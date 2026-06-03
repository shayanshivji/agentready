import Link from "next/link";
import {
  ArrowRight,
  Bot,
  FileText,
  Gauge,
  Radar,
  ScanLine,
} from "lucide-react";

import { SiteNav } from "@/components/site-nav";

export const dynamic = "force-static";

const STEPS = [
  {
    n: "01",
    icon: ScanLine,
    title: "Probe sweep",
    body:
      "Fetches the brand's agent-facing surfaces — robots.txt, llms.txt, agents.md, /.well-known/*, products.json, sitemap, and live product pages.",
  },
  {
    n: "02",
    icon: Bot,
    title: "Agent panel",
    body:
      "Runs a multi-agent shopping panel (ChatGPT, Claude, Perplexity, Gemini…) across L1 citation, L2 recommendation, and L3 transaction journeys.",
  },
  {
    n: "03",
    icon: Gauge,
    title: "ACX scoring",
    body:
      "Scores eight archetype-weighted dimensions — from product data to mandate resolution — into a single 0–100 ACX Index with a verdict band.",
  },
  {
    n: "04",
    icon: FileText,
    title: "Board report",
    body:
      "Renders a board-ready scorecard: the verdict, the dimensional shape, and receipted agent-panel evidence for every score.",
  },
];

const STATS = [
  { value: "7", label: "Brands scored" },
  { value: "35", label: "Best score / 100" },
  { value: "0", label: "Clear 40" },
  { value: "8", label: "ACX dimensions" },
];

export default function LandingPage() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <SiteNav variant="landing" />

      <main className="flex flex-1 flex-col">
        {/* --- Hero --------------------------------------------------------- */}
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 pb-16 pt-20 text-center">
          <span className="chip">
            <Radar className="h-3.5 w-3.5 text-[var(--accent)]" />
            The diagnostic for B2A commerce
          </span>

          <h1 className="max-w-4xl font-display text-5xl font-bold leading-[1.05] tracking-tight text-[var(--ink)] sm:text-7xl">
            Is your brand{" "}
            <span className="text-gradient neon">selectable by an agent?</span>
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed text-[var(--ink-soft)]">
            The agentic web is being built right now — and the brands you know
            aren&apos;t ready to be transacted with. AgentReady scores any brand against
            the 8-dimension <strong className="font-semibold text-[var(--ink)]">ACX Index</strong>,
            runs a live multi-agent shopping panel, and renders a board-ready scorecard.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/app"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3.5 text-sm font-semibold text-[#04060f] shadow-[0_0_36px_-6px_var(--glow-cyan)] transition hover:brightness-110"
            >
              Launch the diagnostic
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-white/5 px-6 py-3.5 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              See how it works
            </a>
          </div>

          {/* Proof stat band */}
          <div className="mt-6 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="glass-card flex flex-col items-center gap-1 px-4 py-5">
                <span className="font-display text-3xl font-bold tabular-nums text-gradient">
                  {s.value}
                </span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* --- How it works ------------------------------------------------- */}
        <section
          id="how"
          className="mx-auto flex w-full max-w-6xl scroll-mt-24 flex-col gap-10 px-6 py-16"
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="chip">The pipeline</span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
              How the diagnostic works
            </h2>
            <p className="max-w-2xl text-[var(--ink-soft)]">
              Four stages, fully receipted, outside-in — no integration, no access to the
              brand&apos;s systems. Every score traces back to captured evidence.
            </p>
          </div>

          <ol className="relative grid gap-4 md:grid-cols-4">
            {/* connector line */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-0 right-0 top-[3.25rem] hidden h-px bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent md:block"
            />
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <li key={step.n} className="glass-card relative flex flex-col gap-3 p-5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border-strong)] bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-[var(--accent)] shadow-[0_0_22px_-8px_var(--glow-cyan)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-display text-2xl font-bold text-white/10">
                      {step.n}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-semibold text-[var(--ink)]">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--ink-soft)]">{step.body}</p>
                </li>
              );
            })}
          </ol>
        </section>

        {/* --- Closing CTA -------------------------------------------------- */}
        <section className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="holo-border scanline flex flex-col items-center gap-5 overflow-hidden px-6 py-14 text-center">
            <h2 className="max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl">
              Seven leading brands. The best clears{" "}
              <span className="text-gradient">35 / 100</span>. None reaches 40.
            </h2>
            <p className="max-w-xl text-[var(--ink-soft)]">
              See it for yourself — replay any brand&apos;s full diagnostic, from probe
              sweep to board-ready scorecard.
            </p>
            <Link
              href="/app"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3.5 text-sm font-semibold text-[#04060f] shadow-[0_0_36px_-6px_var(--glow-cyan)] transition hover:brightness-110"
            >
              Launch the diagnostic
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>

        <footer className="mx-auto w-full max-w-6xl border-t border-[var(--border)] px-6 py-6 text-xs text-[var(--ink-faint)]">
          <div className="flex flex-wrap items-center gap-4">
            <span>AgentReady · v0.4.0 · McKinsey 2026 Innovation Olympics</span>
            <a
              href="https://github.com/anthropics/anthropic"
              className="underline transition hover:text-[var(--accent)]"
              target="_blank"
              rel="noreferrer"
            >
              Submission
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
