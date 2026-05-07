import { Activity, Boxes, Gauge, Layers } from 'lucide-react';

const points = [
  {
    icon: Activity,
    title: 'Single source of yield',
    body: 'Deposits are forwarded into the public Aave V3 USDC market on Sepolia. The yield you earn is exactly the supply rate Aave pays — nothing more, nothing less.',
  },
  {
    icon: Layers,
    title: 'No fixed APY, ever',
    body: 'Rates float with utilization. They go up when borrowers pay more, down when borrowing slows. Anyone promising you a fixed return on a real DeFi vault is making it up.',
  },
  {
    icon: Boxes,
    title: 'Non-custodial, withdraw any time',
    body: 'You hold the aTokens, not us. Withdrawals execute against the same Aave pool any address can call. No lock-ups, no opaque off-chain bookkeeping.',
  },
  {
    icon: Gauge,
    title: 'Nothing to set, nothing to admin',
    body: 'There is no admin dashboard for "performance" or "Tier B" returns. There is no hidden multiplier. Verify the addresses below on Etherscan and read the same data we read.',
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
          <p className="stat-label">How yield is generated</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            One protocol. Zero opinions.
          </h2>
          <p className="mt-5 text-slate-300">
            This is intentionally a boring vault. Capital is deposited 1:1 into
            Aave V3&rsquo;s USDC reserve and the share token (aUSDC) accrues
            interest in real time. There are no rebalancing strategies, no
            leverage, no off-chain hedges, and no &ldquo;profit sharing tier&rdquo;
            controlled by an admin.
          </p>

          <dl className="mt-8 grid grid-cols-1 gap-4 sm:max-w-md sm:grid-cols-2">
            <div className="glass-card p-4">
              <dt className="stat-label">Network</dt>
              <dd className="mt-1 font-display text-base font-semibold text-white">
                Sepolia testnet
              </dd>
            </div>
            <div className="glass-card p-4">
              <dt className="stat-label">Underlying</dt>
              <dd className="mt-1 font-display text-base font-semibold text-white">
                USDC (Aave faucet)
              </dd>
            </div>
            <div className="glass-card p-4">
              <dt className="stat-label">Share token</dt>
              <dd className="mt-1 font-display text-base font-semibold text-white">
                aUSDC (Aave V3)
              </dd>
            </div>
            <div className="glass-card p-4">
              <dt className="stat-label">Custody</dt>
              <dd className="mt-1 font-display text-base font-semibold text-white">
                Your wallet
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
