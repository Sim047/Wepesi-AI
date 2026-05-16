import Link from "next/link";
import { FileText, LayoutDashboard, Library, ShieldCheck } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/intake", label: "Intake", icon: ShieldCheck },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/references", label: "References", icon: Library }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-line bg-white px-5 py-6 lg:block">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-ink text-sm font-semibold text-white">W</div>
          <div>
            <div className="text-sm font-semibold">Wepesi</div>
            <div className="text-xs text-slate-500">Compliance OS</div>
          </div>
        </Link>
        <nav className="mt-10 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-64">{children}</main>
    </div>
  );
}
