"use client";

import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

import {
  ACX500_TARGET,
  ARCHETYPE_COVERAGE,
  demoStats,
  inProgressBrands,
  scoredBrands,
  sortScoredByRank,
} from "@/lib/brand-catalog";
import { bandByLabel } from "@/lib/dimensions";
import type { BrandWithStatus } from "@/lib/brand-catalog";

const STATUS_STYLES = {
  scored: {
    label: "Scored",
    color: "#5ed0a8",
    bg: "rgba(94,208,168,0.12)",
  },
  in_progress: {
    label: "In capture",
    color: "#e8a84a",
    bg: "rgba(232,168,74,0.12)",
  },
  planned: {
    label: "Planned",
    color: "#8a9cbe",
    bg: "rgba(138,156,190,0.1)",
  },
} as const;

function ArchetypeStrip() {
  return (
    <div className="flex flex-wrap gap-2">
      {ARCHETYPE_COVERAGE.map((row) => {
        const style = STATUS_STYLES[row.status];
        return (
          <div
            key={row.archetype}
            className="flex min-w-[9rem] flex-col gap-0.5 rounded-lg border border-[var(--border)] bg-black/20 px-3 py-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-[var(--ink)]">
                {row.archetype}
              </span>
              <span
                className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                style={{ color: style.color, backgroundColor: style.bg }}
              >
                {style.label}
              </span>
            </div>
            <span className="text-[10px] text-[var(--ink-faint)]">{row.detail}</span>
          </div>
        );
      })}
    </div>
  );
}

function LeaderboardRow({
  rank,
  brand,
  showRank = true,
}: {
  rank: number;
  brand: BrandWithStatus;
  showRank?: boolean;
}) {
  const isScored = brand.demo_status === "scored";
  const score = brand.latest_scan?.total_score ?? null;
  const band = bandByLabel(brand.latest_scan?.band ?? null);

  const cells = (
    <>
      <td className="px-3 py-3 font-mono text-xs tabular-nums text-[var(--ink-faint)]">
        {showRank ? rank : "—"}
      </td>
      <td className="px-3 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="font-display text-sm font-semibold text-[var(--ink)]">
            {brand.name}
          </span>
          <span className="font-mono text-[10px] text-[var(--ink-faint)]">
            {brand.domain}
          </span>
        </div>
      </td>
      <td className="hidden px-3 py-3 sm:table-cell">
        <span className="chip text-[10px]">{brand.archetype}</span>
      </td>
      <td className="px-3 py-3 text-right">
        {isScored && score != null ? (
          <span
            className="font-display text-lg font-bold tabular-nums"
            style={{ color: band?.color ?? "var(--ink)" }}
          >
            {score.toFixed(1)}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs text-amber-300/90">
            <Loader2 className="h-3 w-3 animate-spin" />
            Capture in progress
          </span>
        )}
      </td>
      <td className="hidden px-3 py-3 text-right md:table-cell">
        {band ? (
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
            style={{
              color: band.color,
              backgroundColor: `${band.color}1a`,
              border: `1px solid ${band.color}44`,
            }}
          >
            {band.label}
          </span>
        ) : (
          <span className="text-[10px] uppercase tracking-wide text-[var(--ink-faint)]">
            Pending
          </span>
        )}
      </td>
      <td className="px-3 py-3 text-right">
        {isScored ? (
          <Link
            href={`/scans/${brand.slug}`}
            className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--accent)] transition hover:text-[var(--accent-hi)]"
          >
            Replay
            <ArrowRight className="h-3 w-3" />
          </Link>
        ) : (
          <span className="text-[10px] text-[var(--ink-faint)]">Queued</span>
        )}
      </td>
    </>
  );

  return (
    <tr
      className={
        isScored
          ? "border-b border-[var(--border)]/60 transition hover:bg-white/[0.03]"
          : "border-b border-[var(--border)]/40 bg-white/[0.02] opacity-90"
      }
    >
      {cells}
    </tr>
  );
}

export function Acx500Leaderboard() {
  const stats = demoStats();
  const ranked = sortScoredByRank(scoredBrands());
  const pipeline = inProgressBrands();
  const fillPct = Math.round(
    ((stats.scoredCount + stats.inProgressCount) / ACX500_TARGET) * 100,
  );

  return (
    <section id="acx500" className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-2">
          <span className="chip w-fit">ACX 500 · Year-1 preview</span>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
            Public benchmark leaderboard
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-[var(--ink-soft)]">
            {stats.scoredCount} of {ACX500_TARGET} companies scored from recorded evidence.{" "}
            {stats.inProgressCount} additional entities in active capture across new archetypes.{" "}
            Remaining slots queue for the annual ACX 500 publication.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { v: String(stats.scoredCount), l: "Scored" },
            { v: String(stats.inProgressCount), l: "In capture" },
            { v: String(stats.queuedCount), l: "Queued" },
          ].map((s) => (
            <div
              key={s.l}
              className="glass-card flex flex-col items-center gap-0.5 px-3 py-3 sm:px-4"
            >
              <span className="font-display text-2xl font-bold tabular-nums text-gradient">
                {s.v}
              </span>
              <span className="text-[9px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                {s.l}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
          Seven archetype coverage
        </p>
        <ArchetypeStrip />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-black/20">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--border)] bg-white/[0.04] text-[10px] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                <th className="px-3 py-2.5 font-semibold">Rank</th>
                <th className="px-3 py-2.5 font-semibold">Company</th>
                <th className="hidden px-3 py-2.5 font-semibold sm:table-cell">Archetype</th>
                <th className="px-3 py-2.5 text-right font-semibold">ACX</th>
                <th className="hidden px-3 py-2.5 text-right font-semibold md:table-cell">
                  Band
                </th>
                <th className="px-3 py-2.5 text-right font-semibold">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((brand, i) => (
                <LeaderboardRow key={brand.slug} rank={i + 1} brand={brand} />
              ))}
              {pipeline.map((brand) => (
                <LeaderboardRow
                  key={brand.slug}
                  rank={0}
                  brand={brand}
                  showRank={false}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[var(--border)] px-4 py-4">
          <div className="mb-2 flex items-center justify-between text-[11px] text-[var(--ink-faint)]">
            <span>
              ACX 500 universe · {stats.scoredCount + stats.inProgressCount} named in pipeline
            </span>
            <span>{fillPct}% of target index populated</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/5">
            <div className="flex h-full w-full">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-violet-500"
                style={{ width: `${(stats.scoredCount / ACX500_TARGET) * 100}%` }}
                title={`${stats.scoredCount} scored`}
              />
              <div
                className="h-full bg-amber-400/70"
                style={{ width: `${(stats.inProgressCount / ACX500_TARGET) * 100}%` }}
                title={`${stats.inProgressCount} in capture`}
              />
            </div>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-[var(--ink-faint)]">
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 align-middle" />
            Scored
            <span className="mx-2 inline-block h-2 w-2 rounded-full bg-amber-400/70 align-middle" />
            In capture · {stats.queuedCount} remaining slots reserved for annual benchmark
            expansion (no scores published until evidence is captured).
          </p>
        </div>
      </div>
    </section>
  );
}
