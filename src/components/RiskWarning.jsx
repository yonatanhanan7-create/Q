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
              This is a managed trading vault. The manager trades on-chain
              with depositor funds — and trading loses money sometimes. The
              contract prevents theft; it does not prevent bad trades, MEV
              loss, oracle issues, or smart-contract bugs. There is no
              guaranteed yield, no principal protection, no insurance.
            </p>
            <p className="text-slate-400">
              The contract is unaudited. Operating a managed vault for the
              public is regulated in most jurisdictions; depositors are
              responsible for confirming they may lawfully participate.
              Read the full risk disclosure before depositing.
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
