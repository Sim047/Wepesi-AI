"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Download, FileText } from "lucide-react";

import { AppShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import type { ComplianceResponse } from "@/lib/api";
import { demoReport } from "@/lib/demo-report";

export default function ReportsPage() {
  const [data, setData] = useState<ComplianceResponse>(demoReport);

  useEffect(() => {
    const raw = sessionStorage.getItem("wepesi:lastReport");
    if (raw) setData(JSON.parse(raw));
  }, []);

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-signal">
              <FileText className="h-4 w-4" />
              Compliance report
            </div>
            <h1 className="mt-2 text-3xl font-semibold text-ink">Nigeria launch pathway for a Kenya fintech</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Structured output for management, counsel, and investors. Source: {data.source === "api" ? "live backend" : "demo fallback"}.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/intake">Revise intake</Link>
            </Button>
            <Button variant="signal" onClick={() => window.print()}>
              <Download className="h-4 w-4" />
              Board pack
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_0.78fr]">
          <article className="space-y-5">
            <Panel title="Executive summary" accent>
              {data.report.executive_summary}
            </Panel>
            <div className="grid gap-5 md:grid-cols-2">
              <Panel title="Recommended pathway">{data.report.license_category}</Panel>
              <Panel title="Estimated timeline">{data.report.estimated_timeline}</Panel>
            </div>
            <Panel title="Why this pathway matters">{data.report.license_reasoning}</Panel>
            <Panel title="Capital and budget questions">{data.report.capital_requirements}</Panel>
            <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Execution plan</h2>
              <div className="mt-4 space-y-3">
                {data.report.compliance_steps.map((item, index) => (
                  <div key={item} className="flex gap-3 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-mint text-xs font-semibold text-signal">{index + 1}</span>
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </article>

          <aside className="space-y-5">
            <ListPanel title="Document room sprint" items={data.report.required_documents} icon="check" />
            <ListPanel title="Launch risks" items={data.report.risks} icon="risk" />
            <ListPanel title="Next investor-facing actions" items={data.report.next_actions} icon="arrow" />
            <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Regulatory reference trail</h2>
              <div className="mt-4 space-y-4">
                {data.report.regulatory_references.map((reference) => (
                  <div key={`${reference.regulator}-${reference.title}`} className="rounded-md bg-slate-50 p-3 text-sm">
                    <div className="font-semibold text-ink">{reference.title}</div>
                    <div className="mt-1 text-slate-500">{reference.regulator}</div>
                    <div className="mt-2 text-xs leading-5 text-slate-500">{reference.citation}</div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}

function Panel({ title, children, accent = false }: { title: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <section className={`rounded-lg border p-5 shadow-sm ${accent ? "border-signal bg-mint" : "border-line bg-white"}`}>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-700">{children}</p>
    </section>
  );
}

function ListPanel({ title, items, icon }: { title: string; items: string[]; icon: "check" | "risk" | "arrow" }) {
  const Icon = icon === "risk" ? AlertTriangle : icon === "arrow" ? ArrowRight : CheckCircle2;
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <Icon className={`mt-1 h-4 w-4 shrink-0 ${icon === "risk" ? "text-amber" : "text-signal"}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
