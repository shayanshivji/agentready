import { Suspense } from "react";
import { Activity } from "lucide-react";
import { api } from "@/lib/api";
import { STATIC_MODE } from "@/lib/static";
import { STATIC_BRANDS } from "@/data";
import { UrlForm } from "@/components/url-form";
import { BrandCard } from "@/components/brand-card";
import { SiteNav } from "@/components/site-nav";

export const dynamic = "force-dynamic";

async function BrandGrid() {
  if (STATIC_MODE) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STATIC_BRANDS.map((b) => (
          <BrandCard key={b.id} brand={b} />
        ))}
      </div>
    );
  }
  try {
    const { brands } = await api.brands.list();
    if (brands.length === 0) {
      return (
        <p className="text-[var(--ink-soft)]">
          No brands seeded yet. Run <code>python -m agentready.api.db.init</code>.
        </p>
      );
    }
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b) => (
          <BrandCard key={b.id} brand={b} />
        ))}
      </div>
    );
  } catch {
    return (
      <div className="glass-card rounded-2xl p-4 text-sm text-amber-200">
        Backend not reachable at{" "}
        <code>{process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"}</code>.
        Boot the API with{" "}
        <code>python -m uvicorn agentready.api.main:app --reload --port 8000</code>.
      </div>
    );
  }
}

export default function AppConsole() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <SiteNav variant="app" />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 py-12">
        <header className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="chip w-fit">ACX Diagnostic Console</span>
            <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
              Score a brand against the{" "}
              <span className="text-gradient">8-dimension ACX Index</span>.
            </h1>
            <p className="max-w-3xl text-[var(--ink-soft)]">
              Enter any brand URL or pick a pre-seeded benchmark below. The diagnostic
              runs a multi-agent shopping panel against the brand&apos;s real surfaces
              and renders a board-ready scorecard — outside-in, in under five minutes.
            </p>
          </div>

          <div className="holo-border scanline overflow-hidden p-5">
            <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
              Brand URL
            </label>
            <div className="mt-2.5">
              <UrlForm />
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-[var(--ink-faint)]">
              <Activity className="h-3.5 w-3.5 text-[var(--accent-3)]" />
              Streams the diagnostic live: probes → agent panel → scoring → board report.
            </p>
          </div>
        </header>

        {STATIC_MODE ? (
          <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[rgba(124,92,255,0.06)] p-6">
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-400 to-violet-500" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              How to read this demo
            </p>
            <p className="mt-2 font-display text-2xl font-semibold leading-snug text-[var(--ink)]">
              Seven leading brands, scored live. The best clears{" "}
              <span className="text-gradient">35 / 100</span>. None reaches 40.
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--ink-soft)]">
              Those low scores aren&apos;t a bug — they&apos;re the finding. Today&apos;s
              web is built for humans, not agents. Click any brand to replay its full
              diagnostic, reproduced from recorded evidence.
            </p>
          </div>
        ) : null}

        <section className="flex flex-col gap-5">
          <div className="flex items-baseline justify-between border-b border-[var(--border)] pb-3">
            <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--ink)]">
              Pre-seeded benchmark
            </h2>
            <p className="text-sm text-[var(--ink-faint)]">
              {STATIC_MODE
                ? "Seven brands · recorded ACX evidence"
                : "Six brands · manual ACX v1.2 receipts"}
            </p>
          </div>

          <Suspense
            fallback={
              <div className="h-32 animate-pulse rounded-2xl border border-[var(--border)] bg-white/5" />
            }
          >
            <BrandGrid />
          </Suspense>
        </section>

        <footer className="mt-auto border-t border-[var(--border)] pt-6 text-xs text-[var(--ink-faint)]">
          AgentReady · v0.4.0 ·{" "}
          {STATIC_MODE ? "Interactive demo (recorded evidence)" : "Live dashboard online"}
        </footer>
      </main>
    </div>
  );
}
