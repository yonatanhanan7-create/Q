# TradingVault — deployment & operation guide

This directory holds the on-chain contract that backs the AlphaChain Capital
front-end. It is a **non-custodial managed trading vault**:

- Depositors send USDC to the contract and receive ERC-20 shares minted at the
  live NAV.
- A designated `manager` address can swap the vault's holdings via whitelisted
  Uniswap V3 routers — and *only* via swaps. The manager **cannot** transfer
  funds out of the contract.
- NAV is computed on-chain by summing the vault's USDC balance and the
  USD-equivalent of every whitelisted token, priced through Chainlink feeds
  (with a one-hour staleness check).
- Performance fee is applied on a high-water mark basis and is hard-capped at
  30% by the contract.

> **The code is unaudited.** Do not deploy with real capital before a third-party
> review. Treat the Sepolia deployment as the integration-test harness.

---

## 1. Prerequisites

```bash
npm install
cp .env.example .env  # then fill in the values
```

`.env` should contain:

```
DEPLOYER_PRIVATE_KEY=0x...        # funded with native gas
SEPOLIA_RPC_URL=https://...
ARBITRUM_RPC_URL=https://...
ETHERSCAN_API_KEY=...             # for verification
```

## 2. Compile

```bash
npm run compile
```

## 3. Deploy

The deployment script reads per-network configuration (asset address, Uniswap
V3 router, whitelisted tokens with their Chainlink feeds) from
`scripts/deploy.cjs`. **Verify every address against the official source before
running on mainnet.**

```bash
# test deployment
npm run deploy:sepolia

# production deployment
npm run deploy:arbitrum
```

The script prints, on success:

```
TradingVault deployed: 0x...
VITE_VAULT_ADDRESS=0x...
VITE_VAULT_CHAIN_ID=42161
```

Copy these into the frontend's `.env.local`:

```
VITE_VAULT_ADDRESS=0x...
VITE_VAULT_CHAIN_ID=42161
VITE_VAULT_ASSET=0xaf88d065e77c8cC2239327C5EDb3A432268e5831   # USDC on Arbitrum
VITE_VAULT_ASSET_DECIMALS=6
VITE_VAULT_ASSET_SYMBOL=USDC
```

## 4. Post-deploy hardening

The deploy script sets the deployer as **owner**, **manager**, and **feeRecipient**.
Before accepting external deposits you should:

1. **Move ownership to a multisig.** Owner controls the whitelists and the fee
   parameters; do not run that from a hot key.
   ```solidity
   vault.transferOwnership(MULTISIG);
   // multisig must call acceptOwnership() to complete the transfer
   ```
2. **Move `manager` to a dedicated trading key**, separate from the owner.
   ```solidity
   vault.setManager(TRADING_HOT_WALLET);
   ```
3. **Move `feeRecipient` to the operating wallet** that should accrue fees.
4. **Verify the contract on the block explorer** so depositors can read the
   source.

## 5. Adding / removing whitelisted markets

Only the owner (multisig) can change whitelists.

```solidity
// allow the manager to hold WETH, priced via Chainlink ETH/USD
vault.setToken(WETH, true, ETH_USD_FEED);

// remove an asset from the whitelist (existing balances stay; manager just
// can't acquire more)
vault.setToken(WETH, false, address(0));

// allow / disallow a router
vault.setRouter(UNISWAP_V3_ROUTER, true);
```

When you set a token with `allowed = true`, that token is appended to the
`trackedTokens` array and used in NAV calculation. If the token has no live
Chainlink feed, NAV calls (and therefore deposits/withdrawals) revert until you
either remove the token or supply a working feed.

## 6. Manager workflow

The manager calls a single function:

```solidity
function trade(
    address router,
    address tokenIn,
    address tokenOut,
    uint24 fee,
    uint256 amountIn,
    uint256 amountOutMinimum
) external returns (uint256 amountOut);
```

Constraints enforced by the contract:

- `router` must be whitelisted.
- Both `tokenIn` and `tokenOut` must be either the base asset or a whitelisted
  token.
- The router pulls `amountIn` from the vault and sends the swap output back to
  the vault. The contract resets the allowance to zero after the call.
- Slippage protection is the manager's responsibility via `amountOutMinimum`.

## 7. Upgrade & emergency posture

There is **no upgrade path**. The deployment is final code. If a bug is
discovered, the response is:

1. Owner removes all routers from the whitelist (`setRouter(..., false)`),
   freezing trading.
2. The manager liquidates open positions back to the base asset.
3. Depositors withdraw normally; the vault is then abandoned.

You should plan for this scenario before launch. Do not promise depositors
recovery actions you cannot perform.

## 8. Legal note

Operating a vehicle that pools money from third parties and trades it
discretionarily is regulated almost everywhere. In Israel, for example, this is
governed by the Regulation of Investment Advice, Investment Marketing and
Investment Portfolio Management Law, 1995, and typically requires a portfolio
manager licence. Other jurisdictions have analogous rules. Consult a securities
lawyer in your jurisdiction before accepting external deposits — the smart
contract being on-chain does not exempt the operator from licensing
obligations.
