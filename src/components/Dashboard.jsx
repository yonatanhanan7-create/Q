import { useMemo, useState } from 'react';
import { useAccount, useBalance, useChainId } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseUnits } from 'viem';
import {
  ArrowUpRight,
  Loader2,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from 'lucide-react';

import { useFundStats } from '../hooks/useFundStats.js';

const ASSETS = {
  ETH: {
    symbol: 'ETH',
    decimals: 18,
    color: 'from-cyan-400/20 to-cyan-400/0',
    iconColor: 'text-cyan-300',
  },
  USDT: {
    symbol: 'USDT',
    decimals: 6,
    color: 'from-emerald-400/20 to-emerald-400/0',
    iconColor: 'text-emerald-300',
  },
};

const VAULT_ADDRESS = '0x000000000000000000000000000000000000A1FA';

export default function Dashboard({ embedded = false }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: ethBalance } = useBalance({ address });
  const { roi, tvl } = useFundStats();

  const [asset, setAsset] = useState('USDT');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lastTx, setLastTx] = useState(null);

  const selected = ASSETS[asset];

  // Mocked positions in lieu of an actual vault read
  const userPosition = useMemo(() => {
    if (!isConnected || !address) return null;
    const seed = parseInt(address.slice(-6), 16);
    const principal = 2_500 + (seed % 12_000);
    const earned = principal * (roi / 100) * 0.62;
    return {
      shares: (principal + earned).toFixed(2),
      principal,
      earned: earned.toFixed(2),
    };
  }, [address, isConnected, roi]);

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    setSubmitting(true);

    // Placeholder: in production this would be a wagmi
    // useWriteContract({ abi, address: VAULT_ADDRESS, functionName: 'deposit', args: [...] })
    const parsed = parseUnits(amount, selected.decimals);

    const txDetails = {
      action: 'deposit',
      vault: VAULT_ADDRESS,
      asset: selected.symbol,
      amountHuman: amount,
      amountWei: parsed.toString(),
      sender: address,
      chainId,
      timestamp: new Date().toISOString(),
    };

    // Simulate a smart-contract call
    console.group('%c[AlphaChain] deposit() simulated', 'color:#10B981');
    console.log('Calling vault.deposit(asset, amount, receiver)');
    console.table(txDetails);
    console.groupEnd();

    await new Promise((r) => setTimeout(r, 1100));

    const fakeHash =
      '0x' +
      Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16),
      ).join('');

    setLastTx({ ...txDetails, hash: fakeHash });
    setAmount('');
    setSubmitting(false);
  };

  if (!isConnected) {
    return (
      <section
        className={`mx-auto max-w-3xl px-6 ${embedded ? '' : 'pt-24 pb-16'}`}
      >
        <div className="glass-card flex flex-col items-center p-10 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20">
            <Wallet className="h-6 w-6" />
          </span>
          <h2 className="mt-5 font-display text-2xl font-semibold text-white">
            Connect your wallet to invest
          </h2>
          <p className="mt-2 max-w-md text-sm text-slate-400">
            AlphaChain is fully non-custodial. Connecting your wallet only
            grants this app permission to read your balances and prepare
            transactions for you to sign.
          </p>
          <div className="mt-6">
            <ConnectButton />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`mx-auto max-w-7xl px-6 ${embedded ? '' : 'pt-12 pb-16'}`}
    >
      <div className="mb-8">
        <p className="stat-label">Investor dashboard</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Welcome back, {address?.slice(0, 6)}…{address?.slice(-4)}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-white">
              Your position
            </h3>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              acAlpha vault
            </span>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <dt className="stat-label">Total balance</dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-white">
                ${userPosition?.shares ?? '0.00'}
              </dd>
            </div>
            <div>
              <dt className="stat-label">Principal</dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-white">
                ${userPosition?.principal.toLocaleString() ?? '0'}
              </dd>
            </div>
            <div>
              <dt className="stat-label">Earned</dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-emerald-300">
                +${userPosition?.earned ?? '0.00'}
              </dd>
            </div>
            <div>
              <dt className="stat-label">Wallet ETH</dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-white">
                {ethBalance
                  ? Number(ethBalance.formatted).toFixed(4)
                  : '0.0000'}
              </dd>
            </div>
          </dl>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <MiniStat
              label="Vault TVL"
              value={`$${(tvl / 1e6).toFixed(2)}M`}
              icon={ShieldCheck}
            />
            <MiniStat
              label="Your share"
              value={
                userPosition
                  ? `${((Number(userPosition.shares) / tvl) * 100).toFixed(4)}%`
                  : '—'
              }
              icon={TrendingUp}
            />
            <MiniStat
              label="Network"
              value={chainNameFromId(chainId)}
              icon={Wallet}
            />
          </div>
        </div>

        <form onSubmit={handleDeposit} className="glass-card p-6">
          <h3 className="font-display text-lg font-semibold text-white">
            Deposit into vault
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Funds are deployed instantly across active strategies.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {Object.values(ASSETS).map((a) => (
              <button
                key={a.symbol}
                type="button"
                onClick={() => setAsset(a.symbol)}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                  asset === a.symbol
                    ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                }`}
              >
                {a.symbol}
              </button>
            ))}
          </div>

          <label className="mt-4 block">
            <span className="stat-label">Amount</span>
            <div className="mt-2 flex items-center rounded-xl border border-white/10 bg-brand-deep/60 px-3 focus-within:border-emerald-400/50">
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-transparent py-3 font-display text-xl text-white outline-none placeholder:text-slate-600"
              />
              <span className={`text-sm font-medium ${selected.iconColor}`}>
                {selected.symbol}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Vault: {VAULT_ADDRESS.slice(0, 10)}…</span>
              <button
                type="button"
                onClick={() =>
                  setAmount(
                    asset === 'ETH' && ethBalance
                      ? Number(ethBalance.formatted).toFixed(4)
                      : '1000',
                  )
                }
                className="text-emerald-400 transition hover:text-emerald-300"
              >
                Use max
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={submitting || !amount}
            className="btn-primary mt-5 w-full"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Confirming…
              </>
            ) : (
              <>
                Deposit {selected.symbol}
                <ArrowUpRight className="h-4 w-4" />
              </>
            )}
          </button>

          {lastTx && (
            <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3 text-xs text-emerald-200">
              <p className="font-medium">Simulated transaction sent</p>
              <p className="mt-1 break-all font-mono text-[11px] text-emerald-300/80">
                {lastTx.hash}
              </p>
              <p className="mt-1 text-emerald-200/70">
                Deposited {lastTx.amountHuman} {lastTx.asset} — see console for
                full payload.
              </p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

function MiniStat({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between">
        <span className="stat-label">{label}</span>
        <Icon className="h-4 w-4 text-slate-500" />
      </div>
      <p className="mt-2 font-display text-base font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function chainNameFromId(id) {
  switch (id) {
    case 1:
      return 'Ethereum';
    case 42161:
      return 'Arbitrum';
    case 10:
      return 'Optimism';
    case 8453:
      return 'Base';
    case 137:
      return 'Polygon';
    default:
      return `Chain ${id ?? '—'}`;
  }
}
