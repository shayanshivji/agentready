"use client";

import { useEffect, useReducer } from "react";

import { type StaticScanPayload } from "@/data";
import { getStaticScan } from "@/lib/static";
import { ScanEvent } from "@/lib/events";
import {
  ScanStreamState,
  initialState,
  reducer,
} from "@/lib/use-scan-stream";

// ---------------------------------------------------------------------------
// Timeline synthesis — turn a baked {scan, journeys} payload into the same
// ordered event stream the FastAPI WebSocket would emit, then replay it with
// timers so the dashboard animates exactly as it does against the live backend.
// ---------------------------------------------------------------------------
type Timed = { delay: number; event: ScanEvent };

function buildTimeline(payload: StaticScanPayload): { events: Timed[]; total: number } {
  const { scan, journeys, receipts_count } = payload;
  const sid = scan.id;
  const ts = () => new Date().toISOString();
  const out: Timed[] = [];

  out.push({
    delay: 150,
    event: { type: "scan.started", scan_id: sid, brand_slug: scan.brand.slug, mode: scan.mode, ts: ts() },
  });

  // 1 · Probe sweep
  out.push({ delay: 350, event: { type: "node.started", scan_id: sid, node: "load_receipts", mode: scan.mode, ts: ts() } });
  out.push({
    delay: 1150,
    event: { type: "node.completed", scan_id: sid, node: "load_receipts", ts: ts(), receipts_count },
  });

  // 2 · Agent panel
  const agents = Array.from(new Set(journeys.map((j) => j.agent)));
  out.push({ delay: 1300, event: { type: "node.started", scan_id: sid, node: "load_panel", mode: scan.mode, ts: ts() } });
  out.push({
    delay: 2150,
    event: { type: "node.completed", scan_id: sid, node: "load_panel", ts: ts(), journeys_count: journeys.length, agents },
  });

  // 3 · ACX scoring — dimensions stream in one by one
  out.push({ delay: 2300, event: { type: "node.started", scan_id: sid, node: "score", mode: scan.mode, ts: ts() } });
  let t = 2450;
  for (const d of scan.dimensions) {
    out.push({
      delay: t,
      event: {
        type: "dimension.scored",
        scan_id: sid,
        code: d.code,
        raw: d.raw_subtotal,
        max: d.max_subtotal,
        weighted: d.weighted_score,
        sub_criteria: d.sub_criteria.map((s) => ({
          code: s.code,
          label: s.label,
          score: s.score,
          notes: s.notes,
        })),
        ts: ts(),
      },
    });
    t += 210;
  }
  const total = scan.total_score ?? 0;
  out.push({
    delay: t + 150,
    event: { type: "node.completed", scan_id: sid, node: "score", ts: ts(), total_raw: total, total_normalized: total },
  });

  // 4 · Persist evidence — journeys stream into the replay player
  let jt = t + 350;
  out.push({ delay: jt, event: { type: "node.started", scan_id: sid, node: "emit_journeys", mode: scan.mode, ts: ts() } });
  jt += 150;
  for (const j of journeys) {
    out.push({ delay: jt, event: { type: "agent.journey.observed", scan_id: sid, journey: j, ts: ts() } });
    jt += 260;
  }
  out.push({
    delay: jt + 100,
    event: { type: "node.completed", scan_id: sid, node: "emit_journeys", ts: ts(), journeys_count: journeys.length },
  });

  const done = jt + 450;
  out.push({
    delay: done,
    event: {
      type: "scan.completed",
      scan_id: sid,
      total_raw: total,
      total_normalized: total,
      band: scan.band ?? "",
      elapsed_ms: done,
      ts: ts(),
    },
  });

  return { events: out, total: done };
}

/**
 * Drop-in replacement for `useScanStream` that replays a bundled fixture by
 * brand slug instead of opening a WebSocket. Returns the identical state shape.
 */
export function useStaticScanStream(slug: string | null): ScanStreamState | null {
  const [state, dispatch] = useReducer(reducer, initialState(slug ?? ""));

  useEffect(() => {
    if (!slug) return;
    const payload = getStaticScan(slug);
    if (!payload) return;

    dispatch({ type: "reset", scanId: payload.scan.id });
    const { events } = buildTimeline(payload);
    const timers = events.map((e) =>
      setTimeout(() => dispatch({ type: "event", event: e.event }), e.delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [slug]);

  if (!slug) return null;
  return state;
}
