/* eslint-disable no-console */
const hre = require('hardhat');

// Per-network configuration. Verify every address against the official source
// (Uniswap docs, Chainlink docs, the chain's block explorer) before deploying.
const CONFIG = {
  // Arbitrum One — production-ish defaults.
  arbitrum: {
    asset: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // native USDC
    uniswapV3Router: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    tokens: [
      // WETH
      {
        token: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
        feed: '0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612', // ETH/USD
      },
      // WBTC
      {
        token: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
        feed: '0x6ce185860a4963106506C203335A2910413708e9', // BTC/USD
      },
    ],
  },
  // Sepolia — test deployment. Use mock USDC + Aave faucet token + the
  // Uniswap V3 router that exists on Sepolia.
  sepolia: {
    asset: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8', // Aave-faucet USDC
    uniswapV3Router: '0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E', // Uniswap V3 SwapRouter02
    tokens: [
      // WETH (Sepolia)
      {
        token: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
        feed: '0x694AA1769357215DE4FAC081bf1f309aDC325306', // ETH/USD
      },
    ],
  },
};

async function main() {
  const network = hre.network.name;
  const cfg = CONFIG[network];
  if (!cfg) throw new Error(`No deploy config for network ${network}`);

  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying TradingVault on ${network} from ${deployer.address}`);

  const Vault = await hre.ethers.getContractFactory('TradingVault');
  const vault = await Vault.deploy(
    cfg.asset,
    deployer.address, // owner
    deployer.address, // manager (change later via setManager)
    deployer.address, // feeRecipient
    1000, // 10% performance fee, capped at 30%
    'AlphaChain Vault Share',
    'acVAULT',
  );
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log('TradingVault deployed:', vaultAddress);

  // Whitelist the router and tokens.
  let tx = await vault.setRouter(cfg.uniswapV3Router, true);
  await tx.wait();
  console.log('Router whitelisted:', cfg.uniswapV3Router);

  for (const { token, feed } of cfg.tokens) {
    tx = await vault.setToken(token, true, feed);
    await tx.wait();
    console.log(`Token whitelisted: ${token} (feed ${feed})`);
  }

  console.log('\n=== Deployment summary ===');
  console.log(`Network:  ${network}`);
  console.log(`Vault:    ${vaultAddress}`);
  console.log(`Asset:    ${cfg.asset}`);
  console.log(`Manager:  ${deployer.address}`);
  console.log('Add this to your frontend .env:');
  console.log(`VITE_VAULT_ADDRESS=${vaultAddress}`);
  console.log(`VITE_VAULT_CHAIN_ID=${(await hre.ethers.provider.getNetwork()).chainId}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
