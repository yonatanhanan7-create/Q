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
        Last updated: 2026-05-07
      </p>

      <div className="prose prose-invert mt-10 max-w-none text-slate-300 [&>h2]:font-display [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:text-white [&>h2]:mt-10 [&>p]:mt-3 [&>ul]:mt-3 [&>ul]:list-disc [&>ul]:pl-6 [&>li]:mt-1">
        <h2>1. Nature of this site</h2>
        <p>
          AlphaChain Capital (&ldquo;the Site&rdquo;) is an open-source
          demonstration of a non-custodial DeFi front-end. It is provided
          free of charge, on an &ldquo;as-is&rdquo; basis, for educational
          and portfolio purposes. It is not a product, a fund, an investment
          advisor, a broker-dealer, or a regulated financial institution.
        </p>

        <h2>2. No advice, no solicitation</h2>
        <p>
          Nothing on the Site constitutes investment, legal, tax, or
          accounting advice, nor an offer or solicitation to buy or sell any
          security or financial instrument. Information about yields, APYs,
          and protocol metrics is provided for context only and is read live
          from public smart contracts that we do not control.
        </p>

        <h2>3. Non-custodial &amp; self-directed</h2>
        <p>
          The Site does not take custody of your funds. All transactions are
          initiated by you and signed by your own wallet. We never hold,
          manage, or move user assets, and we have no ability to recover
          assets sent to incorrect addresses, lost private keys, or contracts
          that fail.
        </p>

        <h2>4. Honest representations</h2>
        <p>We commit to the following:</p>
        <ul>
          <li>
            We will <strong>not</strong> promise fixed yields, guaranteed
            returns, or principal protection.
          </li>
          <li>
            We will <strong>not</strong> hide an admin-controlled
            &ldquo;performance multiplier&rdquo;, secret strategy, or
            off-chain ledger that we can edit.
          </li>
          <li>
            All metrics displayed (TVL, APY, balances) are read directly from
            public smart contracts on the chain you are connected to. The
            contract addresses are listed on the dashboard and verifiable on
            Etherscan.
          </li>
        </ul>

        <h2>5. Risks you accept</h2>
        <p>
          Using DeFi protocols involves real and material risks, including
          but not limited to: smart-contract bugs, oracle failures, stablecoin
          depegs, governance attacks, key compromise, phishing, and total
          loss of capital. By using the Site you confirm you understand these
          risks and have the technical literacy to evaluate them yourself.
        </p>

        <h2>6. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by applicable law, the operators of
          the Site are not liable for losses caused by bugs in third-party
          protocols, by your own actions, or by network conditions outside
          our control.{' '}
          <strong>
            This limitation does not, and is not intended to, disclaim
            liability for our own fraud, willful misconduct, or gross
            negligence
          </strong>
          , and nothing in these terms attempts to waive any non-waivable
          consumer-protection rights you may have under your local law.
        </p>

        <h2>7. Eligibility &amp; jurisdiction</h2>
        <p>
          You are responsible for determining whether your use of DeFi
          protocols, including any production deployment of this codebase, is
          lawful in your jurisdiction. If your jurisdiction restricts access
          to crypto assets or unregistered securities, do not use the Site.
        </p>

        <h2>8. Open-source license</h2>
        <p>
          The source code is published under the MIT License. You may fork,
          modify, and self-host it. If you do, please remove the
          &ldquo;AlphaChain Capital&rdquo; branding and substitute your own,
          and do not represent that this project is operated by us.
        </p>

        <h2>9. Changes to these terms</h2>
        <p>
          We may update these terms from time to time. The current version is
          always served from this page; the &ldquo;Last updated&rdquo; date
          at the top reflects the latest revision.
        </p>
      </div>
    </section>
  );
}
