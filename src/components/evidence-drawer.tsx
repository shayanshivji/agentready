"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { DimensionState, JourneyState } from "@/lib/use-scan-stream";
import { DIMENSION_BY_CODE } from "@/lib/dimensions";

type Props = {
  dimensionCode: string | null;
  dimensions: DimensionState[];
  journeys: JourneyState[];
  onClose: () => void;
};

// Maps a dimension code to the agent-panel layer(s) most relevant to it.
const DIMENSION_LAYERS: Record<string, ("L1" | "L2" | "L3")[]> = {
  D1: ["L1"],
  D2: ["L1", "L2"],
  D3: ["L1"],
  D4: ["L3"],
  D5: ["L3"],
  D6: [],
  D7: ["L3"],
  D8: ["L1", "L2"],
};

export function EvidenceDrawer({ dimensionCode, dimensions, journeys, onClose }: Props) {
  const dim = dimensionCode ? dimensions.find((d) => d.code === dimensionCode) : null;
  const meta = dimensionCode ? DIMENSION_BY_CODE[dimensionCode] : null;
  const relevantLayers = (dimensionCode && DIMENSION_LAYERS[dimensionCode]) || [];
  const relevantJourneys = journeys.filter((j) => relevantLayers.includes(j.layer));

  return (
    <AnimatePresence>
      {dimensionCode && meta ? (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col overflow-y-auto border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
          >
            <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
              <div>
                <p className="font-mono text-xs font-semibold text-slate-500">
                  {meta.code} · weight {meta.weight}%
                </p>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {meta.name}
                </h2>
                <p className="mt-1 max-w-md text-xs text-slate-500">{meta.description}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex flex-col gap-6 p-6">
              {/* score summary */}
              <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                {dim ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold tabular-nums text-slate-900 dark:text-slate-100">
                      {dim.raw.toFixed(1)}
                    </span>
                    <span className="text-sm text-slate-500">
                      / {dim.max.toFixed(0)} raw · weighted {dim.weighted.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Scoring not yet emitted for this dimension.</p>
                )}
              </section>

              {/* sub-criteria */}
              {dim ? (
                <section>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Sub-criteria
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {dim.subCriteria.map((sc) => (
                      <li
                        key={sc.code}
                        className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/40"
                      >
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            <span className="font-mono text-xs text-slate-500">{sc.code}</span>{" "}
                            {sc.label}
                          </span>
                          <span className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {sc.score.toFixed(2)}
                          </span>
                        </div>
                        {sc.notes ? (
                          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                            {sc.notes}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {/* journey evidence */}
              {relevantLayers.length > 0 ? (
                <section>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Agent-panel evidence ({relevantLayers.join(", ")})
                  </h3>
                  {relevantJourneys.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900/40">
                      No journeys observed yet for this dimension&apos;s layers.
                    </p>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {relevantJourneys.map((j, i) => (
                        <li
                          key={`${j.agent}-${j.intent_id}-${j.layer}-${i}`}
                          className="rounded-lg border border-slate-200 bg-white p-3 text-xs dark:border-slate-800 dark:bg-slate-900/40"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-mono text-[11px] text-slate-500">
                              {j.agent} · {j.layer} · intent {j.intent_id}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                j.success
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-rose-100 text-rose-700"
                              }`}
                            >
                              {j.success ? "ok" : "fail"}
                            </span>
                          </div>
                          <p className="mt-1 text-[12px] text-slate-700 dark:text-slate-300">
                            {j.intent_label}
                          </p>
                          {j.canonical_url ? (
                            <p className="mt-1 truncate font-mono text-[10px] text-slate-500">
                              {j.canonical_url}
                            </p>
                          ) : null}
                          {j.dropoff_reason ? (
                            <p className="mt-1 text-[11px] text-amber-700">
                              dropoff: {j.dropoff_reason}
                            </p>
                          ) : null}
                          <p className="mt-1 line-clamp-2 text-[11px] text-slate-600 dark:text-slate-400">
                            {j.transcript_preview}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ) : null}
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
