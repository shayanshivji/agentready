import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Globe2,
  LineChart,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";

import { LandingFooter } from "@/components/landing-footer";
import { PlatformLogoStrip, PlatformMarquee } from "@/components/platform-marquee";
import { SiteNav } from "@/components/site-nav";
import { demoStats, sortScoredByRank, scoredBrands } from "@/lib/brand-catalog";
import { bandByLabel } from "@/lib/dimensions";

export const dynamic = "force-static";

const PRODUCTS = [
  {
    icon: Bot,
    title: "Agent Panel Analytics",
    subtitle: "See how AI represents your brand in every conversation.",
    body:
      "Run a multi-agent shopping panel across ChatGPT, Claude, Perplexity, and Gemini. Measure citation, recommendation, and transaction outcomes with receipted evidence.",
    href: "/app",
    cta: "Learn more",
  },
  {
    icon: ScanSearch,
    title: "Technical Foundations",
    subtitle: "Track how your site is crawled, indexed, and interpreted by AI.",
    body:
      "Outside-in probes for robots.txt, llms.txt, schema markup, AI search health, and crawlability — aligned to the firm's DOS GEO and GEO Accelerator stack.",
    href: "/app",
    cta: "Learn more",
  },
  {
    icon: LineChart,
    title: "ACX Scoring Engine",
    subtitle: "One readiness score across eight agentic commerce dimensions.",
    body:
      "Archetype-weighted scoring from product data to mandate resolution. Every sub-score traces to captured probe and panel evidence.",
    href: "/app",
    cta: "Learn more",
  },
  {
    icon: Globe2,
    title: "ACX 500 Benchmark",
    subtitle: "Understand where you stand against peers in your industry.",
    body:
      "Year-1 preview of the annual public index. Ranked leaderboard across seven commerce archetypes — scored entities only, pipeline shown as in capture.",
    href: "/app#acx500",
    cta: "View leaderboard",
  },
];

export default function LandingPage() {
  const stats = demoStats();
  const topFive = sortScoredByRank(scoredBrands()).slice(0, 5);

  return (
    <div className="marketing-page flex w-full flex-1 flex-col">
      <SiteNav variant="landing" />

      <main className="flex flex-1 flex-col">
        {/* Hero — Profound-style platform rotation */}
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-6 pb-20 pt-16 text-center sm:pt-24">
          <PlatformMarquee />

          <div className="flex max-w-3xl flex-col gap-5">
            <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--ink)] sm:text-6xl">
              When the buyer is an agent, is your brand{" "}
              <span className="text-[var(--accent)]">selectable</span> — and{" "}
              <span className="text-[var(--accent)]">transactable</span>?
            </h1>
            <p className="text-lg leading-relaxed text-[var(--ink-soft)]">
              Millions of purchases will flow through AI agents. AgentReady scores whether
              your business is ready to be discovered, trusted, and bought from — not just
              mentioned.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/app" className="btn-primary group">
              Get a demo
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link href="/app#acx500" className="btn-secondary">
              View ACX 500 preview
            </Link>
          </div>

          <p className="max-w-xl text-sm text-[var(--ink-faint)]">
            Reach commerce leaders who need a board-ready answer on agentic readiness —
            outside-in, in four weeks.
          </p>
        </section>

        {/* Platform strip */}
        <section className="border-y border-[var(--border)] bg-white/[0.02] py-10">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink-faint)]">
              Get your brand measured by
            </p>
            <PlatformLogoStrip />
          </div>
        </section>

        {/* Value prop band */}
        <section className="mx-auto w-full max-w-6xl px-6 py-20 text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
            Scale readiness, not guesswork
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--ink-soft)]">
            AgentReady is the full-stack diagnostic for the agentic commerce era.
            Understand, score, prioritize, and report — with evidence your board can fund.
          </p>
        </section>

        {/* Product grid — Profound platform modules */}
        <section id="platform" className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 pb-20">
          <div className="grid gap-5 md:grid-cols-2">
            {PRODUCTS.map((p) => {
              const Icon = p.icon;
              return (
                <article key={p.title} className="product-card group flex flex-col gap-4 p-8">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-white/[0.04] text-[var(--ink)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-xl font-semibold text-[var(--ink)]">
                      {p.title}
                    </h3>
                    <p className="text-sm font-medium text-[var(--accent)]">{p.subtitle}</p>
                    <p className="text-sm leading-relaxed text-[var(--ink-soft)]">{p.body}</p>
                  </div>
                  <Link
                    href={p.href}
                    className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-[var(--ink)] transition group-hover:gap-2"
                  >
                    {p.cta}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        {/* Mini leaderboard preview */}
        <section className="border-y border-[var(--border)] bg-white/[0.02] py-16">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-md flex-shrink-0">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                ACX 500 · Preview
              </span>
              <h2 className="mt-2 font-display text-2xl font-semibold text-[var(--ink)] sm:text-3xl">
                Where you stand in agentic commerce
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
                {stats.scoredCount} companies scored · {stats.inProgressCount} in active
                capture · {stats.queuedCount} queued for annual publication. Scores published
                only with receipted evidence.
              </p>
              <Link href="/app#acx500" className="btn-primary group mt-6 inline-flex">
                Explore full leaderboard
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-[var(--border)] bg-black/30">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[10px] uppercase tracking-wider text-[var(--ink-faint)]">
                    <th className="px-4 py-3 font-semibold">#</th>
                    <th className="px-4 py-3 font-semibold">Company</th>
                    <th className="px-4 py-3 text-right font-semibold">ACX</th>
                  </tr>
                </thead>
                <tbody>
                  {topFive.map((b, i) => {
                    const band = bandByLabel(b.latest_scan?.band ?? null);
                    return (
                      <tr
                        key={b.slug}
                        className="border-b border-[var(--border)]/50 last:border-0"
                      >
                        <td className="px-4 py-3 font-mono text-xs text-[var(--ink-faint)]">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3 font-medium text-[var(--ink)]">{b.name}</td>
                        <td
                          className="px-4 py-3 text-right font-display font-semibold tabular-nums"
                          style={{ color: band?.color }}
                        >
                          {b.latest_scan?.total_score?.toFixed(1)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Finding quote */}
        <section className="mx-auto w-full max-w-3xl px-6 py-20 text-center">
          <blockquote className="font-display text-2xl font-medium leading-snug text-[var(--ink)] sm:text-3xl">
            &ldquo;Agents can cite you. They cannot transact with you.&rdquo;
          </blockquote>
          <p className="mt-4 text-sm text-[var(--ink-soft)]">
            Headline finding from {stats.scoredCount} benchmark brands · none cleared
            Agent-Aware (40+)
          </p>
        </section>

        {/* Lead gen — Profound AEO Report box */}
        <section id="how" className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 pb-20">
          <div className="report-cta flex flex-col items-center gap-6 rounded-3xl border border-[var(--border)] bg-gradient-to-b from-white/[0.06] to-transparent px-6 py-14 text-center sm:px-12">
            <BarChart3 className="h-10 w-10 text-[var(--accent)]" />
            <h2 className="max-w-xl font-display text-2xl font-semibold text-[var(--ink)] sm:text-3xl">
              Get your free ACX readiness snapshot
            </h2>
            <p className="max-w-lg text-sm text-[var(--ink-soft)]">
              Discover how your brand performs against agents — and uncover the gaps
              blocking transaction readiness.
            </p>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[var(--ink-soft)]">
              {["ACX score", "Agent panel evidence", "Peer benchmark", "Board report"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[var(--accent-3)]" />
                    {item}
                  </li>
                ),
              )}
            </ul>
            <Link href="/app" className="btn-primary group mt-2">
              Analyze my brand
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
