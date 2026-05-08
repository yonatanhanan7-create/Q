require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || '';
const SEPOLIA_RPC = process.env.SEPOLIA_RPC_URL || 'https://rpc.sepolia.org';
const ARBITRUM_RPC = process.env.ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';

module.exports = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  paths: {
    sources: './contracts',
    artifacts: './artifacts',
    cache: './cache',
  },
  networks: {
    hardhat: {},
    sepolia: PRIVATE_KEY
      ? { url: SEPOLIA_RPC, accounts: [PRIVATE_KEY] }
      : { url: SEPOLIA_RPC },
    arbitrum: PRIVATE_KEY
      ? { url: ARBITRUM_RPC, accounts: [PRIVATE_KEY] }
      : { url: ARBITRUM_RPC },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
