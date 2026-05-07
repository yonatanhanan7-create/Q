import { AlertTriangle, ArrowRight } from 'lucide-react';

export default function RiskWarning({ onLearnMore }) {
  return (
    <section
      id="risk-summary"
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
              Read this before depositing anything
            </p>
            <p>
              DeFi yields are not guaranteed. Smart contracts can have bugs.
              Stablecoins can de-peg. Oracles can fail. The yield you see is
              whatever Aave V3 is paying right now — it can drop, it can spike,
              it can go to zero. Anyone promising a fixed return on a real
              on-chain vault is misleading you.
            </p>
            <p className="text-slate-400">
              This site is a non-custodial demo on a public testnet. Nothing
              here is investment advice or a solicitation. Read the full risk
              disclosure before using anything similar on mainnet.
            </p>
            {onLearnMore && (
              <button
                type="button"
                onClick={onLearnMore}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-200 hover:text-amber-100"
              >
                Read full risk disclosure
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
