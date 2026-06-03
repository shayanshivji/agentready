import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { HealthBadge } from "@/components/health-badge";

export function SiteNav({ variant = "app" }: { variant?: "app" | "landing" }) {
  return (
    <nav className="sticky top-0 z-30 border-b border-[var(--border)] bg-[rgba(5,8,19,0.6)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 font-display text-sm font-bold text-[#04060f] shadow-[0_0_22px_-2px_var(--glow-cyan)]">
            AR
          </span>
          <div className="flex flex-col leading-none">
            <span className="font-display text-sm font-semibold tracking-[0.18em] text-[var(--ink)]">
              AGENTREADY
            </span>
            <span className="text-[10px] uppercase tracking-[0.28em] text-[var(--ink-faint)]">
              ACX Diagnostic
            </span>
          </div>
        </Link>

        {variant === "landing" ? (
          <Link
            href="/app"
            className="group inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-strong)] bg-gradient-to-r from-cyan-500/15 to-violet-500/15 px-3.5 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--ink)] transition hover:shadow-[0_0_24px_-6px_var(--glow-cyan)]"
          >
            Launch diagnostic
            <ArrowRight className="h-3.5 w-3.5 text-[var(--accent)] transition group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <HealthBadge />
        )}
      </div>
    </nav>
  );
}
