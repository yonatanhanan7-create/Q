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
          Using DeFi can lead to <strong>total loss of your funds</strong>.
          Read this page before depositing anything — even on a testnet, the
          mental model matters.
        </p>

        <Block title="No fixed yields exist">
          Any platform that promises you a guaranteed APY on a crypto deposit
          is either pricing in a hidden source of income (token emissions,
          venture subsidy, paying older depositors with newer ones), or it is
          lying. Real on-chain yields move every block with utilization,
          liquidity, and macro conditions. Treat &ldquo;15% APY, locked&rdquo;
          marketing as a red flag, not a feature.
        </Block>

        <Block title="Smart-contract risk">
          The contracts you interact with — Aave V3 in this demo, but the
          principle generalizes — are complex software written by humans.
          Bugs have caused billions of dollars of losses across the DeFi
          ecosystem. An audit is a snapshot, not a guarantee. Assume any
          balance you deposit can be lost in a single tx if a critical
          vulnerability is exploited.
        </Block>

        <Block title="Oracle and de-pegging risk">
          Lending markets rely on oracles for asset prices. If an oracle is
          stale, manipulated, or wrong, depositors can lose the difference.
          Stablecoins can also lose their peg under stress; if USDC drops to
          $0.85 your USDC balance is still 1 USDC, but its purchasing power
          has fallen.
        </Block>

        <Block title="Counterparty and protocol risk">
          When you deposit into a lending pool, your funds are lent to
          borrowers. If borrowers default and liquidations cannot cover the
          debt, the shortfall comes out of depositors&rsquo; capital. This is
          rare but has happened.
        </Block>

        <Block title="Operational and key-management risk">
          The most common loss in DeFi is not a hack — it is the user signing
          a malicious transaction, falling for a fake site, leaking a seed
          phrase, or sending funds to the wrong address. None of those are
          recoverable. Verify every transaction in your wallet before
          signing.
        </Block>

        <Block title="Regulatory risk">
          The legal status of DeFi is evolving. Tokens, yields, and platforms
          that are permitted today may be restricted tomorrow in your
          jurisdiction. You are responsible for compliance, including taxes
          on any gains.
        </Block>

        <Block title="What this site does and does not do">
          This site is a non-custodial demo that lets you deposit test USDC
          into the public Aave V3 Sepolia market. It does not offer fixed
          returns, profit-sharing tiers, an admin-controlled performance
          multiplier, or any opinion about whether you should invest. It is
          intentionally boring.
        </Block>

        <p className="text-sm text-slate-400">
          If you do not fully understand the risks above, do not use the
          mainnet version of any DeFi protocol — including this one if it is
          ever deployed there.
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
