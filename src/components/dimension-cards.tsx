"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { DimensionState } from "@/lib/use-scan-stream";
import { DIMENSION_BY_CODE, DIMENSIONS } from "@/lib/dimensions";

type Props = {
  dimensions: DimensionState[];
  onSelect: (code: string) => void;
  selected?: string | null;
};

function colorForPct(pct: number): string {
  if (pct >= 75) return "bg-emerald-500";
  if (pct >= 55) return "bg-blue-500";
  if (pct >= 35) return "bg-amber-500";
  if (pct > 0) return "bg-orange-500";
  return "bg-slate-300 dark:bg-slate-700";
}

export function DimensionCards({ dimensions, onSelect, selected }: Props) {
  const byCode = new Map(dimensions.map((d) => [d.code, d]));

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {DIMENSIONS.map((meta) => {
        const dim = byCode.get(meta.code);
        const has = !!dim;
        const pct = dim ? Math.round((dim.raw / dim.max) * 100) : 0;
        const isSelected = selected === meta.code;
        return (
          <motion.button
            key={meta.code}
            type="button"
            layout
            onClick={() => onSelect(meta.code)}
            initial={{ opacity: 0.4, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`group flex flex-col gap-2 rounded-xl border bg-white p-4 text-left shadow-sm transition-all hover:border-blue-400 hover:shadow-md dark:bg-slate-900/40 ${
              isSelected
                ? "border-blue-500 ring-2 ring-blue-500/20"
                : "border-slate-200 dark:border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold text-slate-500">
                {meta.code} · weight {meta.weight}%
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {meta.name}
            </h3>
            <div className="flex items-baseline justify-between">
              <AnimatePresence mode="wait">
                {has ? (
                  <motion.span
                    key="score"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100"
                  >
                    {dim!.raw.toFixed(1)}
                    <span className="ml-1 text-sm font-normal text-slate-500">
                      / {dim!.max.toFixed(0)}
                    </span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="pending"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-medium text-slate-400"
                  >
                    awaiting…
                  </motion.span>
                )}
              </AnimatePresence>
              {has ? (
                <span className="text-[11px] font-medium text-slate-500">
                  weighted {dim!.weighted.toFixed(2)}
                </span>
              ) : null}
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`h-full ${colorForPct(pct)}`}
              />
            </div>
            <p className="text-[11px] leading-snug text-slate-500">
              {meta.description}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}

export { DIMENSION_BY_CODE };
