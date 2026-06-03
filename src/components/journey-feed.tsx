"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ShieldAlert, ShoppingCart, Sparkles } from "lucide-react";

import { JourneyState } from "@/lib/use-scan-stream";

type Props = {
  journeys: JourneyState[];
  filterLayer?: "L1" | "L2" | "L3" | "ALL";
  onSelect?: (j: JourneyState) => void;
};

const LAYER_LABEL: Record<string, string> = {
  L1: "L1 · Citation",
  L2: "L2 · Recommendation",
  L3: "L3 · Action",
};

const LAYER_ICON = {
  L1: Sparkles,
  L2: ArrowRight,
  L3: ShoppingCart,
};

const SENTIMENT_STYLES: Record<string, string> = {
  positive: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  neutral: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  negative: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
};

export function JourneyFeed({ journeys, filterLayer = "ALL", onSelect }: Props) {
  const filtered = filterLayer === "ALL" ? journeys : journeys.filter((j) => j.layer === filterLayer);

  if (filtered.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40">
        No journeys yet. Watching for agent-panel events…
      </p>
    );
  }

  return (
    <ul className="grid gap-3 lg:grid-cols-2">
      <AnimatePresence initial={false}>
        {filtered.map((j, i) => {
          const Icon = LAYER_ICON[j.layer];
          return (
            <motion.li
              key={`${j.agent}-${j.intent_id}-${j.layer}-${i}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => onSelect?.(j)}
              className={`flex flex-col gap-2 rounded-xl border bg-white p-4 shadow-sm dark:bg-slate-900/40 ${
                onSelect ? "cursor-pointer hover:border-blue-400" : ""
              } border-slate-200 dark:border-slate-800`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {LAYER_LABEL[j.layer]}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-slate-500">{j.agent}</span>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Intent {j.intent_id}: {j.intent_label}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span
                  className={`rounded-full px-2 py-0.5 font-medium ${
                    j.success
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200"
                  }`}
                >
                  {j.success ? "succeeded" : "failed"}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 font-medium ${
                    j.cited
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200"
                      : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  }`}
                >
                  {j.cited ? "brand cited" : "uncited"}
                </span>
                <span className={`rounded-full px-2 py-0.5 font-medium ${SENTIMENT_STYLES[j.sentiment] ?? ""}`}>
                  {j.sentiment}
                </span>
                {j.dropoff_reason ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                    <ShieldAlert className="h-3 w-3" /> {j.dropoff_reason}
                  </span>
                ) : null}
              </div>
              {j.canonical_url ? (
                <p className="truncate font-mono text-[11px] text-slate-500">{j.canonical_url}</p>
              ) : null}
              <p className="line-clamp-2 text-xs text-slate-600 dark:text-slate-400">
                {j.transcript_preview}
              </p>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
