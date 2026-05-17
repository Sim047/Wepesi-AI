import Link from "next/link";
import { ArrowRight, CircleDollarSign, Clock3, FileText, ShieldCheck, TrendingUp } from "lucide-react";

import { AppShell } from "@/components/shell";
import { Button } from "@/components/ui/button";

const metrics = [
  { label: "Active corridor", value: "Kenya -> Nigeria", Icon: TrendingUp },
  { label: "Readiness window", value: "10-18 weeks", Icon: Clock3 },
  { label: "Evidence workstreams", value: "6", Icon: FileText },
  { label: "Capital review", value: "Required", Icon: CircleDollarSign }
];

const workstreams = [
  ["Operating model", "Map wallet, payment initiation, settlement, and remittance roles.", "Complete"],
  ["License pathway", "Confirm CBN payment-service category and IMTO exposure.", "Review"],
  ["AML/CFT controls", "Prepare sanctions, CDD, monitoring, and escalation evidence.", "In progress"],
  ["Safeguarding", "Document funds-flow, reconciliation, and customer protection model.", "In progress"],
  ["Partner diligence", "Validate bank, processor, and local operating dependencies.", "Next"]
];

export default function DashboardPage() {
  return (
    <AppShell>
      <section className="px-6 py-8">
        <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 md:flex-row md:items-center">
          <div>
            <div className="text-sm font-semibold uppercase tracking-wide text-signal">Command center</div>
            <h1 className="mt-2 text-3xl font-semibold text-ink">Expansion readiness cockpit</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Operating snapshot for product intake, regulatory classification, launch blockers, and execution planning.
            </p>
          </div>
          <Button asChild variant="signal">
            <Link href="/intake">
              New analysis <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map(({ label, value, Icon }) => (
            <div key={label} className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <Icon className="h-5 w-5 text-signal" />
              <div className="mt-5 text-2xl font-semibold text-ink">{value}</div>
              <div className="mt-1 text-sm text-slate-500">{label}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.7fr]">
          <div className="rounded-lg border border-line bg-white shadow-sm">
            <div className="border-b border-line px-5 py-4">
              <h2 className="font-semibold text-ink">Launch workstreams</h2>
            </div>
            <div className="divide-y divide-line">
              {workstreams.map(([title, detail, status]) => (
                <div key={title} className="grid gap-3 px-5 py-4 text-sm md:grid-cols-[0.55fr_1fr_auto] md:items-center">
                  <div className="font-semibold text-ink">{title}</div>
                  <div className="leading-6 text-slate-600">{detail}</div>
                  <div className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{status}</div>
                </div>
              ))}
            </div>
          </div>
          <aside className="rounded-lg border border-line bg-ink p-5 text-white shadow-soft">
            <ShieldCheck className="h-6 w-6 text-amber-300" />
            <h2 className="mt-5 text-xl font-semibold">What investors can see</h2>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              Wepesi is not a static checklist. It is a repeatable compliance workflow that can expand from one corridor to many, with source-linked regulatory memory and structured outputs for operations, counsel, and management.
            </p>
            <Button asChild className="mt-5 bg-white text-ink hover:bg-slate-100">
              <Link href="/reports">View sample report</Link>
            </Button>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}
