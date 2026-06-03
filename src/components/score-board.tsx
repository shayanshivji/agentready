"use client";

import { motion } from "framer-motion";

import { ScanStreamState } from "@/lib/use-scan-stream";
import { BANDS, SCORE_MAX, bandByLabel, bandFor } from "@/lib/dimensions";

type Props = {
  state: ScanStreamState;
};

export function ScoreBoard({ state }: Props) {
  const live = state.dimensions.reduce((sum, d) => sum + d.weighted, 0);
  const total = state.totalNormalized ?? live;
  const band = state.band ? bandByLabel(state.band) : bandFor(total);
  const progress = Math.min(state.dimensions.length / 8, 1);

  return (
    <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <motion.div
        layout
        className="glass-card scanline flex flex-col gap-3 overflow-hidden p-6"
      >
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink-faint)]">
            ACX Index · live
          </span>
          <span className="font-mono text-xs text-[var(--ink-faint)]">
            {state.dimensions.length} / 8 dimensions
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <motion.span
            key={total.toFixed(2)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-7xl font-bold tabular-nums leading-none"
            style={{
              color: band?.color ?? "var(--ink)",
              textShadow: band ? `0 0 36px ${band.color}66` : "0 0 36px var(--glow-cyan)",
            }}
          >
            {total.toFixed(2)}
          </motion.span>
          <span className="text-xl font-medium text-[var(--ink-faint)]">/ {SCORE_MAX}</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full border border-[var(--border)] bg-black/40">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.45 }}
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 shadow-[0_0_16px_-2px_var(--glow-cyan)]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {band ? (
            <span
              className="rounded-full px-3 py-1 font-semibold uppercase tracking-wide"
              style={{
                color: band.color,
                backgroundColor: `${band.color}1f`,
                border: `1px solid ${band.color}55`,
              }}
            >
              {band.label}
            </span>
          ) : null}
          {state.status === "completed" && state.elapsedMs ? (
            <span className="font-mono text-[var(--ink-faint)]">
              scored in {(state.elapsedMs / 1000).toFixed(2)}s
            </span>
          ) : null}
          {state.status === "running" ? (
            <span className="inline-flex items-center gap-1.5 text-[var(--accent)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-[var(--accent)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
              </span>
              live
            </span>
          ) : null}
          {state.status === "failed" ? (
            <span className="rounded-full bg-rose-500/15 px-2 py-0.5 font-medium text-rose-300">
              failed: {state.error}
            </span>
          ) : null}
        </div>
      </motion.div>

      <div className="glass-card flex flex-col gap-2 p-5">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink-faint)]">
          Benchmark bands
        </span>
        <ul className="flex flex-col gap-1">
          {BANDS.map((b) => {
            const active = band?.key === b.key;
            return (
              <li
                key={b.key}
                className={`flex items-center justify-between rounded-md px-2 py-1.5 text-xs transition ${
                  active ? "bg-white/8 font-semibold text-[var(--ink)]" : "text-[var(--ink-faint)]"
                }`}
                style={active ? { boxShadow: `inset 2px 0 0 0 ${b.color}` } : undefined}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: b.color,
                      boxShadow: active ? `0 0 10px ${b.color}` : undefined,
                    }}
                  />
                  {b.label}
                </span>
                <span className="font-mono">
                  {b.min}–{b.max}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
