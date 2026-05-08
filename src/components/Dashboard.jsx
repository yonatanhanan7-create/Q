import { useState } from 'react';
import {
  useAccount,
  useChainId,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseUnits, formatUnits } from 'viem';
import {
  ArrowDownToLine,
  ArrowUpToLine,
  ExternalLink,
  Info,
  Loader2,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from 'lucide-react';

import {
  VAULT_ADDRESS,
  VAULT_ASSET,
  VAULT_ASSET_DECIMALS,
  VAULT_ASSET_SYMBOL,
  VAULT_CHAIN_ID,
  isVaultConfigured,
  erc20Abi,
  tradingVaultAbi,
} from '../lib/vault.js';
import { useVaultData } from '../hooks/useVaultData.js';

const explorerTx = (hash, chainId) => {
  if (chainId === 1) return `https://etherscan.io/tx/${hash}`;
  if (chainId === 11155111) return `https://sepolia.etherscan.io/tx/${hash}`;
  if (chainId === 42161) return `https://arbiscan.io/tx/${hash}`;
  return `https://etherscan.io/tx/${hash}`;
};

const chainName = (id) => {
  if (id === 1) return 'Ethereum';
  if (id === 11155111) return 'Sepolia';
  if (id === 42161) return 'Arbitrum';
  return `Chain ${id}`;
};

export default function Dashboard({ embedded = false }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: switching } = useSwitchChain();
  const onCorrectChain = chainId === VAULT_CHAIN_ID;

  const v = useVaultData();
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('deposit');
  const [pendingHash, setPendingHash] = useState(null);
  const [step, setStep] = useState('idle');

  const { writeContractAsync } = useWriteContract();
  const { isLoading: txMining } = useWaitForTransactionReceipt({
    hash: pendingHash,
    chainId: VAULT_CHAIN_ID,
  });

  if (pendingHash && !txMining && step !== 'idle') {
    setTimeout(() => {
      setStep('idle');
      setPendingHash(null);
      setAmount('');
      v.refetch?.();
    }, 0);
  }

  if (!isConnected) {
    return (
      <CenterCard embedded={embedded} icon={Wallet} title="Connect your wallet to start">
        <p className="mt-2 max-w-md text-sm text-slate-400">
          The vault is non-custodial. We can&rsquo;t move funds in your name —
          only your wallet can sign transactions to deposit or withdraw.
        </p>
        <div className="mt-6">
          <ConnectButton />
        </div>
      </CenterCard>
    );
  }

  if (!isVaultConfigured) {
    return (
      <CenterCard embedded={embedded} icon={Info} title="Vault not configured" amber>
        <p className="mt-2 max-w-md text-sm text-slate-400">
          The frontend has no <code className="text-amber-200">VITE_VAULT_ADDRESS</code>{' '}
          set. Deploy the TradingVault contract (see{' '}
          <code className="text-amber-200">contracts/README.md</code>) and add
          the address to your <code>.env.local</code>:
        </p>
        <pre className="mt-4 w-full overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-3 text-left text-xs text-slate-300">
{`VITE_VAULT_ADDRESS=0x...
VITE_VAULT_CHAIN_ID=${VAULT_CHAIN_ID}
VITE_VAULT_ASSET=0x...      # USDC on the deploy chain
VITE_VAULT_ASSET_DECIMALS=6
VITE_VAULT_ASSET_SYMBOL=USDC`}
        </pre>
      </CenterCard>
    );
  }

  if (!onCorrectChain) {
    return (
      <CenterCard embedded={embedded} icon={Info} title={`Switch to ${chainName(VAULT_CHAIN_ID)}`} amber>
        <p className="mt-2 max-w-md text-sm text-slate-400">
          The vault lives on {chainName(VAULT_CHAIN_ID)}. Switch your wallet
          network to continue.
        </p>
        <button
          onClick={() => switchChain({ chainId: VAULT_CHAIN_ID })}
          disabled={switching}
          className="btn-primary mt-6"
        >
          {switching ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Switching…
            </>
          ) : (
            `Switch to ${chainName(VAULT_CHAIN_ID)}`
          )}
        </button>
      </CenterCard>
    );
  }

  const parsedAssets = (() => {
    try {
      return amount && mode === 'deposit'
        ? parseUnits(amount, VAULT_ASSET_DECIMALS)
        : 0n;
    } catch {
      return 0n;
    }
  })();
  const parsedShares = (() => {
    try {
      return amount && mode === 'withdraw' ? parseUnits(amount, 18) : 0n;
    } catch {
      return 0n;
    }
  })();

  const needsApproval =
    mode === 'deposit' && parsedAssets > 0n && v.allowance < parsedAssets;

  const handleDeposit = async () => {
    if (!parsedAssets) return;
    try {
      if (needsApproval) {
        setStep('approving');
        const hash = await writeContractAsync({
          address: VAULT_ASSET,
          abi: erc20Abi,
          functionName: 'approve',
          args: [VAULT_ADDRESS, parsedAssets],
          chainId: VAULT_CHAIN_ID,
        });
        setPendingHash(hash);
        return;
      }
      setStep('depositing');
      const hash = await writeContractAsync({
        address: VAULT_ADDRESS,
        abi: tradingVaultAbi,
        functionName: 'deposit',
        args: [parsedAssets, address],
        chainId: VAULT_CHAIN_ID,
      });
      setPendingHash(hash);
    } catch (err) {
      console.error('Deposit failed:', err);
      setStep('idle');
    }
  };

  const handleWithdraw = async () => {
    if (!parsedShares) return;
    try {
      setStep('withdrawing');
      const hash = await writeContractAsync({
        address: VAULT_ADDRESS,
        abi: tradingVaultAbi,
        functionName: 'withdraw',
        args: [parsedShares, address],
        chainId: VAULT_CHAIN_ID,
      });
      setPendingHash(hash);
    } catch (err) {
      console.error('Withdraw failed:', err);
      setStep('idle');
    }
  };

  const busy = step !== 'idle' || txMining;
  const insufficientWallet =
    mode === 'deposit' && parsedAssets > v.walletBalanceRaw;
  const insufficientShares =
    mode === 'withdraw' && parsedShares > v.userShares;

  const buttonLabel = (() => {
    if (step === 'approving') return `Approving ${VAULT_ASSET_SYMBOL}…`;
    if (step === 'depositing') return 'Depositing…';
    if (step === 'withdrawing') return 'Withdrawing…';
    if (txMining) return 'Confirming…';
    if (mode === 'deposit')
      return needsApproval ? `Approve ${VAULT_ASSET_SYMBOL}` : `Deposit ${VAULT_ASSET_SYMBOL}`;
    return 'Withdraw shares';
  })();

  const pnlPct =
    v.highWaterMark > 0
      ? ((v.sharePrice - 1) * 100).toFixed(2)
      : '0.00';

  return (
    <section
      className={`mx-auto max-w-7xl px-6 ${embedded ? '' : 'pt-12 pb-16'}`}
    >
      <div className="mb-8">
        <p className="stat-label">Vault dashboard · {chainName(VAULT_CHAIN_ID)}</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {address?.slice(0, 6)}…{address?.slice(-4)}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-white">
              Vault overview
            </h3>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live NAV
            </span>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat
              label={`Your value (${VAULT_ASSET_SYMBOL})`}
              value={v.userValue.toFixed(2)}
              accent
            />
            <Stat label="Your shares" value={v.userSharesNum.toFixed(4)} />
            <Stat
              label="Share price"
              value={v.sharePrice.toFixed(4)}
              suffix={VAULT_ASSET_SYMBOL}
            />
            <Stat
              label={`Wallet ${VAULT_ASSET_SYMBOL}`}
              value={v.walletBalance.toFixed(2)}
            />
          </dl>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <MiniStat
              label="Vault TVL"
              value={`${v.tvl.toLocaleString('en-US', { maximumFractionDigits: 0 })} ${VAULT_ASSET_SYMBOL}`}
              icon={ShieldCheck}
            />
            <MiniStat
              label="Cumulative perf"
              value={`${pnlPct}%`}
              icon={TrendingUp}
              positive={Number(pnlPct) >= 0}
            />
            <MiniStat
              label="Performance fee"
              value={`${(v.performanceFeeBps / 100).toFixed(1)}%`}
              icon={Info}
            />
          </div>

          <div className="mt-6 space-y-1 text-xs text-slate-500">
            <p>
              Manager:{' '}
              <code className="font-mono text-slate-400">
                {v.manager
                  ? `${v.manager.slice(0, 8)}…${v.manager.slice(-6)}`
                  : '—'}
              </code>
            </p>
            <p>
              Vault:{' '}
              <code className="font-mono text-slate-400">{VAULT_ADDRESS}</code>
            </p>
            <p>
              Asset:{' '}
              <code className="font-mono text-slate-400">{VAULT_ASSET}</code>
            </p>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setMode('deposit')}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                mode === 'deposit'
                  ? 'bg-emerald-400/15 text-emerald-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Deposit
            </button>
            <button
              type="button"
              onClick={() => setMode('withdraw')}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                mode === 'withdraw'
                  ? 'bg-emerald-400/15 text-emerald-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Withdraw
            </button>
          </div>

          <label className="mt-5 block">
            <span className="stat-label">
              {mode === 'deposit' ? 'Amount to deposit' : 'Shares to redeem'}
            </span>
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
              <span className="text-sm font-medium text-emerald-300">
                {mode === 'deposit' ? VAULT_ASSET_SYMBOL : 'shares'}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>
                {mode === 'deposit'
                  ? `Wallet: ${v.walletBalance.toFixed(2)} ${VAULT_ASSET_SYMBOL}`
                  : `Owned: ${v.userSharesNum.toFixed(4)} shares`}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (mode === 'deposit') {
                    setAmount(formatUnits(v.walletBalanceRaw, VAULT_ASSET_DECIMALS));
                  } else {
                    setAmount(formatUnits(v.userShares, 18));
                  }
                }}
                className="text-emerald-400 transition hover:text-emerald-300"
              >
                Max
              </button>
            </div>
          </label>

          {(insufficientWallet || insufficientShares) && (
            <p className="mt-2 text-xs text-amber-300">
              {insufficientWallet
                ? `Not enough ${VAULT_ASSET_SYMBOL} in your wallet.`
                : 'Not enough vault shares.'}
            </p>
          )}

          <button
            type="button"
            disabled={
              busy ||
              (mode === 'deposit' ? !parsedAssets : !parsedShares) ||
              insufficientWallet ||
              insufficientShares
            }
            onClick={mode === 'deposit' ? handleDeposit : handleWithdraw}
            className="btn-primary mt-5 w-full"
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {buttonLabel}
              </>
            ) : (
              <>
                {mode === 'deposit' ? (
                  <ArrowDownToLine className="h-4 w-4" />
                ) : (
                  <ArrowUpToLine className="h-4 w-4" />
                )}
                {buttonLabel}
              </>
            )}
          </button>

          {mode === 'deposit' && needsApproval && !busy && (
            <p className="mt-3 text-xs text-slate-500">
              First transaction approves the vault to spend your{' '}
              {VAULT_ASSET_SYMBOL}; then press Deposit again.
            </p>
          )}

          {mode === 'withdraw' && (
            <p className="mt-3 text-xs text-slate-500">
              Withdrawals draw from the vault&rsquo;s liquid {VAULT_ASSET_SYMBOL}{' '}
              balance. If the manager has open positions, redemption may
              revert until they liquidate.
            </p>
          )}

          {pendingHash && (
            <a
              href={explorerTx(pendingHash, VAULT_CHAIN_ID)}
              target="_blank"
              rel="noreferrer"
              className="mt-4 block break-all rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3 text-xs text-emerald-200 hover:bg-emerald-400/10"
            >
              View on explorer
              <ExternalLink className="ml-1 inline h-3 w-3" />
              <p className="mt-1 font-mono text-[11px] text-emerald-300/80">
                {pendingHash}
              </p>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function CenterCard({ children, embedded, icon: Icon, title, amber }) {
  return (
    <section
      className={`mx-auto max-w-3xl px-6 ${embedded ? '' : 'pt-24 pb-16'}`}
    >
      <div className="glass-card flex flex-col items-center p-10 text-center">
        <span
          className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${
            amber
              ? 'bg-amber-400/10 text-amber-300 ring-amber-400/30'
              : 'bg-emerald-400/10 text-emerald-400 ring-emerald-400/20'
          }`}
        >
          <Icon className="h-6 w-6" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold text-white">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

function Stat({ label, value, suffix, accent }) {
  return (
    <div>
      <dt className="stat-label">{label}</dt>
      <dd
        className={`mt-1 font-display text-2xl font-semibold ${
          accent ? 'text-emerald-300' : 'text-white'
        }`}
      >
        {value}
        {suffix && (
          <span className="ml-1 text-sm font-medium text-slate-500">
            {suffix}
          </span>
        )}
      </dd>
    </div>
  );
}

function MiniStat({ label, value, icon: Icon, positive }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between">
        <span className="stat-label">{label}</span>
        <Icon className="h-4 w-4 text-slate-500" />
      </div>
      <p
        className={`mt-2 font-display text-base font-semibold ${
          positive === false ? 'text-amber-300' : 'text-white'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
