import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet } from 'wagmi/chains';

const projectId =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'alphachain-demo-project-id';

// Sepolia is the default — this demo writes real txs against Aave V3 Sepolia.
// Mainnet is included read-only so users can connect from a mainnet-by-default
// wallet, but we encourage switching networks before any deposit.
export const wagmiConfig = getDefaultConfig({
  appName: 'AlphaChain Capital (demo)',
  projectId,
  chains: [sepolia, mainnet],
  ssr: false,
});

export const DEFAULT_CHAIN = sepolia;
