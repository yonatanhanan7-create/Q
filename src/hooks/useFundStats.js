import { useEffect, useState } from 'react';

const BASE_TVL = 142_750_000;
const BASE_ROI = 38.42;
const BASE_INVESTORS = 8_421;

// Mocked "live" fund metrics. In production these would come from an indexer
// or a smart-contract read via wagmi useReadContract.
export function useFundStats() {
  const [tvl, setTvl] = useState(BASE_TVL);
  const [roi, setRoi] = useState(BASE_ROI);
  const [investors, setInvestors] = useState(BASE_INVESTORS);

  useEffect(() => {
    const id = setInterval(() => {
      setTvl((prev) => prev + Math.round((Math.random() - 0.4) * 35_000));
      setRoi((prev) =>
        Math.max(0, +(prev + (Math.random() - 0.5) * 0.05).toFixed(2)),
      );
      setInvestors((prev) =>
        Math.max(BASE_INVESTORS, prev + (Math.random() > 0.7 ? 1 : 0)),
      );
    }, 3500);

    return () => clearInterval(id);
  }, []);

  return { tvl, roi, investors };
}
