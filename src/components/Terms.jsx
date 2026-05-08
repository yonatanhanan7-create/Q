import { ScrollText } from 'lucide-react';

export default function Terms() {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-16 pb-24">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20">
          <ScrollText className="h-5 w-5" />
        </span>
        <div>
          <p className="stat-label">Legal</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Terms of Service
          </h1>
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Last updated: 2026-05-08
      </p>

      <div className="prose prose-invert mt-10 max-w-none text-slate-300 [&>h2]:font-display [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:text-white [&>h2]:mt-10 [&>p]:mt-3 [&>ul]:mt-3 [&>ul]:list-disc [&>ul]:pl-6 [&>li]:mt-1">
        <h2>1. What this site is</h2>
        <p>
          AlphaChain Capital (&ldquo;the Site&rdquo;) is the front-end for an
          open-source <strong>managed trading vault</strong> deployed as a
          public smart contract. Depositors supply USDC to the vault and
          receive ERC-20 shares. A designated &ldquo;manager&rdquo; address
          executes spot trades on whitelisted decentralised exchanges with the
          vault&rsquo;s assets. The contract enforces that the manager
          <strong> cannot transfer assets to themselves</strong>; their power is
          restricted to swap calls on whitelisted DEX routers.
        </p>

        <h2>2. Active management — losses are possible</h2>
        <p>
          Unlike a passive lending pool, the vault&rsquo;s share price moves
          with the manager&rsquo;s trading decisions. <strong>Past
          performance does not predict future results.</strong> Your principal
          is at risk; the vault may experience drawdowns of any size, up to
          and including total loss. There is no guaranteed yield, no fixed
          APY, and no principal protection of any kind.
        </p>

        <h2>3. Fees</h2>
        <p>
          The vault charges a performance fee, hard-capped by the contract at
          30%, accruing only above the previous all-time-high share price
          (high-water mark). The current rate is published on-chain via
          <code className="text-emerald-300">{' performanceFeeBps()'}</code>{' '}
          and shown on the dashboard. There are no deposit, withdrawal, or
          management fees in this version.
        </p>

        <h2>4. Non-custodial &amp; self-directed</h2>
        <p>
          The Site never takes custody of your funds. Deposits move directly
          from your wallet to the vault contract; withdrawals move directly
          from the vault contract to your wallet. We cannot freeze, claw back,
          or recover assets, including in cases of phishing, lost keys, or
          mistaken transactions. The manager&rsquo;s key is the operator&rsquo;s
          responsibility to protect.
        </p>

        <h2>5. Honest representations</h2>
        <p>We commit to the following:</p>
        <ul>
          <li>
            We <strong>do not</strong> promise fixed yields, guaranteed
            returns, or principal protection.
          </li>
          <li>
            We <strong>do not</strong> operate an off-chain ledger or an
            admin-controlled performance multiplier. The on-chain share price
            is the share price.
          </li>
          <li>
            All metrics on the dashboard (TVL, share price, manager address,
            fee rate) are read directly from the deployed{' '}
            <code className="text-emerald-300">TradingVault</code> contract on
            the chain you are connected to.
          </li>
          <li>
            The contract source is published in this repository under MIT.
            Anyone can read, audit, or fork it.
          </li>
        </ul>

        <h2>6. Risks you accept</h2>
        <p>
          Using this vault involves real and material risks, including but not
          limited to:
        </p>
        <ul>
          <li>
            <strong>Manager risk:</strong> the manager may execute losing
            trades, including catastrophic ones. The contract cannot prevent
            bad judgment.
          </li>
          <li>
            <strong>Smart-contract risk:</strong> the vault is unaudited
            software; bugs may cause loss of funds.
          </li>
          <li>
            <strong>Oracle risk:</strong> NAV is computed from Chainlink price
            feeds. A faulty or manipulated feed can mis-price the vault.
          </li>
          <li>
            <strong>DEX / MEV risk:</strong> on-chain swaps are subject to
            slippage, sandwich attacks, and adverse fills.
          </li>
          <li>
            <strong>Stablecoin risk:</strong> USDC may depeg.
          </li>
          <li>
            <strong>Liquidity risk:</strong> withdrawals are paid from the
            vault&rsquo;s liquid USDC balance. If the manager has open
            positions, your redemption may revert until they liquidate.
          </li>
        </ul>

        <h2>7. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by applicable law, the operators of
          the Site are not liable for losses caused by bugs in third-party
          protocols, by the manager&rsquo;s trading decisions, or by network
          conditions outside our control.{' '}
          <strong>
            This limitation does not, and is not intended to, disclaim
            liability for our own fraud, willful misconduct, or gross
            negligence
          </strong>
          , and nothing in these terms attempts to waive any non-waivable
          consumer-protection rights you may have under your local law.
        </p>

        <h2>8. Eligibility &amp; jurisdiction</h2>
        <p>
          Operating a managed trading vault for the public is regulated in
          most jurisdictions. In Israel, for example, managing the funds of
          others as a business activity generally requires a portfolio-manager
          licence under the Regulation of Investment Advice, Investment
          Marketing and Investment Portfolio Management Law, 1995. The
          operators are responsible for obtaining any licences required where
          they offer the vault, and depositors are responsible for confirming
          they may lawfully participate from their own jurisdiction. If access
          to crypto assets or unregistered investment vehicles is restricted
          where you are, do not deposit.
        </p>

        <h2>9. Open-source license</h2>
        <p>
          The source code (frontend and contract) is published under the MIT
          License. You may fork, modify, and self-host. If you do, please
          remove the &ldquo;AlphaChain Capital&rdquo; branding and substitute
          your own, and do not represent the operation as ours.
        </p>

        <h2>10. Changes to these terms</h2>
        <p>
          We may update these terms from time to time. The current version is
          always served from this page; the &ldquo;Last updated&rdquo; date at
          the top reflects the latest revision.
        </p>
      </div>
    </section>
  );
}
