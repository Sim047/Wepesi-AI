import { BookOpen, ExternalLink, Landmark, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/shell";

const references = [
  {
    country: "Kenya",
    regulator: "Central Bank of Kenya",
    title: "National Payment System obligations",
    summary: "Authorisation, governance, AML controls, customer protection, safeguarding, and settlement controls for payment service providers.",
    use: "Home-market compliance baseline"
  },
  {
    country: "Nigeria",
    regulator: "Central Bank of Nigeria",
    title: "Payment service provider licensing categories",
    summary: "Classification across PSSP, MMO, switching, super-agent, payment processing, and related payment-system approvals.",
    use: "Target-market license pathway"
  },
  {
    country: "Nigeria",
    regulator: "Central Bank of Nigeria",
    title: "Remittance and AML/CFT obligations",
    summary: "IMTO applicability, customer due diligence, sanctions screening, transaction monitoring, reporting, and escalation controls.",
    use: "Cross-border transfer review"
  },
  {
    country: "Nigeria",
    regulator: "Corporate Affairs Commission and tax authorities",
    title: "Local operating readiness",
    summary: "Entity setup, responsible persons, contracts, tax registration, local banking, and evidence required before launch.",
    use: "Implementation planning"
  }
];

export default function ReferencesPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 border-b border-line pb-6 lg:grid-cols-[1fr_0.7fr]">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-signal">
              <BookOpen className="h-4 w-4" />
              Regulatory memory
            </div>
            <h1 className="mt-2 text-3xl font-semibold text-ink">Source-aware knowledge base</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Wepesi starts with a focused Kenya-Nigeria corpus and expands into a living regulatory graph for African fintech market expansion.
            </p>
          </div>
          <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <Landmark className="h-5 w-5 text-signal" />
            <div className="mt-4 text-2xl font-semibold text-ink">4 seed domains</div>
            <p className="mt-2 text-sm leading-6 text-slate-500">Payment services, remittance, AML/CFT, customer-fund safeguarding, and market-entry operations.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {references.map((reference) => (
            <article key={reference.title} className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="rounded-md bg-mint px-3 py-1 text-xs font-semibold text-signal">{reference.country}</div>
                <ExternalLink className="h-4 w-4 text-slate-400" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-ink">{reference.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{reference.summary}</p>
              <div className="mt-5 flex items-start gap-3 rounded-md bg-slate-50 p-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
                <div>
                  <div className="text-sm font-semibold text-ink">{reference.use}</div>
                  <div className="mt-1 text-xs text-slate-500">{reference.regulator}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
