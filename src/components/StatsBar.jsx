import { TrendingUp, Lock, Activity } from 'lucide-react';
import { useVaultData } from '../hooks/useVaultData.js';

const formatUsd = (n) =>
  '$' +
  (n || 0).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  });

export default function StatsBar() {
  const { tvl, apy, isLoading } = useVaultData();

  const items = [
    {
      label: 'Aave Sepolia USDC TVL',
      value: isLoading ? '…' : formatUsd(tvl),
      icon: Lock,
      accent: 'from-emerald-400/20 to-emerald-400/0',
    },
    {
      label: 'Current Supply APY',
      value: isLoading ? '…' : `${(apy * 100).toFixed(2)}%`,
      icon: TrendingUp,
      accent: 'from-cyan-400/20 to-cyan-400/0',
      positive: true,
    },
    {
      label: 'Source of yield',
      value: 'Aave V3',
      icon: Activity,
      accent: 'from-amber-300/20 to-amber-300/0',
      sub: 'Public lending pool',
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 pb-12">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {items.map(({ label, value, icon: Icon, accent, positive, sub }) => (
          <div
            key={label}
            className="glass-card group relative overflow-hidden p-6"
          >
            <div
              className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${accent} blur-2xl`}
            />
            <div className="flex items-center justify-between">
              <p className="stat-label">{label}</p>
              <Icon className="h-4 w-4 text-slate-500 transition group-hover:text-emerald-400" />
            </div>
            <p
              className={`mt-3 font-display text-3xl font-semibold tracking-tight ${
                positive ? 'text-emerald-300' : 'text-white'
              }`}
            >
              {value}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              {sub || 'Read directly from Aave V3 · refreshes every block'}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
