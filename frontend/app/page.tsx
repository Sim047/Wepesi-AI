import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-paper">
      <section className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-10 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-1 text-sm text-slate-700">
            <ShieldCheck className="h-4 w-4 text-signal" />
            Kenya to Nigeria fintech expansion
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-normal text-ink md:text-6xl">Wepesi</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            AI-native compliance infrastructure for African fintech teams mapping licenses, regulatory pathways,
            documents, risks, and next actions.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/intake">
                Start analysis <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">View dashboard</Link>
            </Button>
          </div>
        </div>
        <div className="border border-line bg-white p-5 shadow-soft">
          <div className="border-b border-line pb-4">
            <div className="text-sm font-semibold">MVP compliance pathway</div>
            <div className="mt-1 text-sm text-slate-500">Payments/remittance startup</div>
          </div>
          <div className="mt-5 space-y-4">
            {[
              "License category suggestion",
              "Capital and timeline guidance",
              "Submission document checklist",
              "CBK and CBN reference trail"
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-md bg-slate-50 p-3 text-sm">
                <CheckCircle2 className="h-4 w-4 text-signal" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
