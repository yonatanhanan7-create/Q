import { Activity, Boxes, Gauge, Layers } from 'lucide-react';

const strategies = [
  {
    icon: Activity,
    title: 'Delta-Neutral Yield',
    weight: '45%',
    body: 'Funding-rate arbitrage and stable LP positions hedged with perpetual shorts. Targets steady, market-uncorrelated returns.',
  },
  {
    icon: Layers,
    title: 'Restaking & LST Basis',
    weight: '25%',
    body: 'Captures the spread between liquid staking tokens and ETH plus EigenLayer points exposure, hedged for duration.',
  },
  {
    icon: Boxes,
    title: 'Curated Long-Only',
    weight: '20%',
    body: 'Concentrated positions in high-conviction L1/L2 and infrastructure tokens, with quarterly rebalancing.',
  },
  {
    icon: Gauge,
    title: 'Tactical Reserves',
    weight: '10%',
    body: 'USDC reserves deployed into top-tier money markets to provide redemption liquidity and dry powder.',
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
          <p className="stat-label">Investment strategy</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            A diversified, risk-first playbook.
          </h2>
          <p className="mt-5 text-slate-300">
            Capital is allocated across four mandates with distinct
            risk-return profiles. Each mandate is sleeved into its own on-chain
            sub-vault, with hard exposure caps and circuit breakers enforced by
            the smart contract.
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-4 sm:max-w-md">
            <div className="glass-card p-4">
              <dt className="stat-label">Sharpe (LTM)</dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-white">
                2.41
              </dd>
            </div>
            <div className="glass-card p-4">
              <dt className="stat-label">Max Drawdown</dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-white">
                -7.8%
              </dd>
            </div>
            <div className="glass-card p-4">
              <dt className="stat-label">Mgmt Fee</dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-white">
                1.5%
              </dd>
            </div>
            <div className="glass-card p-4">
              <dt className="stat-label">Performance Fee</dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-white">
                15%
              </dd>
            </div>
          </dl>
        </div>

        <div className="space-y-4">
          {strategies.map(({ icon: Icon, title, body, weight }) => (
            <div
              key={title}
              className="glass-card flex gap-4 p-5 transition hover:border-emerald-400/30"
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20">
                <Icon className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-semibold text-white">
                    {title}
                  </h3>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                    {weight}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-slate-400">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
