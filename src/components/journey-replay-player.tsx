"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Pause,
  Play,
  RotateCcw,
  ShieldAlert,
  ShoppingCart,
  SkipBack,
  SkipForward,
  Sparkles,
} from "lucide-react";

import { JourneyState } from "@/lib/use-scan-stream";

type Props = {
  journeys: JourneyState[];
};

const LAYER_META: Record<
  string,
  { label: string; icon: typeof Sparkles; blurb: string; accent: string }
> = {
  L1: {
    label: "L1 · Citation",
    icon: Sparkles,
    blurb: "Does the agent find and cite the brand when asked a factual question?",
    accent: "#22d3ee",
  },
  L2: {
    label: "L2 · Recommendation",
    icon: ArrowRight,
    blurb: "Does the agent recommend the brand when comparing options?",
    accent: "#7c5cff",
  },
  L3: {
    label: "L3 · Action",
    icon: ShoppingCart,
    blurb: "Can the agent transact — checkout, mandate, reorder — on the brand's surface?",
    accent: "#ec4899",
  },
};

const SENTIMENT_STYLES: Record<string, string> = {
  positive: "bg-emerald-500/15 text-emerald-300",
  neutral: "bg-white/10 text-[var(--ink-soft)]",
  negative: "bg-rose-500/15 text-rose-300",
};

const SPEEDS = [
  { label: "0.5x", ms: 4400 },
  { label: "1x", ms: 2200 },
  { label: "2x", ms: 1100 },
];

function layerRank(layer: string): number {
  return layer === "L1" ? 0 : layer === "L2" ? 1 : 2;
}

export function JourneyReplayPlayer({ journeys }: Props) {
  // Order the journeys as a funnel narrative: L1 → L2 → L3, agent-grouped.
  const ordered = useMemo(
    () =>
      [...journeys].sort(
        (a, b) =>
          layerRank(a.layer) - layerRank(b.layer) ||
          a.intent_id - b.intent_id ||
          a.agent.localeCompare(b.agent),
      ),
    [journeys],
  );

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const count = ordered.length;
  const clamp = useCallback((i: number) => Math.max(0, Math.min(count - 1, i)), [count]);

  // Keep index valid as journeys stream in.
  useEffect(() => {
    if (index > count - 1) setIndex(clamp(index));
  }, [count, index, clamp]);

  useEffect(() => {
    if (!playing || count === 0) return;
    timer.current = setInterval(() => {
      setIndex((prev) => {
        if (prev >= count - 1) {
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, SPEEDS[speedIdx].ms);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, speedIdx, count]);

  if (count === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--border)] bg-black/25 p-6 text-center text-sm text-[var(--ink-faint)]">
        No journeys captured yet — the replay player activates once the agent panel runs.
      </p>
    );
  }

  const current = ordered[clamp(index)];
  const meta = LAYER_META[current.layer] ?? LAYER_META.L1;
  const Icon = meta.icon;

  const togglePlay = () => {
    if (index >= count - 1 && !playing) {
      setIndex(0);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  };

  return (
    <div className="glass-card flex flex-col gap-4 p-5">
      {/* Stage */}
      <div
        className="relative min-h-[210px] overflow-hidden rounded-xl border border-[var(--border)] p-5"
        style={{ background: `radial-gradient(120% 120% at 0% 0%, ${meta.accent}1a, transparent 60%), rgba(0,0,0,0.35)` }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.32 }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center justify-between gap-3">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ backgroundColor: meta.accent }}
              >
                <Icon className="h-3.5 w-3.5" /> {meta.label}
              </span>
              <span className="font-mono text-xs text-[var(--ink-faint)]">
                {current.agent} · intent {current.intent_id}
              </span>
            </div>

            <p className="text-[11px] uppercase tracking-wide text-[var(--ink-faint)]">{meta.blurb}</p>

            <p className="font-display text-base font-semibold leading-snug text-[var(--ink)]">
              {current.intent_label}
            </p>

            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span
                className={`rounded-full px-2 py-0.5 font-medium ${
                  current.success
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "bg-rose-500/15 text-rose-300"
                }`}
              >
                {current.success ? "succeeded" : "failed"}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 font-medium ${
                  current.cited ? "bg-cyan-500/15 text-cyan-300" : "bg-white/10 text-[var(--ink-soft)]"
                }`}
              >
                {current.cited ? "brand cited" : "uncited"}
              </span>
              <span className={`rounded-full px-2 py-0.5 font-medium ${SENTIMENT_STYLES[current.sentiment] ?? ""}`}>
                {current.sentiment}
              </span>
              {current.canonical_url ? (
                <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[var(--ink-soft)]">
                  {current.canonical_url}
                </span>
              ) : null}
              {current.dropoff_reason ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 font-medium text-amber-300">
                  <ShieldAlert className="h-3 w-3" /> {current.dropoff_reason}
                </span>
              ) : null}
            </div>

            <p className="text-sm leading-relaxed text-[var(--ink-soft)]">
              {current.transcript_preview}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Timeline track */}
      <div className="flex items-center gap-1.5">
        {ordered.map((j, i) => {
          const a = LAYER_META[j.layer]?.accent ?? "#94a3b8";
          const active = i === index;
          const done = i < index;
          return (
            <button
              key={`${j.agent}-${j.intent_id}-${j.layer}-${i}`}
              type="button"
              onClick={() => {
                setPlaying(false);
                setIndex(i);
              }}
              aria-label={`Journey ${i + 1}: ${j.agent} ${j.layer}`}
              className="group relative flex-1"
            >
              <span
                className="block h-2 rounded-full transition-all"
                style={{
                  backgroundColor: active || done ? a : "rgba(140,165,220,0.18)",
                  opacity: done && !active ? 0.55 : 1,
                  transform: active ? "scaleY(1.8)" : "scaleY(1)",
                  boxShadow: active ? `0 0 12px ${a}` : undefined,
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setIndex(clamp(index - 1));
            }}
            className="rounded-md p-2 text-[var(--ink-soft)] transition hover:bg-white/10 hover:text-[var(--ink)]"
            aria-label="Previous"
          >
            <SkipBack className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-semibold text-[#04060f] shadow-[0_0_24px_-6px_var(--glow-cyan)] transition hover:brightness-110"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {playing ? "Pause" : index >= count - 1 ? "Replay" : "Play"}
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setIndex(clamp(index + 1));
            }}
            className="rounded-md p-2 text-[var(--ink-soft)] transition hover:bg-white/10 hover:text-[var(--ink)]"
            aria-label="Next"
          >
            <SkipForward className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setIndex(0);
            }}
            className="rounded-md p-2 text-[var(--ink-soft)] transition hover:bg-white/10 hover:text-[var(--ink)]"
            aria-label="Restart"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[var(--ink-faint)]">
            {index + 1} / {count}
          </span>
          <div className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-black/25 p-1 text-xs">
            {SPEEDS.map((s, i) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setSpeedIdx(i)}
                className={`rounded-md px-2 py-0.5 font-medium transition ${
                  speedIdx === i
                    ? "bg-gradient-to-r from-cyan-500/25 to-violet-500/25 text-[var(--ink)]"
                    : "text-[var(--ink-faint)] hover:text-[var(--ink)]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
