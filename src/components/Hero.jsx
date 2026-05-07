import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Hero({ onLaunchApp }) {
  const { isConnected } = useAccount();

  return (
    <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 sm:pt-28">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-xs font-medium text-emerald-300">
          <Sparkles className="h-3.5 w-3.5" />
          Q1 2026 — Vault v3 now live on Arbitrum &amp; Base
        </span>

        <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
          Institutional-grade{' '}
          <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent">
            on-chain alpha
          </span>{' '}
          for the next cycle.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
          AlphaChain Capital is a non-custodial crypto investment fund that
          deploys actively managed, risk-adjusted strategies across DeFi —
          delivering transparent, on-chain returns to its investors.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {isConnected ? (
            <button onClick={onLaunchApp} className="btn-primary">
              Launch Dashboard
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <ConnectButton.Custom>
              {({ openConnectModal, mounted }) => (
                <button
                  onClick={openConnectModal}
                  disabled={!mounted}
                  className="btn-primary"
                >
                  Connect Wallet to Invest
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </ConnectButton.Custom>
          )}
          <a href="#how-it-works" className="btn-ghost">
            How it works
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Audited by Trail of Bits &amp; Spearbit
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:inline-block" />
          <span>Non-custodial vaults</span>
          <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:inline-block" />
          <span>On-chain reporting</span>
        </div>
      </div>
    </section>
  );
}
