import Link from "next/link";
import type { Route } from "next";
import { FileText, LayoutDashboard, Library, Menu, ShieldCheck } from "lucide-react";

import { WepesiLogo } from "@/components/logo";

const nav: Array<{ href: Route; label: string; icon: typeof LayoutDashboard }> = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/intake", label: "Intake", icon: ShieldCheck },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/references", label: "References", icon: Library }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-20 border-b border-line bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/">
            <WepesiLogo />
          </Link>
          <Menu className="h-5 w-5 text-slate-500" />
        </div>
        <nav className="mt-3 flex gap-2 overflow-x-auto">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-md border border-line px-3 py-2 text-xs font-medium text-slate-700">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <aside className="fixed left-0 top-0 hidden h-full w-72 border-r border-line bg-white px-5 py-6 lg:block">
        <Link href="/">
          <WepesiLogo />
        </Link>
        <nav className="mt-10 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-6 left-5 right-5 rounded-lg border border-line bg-paper p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-signal">Investor demo</div>
          <p className="mt-2 text-sm leading-5 text-slate-600">Live frontend, Supabase schema, and a backend-ready analysis workflow for the Kenya to Nigeria corridor.</p>
        </div>
      </aside>
      <main className="lg:pl-72">{children}</main>
    </div>
  );
}
