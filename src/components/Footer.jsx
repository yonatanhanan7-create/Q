import { Hexagon, Github, FileText, AlertTriangle } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const link =
    'inline-flex items-center gap-1.5 transition hover:text-emerald-400';

  return (
    <footer className="border-t border-white/5 bg-brand-deep/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 ring-1 ring-emerald-400/20">
            <Hexagon className="h-5 w-5 text-emerald-400" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold text-white">
              AlphaChain Capital · demo
            </p>
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} · Open-source · Unaudited
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
          <button
            type="button"
            onClick={() => onNavigate('terms')}
            className={link}
          >
            <FileText className="h-4 w-4" />
            Terms
          </button>
          <button
            type="button"
            onClick={() => onNavigate('risk')}
            className={link}
          >
            <AlertTriangle className="h-4 w-4" />
            Risk
          </button>
          <a
            href="https://github.com/yonatanhanan7-create/Q"
            target="_blank"
            rel="noreferrer"
            className={link}
          >
            <Github className="h-4 w-4" />
            Source
          </a>
        </nav>
      </div>
    </footer>
  );
}
