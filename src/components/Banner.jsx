import { Info } from 'lucide-react';

export default function Banner() {
  return (
    <div className="border-b border-amber-400/20 bg-amber-400/[0.06] text-amber-200">
      <div className="mx-auto flex max-w-7xl items-start gap-2 px-6 py-2 text-xs">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <p>
          <strong className="font-semibold">Unaudited managed vault.</strong>{' '}
          Manager trades on whitelisted DEXes only and cannot withdraw to
          self. Performance moves with trading P&amp;L — your principal can
          and will fluctuate.
        </p>
      </div>
    </div>
  );
}
