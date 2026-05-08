import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, mainnet, sepolia } from 'wagmi/chains';

const projectId =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'alphachain-demo-project-id';

// The frontend supports the chains the TradingVault is likely to live on.
// Set VITE_VAULT_CHAIN_ID in .env.local to whichever chain you deployed to;
// the dashboard will refuse to interact unless the wallet is on that chain.
export const wagmiConfig = getDefaultConfig({
  appName: 'AlphaChain Capital',
  projectId,
  chains: [sepolia, arbitrum, mainnet],
  ssr: false,
});

export const DEFAULT_CHAIN = sepolia;
