// Aave V3 — Sepolia testnet
// Addresses sourced from the Aave V3 Sepolia market deployment.
// NOTE: these addresses are pinned for demo purposes; verify against the
// official Aave docs (https://aave.com/docs) before using elsewhere.

export const SEPOLIA_CHAIN_ID = 11_155_111;

export const AAVE_SEPOLIA = {
  pool: '0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951',
  poolDataProvider: '0x3e9708d80f7B3e43118013075F7e95CE3AB31F31',
  // Test reserve assets (Aave-issued faucet tokens, not real USDC)
  usdc: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
  aUsdc: '0x16dA4541aD1807f4443d92D26044C1147406EB80',
  // Faucet UI for getting test USDC on Sepolia
  faucetUrl: 'https://staging.aave.com/faucet/',
};

export const RESERVE = {
  symbol: 'USDC',
  decimals: 6,
  asset: AAVE_SEPOLIA.usdc,
  aToken: AAVE_SEPOLIA.aUsdc,
};

// --- ABIs (only the methods we use) ---

export const erc20Abi = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function',
    name: 'totalSupply',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'decimals',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint8' }],
  },
];

export const aavePoolAbi = [
  {
    type: 'function',
    name: 'supply',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'asset', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'onBehalfOf', type: 'address' },
      { name: 'referralCode', type: 'uint16' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'withdraw',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'asset', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'to', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getReserveData',
    stateMutability: 'view',
    inputs: [{ name: 'asset', type: 'address' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'configuration', type: 'uint256' },
          { name: 'liquidityIndex', type: 'uint128' },
          { name: 'currentLiquidityRate', type: 'uint128' },
          { name: 'variableBorrowIndex', type: 'uint128' },
          { name: 'currentVariableBorrowRate', type: 'uint128' },
          { name: 'currentStableBorrowRate', type: 'uint128' },
          { name: 'lastUpdateTimestamp', type: 'uint40' },
          { name: 'id', type: 'uint16' },
          { name: 'aTokenAddress', type: 'address' },
          { name: 'stableDebtTokenAddress', type: 'address' },
          { name: 'variableDebtTokenAddress', type: 'address' },
          { name: 'interestRateStrategyAddress', type: 'address' },
          { name: 'accruedToTreasury', type: 'uint128' },
          { name: 'unbacked', type: 'uint128' },
          { name: 'isolationModeTotalDebt', type: 'uint128' },
        ],
      },
    ],
  },
];

const SECONDS_PER_YEAR = 31_536_000;
const RAY = 1e27;

// Aave's currentLiquidityRate is APR in RAY units (annualized, per-second
// compounding assumed). Convert to APY: (1 + APR/secs)^secs - 1.
export function liquidityRateToApy(rateRay) {
  if (!rateRay) return 0;
  const apr = Number(rateRay) / RAY;
  return Math.pow(1 + apr / SECONDS_PER_YEAR, SECONDS_PER_YEAR) - 1;
}
