"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { AppShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import type { ComplianceResponse } from "@/lib/api";

export default function ReportsPage() {
  const [data, setData] = useState<ComplianceResponse | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("wepesi:lastReport");
    if (raw) setData(JSON.parse(raw));
  }, []);

  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-center justify-between border-b border-line pb-6">
          <div>
            <h1 className="text-2xl font-semibold">AI compliance report</h1>
            <p className="mt-1 text-sm text-slate-500">Structured Wepesi output for the MVP corridor.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/intake">Run intake</Link>
          </Button>
        </div>
        {!data ? (
          <div className="mt-6 border border-line bg-white p-6 text-sm text-slate-600">
            No report in this browser session yet.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
            <article className="space-y-4">
              <Panel title="Executive summary">{data.report.executive_summary}</Panel>
              <Panel title="License category">{data.report.license_category}</Panel>
              <Panel title="Reasoning">{data.report.license_reasoning}</Panel>
              <Panel title="Capital requirements">{data.report.capital_requirements}</Panel>
              <Panel title="Estimated timeline">{data.report.estimated_timeline}</Panel>
            </article>
            <aside className="space-y-4">
              <ListPanel title="Required documents" items={data.report.required_documents} />
              <ListPanel title="Compliance steps" items={data.report.compliance_steps} />
              <ListPanel title="Risks" items={data.report.risks} />
              <ListPanel title="Next actions" items={data.report.next_actions} />
              <div className="border border-line bg-white p-4">
                <h2 className="text-sm font-semibold">Regulatory references</h2>
                <div className="mt-3 space-y-3">
                  {data.report.regulatory_references.map((reference) => (
                    <div key={`${reference.regulator}-${reference.title}`} className="text-sm">
                      <div className="font-medium">{reference.title}</div>
                      <div className="text-slate-500">{reference.regulator}</div>
                      <div className="text-xs text-slate-500">{reference.citation}</div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </section>
    </AppShell>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-line bg-white p-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{children}</p>
    </section>
  );
}

function ListPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="border border-line bg-white p-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
