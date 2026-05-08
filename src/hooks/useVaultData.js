import { useAccount, useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';

import {
  VAULT_ADDRESS,
  VAULT_ASSET,
  VAULT_ASSET_DECIMALS,
  VAULT_CHAIN_ID,
  isVaultConfigured,
  erc20Abi,
  tradingVaultAbi,
} from '../lib/vault.js';

const SHARE_PRECISION = 10n ** 18n;

export function useVaultData() {
  const { address } = useAccount();

  const baseContracts = isVaultConfigured
    ? [
        {
          address: VAULT_ADDRESS,
          abi: tradingVaultAbi,
          functionName: 'totalAssets',
          chainId: VAULT_CHAIN_ID,
        },
        {
          address: VAULT_ADDRESS,
          abi: tradingVaultAbi,
          functionName: 'totalSupply',
          chainId: VAULT_CHAIN_ID,
        },
        {
          address: VAULT_ADDRESS,
          abi: tradingVaultAbi,
          functionName: 'sharePrice',
          chainId: VAULT_CHAIN_ID,
        },
        {
          address: VAULT_ADDRESS,
          abi: tradingVaultAbi,
          functionName: 'highWaterMark',
          chainId: VAULT_CHAIN_ID,
        },
        {
          address: VAULT_ADDRESS,
          abi: tradingVaultAbi,
          functionName: 'manager',
          chainId: VAULT_CHAIN_ID,
        },
        {
          address: VAULT_ADDRESS,
          abi: tradingVaultAbi,
          functionName: 'performanceFeeBps',
          chainId: VAULT_CHAIN_ID,
        },
      ]
    : [];

  const userContracts =
    isVaultConfigured && address
      ? [
          {
            address: VAULT_ADDRESS,
            abi: tradingVaultAbi,
            functionName: 'balanceOf',
            args: [address],
            chainId: VAULT_CHAIN_ID,
          },
          {
            address: VAULT_ASSET,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [address],
            chainId: VAULT_CHAIN_ID,
          },
          {
            address: VAULT_ASSET,
            abi: erc20Abi,
            functionName: 'allowance',
            args: [address, VAULT_ADDRESS],
            chainId: VAULT_CHAIN_ID,
          },
        ]
      : [];

  const { data, isLoading, refetch } = useReadContracts({
    contracts: [...baseContracts, ...userContracts],
    query: {
      enabled: isVaultConfigured,
      refetchInterval: 12_000,
    },
  });

  if (!isVaultConfigured || !data) {
    return {
      configured: isVaultConfigured,
      isLoading,
      refetch,
      tvl: 0,
      totalShares: 0n,
      sharePriceRaw: SHARE_PRECISION,
      sharePrice: 1,
      highWaterMark: 1,
      manager: null,
      performanceFeeBps: 0,
      userShares: 0n,
      userSharesNum: 0,
      userValue: 0,
      walletBalance: 0,
      walletBalanceRaw: 0n,
      allowance: 0n,
    };
  }

  const tvlRaw = data[0]?.result ?? 0n;
  const totalShares = data[1]?.result ?? 0n;
  const sharePriceRaw = data[2]?.result ?? SHARE_PRECISION;
  const highWaterMarkRaw = data[3]?.result ?? SHARE_PRECISION;
  const manager = data[4]?.result ?? null;
  const performanceFeeBps = Number(data[5]?.result ?? 0n);

  const userShares = data[6]?.result ?? 0n;
  const walletBalanceRaw = data[7]?.result ?? 0n;
  const allowance = data[8]?.result ?? 0n;

  const tvl = Number(formatUnits(tvlRaw, VAULT_ASSET_DECIMALS));
  const sharePrice = Number(formatUnits(sharePriceRaw, 18));
  const highWaterMark = Number(formatUnits(highWaterMarkRaw, 18));
  const userSharesNum = Number(formatUnits(userShares, 18));
  const userValueRaw =
    totalShares > 0n ? (userShares * tvlRaw) / totalShares : 0n;
  const userValue = Number(formatUnits(userValueRaw, VAULT_ASSET_DECIMALS));
  const walletBalance = Number(
    formatUnits(walletBalanceRaw, VAULT_ASSET_DECIMALS),
  );

  return {
    configured: true,
    isLoading,
    refetch,
    tvl,
    totalShares,
    sharePriceRaw,
    sharePrice,
    highWaterMark,
    manager,
    performanceFeeBps,
    userShares,
    userSharesNum,
    userValue,
    walletBalance,
    walletBalanceRaw,
    allowance,
  };
}
