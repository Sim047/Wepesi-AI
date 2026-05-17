"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { analyzeCompliance, defaultIntake, type IntakePayload } from "@/lib/api";

const featureOptions = ["payments", "remittance", "wallets", "customer funds", "agent network", "merchant acquiring"];

export default function IntakePage() {
  const router = useRouter();
  const [form, setForm] = useState<IntakePayload>(defaultIntake);
  const [loading, setLoading] = useState(false);

  function update(key: keyof IntakePayload, value: string | boolean | string[]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleFeature(feature: string) {
    const next = form.feature_flags.includes(feature)
      ? form.feature_flags.filter((item) => item !== feature)
      : [...form.feature_flags, feature];
    update("feature_flags", next);
  }

  async function runAnalysis() {
    setLoading(true);
    const result = await analyzeCompliance(form);
    sessionStorage.setItem("wepesi:lastReport", JSON.stringify(result));
    router.push("/reports");
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 border-b border-line pb-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-signal">
              <SlidersHorizontal className="h-4 w-4" />
              Regulatory intake
            </div>
            <h1 className="mt-2 text-3xl font-semibold text-ink">Build a launch-ready compliance profile</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Edit the operating assumptions, then generate a board-ready report with licensing, documentation, timeline, risk, and reference intelligence.
            </p>
          </div>
          <div className="rounded-lg border border-line bg-white p-4 text-sm leading-6 text-slate-600 shadow-sm">
            <div className="font-semibold text-ink">Active corridor</div>
            Kenya-incorporated fintech entering Nigeria with payments, remittance, wallet, and customer-funds exposure.
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Home country" value={form.home_country} onChange={(value) => update("home_country", value)} />
          <Field label="Target country" value={form.target_country} onChange={(value) => update("target_country", value)} />
          <Field label="Business type" value={form.business_type} onChange={(value) => update("business_type", value)} />
          <Field label="Product category" value={form.product_category} onChange={(value) => update("product_category", value)} />
          <label className="block rounded-lg border border-line bg-white p-4 shadow-sm md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Transaction model</span>
            <textarea
              className="mt-3 min-h-24 w-full rounded-md border border-line bg-slate-50 px-3 py-3 text-sm leading-6 outline-none focus:border-signal"
              value={form.transaction_model}
              onChange={(event) => update("transaction_model", event.target.value)}
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.7fr]">
          <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Regulated features</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {featureOptions.map((feature) => {
                const active = form.feature_flags.includes(feature);
                return (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => toggleFeature(feature)}
                    className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                      active ? "border-signal bg-mint text-signal" : "border-line bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {feature}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Risk triggers</div>
            <div className="mt-4 space-y-3">
              <Toggle label="Holds customer funds" checked={form.holds_customer_funds} onChange={(value) => update("holds_customer_funds", value)} />
              <Toggle label="Cross-border transfers" checked={form.cross_border_transfers} onChange={(value) => update("cross_border_transfers", value)} />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-lg border border-line bg-ink p-5 text-white shadow-soft md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="h-4 w-4 text-amber-300" />
              Generate investor-ready compliance output
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-200">License pathway, evidence checklist, capital questions, timeline, risks, and next actions.</p>
          </div>
          <Button onClick={runAnalysis} disabled={loading} className="bg-white text-ink hover:bg-slate-100">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            Generate report
          </Button>
        </div>
      </section>
    </AppShell>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block rounded-lg border border-line bg-white p-4 shadow-sm">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input className="mt-3 h-11 w-full rounded-md border border-line bg-slate-50 px-3 text-sm outline-none focus:border-signal" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-md bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700">
      {label}
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-signal" />
    </label>
  );
}
