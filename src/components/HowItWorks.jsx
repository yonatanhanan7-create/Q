import { Wallet, LineChart, Coins, ShieldCheck } from 'lucide-react';

const steps = [
  {
    icon: Wallet,
    title: '1. Connect your wallet',
    body: 'Securely connect MetaMask, Coinbase Wallet, Rainbow or any WalletConnect-compatible wallet. AlphaChain never takes custody of your funds.',
  },
  {
    icon: Coins,
    title: '2. Deposit USDT or ETH',
    body: 'Allocate to the vault in a single transaction. You receive ERC-4626 fund shares (acAlpha) representing your stake.',
  },
  {
    icon: LineChart,
    title: '3. Strategies deploy capital',
    body: 'Our portfolio managers rebalance across delta-neutral, basis trade, and curated long-only strategies — all executed on-chain.',
  },
  {
    icon: ShieldCheck,
    title: '4. Withdraw any time',
    body: 'Redeem your shares for the underlying assets at NAV. No lock-ups, no off-chain promises, no custodians.',
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
          Deposit, earn, and withdraw — entirely on-chain. Every position is
          publicly verifiable, every fee is transparent, every share is yours.
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
