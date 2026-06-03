"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Download, Info, RefreshCcw } from "lucide-react";

import { API_BASE_URL } from "@/lib/api";
import { staticReportHref } from "@/lib/static";
import { useScanStream } from "@/lib/use-scan-stream";
import { useStaticScanStream } from "@/lib/use-static-scan-stream";
import { AcxRadar } from "@/components/acx-radar";
import { DimensionCards } from "@/components/dimension-cards";
import { EvidenceDrawer } from "@/components/evidence-drawer";
import { JourneyFeed } from "@/components/journey-feed";
import { JourneyReplayPlayer } from "@/components/journey-replay-player";
import { PipelineTimeline } from "@/components/pipeline-timeline";
import { ScoreBoard } from "@/components/score-board";

type Props = {
  scanId: string;
  brandName: string;
  brandSlug: string;
  url: string;
  startedAt: string;
  mode: string;
  staticMode?: boolean;
};

export function LiveScanView({
  scanId,
  brandName,
  brandSlug,
  url,
  startedAt,
  mode,
  staticMode = false,
}: Props) {
  // Both hooks are always called (Rules of Hooks); the inactive one is fed
  // `null` and returns `null`, so exactly one stream drives the view.
  const liveState = useScanStream(staticMode ? null : scanId);
  const replayState = useStaticScanStream(staticMode ? brandSlug : null);
  const state = staticMode ? replayState : liveState;
  const [selectedDim, setSelectedDim] = useState<string | null>(null);
  const [layerFilter, setLayerFilter] = useState<"ALL" | "L1" | "L2" | "L3">("ALL");
  const [journeyView, setJourneyView] = useState<"replay" | "feed">("replay");

  if (!state) {
    return (
      <div className="glass-card p-8 text-center text-sm text-[var(--ink-soft)]">
        Connecting to scan stream…
      </div>
    );
  }

  const pdfHref = staticMode
    ? staticReportHref(brandSlug)
    : `${API_BASE_URL}/api/scans/${scanId}/report.pdf`;

  // A "thin result" is a completed scan with no agent-panel journeys — i.e. a
  // brand that isn't part of the curated demo dataset. Rather than letting the
  // page look broken (flat radar, empty replay), we surface an honest banner
  // that reframes the outcome: a near-zero score here is a *real* agent-blind
  // finding, not a tool failure.
  const isThinResult = state.status === "completed" && state.journeys.length === 0;
  const isLiveMode = mode === "live" || mode === "hybrid";

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-3">
        <Link href="/" className="inline-flex w-fit items-center gap-1 text-xs text-[var(--ink-faint)] transition hover:text-[var(--accent)]">
          <ArrowLeft className="h-3.5 w-3.5" /> All brands
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="chip w-fit">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              </span>
              ACX scan · {brandSlug}
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--ink)]">
              {brandName}
            </h1>
            <p className="font-mono text-xs text-[var(--ink-soft)]">{url}</p>
            <p className="font-mono text-xs text-[var(--ink-faint)]">
              started {new Date(startedAt).toLocaleString()} · mode {mode}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={pdfHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-strong)] bg-gradient-to-r from-cyan-500/15 to-violet-500/15 px-3 py-1.5 text-xs font-medium text-[var(--ink)] transition hover:shadow-[0_0_22px_-6px_var(--glow-cyan)]"
            >
              <Download className="h-3.5 w-3.5 text-[var(--accent)]" /> Board report (PDF)
            </a>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white/5 px-3 py-1.5 text-xs font-medium text-[var(--ink-soft)] transition hover:border-[var(--border-strong)] hover:text-[var(--ink)]"
            >
              <RefreshCcw className="h-3.5 w-3.5" /> {staticMode ? "Replay" : "Reconnect"}
            </button>
          </div>
        </div>
      </header>

      <ScoreBoard state={state} />

      {isThinResult ? (
        <div className="flex gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900 shadow-sm dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <div className="flex flex-col gap-2">
            <p className="font-semibold">
              {brandName} is not in the curated demo dataset — this is a real
              agent-readiness finding, not an error.
            </p>
            {isLiveMode ? (
              <p>
                We ran a <span className="font-medium">live probe sweep</span>{" "}
                against <code className="font-mono text-xs">{url}</code>. The
                near-zero score reflects genuine gaps in agent-readable
                infrastructure — no <code className="font-mono text-xs">llms.txt</code>,
                no structured product feed, and an agent user-agent that was
                served a blocked or empty page. Agent-panel journeys are only
                replayed for the curated brands (live panel runs require model
                API credentials that aren&apos;t configured for this demo).
              </p>
            ) : (
              <p>
                In <span className="font-medium">receipts mode</span> (the
                default for deterministic on-stage runs), only the curated demo
                brands ship recorded probe evidence and agent-panel journeys.
                For an arbitrary URL there is no cached evidence to score
                against, so dimensions read near zero. Re-run in{" "}
                <span className="font-medium">live mode</span> to fetch the
                brand&apos;s real surfaces, or pick a seeded brand below for the
                full journey replay.
              </p>
            )}
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-1 rounded-md border border-amber-400 bg-white/70 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-white dark:border-amber-500/40 dark:bg-transparent dark:text-amber-200"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Pick a curated demo brand
            </Link>
          </div>
        </div>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="glass-card flex flex-col gap-3 p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-sm font-semibold tracking-wide text-[var(--ink)]">
              ACX radar
            </h2>
            <span className="text-[11px] text-[var(--ink-faint)]">
              normalised to dimension max
            </span>
          </div>
          <AcxRadar dimensions={state.dimensions} height={340} />
        </div>

        <div className="glass-card flex flex-col gap-3 p-5">
          <h2 className="font-display text-sm font-semibold tracking-wide text-[var(--ink)]">
            Pipeline
          </h2>
          <PipelineTimeline nodes={state.pipeline} />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-sm font-semibold tracking-wide text-[var(--ink)]">
            Dimensions
          </h2>
          <p className="text-xs text-[var(--ink-faint)]">Click any card for evidence.</p>
        </div>
        <DimensionCards
          dimensions={state.dimensions}
          onSelect={setSelectedDim}
          selected={selectedDim}
        />
      </section>

      <section className={`flex flex-col gap-3 ${isThinResult ? "hidden" : ""}`}>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-sm font-semibold tracking-wide text-[var(--ink)]">
            Agent journeys ({state.journeys.length})
          </h2>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-black/25 p-1 text-xs">
              {(["replay", "feed"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setJourneyView(opt)}
                  className={`rounded-md px-2.5 py-1 font-medium capitalize transition ${
                    journeyView === opt
                      ? "bg-gradient-to-r from-cyan-500/25 to-violet-500/25 text-[var(--ink)] shadow-[0_0_16px_-6px_var(--glow-cyan)]"
                      : "text-[var(--ink-faint)] hover:text-[var(--ink)]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {journeyView === "feed" ? (
              <div className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-black/25 p-1 text-xs">
                {(["ALL", "L1", "L2", "L3"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setLayerFilter(opt)}
                    className={`rounded-md px-2.5 py-1 font-medium transition ${
                      layerFilter === opt
                        ? "bg-gradient-to-r from-cyan-500/25 to-violet-500/25 text-[var(--ink)] shadow-[0_0_16px_-6px_var(--glow-cyan)]"
                        : "text-[var(--ink-faint)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        {journeyView === "replay" ? (
          <JourneyReplayPlayer journeys={state.journeys} />
        ) : (
          <JourneyFeed journeys={state.journeys} filterLayer={layerFilter} />
        )}
      </section>

      <EvidenceDrawer
        dimensionCode={selectedDim}
        dimensions={state.dimensions}
        journeys={state.journeys}
        onClose={() => setSelectedDim(null)}
      />
    </main>
  );
}
