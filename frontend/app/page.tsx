import Link from "next/link";
import { ArrowRight, Banknote, CheckCircle2, Globe2, Landmark, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

import { WepesiLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const proof = [
  { label: "Corridor readiness", value: "10-18w", icon: TrendingUp },
  { label: "Regulator maps", value: "CBK + CBN", icon: Landmark },
  { label: "Document pack", value: "6 workstreams", icon: ShieldCheck },
  { label: "Launch risk", value: "High signal", icon: Sparkles }
];

const workflow = [
  "Capture product model, corridor, funds flow, and regulated features.",
  "Map activity against payment, wallet, remittance, AML/CFT, and safeguarding obligations.",
  "Generate an investor-ready action plan with documents, risks, assumptions, and next steps."
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-paper">
      <section className="mx-auto grid min-h-[92vh] max-w-7xl grid-cols-1 gap-10 px-6 py-8 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
        <div>
          <WepesiLogo />
          <div className="mt-10 inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm">
            <Globe2 className="h-4 w-4 text-signal" />
            Kenya to Nigeria market-entry intelligence
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-tight tracking-normal text-ink md:text-7xl">
            Launch regulated fintech products across Africa with fewer blind spots.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Wepesi turns fragmented licensing rules, capital questions, documents, timelines, and launch risks into a board-ready compliance pathway for African fintech expansion teams.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="signal">
              <Link href="/intake">
                Start compliance analysis <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">Open command center</Link>
            </Button>
          </div>
          <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            {workflow.map((item, index) => (
              <div key={item} className="rounded-lg border border-line bg-white/80 p-4 text-sm leading-6 text-slate-600 shadow-sm">
                <span className="mb-3 flex h-7 w-7 items-center justify-center rounded-md bg-mint text-xs font-semibold text-signal">{index + 1}</span>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="rounded-xl border border-line bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-4 border-b border-line pb-5">
              <div>
                <div className="text-sm font-semibold text-ink">Wepesi readiness report</div>
                <div className="mt-1 text-sm text-slate-500">Payments and remittance expansion</div>
              </div>
              <div className="rounded-md bg-mint px-3 py-1 text-xs font-semibold text-signal">Ready</div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {proof.map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-lg border border-line bg-slate-50 p-4">
                  <Icon className="h-4 w-4 text-signal" />
                  <div className="mt-4 text-2xl font-semibold text-ink">{value}</div>
                  <div className="mt-1 text-sm text-slate-500">{label}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-lg bg-ink p-5 text-white">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Banknote className="h-4 w-4 text-amber-300" />
                Investor narrative
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-200">
                Wepesi provides a repeatable workflow for corridor expansion: collect product facts, classify licensing exposure, generate an evidence checklist, and preserve a regulator reference trail.
              </p>
            </div>
            <div className="mt-5 space-y-3">
              {["License classification", "AML/CFT readiness", "Document room sprint", "Partner and funds-flow review"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-md bg-white text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-signal" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
