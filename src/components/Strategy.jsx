import { Activity, Lock, Eye, Percent } from 'lucide-react';

const points = [
  {
    icon: Lock,
    title: 'The manager can trade — not steal',
    body: 'The TradingVault contract has two roles: depositors and a manager. The manager calls a single function — trade() — that swaps tokens through a whitelisted DEX router. Any other transfer of funds reverts. There is no withdrawAdmin, no emergencyDrain, no upgrade backdoor.',
  },
  {
    icon: Eye,
    title: 'NAV is computed, not declared',
    body: 'totalAssets() sums the vault’s USDC balance and the USD-equivalent of every whitelisted token it currently holds, priced via Chainlink. Share price is totalAssets() / totalSupply(). It is not editable. Period.',
  },
  {
    icon: Percent,
    title: 'Performance fee with a high-water mark',
    body: 'The manager only earns on new gains above the previous peak share price. If the vault loses 20% and recovers 15%, the manager earns nothing — depositors must be made whole first. The fee is hard-capped at 30% by the contract.',
  },
  {
    icon: Activity,
    title: 'Withdrawals from liquid USDC',
    body: 'When you redeem shares, the contract sends you a proportional share of its USDC balance. If the manager has open positions, they must liquidate to honour withdrawals — the same constraint a real fund operates under.',
  },
];

export default function Strategy() {
  return (
    <section
      id="strategy"
      className="relative mx-auto max-w-7xl scroll-mt-20 px-6 py-24"
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <p className="stat-label">Architecture</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Trust the contract, not the manager.
          </h2>
          <p className="mt-5 text-slate-300">
            Most &ldquo;crypto investment funds&rdquo; ask you to trust a
            person. This one asks you to verify a contract. The complete
            source is in <code className="text-emerald-300">contracts/TradingVault.sol</code>{' '}
            — read it before you deposit.
          </p>

          <dl className="mt-8 grid grid-cols-1 gap-4 sm:max-w-md sm:grid-cols-2">
            <div className="glass-card p-4">
              <dt className="stat-label">Custody</dt>
              <dd className="mt-1 font-display text-base font-semibold text-white">
                Smart contract
              </dd>
            </div>
            <div className="glass-card p-4">
              <dt className="stat-label">Manager scope</dt>
              <dd className="mt-1 font-display text-base font-semibold text-white">
                Trade only
              </dd>
            </div>
            <div className="glass-card p-4">
              <dt className="stat-label">Allowed venues</dt>
              <dd className="mt-1 font-display text-base font-semibold text-white">
                Uniswap V3 (whitelist)
              </dd>
            </div>
            <div className="glass-card p-4">
              <dt className="stat-label">Pricing</dt>
              <dd className="mt-1 font-display text-base font-semibold text-white">
                Chainlink, &lt; 1h staleness
              </dd>
            </div>
          </dl>
        </div>

        <div className="space-y-4">
          {points.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="glass-card flex gap-4 p-5 transition hover:border-emerald-400/30"
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20">
                <Icon className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <h3 className="font-display text-base font-semibold text-white">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm text-slate-400">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
