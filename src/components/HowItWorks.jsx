import { Wallet, ArrowDownToLine, Activity, ArrowUpToLine } from 'lucide-react';

const steps = [
  {
    icon: Wallet,
    title: '1. Connect & approve',
    body: 'Connect a wallet on the deployment chain (Sepolia for testing, Arbitrum/Mainnet for production). One-time approval lets the vault contract pull USDC from your wallet — only the amount you authorise.',
  },
  {
    icon: ArrowDownToLine,
    title: '2. Deposit USDC',
    body: 'Call deposit(). The contract reads its own NAV via Chainlink, mints you shares at the live price, and emits a Deposit event. Your shares are an ERC-20 you can transfer or hold in cold storage.',
  },
  {
    icon: Activity,
    title: '3. Manager trades on-chain',
    body: 'The manager opens and closes positions through whitelisted Uniswap V3 routers. Every swap is a public transaction with a Trade event. There is no off-chain execution venue.',
  },
  {
    icon: ArrowUpToLine,
    title: '4. Redeem shares',
    body: 'Call withdraw() and burn your shares for a proportional slice of the vault’s liquid USDC. No lock-ups, no admin approval. The same NAV math runs on the way out as on the way in.',
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
          Four steps. One smart contract.
        </h2>
        <p className="mt-4 text-slate-300">
          Everything you see on this page maps to a function in{' '}
          <code className="text-emerald-300">TradingVault.sol</code>. Read it,
          run it, fork it.
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
