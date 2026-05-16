import { AppShell } from "@/components/shell";

const references = [
  {
    country: "Kenya",
    regulator: "Central Bank of Kenya",
    title: "National Payment System regulatory obligations",
    summary: "Authorisation, governance, AML controls, customer protection, and settlement safeguards."
  },
  {
    country: "Nigeria",
    regulator: "Central Bank of Nigeria",
    title: "Payment service provider licensing categories",
    summary: "PSSP, MMO, switching, super-agent, and related payment system approval analysis."
  },
  {
    country: "Nigeria",
    regulator: "Central Bank of Nigeria",
    title: "Remittance and AML/CFT obligations",
    summary: "IMTO applicability, CDD, transaction monitoring, reporting, and sanctions controls."
  }
];

export default function ReferencesPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="border-b border-line pb-6">
          <h1 className="text-2xl font-semibold">Regulatory references</h1>
          <p className="mt-1 text-sm text-slate-500">Initial seed knowledge base for the Wepesi MVP.</p>
        </div>
        <div className="mt-6 space-y-4">
          {references.map((reference) => (
            <article key={reference.title} className="border border-line bg-white p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{reference.country}</div>
              <h2 className="mt-2 text-base font-semibold">{reference.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{reference.summary}</p>
              <p className="mt-3 text-xs text-slate-500">{reference.regulator}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
