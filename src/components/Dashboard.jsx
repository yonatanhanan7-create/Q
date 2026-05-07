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
  Droplet,
  ExternalLink,
  Info,
  Loader2,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from 'lucide-react';

import {
  AAVE_SEPOLIA,
  RESERVE,
  SEPOLIA_CHAIN_ID,
  aavePoolAbi,
  erc20Abi,
} from '../lib/aave.js';
import { useVaultData } from '../hooks/useVaultData.js';

export default function Dashboard({ embedded = false }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: switching } = useSwitchChain();
  const onSepolia = chainId === SEPOLIA_CHAIN_ID;

  const {
    apy,
    tvl,
    walletBalance,
    vaultBalance,
    allowance,
    walletBalanceRaw,
    vaultBalanceRaw,
  } = useVaultData();

  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('deposit'); // 'deposit' | 'withdraw'
  const [pendingHash, setPendingHash] = useState(null);
  const [step, setStep] = useState('idle'); // 'idle' | 'approving' | 'supplying' | 'withdrawing'

  const { writeContractAsync } = useWriteContract();
  const { isLoading: txMining } = useWaitForTransactionReceipt({
    hash: pendingHash,
    chainId: SEPOLIA_CHAIN_ID,
  });

  const parsedAmount = (() => {
    try {
      return amount ? parseUnits(amount, RESERVE.decimals) : 0n;
    } catch {
      return 0n;
    }
  })();

  const needsApproval =
    mode === 'deposit' && parsedAmount > 0n && allowance < parsedAmount;

  const handleDeposit = async () => {
    if (!parsedAmount) return;
    try {
      if (needsApproval) {
        setStep('approving');
        const hash = await writeContractAsync({
          address: RESERVE.asset,
          abi: erc20Abi,
          functionName: 'approve',
          args: [AAVE_SEPOLIA.pool, parsedAmount],
          chainId: SEPOLIA_CHAIN_ID,
        });
        setPendingHash(hash);
        return;
      }
      setStep('supplying');
      const hash = await writeContractAsync({
        address: AAVE_SEPOLIA.pool,
        abi: aavePoolAbi,
        functionName: 'supply',
        args: [RESERVE.asset, parsedAmount, address, 0],
        chainId: SEPOLIA_CHAIN_ID,
      });
      setPendingHash(hash);
    } catch (err) {
      console.error('Deposit failed:', err);
      setStep('idle');
    }
  };

  const handleWithdraw = async () => {
    if (!parsedAmount) return;
    try {
      setStep('withdrawing');
      const hash = await writeContractAsync({
        address: AAVE_SEPOLIA.pool,
        abi: aavePoolAbi,
        functionName: 'withdraw',
        args: [RESERVE.asset, parsedAmount, address],
        chainId: SEPOLIA_CHAIN_ID,
      });
      setPendingHash(hash);
    } catch (err) {
      console.error('Withdraw failed:', err);
      setStep('idle');
    }
  };

  // When the latest tx confirms, clear the form/step and let the read hooks
  // refresh balances on their next interval tick.
  if (pendingHash && !txMining && step !== 'idle') {
    setTimeout(() => {
      setStep('idle');
      setPendingHash(null);
      setAmount('');
    }, 0);
  }

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
            Connect your wallet to start
          </h2>
          <p className="mt-2 max-w-md text-sm text-slate-400">
            This demo only writes to Sepolia. Connecting your wallet only lets
            this app read public balances and prepare transactions for you to
            sign.
          </p>
          <div className="mt-6">
            <ConnectButton />
          </div>
        </div>
      </section>
    );
  }

  if (!onSepolia) {
    return (
      <section
        className={`mx-auto max-w-3xl px-6 ${embedded ? '' : 'pt-12 pb-16'}`}
      >
        <div className="glass-card flex flex-col items-center p-10 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/30">
            <Info className="h-6 w-6" />
          </span>
          <h2 className="mt-5 font-display text-2xl font-semibold text-white">
            Switch to Sepolia
          </h2>
          <p className="mt-2 max-w-md text-sm text-slate-400">
            This demo only writes to the Sepolia testnet so no real funds are
            ever at risk. Switch your wallet&rsquo;s network to continue.
          </p>
          <button
            onClick={() => switchChain({ chainId: SEPOLIA_CHAIN_ID })}
            disabled={switching}
            className="btn-primary mt-6"
          >
            {switching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Switching…
              </>
            ) : (
              'Switch to Sepolia'
            )}
          </button>
        </div>
      </section>
    );
  }

  const busy = step !== 'idle' || txMining;
  const insufficientWallet =
    mode === 'deposit' && parsedAmount > walletBalanceRaw;
  const insufficientVault =
    mode === 'withdraw' && parsedAmount > vaultBalanceRaw;
  const buttonLabel = (() => {
    if (step === 'approving') return 'Approving…';
    if (step === 'supplying') return 'Supplying…';
    if (step === 'withdrawing') return 'Withdrawing…';
    if (txMining) return 'Confirming…';
    if (mode === 'deposit') return needsApproval ? 'Approve USDC' : 'Deposit USDC';
    return 'Withdraw USDC';
  })();

  return (
    <section
      className={`mx-auto max-w-7xl px-6 ${embedded ? '' : 'pt-12 pb-16'}`}
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="stat-label">Vault dashboard · Sepolia</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {address?.slice(0, 6)}…{address?.slice(-4)}
          </h2>
        </div>
        <a
          href={AAVE_SEPOLIA.faucetUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost"
        >
          <Droplet className="h-4 w-4" />
          Get test USDC
          <ExternalLink className="h-3.5 w-3.5 opacity-60" />
        </a>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-white">
              Your position
            </h3>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              aUSDC live
            </span>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <dt className="stat-label">In vault (aUSDC)</dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-white">
                {vaultBalance.toFixed(2)}
              </dd>
            </div>
            <div>
              <dt className="stat-label">Wallet USDC</dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-white">
                {walletBalance.toFixed(2)}
              </dd>
            </div>
            <div>
              <dt className="stat-label">Current APY</dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-emerald-300">
                {(apy * 100).toFixed(2)}%
              </dd>
            </div>
            <div>
              <dt className="stat-label">Pool TVL</dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-white">
                ${tvl.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </dd>
            </div>
          </dl>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <MiniStat
              label="Network"
              value="Sepolia"
              icon={ShieldCheck}
            />
            <MiniStat
              label="Asset"
              value="USDC (faucet)"
              icon={Wallet}
            />
            <MiniStat
              label="Yield source"
              value="Aave V3 Pool"
              icon={TrendingUp}
            />
          </div>

          <p className="mt-6 text-xs text-slate-500">
            Pool:{' '}
            <code className="font-mono text-slate-400">
              {AAVE_SEPOLIA.pool}
            </code>
          </p>
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
              <span className="text-sm font-medium text-emerald-300">
                USDC
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>
                {mode === 'deposit'
                  ? `Wallet: ${walletBalance.toFixed(2)}`
                  : `Vault: ${vaultBalance.toFixed(2)}`}
              </span>
              <button
                type="button"
                onClick={() => {
                  const raw =
                    mode === 'deposit' ? walletBalanceRaw : vaultBalanceRaw;
                  setAmount(formatUnits(raw, RESERVE.decimals));
                }}
                className="text-emerald-400 transition hover:text-emerald-300"
              >
                Max
              </button>
            </div>
          </label>

          {(insufficientWallet || insufficientVault) && (
            <p className="mt-2 text-xs text-amber-300">
              {insufficientWallet
                ? 'Not enough USDC in wallet. Use the faucet above.'
                : 'Not enough aUSDC in the vault.'}
            </p>
          )}

          <button
            type="button"
            disabled={
              busy ||
              !parsedAmount ||
              insufficientWallet ||
              insufficientVault
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
              You will need to approve USDC for the Aave pool first, then
              press Deposit again to supply.
            </p>
          )}

          {pendingHash && (
            <a
              href={`https://sepolia.etherscan.io/tx/${pendingHash}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 block break-all rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3 text-xs text-emerald-200 hover:bg-emerald-400/10"
            >
              View on Etherscan ↗
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
