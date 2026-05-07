import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, arbitrum, optimism, base, polygon } from 'wagmi/chains';

const projectId =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'alphachain-demo-project-id';

export const wagmiConfig = getDefaultConfig({
  appName: 'AlphaChain Capital',
  projectId,
  chains: [mainnet, arbitrum, optimism, base, polygon],
  ssr: false,
});
