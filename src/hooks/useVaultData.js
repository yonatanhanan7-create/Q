import { useReadContract, useReadContracts, useAccount } from 'wagmi';
import { formatUnits } from 'viem';

import {
  AAVE_SEPOLIA,
  RESERVE,
  SEPOLIA_CHAIN_ID,
  aavePoolAbi,
  erc20Abi,
  liquidityRateToApy,
} from '../lib/aave.js';

// Reads live vault metrics (TVL, APY) and the connected user's balances
// directly from Aave V3 on Sepolia. No manual updates, no admin overrides —
// every value below is whatever the contract returns at this block.
export function useVaultData() {
  const { address } = useAccount();

  const { data: reserveData, isLoading: reserveLoading } = useReadContract({
    address: AAVE_SEPOLIA.pool,
    abi: aavePoolAbi,
    functionName: 'getReserveData',
    args: [RESERVE.asset],
    chainId: SEPOLIA_CHAIN_ID,
    query: { refetchInterval: 15_000 },
  });

  const { data: tvlRaw } = useReadContract({
    address: RESERVE.aToken,
    abi: erc20Abi,
    functionName: 'totalSupply',
    chainId: SEPOLIA_CHAIN_ID,
    query: { refetchInterval: 15_000 },
  });

  const { data: userReads } = useReadContracts({
    contracts: address
      ? [
          {
            address: RESERVE.asset,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [address],
            chainId: SEPOLIA_CHAIN_ID,
          },
          {
            address: RESERVE.aToken,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [address],
            chainId: SEPOLIA_CHAIN_ID,
          },
          {
            address: RESERVE.asset,
            abi: erc20Abi,
            functionName: 'allowance',
            args: [address, AAVE_SEPOLIA.pool],
            chainId: SEPOLIA_CHAIN_ID,
          },
        ]
      : [],
    query: { enabled: !!address, refetchInterval: 15_000 },
  });

  const apy = reserveData ? liquidityRateToApy(reserveData.currentLiquidityRate) : 0;
  const tvl = tvlRaw ? Number(formatUnits(tvlRaw, RESERVE.decimals)) : 0;
  const walletBalance =
    userReads?.[0]?.result != null
      ? Number(formatUnits(userReads[0].result, RESERVE.decimals))
      : 0;
  const vaultBalance =
    userReads?.[1]?.result != null
      ? Number(formatUnits(userReads[1].result, RESERVE.decimals))
      : 0;
  const allowance = userReads?.[2]?.result ?? 0n;

  return {
    apy,
    tvl,
    walletBalance,
    vaultBalance,
    allowance,
    isLoading: reserveLoading,
    walletBalanceRaw: userReads?.[0]?.result ?? 0n,
    vaultBalanceRaw: userReads?.[1]?.result ?? 0n,
  };
}
