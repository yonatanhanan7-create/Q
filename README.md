# AlphaChain Capital

A modern, dark-mode landing page and investor dashboard for a fictional crypto investment fund — built with **React (Vite)**, **Tailwind CSS**, **Wagmi/Viem**, and **RainbowKit**.

## Stack

- React 18 + Vite
- Tailwind CSS (dark, slate + emerald palette)
- Wagmi v2 / Viem v2
- RainbowKit v2 (MetaMask, Coinbase Wallet, WalletConnect, Rainbow, etc.)
- Lucide-React icons
- TanStack Query (required by Wagmi)

## Getting started

```bash
npm install
cp .env.example .env       # add your WalletConnect project id
npm run dev
```

Then open http://localhost:5173

## What it includes

- **Landing page**
  - Hero with conditional "Connect Wallet" / "Launch Dashboard" CTAs
  - Live-feel **TVL / ROI / Active Investors** stats bar (mocked, ticks every 3.5s)
  - "How it works" 4-step section
  - Investment strategy breakdown with allocation weights and Sharpe / drawdown stats
  - Risk-disclosure footer block
- **Dashboard** (rendered when wallet is connected)
  - User position card: total balance, principal, earned, wallet ETH
  - Mini stats: vault TVL, your share, current network
  - Deposit form: USDT / ETH selector, amount input, "Use max", **`deposit()` placeholder** that logs full transaction details to the console and shows a simulated tx hash

## Where to plug in a real smart contract

`src/components/Dashboard.jsx` — `handleDeposit` is currently a console-only simulation. Replace with:

```js
import { useWriteContract } from 'wagmi';
const { writeContractAsync } = useWriteContract();
await writeContractAsync({
  abi: vaultAbi,
  address: VAULT_ADDRESS,
  functionName: 'deposit',
  args: [parseUnits(amount, decimals), address],
});
```

Wallet connection lives in `src/lib/wagmi.js` and `src/main.jsx`.
