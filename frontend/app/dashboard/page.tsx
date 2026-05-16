import Link from "next/link";
import { ArrowRight, Clock3, FileText, ShieldCheck, TrendingUp } from "lucide-react";

import { AppShell } from "@/components/shell";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <AppShell>
      <section className="px-6 py-8">
        <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold">Compliance dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Operational view for Wepesi MVP analyses.</p>
          </div>
          <Button asChild>
            <Link href="/intake">
              New analysis <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            { label: "Active requests", value: "1", Icon: ShieldCheck },
            { label: "Reports generated", value: "0", Icon: FileText },
            { label: "Avg. planning timeline", value: "8-16w", Icon: Clock3 },
            { label: "Priority corridor", value: "KE-NG", Icon: TrendingUp }
          ].map(({ label, value, Icon }) => (
            <div key={label} className="border border-line bg-white p-4">
              <Icon className="h-4 w-4 text-signal" />
              <div className="mt-4 text-2xl font-semibold">{value}</div>
              <div className="mt-1 text-sm text-slate-500">{label}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 border border-line bg-white">
          <div className="grid grid-cols-[1fr_1fr_1fr_auto] border-b border-line px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
            <span>Corridor</span>
            <span>Product</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          <div className="grid grid-cols-[1fr_1fr_1fr_auto] items-center px-4 py-4 text-sm">
            <span>Kenya to Nigeria</span>
            <span>Payments/remittance</span>
            <span className="text-amber">Ready for analysis</span>
            <Button asChild variant="outline">
              <Link href="/intake">Open</Link>
            </Button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
