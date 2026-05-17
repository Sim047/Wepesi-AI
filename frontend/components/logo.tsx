import { cn } from "@/lib/utils";

export function WepesiLogo({ className, showWordmark = true }: { className?: string; showWordmark?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-white shadow-soft">
        <div className="absolute inset-1 rounded-md border border-white/15" />
        <svg viewBox="0 0 40 40" className="relative h-8 w-8" aria-hidden="true">
          <path d="M9 12h8l3 11 4-15 3 10h4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11 29h18" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      {showWordmark ? (
        <div>
          <div className="text-base font-semibold leading-5 text-ink">Wepesi</div>
          <div className="text-xs font-medium text-slate-500">Compliance command center</div>
        </div>
      ) : null}
    </div>
  );
}
