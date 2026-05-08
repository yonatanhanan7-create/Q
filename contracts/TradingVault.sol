// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable2Step, Ownable} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IUniswapV3Router {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }
    function exactInputSingle(ExactInputSingleParams calldata) external payable returns (uint256);
}

interface IChainlinkFeed {
    function decimals() external view returns (uint8);
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

/// @title TradingVault
/// @notice Non-custodial managed trading vault. Depositors supply USDC,
/// receive shares minted at the live NAV, and may redeem shares at any time.
/// The designated manager can swap vault holdings via whitelisted DEX routers
/// (Uniswap V3) but **cannot** withdraw assets to themselves. Performance is
/// fee'd at a high-water mark on the share price.
///
/// Security model:
/// - Owner (recommended: multisig) controls whitelists and fee parameters.
/// - Manager can only execute trades; no transfers, no approvals to non-routers.
/// - Each whitelisted token must have a Chainlink feed so NAV is verifiable.
/// - All accepted price feeds are sanity-bounded by `MAX_FEED_STALENESS`.
///
/// THIS IS UNAUDITED CODE. Treat it as a starting point; have it reviewed by
/// an auditor before deploying to mainnet with real capital.
contract TradingVault is ERC20, Ownable2Step, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 public constant BPS = 10_000;
    uint256 public constant MAX_PERFORMANCE_FEE_BPS = 3_000; // 30%
    uint256 public constant MAX_FEED_STALENESS = 1 hours;
    uint256 public constant SHARE_PRECISION = 1e18;

    // Base accounting asset (USDC). Decimals captured for NAV math.
    IERC20 public immutable asset;
    uint8 public immutable assetDecimals;

    // Trader (active manager). Cannot move funds to itself.
    address public manager;

    // Performance fee parameters (high-water mark).
    address public feeRecipient;
    uint256 public performanceFeeBps; // e.g. 1000 = 10%
    uint256 public highWaterMark; // share price (in asset terms) high-water mark

    // Whitelists.
    mapping(address => bool) public allowedRouter;
    mapping(address => bool) public allowedToken; // tokens the manager may hold
    mapping(address => address) public priceFeed; // token => Chainlink USD feed
    address[] public trackedTokens; // for NAV iteration

    event ManagerUpdated(address indexed previous, address indexed next);
    event FeeRecipientUpdated(address indexed previous, address indexed next);
    event PerformanceFeeUpdated(uint256 previousBps, uint256 nextBps);
    event RouterAllowed(address indexed router, bool allowed);
    event TokenAllowed(address indexed token, bool allowed, address feed);
    event Deposit(address indexed user, uint256 assets, uint256 shares);
    event Withdraw(address indexed user, uint256 assets, uint256 shares);
    event Trade(
        address indexed router,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );
    event PerformanceFeeAccrued(uint256 sharesMinted, uint256 newHighWaterMark);

    error NotManager();
    error InvalidParam();
    error TokenNotAllowed(address token);
    error RouterNotAllowed(address router);
    error FeedStale(address token);
    error FeedMissing(address token);
    error ZeroAmount();
    error InsufficientLiquidAsset(uint256 requested, uint256 available);

    modifier onlyManager() {
        if (msg.sender != manager) revert NotManager();
        _;
    }

    constructor(
        IERC20 _asset,
        address _owner,
        address _manager,
        address _feeRecipient,
        uint256 _performanceFeeBps,
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) Ownable(_owner) {
        if (_manager == address(0) || _feeRecipient == address(0)) revert InvalidParam();
        if (_performanceFeeBps > MAX_PERFORMANCE_FEE_BPS) revert InvalidParam();

        asset = _asset;
        assetDecimals = IERC20Metadata(address(_asset)).decimals();
        manager = _manager;
        feeRecipient = _feeRecipient;
        performanceFeeBps = _performanceFeeBps;
        highWaterMark = SHARE_PRECISION; // 1.0
    }

    // ─── Owner ────────────────────────────────────────────────────────────

    function setManager(address newManager) external onlyOwner {
        if (newManager == address(0)) revert InvalidParam();
        emit ManagerUpdated(manager, newManager);
        manager = newManager;
    }

    function setFeeRecipient(address newRecipient) external onlyOwner {
        if (newRecipient == address(0)) revert InvalidParam();
        emit FeeRecipientUpdated(feeRecipient, newRecipient);
        feeRecipient = newRecipient;
    }

    function setPerformanceFeeBps(uint256 newBps) external onlyOwner {
        if (newBps > MAX_PERFORMANCE_FEE_BPS) revert InvalidParam();
        emit PerformanceFeeUpdated(performanceFeeBps, newBps);
        performanceFeeBps = newBps;
    }

    function setRouter(address router, bool allowed) external onlyOwner {
        allowedRouter[router] = allowed;
        emit RouterAllowed(router, allowed);
    }

    function setToken(address token, bool allowed, address feed) external onlyOwner {
        if (token == address(0)) revert InvalidParam();

        bool wasAllowed = allowedToken[token];
        allowedToken[token] = allowed;
        priceFeed[token] = allowed ? feed : address(0);

        if (allowed && !wasAllowed && token != address(asset)) {
            trackedTokens.push(token);
        }

        emit TokenAllowed(token, allowed, feed);
    }

    // ─── Depositor flow ──────────────────────────────────────────────────

    /// @notice Deposit `assets` of the underlying. Mints shares at the
    /// current NAV after accruing any performance fee.
    function deposit(uint256 assets, address receiver)
        external
        nonReentrant
        returns (uint256 shares)
    {
        if (assets == 0) revert ZeroAmount();
        _accruePerformanceFee();

        uint256 nav = totalAssets();
        uint256 supply = totalSupply();
        shares = supply == 0 || nav == 0
            ? assets * SHARE_PRECISION / (10 ** assetDecimals)
            : (assets * supply) / nav;

        asset.safeTransferFrom(msg.sender, address(this), assets);
        _mint(receiver, shares);

        emit Deposit(receiver, assets, shares);
    }

    /// @notice Burn `shares` and receive a proportional amount of the
    /// underlying asset. If the vault does not currently hold enough
    /// of the underlying (i.e. manager has open positions), the call
    /// reverts; the manager must liquidate first.
    function withdraw(uint256 shares, address receiver)
        external
        nonReentrant
        returns (uint256 assets)
    {
        if (shares == 0) revert ZeroAmount();
        _accruePerformanceFee();

        uint256 supply = totalSupply();
        uint256 nav = totalAssets();
        assets = (shares * nav) / supply;

        uint256 liquid = asset.balanceOf(address(this));
        if (assets > liquid) revert InsufficientLiquidAsset(assets, liquid);

        _burn(msg.sender, shares);
        asset.safeTransfer(receiver, assets);

        emit Withdraw(receiver, assets, shares);
    }

    // ─── Manager: trading ────────────────────────────────────────────────

    /// @notice Execute an exact-input single swap on a whitelisted Uniswap V3
    /// router. The output token must be whitelisted (or the base asset).
    /// Manager cannot transfer funds elsewhere.
    function trade(
        address router,
        address tokenIn,
        address tokenOut,
        uint24 fee,
        uint256 amountIn,
        uint256 amountOutMinimum
    ) external onlyManager nonReentrant returns (uint256 amountOut) {
        if (!allowedRouter[router]) revert RouterNotAllowed(router);
        if (tokenIn != address(asset) && !allowedToken[tokenIn]) revert TokenNotAllowed(tokenIn);
        if (tokenOut != address(asset) && !allowedToken[tokenOut]) revert TokenNotAllowed(tokenOut);

        IERC20(tokenIn).forceApprove(router, amountIn);

        IUniswapV3Router.ExactInputSingleParams memory params = IUniswapV3Router
            .ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: fee,
                recipient: address(this),
                deadline: block.timestamp + 300,
                amountIn: amountIn,
                amountOutMinimum: amountOutMinimum,
                sqrtPriceLimitX96: 0
            });

        amountOut = IUniswapV3Router(router).exactInputSingle(params);

        // Reset approval to zero after the swap to avoid lingering allowance.
        IERC20(tokenIn).forceApprove(router, 0);

        emit Trade(router, tokenIn, tokenOut, amountIn, amountOut);
    }

    // ─── NAV / share-price views ─────────────────────────────────────────

    /// @notice Total assets under management, denominated in the base asset.
    /// Sums the vault's base asset balance and the USD-equivalent of every
    /// whitelisted token it currently holds, priced via Chainlink.
    function totalAssets() public view returns (uint256 nav) {
        nav = asset.balanceOf(address(this));
        uint256 len = trackedTokens.length;
        for (uint256 i; i < len; ++i) {
            address token = trackedTokens[i];
            if (!allowedToken[token]) continue;
            uint256 bal = IERC20(token).balanceOf(address(this));
            if (bal == 0) continue;
            nav += _valueInBase(token, bal);
        }
    }

    /// @notice Share price expressed in base asset units, scaled by SHARE_PRECISION.
    function sharePrice() public view returns (uint256) {
        uint256 supply = totalSupply();
        if (supply == 0) return SHARE_PRECISION;
        return (totalAssets() * SHARE_PRECISION) / supply;
    }

    function trackedTokensLength() external view returns (uint256) {
        return trackedTokens.length;
    }

    // ─── Internal helpers ────────────────────────────────────────────────

    function _valueInBase(address token, uint256 amount) internal view returns (uint256) {
        address feed = priceFeed[token];
        if (feed == address(0)) revert FeedMissing(token);

        (, int256 answer, , uint256 updatedAt, ) = IChainlinkFeed(feed).latestRoundData();
        if (answer <= 0) revert FeedStale(token);
        if (block.timestamp - updatedAt > MAX_FEED_STALENESS) revert FeedStale(token);

        uint8 feedDecimals = IChainlinkFeed(feed).decimals();
        uint8 tokenDecimals = IERC20Metadata(token).decimals();

        // amount * price / 10^(tokenDecimals + feedDecimals - assetDecimals)
        uint256 numerator = amount * uint256(answer);
        uint256 scale = uint256(tokenDecimals) + uint256(feedDecimals);
        if (scale > assetDecimals) {
            return numerator / (10 ** (scale - assetDecimals));
        } else {
            return numerator * (10 ** (assetDecimals - scale));
        }
    }

    /// @dev If share price has reached a new high, mint shares to the fee
    /// recipient equal to the configured cut of the appreciation. Each
    /// deposit/withdraw call accrues so the fee is always up-to-date.
    function _accruePerformanceFee() internal {
        if (totalSupply() == 0 || performanceFeeBps == 0) return;

        uint256 currentPrice = sharePrice();
        if (currentPrice <= highWaterMark) return;

        uint256 gainPerShare = currentPrice - highWaterMark;
        uint256 feeAssets = (gainPerShare * totalSupply() * performanceFeeBps)
            / (BPS * SHARE_PRECISION);

        if (feeAssets == 0) {
            highWaterMark = currentPrice;
            return;
        }

        // Mint enough shares to feeRecipient that they own `feeAssets` worth
        // of NAV at the current price (post-mint).
        uint256 nav = totalAssets();
        // sharesToMint = feeAssets * supply / (nav - feeAssets)
        if (feeAssets >= nav) return; // safety
        uint256 sharesToMint = (feeAssets * totalSupply()) / (nav - feeAssets);
        if (sharesToMint == 0) {
            highWaterMark = currentPrice;
            return;
        }

        _mint(feeRecipient, sharesToMint);
        highWaterMark = sharePrice();
        emit PerformanceFeeAccrued(sharesToMint, highWaterMark);
    }
}
