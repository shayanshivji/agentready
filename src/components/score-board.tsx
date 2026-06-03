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
        className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/40"
      >
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            ACX Index · live
          </span>
          <span className="text-xs text-slate-500">
            {state.dimensions.length} / 8 dimensions
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <motion.span
            key={total.toFixed(2)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold tabular-nums text-slate-900 dark:text-slate-100"
          >
            {total.toFixed(2)}
          </motion.span>
          <span className="text-xl font-medium text-slate-400">/ {SCORE_MAX}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.45 }}
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {band ? (
            <span
              className="rounded-full px-3 py-1 font-semibold text-white"
              style={{ backgroundColor: band.color }}
            >
              {band.label}
            </span>
          ) : null}
          {state.status === "completed" && state.elapsedMs ? (
            <span className="text-slate-500">
              scored in {(state.elapsedMs / 1000).toFixed(2)}s
            </span>
          ) : null}
          {state.status === "running" ? (
            <span className="inline-flex items-center gap-1.5 text-blue-600">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-blue-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
              live
            </span>
          ) : null}
          {state.status === "failed" ? (
            <span className="rounded-full bg-rose-100 px-2 py-0.5 font-medium text-rose-700">
              failed: {state.error}
            </span>
          ) : null}
        </div>
      </motion.div>

      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Benchmark bands
        </span>
        <ul className="flex flex-col gap-1.5">
          {BANDS.map((b) => {
            const active = band?.key === b.key;
            return (
              <li
                key={b.key}
                className={`flex items-center justify-between rounded-md px-2 py-1.5 text-xs ${
                  active ? "bg-slate-100 font-semibold dark:bg-slate-800" : "text-slate-500"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: b.color }}
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
