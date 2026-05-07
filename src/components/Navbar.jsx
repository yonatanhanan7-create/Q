import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Hexagon } from 'lucide-react';

export default function Navbar({ onNavigate, currentView, showDashboardLink }) {
  const navItem =
    'text-sm font-medium text-slate-300 transition hover:text-emerald-400';

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-brand-deep/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-left"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/30 to-emerald-600/10 ring-1 ring-emerald-400/30">
            <Hexagon className="h-5 w-5 text-emerald-400" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-base font-semibold tracking-wide text-white">
              AlphaChain
            </p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
              Capital
            </p>
          </div>
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#how-it-works" className={navItem}>
            How it works
          </a>
          <a href="#strategy" className={navItem}>
            Strategy
          </a>
          <a href="#risk" className={navItem}>
            Risk
          </a>
          {showDashboardLink && (
            <button
              onClick={() => onNavigate('dashboard')}
              className={`${navItem} ${
                currentView === 'dashboard' ? 'text-emerald-400' : ''
              }`}
            >
              Dashboard
            </button>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <ConnectButton
            showBalance={false}
            chainStatus="icon"
            accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }}
          />
        </div>
      </div>
    </header>
  );
}
