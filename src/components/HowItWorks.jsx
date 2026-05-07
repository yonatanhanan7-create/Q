import { Wallet, Coins, ShieldCheck, ArrowDownToLine } from 'lucide-react';

const steps = [
  {
    icon: Wallet,
    title: '1. Connect a wallet on Sepolia',
    body: 'MetaMask, Coinbase Wallet, Rainbow, or any WalletConnect-compatible wallet works. We never take custody of your keys or your funds.',
  },
  {
    icon: Coins,
    title: '2. Get free test USDC',
    body: 'A button on the dashboard links straight to the public Aave Sepolia faucet. Mint as much test USDC as you want — it is worthless on mainnet.',
  },
  {
    icon: ShieldCheck,
    title: '3. Deposit into the Aave pool',
    body: 'Approve once, then supply USDC to Aave V3. You receive aUSDC in your wallet that grows in your balance as interest accrues, second by second.',
  },
  {
    icon: ArrowDownToLine,
    title: '4. Withdraw any time',
    body: 'Redeem your aUSDC back into USDC in a single transaction. There are no lock-ups, no withdrawal fees, no admin approval.',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-7xl scroll-mt-20 px-6 py-24"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="stat-label">How it works</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Four steps. Zero custodians.
        </h2>
        <p className="mt-4 text-slate-300">
          The whole point of this demo is that there is nothing magic happening
          off-chain. Every step below is a public smart-contract call you can
          inspect on Etherscan.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="glass-card group flex h-full flex-col p-6 transition hover:-translate-y-0.5 hover:border-emerald-400/30"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-display text-lg font-semibold text-white">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
