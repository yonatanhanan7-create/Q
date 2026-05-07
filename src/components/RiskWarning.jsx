import { AlertTriangle } from 'lucide-react';

export default function RiskWarning() {
  return (
    <section
      id="risk"
      className="mx-auto max-w-7xl scroll-mt-20 px-6 pt-8 pb-20"
    >
      <div className="glass-card relative overflow-hidden border-amber-400/20 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="flex flex-col gap-5 sm:flex-row">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/30">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div className="space-y-3 text-sm leading-relaxed text-slate-300">
            <p className="font-display text-base font-semibold text-amber-200">
              Risk disclosure
            </p>
            <p>
              Investing in digital assets involves a high degree of risk,
              including the risk of total loss of capital. Past performance is
              not indicative of future results. Strategy returns are
              variable and may be negative.
            </p>
            <p>
              AlphaChain Capital vaults are smart-contract based and inherit
              risks from underlying protocols, including (but not limited to)
              smart-contract bugs, oracle manipulation, depegging events, and
              counterparty risk on centralized venues used for hedging.
            </p>
            <p className="text-slate-400">
              Nothing on this page constitutes investment, legal, or tax
              advice. AlphaChain Capital is not available to U.S. persons or
              residents of restricted jurisdictions. Please consult a
              qualified advisor before investing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
