"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { DimensionState, JourneyState } from "@/lib/use-scan-stream";
import { DIMENSION_BY_CODE } from "@/lib/dimensions";

type Props = {
  brandSlug: string;
  dimensionCode: string | null;
  dimensions: DimensionState[];
  journeys: JourneyState[];
  onClose: () => void;
};

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

function evidenceHref(brandSlug: string, path: string): string {
  if (path.startsWith("/evidence/")) return path;
  const name = path.split(/[/\\]/).pop() ?? path;
  return `/evidence/${brandSlug}/${name}`;
}

export function EvidenceDrawer({
  brandSlug,
  dimensionCode,
  dimensions,
  journeys,
  onClose,
}: Props) {
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
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col overflow-y-auto border-l border-[var(--border-strong)] bg-[var(--bg-2)] shadow-2xl"
          >
            <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[var(--border)] bg-[rgba(7,11,26,0.92)] px-6 py-4 backdrop-blur">
              <div>
                <p className="font-mono text-xs font-semibold text-[var(--accent)]">
                  {meta.code} · weight {meta.weight}%
                </p>
                <h2 className="font-display text-lg font-semibold text-[var(--ink)]">
                  {meta.name}
                </h2>
                <p className="mt-1 max-w-md text-xs text-[var(--ink-soft)]">{meta.description}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-[var(--ink-soft)] transition hover:bg-white/10 hover:text-[var(--ink)]"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex flex-col gap-6 p-6">
              <section className="glass-card p-4">
                {dim ? (
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-3xl font-bold tabular-nums text-[var(--ink)]">
                      {dim.raw.toFixed(1)}
                    </span>
                    <span className="text-sm text-[var(--ink-faint)]">
                      / {dim.max.toFixed(0)} raw · weighted {dim.weighted.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-[var(--ink-faint)]">
                    Scoring not yet emitted for this dimension.
                  </p>
                )}
              </section>

              {dim ? (
                <section>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                    Sub-criteria
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {dim.subCriteria.map((sc) => (
                      <li
                        key={sc.code}
                        className="glass-card border border-[var(--border)] p-3"
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-sm font-semibold text-[var(--ink)]">
                            <span className="font-mono text-xs text-[var(--accent)]">{sc.code}</span>{" "}
                            {sc.label}
                          </span>
                          <span className="font-mono text-sm font-semibold text-[var(--ink)]">
                            {sc.score.toFixed(2)}
                          </span>
                        </div>
                        {sc.notes ? (
                          <p className="mt-1 text-xs leading-relaxed text-[var(--ink-soft)]">
                            {sc.notes}
                          </p>
                        ) : null}
                        {sc.evidence && sc.evidence.length > 0 ? (
                          <ul className="mt-2 space-y-1 font-mono text-[10px] text-[var(--accent)]">
                            {sc.evidence.map((ref) => (
                              <li key={ref} className="truncate">
                                ↳ {ref}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {relevantLayers.length > 0 ? (
                <section>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                    Agent-panel evidence ({relevantLayers.join(", ")})
                  </h3>
                  {relevantJourneys.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-[var(--border)] p-4 text-xs text-[var(--ink-faint)]">
                      No journeys observed yet for this dimension&apos;s layers.
                    </p>
                  ) : (
                    <ul className="flex flex-col gap-3">
                      {relevantJourneys.map((j, i) => {
                        const imgSrc =
                          j.evidence_path ? evidenceHref(brandSlug, j.evidence_path) : null;
                        return (
                          <li
                            key={`${j.agent}-${j.intent_id}-${j.layer}-${i}`}
                            className="glass-card border border-[var(--border)] p-3 text-xs"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="font-mono text-[11px] text-[var(--ink-faint)]">
                                {j.agent} · {j.layer} · intent {j.intent_id}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                  j.success
                                    ? "bg-emerald-500/15 text-emerald-300"
                                    : "bg-rose-500/15 text-rose-300"
                                }`}
                              >
                                {j.success ? "ok" : "fail"}
                              </span>
                            </div>
                            <p className="mt-1 text-[12px] text-[var(--ink)]">{j.intent_label}</p>
                            {imgSrc ? (
                              <div className="mt-2 overflow-hidden rounded-lg border border-[var(--border)]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={imgSrc}
                                  alt={`${j.agent} ${j.layer} evidence`}
                                  className="max-h-48 w-full object-cover object-top"
                                />
                                <p className="truncate px-2 py-1 font-mono text-[10px] text-[var(--ink-faint)]">
                                  {imgSrc}
                                </p>
                              </div>
                            ) : null}
                            {j.dropoff_reason ? (
                              <p className="mt-1 text-[11px] text-amber-300">
                                dropoff: {j.dropoff_reason}
                              </p>
                            ) : null}
                            <p className="mt-1 line-clamp-3 text-[11px] text-[var(--ink-soft)]">
                              {j.transcript_preview}
                            </p>
                          </li>
                        );
                      })}
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
