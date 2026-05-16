"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { analyzeCompliance } from "@/lib/api";

export default function IntakePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeCompliance();
      sessionStorage.setItem("wepesi:lastReport", JSON.stringify(result));
      router.push("/reports");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="border-b border-line pb-6">
          <h1 className="text-2xl font-semibold">Regulatory intake</h1>
          <p className="mt-1 text-sm text-slate-500">Wepesi MVP is preconfigured for the Kenya to Nigeria payments corridor.</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            ["Home country", "Kenya"],
            ["Target country", "Nigeria"],
            ["Business type", "Fintech startup"],
            ["Transaction model", "Cross-border payments and remittance"],
            ["Product category", "Payments/remittance"],
            ["Features", "Payments, remittance, wallets, customer funds"]
          ].map(([label, value]) => (
            <label key={label} className="block border border-line bg-white p-4">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
              <input
                className="mt-3 h-10 w-full border border-line bg-slate-50 px-3 text-sm outline-none"
                value={value}
                readOnly
              />
            </label>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between gap-4 border border-line bg-white p-4">
          <div>
            <div className="text-sm font-semibold">Generate AI compliance report</div>
            <div className="mt-1 text-sm text-slate-500">Structured JSON output with license pathway, checklist, risks, and references.</div>
          </div>
          <Button onClick={runAnalysis} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            Analyze
          </Button>
        </div>
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </section>
    </AppShell>
  );
}
