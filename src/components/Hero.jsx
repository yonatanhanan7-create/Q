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
          Open-source demo · Sepolia testnet · powered by Aave V3
        </span>

        <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
          Transparent,{' '}
          <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent">
            on-chain yield
          </span>{' '}
          you can verify yourself.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
          AlphaChain is a non-custodial demo vault. It supplies USDC to the
          public Aave V3 lending market and your share of the yield is paid by
          the protocol — not by us. Every number on this page is read from a
          smart contract, not set by an admin.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {isConnected ? (
            <button onClick={onLaunchApp} className="btn-primary">
              Open Dashboard
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
                  Connect Wallet
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
            Non-custodial
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:inline-block" />
          <span>No fixed-yield promises</span>
          <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:inline-block" />
          <span>Read-only contract integration</span>
        </div>
      </div>
    </section>
  );
}
