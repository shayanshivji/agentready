import { Suspense } from "react";
import { api } from "@/lib/api";
import { STATIC_MODE } from "@/lib/static";
import { STATIC_BRANDS } from "@/data";
import { UrlForm } from "@/components/url-form";
import { BrandCard } from "@/components/brand-card";
import { HealthBadge } from "@/components/health-badge";

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
        <p className="text-slate-500">No brands seeded yet. Run <code>python -m agentready.api.db.init</code>.</p>
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
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
        Backend not reachable at <code>{process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"}</code>.
        Boot the API with <code>python -m uvicorn agentready.api.main:app --reload --port 8000</code>.
      </div>
    );
  }
}

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 py-12">
      <header className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-mono text-sm font-bold text-white">
              AR
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              AgentReady
            </span>
          </div>
          <HealthBadge />
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-100">
            The diagnostic for B2A commerce.
          </h1>
          <p className="max-w-3xl text-lg text-slate-600 dark:text-slate-400">
            AgentReady scores any brand against the 8-dimension <strong>ACX Index</strong>,
            runs a multi-agent shopping panel against the brand&apos;s real surfaces,
            and renders a board-ready scorecard — outside-in, in under five minutes.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Brand URL
          </label>
          <div className="mt-2">
            <UrlForm />
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Streams the 8-dimension ACX diagnostic live: probes → agent panel → scoring → board report.
          </p>
        </div>
      </header>

      {STATIC_MODE ? (
        <div className="flex flex-col gap-2 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900 shadow-sm dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
            How to read this demo
          </p>
          <p className="text-base font-semibold text-amber-950 dark:text-amber-50">
            Seven leading brands, scored live against the 8-dimension ACX Index.
            The best clears 35 / 100. None reaches 40.
          </p>
          <p className="text-amber-900/90 dark:text-amber-100/80">
            Those low scores aren&apos;t a bug — they&apos;re the finding. Today&apos;s
            web is built for humans, not agents. Click any brand to replay its
            full diagnostic: probe sweep → multi-agent shopping panel → 8-dimension
            scoring → board-ready scorecard, reproduced from recorded evidence.
          </p>
        </div>
      ) : null}

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Pre-seeded benchmark
          </h2>
          <p className="text-sm text-slate-500">
            {STATIC_MODE
              ? "Seven brands with recorded ACX evidence on file."
              : "Six brands with manual ACX v1.2 receipts on file."}
          </p>
        </div>

        <Suspense
          fallback={
            <div className="h-32 animate-pulse rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40" />
          }
        >
          <BrandGrid />
        </Suspense>
      </section>

      <footer className="mt-auto flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-4">
          <span>
            AgentReady · v0.4.0 · {STATIC_MODE ? "Interactive demo (recorded evidence)" : "Live dashboard online"}
          </span>
          {STATIC_MODE ? null : (
            <a
              href={`${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"}/docs`}
              className="underline hover:text-blue-600"
              target="_blank"
              rel="noreferrer"
            >
              API docs
            </a>
          )}
          <a
            href="https://github.com/anthropics/anthropic"
            className="underline hover:text-blue-600"
            target="_blank"
            rel="noreferrer"
          >
            McKinsey 2026 Innovation Olympics submission
          </a>
        </div>
      </footer>
    </main>
  );
}
