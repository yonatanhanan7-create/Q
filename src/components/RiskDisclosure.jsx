import { AlertTriangle } from 'lucide-react';

export default function RiskDisclosure() {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-16 pb-24">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/30">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <div>
          <p className="stat-label">Legal</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Risk Disclosure
          </h1>
        </div>
      </div>

      <div className="mt-10 space-y-8 text-slate-300">
        <p className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-5 text-sm text-amber-100">
          A managed trading vault can lose money — sometimes a lot of it.
          Read this page before depositing. The architecture protects you
          against theft; it does not protect you against bad trades.
        </p>

        <Block title="Manager risk (the big one)">
          The manager makes discretionary trading decisions with your funds.
          Even a skilled manager has losing months; an unskilled or unlucky
          one can produce drawdowns of 50%, 80%, or more. The contract has no
          stop-loss, no risk limits, and no obligation on the manager to
          trade conservatively. Past performance is not indicative of future
          results, and the disclosure of past performance — if any — is
          performance net of fees but not adjusted for survivorship bias.
        </Block>

        <Block title="What the contract does and does not protect">
          <strong>Protects against:</strong> the manager moving funds to
          their own wallet, swapping to a non-whitelisted token, approving
          arbitrary contracts, or back-dating performance. The
          on-chain share price <em>is</em> the share price.
          <br />
          <br />
          <strong>Does not protect against:</strong> the manager making
          terrible trades on whitelisted venues, the manager front-running
          deposits/withdrawals through their personal wallet, MEV bots
          extracting value from large vault swaps, or oracle/Chainlink
          failures.
        </Block>

        <Block title="Smart-contract risk">
          The TradingVault contract is unaudited software. Bugs in vault
          accounting, in the swap path, or in the performance-fee math can
          cause loss of funds. The whitelisted DEX routers (Uniswap V3) and
          the asset (USDC) carry their own well-known but non-zero risks.
          Treat any balance you deposit as &ldquo;capital you can afford to
          lose to a bug.&rdquo;
        </Block>

        <Block title="Oracle &amp; pricing risk">
          NAV is computed using Chainlink price feeds with a one-hour
          staleness check. If a feed is wrong (manipulated, delayed past the
          staleness bound, or simply incorrect), deposits and withdrawals
          can mis-price, transferring value between depositors. Critical
          markets like ETH/USD are robust; less-liquid assets are not.
        </Block>

        <Block title="Liquidity &amp; redemption risk">
          Withdrawals pay out from the vault&rsquo;s liquid USDC balance.
          If the manager has open positions worth, say, 80% of the vault,
          only 20% of the vault is redeemable until the manager liquidates.
          Forced liquidation in stressed markets often realises worse prices
          than the on-chain NAV implies.
        </Block>

        <Block title="Stablecoin &amp; chain risk">
          USDC may depeg under stress. The chain you deposit on (Sepolia for
          tests, Arbitrum or Mainnet in production) may experience
          congestion, reorgs, or sequencer downtime that delays your tx.
          During such events, share-price moves can be severe.
        </Block>

        <Block title="Operational &amp; key risk">
          The manager&rsquo;s key is the operator&rsquo;s problem to protect.
          A compromised manager key would not let an attacker steal funds
          (the contract prevents that), but it would let them trade your
          deposits into worthless tokens via whitelisted routes. Owner-key
          compromise (multisig recommended) is more serious — the owner can
          rotate the manager and edit whitelists.
        </Block>

        <Block title="Regulatory risk">
          The legal status of managed crypto vaults is unsettled in many
          jurisdictions. Operating one for the public typically requires a
          portfolio-management licence; depositing in one may be restricted
          for retail investors in your jurisdiction. You are responsible for
          your own compliance, including tax on any gains.
        </Block>

        <Block title="What this site does and does not do">
          This site is the front-end for a non-custodial managed trading
          vault. It does not offer fixed returns, principal protection,
          insurance, or any opinion about whether you should deposit. The
          performance shown is the on-chain share price, period.
        </Block>

        <p className="text-sm text-slate-400">
          If you do not fully understand the risks above, do not deposit on
          mainnet. Use the Sepolia deployment to learn the mechanics first.
        </p>
      </div>
    </section>
  );
}

function Block({ title, children }) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
      <p className="mt-2 leading-relaxed">{children}</p>
    </div>
  );
}
