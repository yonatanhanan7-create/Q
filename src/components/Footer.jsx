import { Hexagon, Github, Twitter, FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-brand-deep/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 ring-1 ring-emerald-400/20">
            <Hexagon className="h-5 w-5 text-emerald-400" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold text-white">
              AlphaChain Capital
            </p>
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} · Non-custodial on-chain fund
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
          <a href="#how-it-works" className="hover:text-emerald-400">
            How it works
          </a>
          <a href="#strategy" className="hover:text-emerald-400">
            Strategy
          </a>
          <a href="#risk" className="hover:text-emerald-400">
            Risk
          </a>
          <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:inline-block" />
          <a
            href="#"
            className="inline-flex items-center gap-1.5 hover:text-emerald-400"
          >
            <FileText className="h-4 w-4" />
            Audit report
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 hover:text-emerald-400"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 hover:text-emerald-400"
          >
            <Twitter className="h-4 w-4" />
            X / Twitter
          </a>
        </nav>
      </div>
    </footer>
  );
}
