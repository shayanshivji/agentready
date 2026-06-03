"use client";

import { useEffect, useReducer, useRef } from "react";

import { API_BASE_URL } from "@/lib/api";
import {
  AgentJourneyEvent,
  DimensionScoredEvent,
  NodeCompletedEvent,
  NodeStartedEvent,
  PIPELINE_NODES,
  PipelineNodeId,
  ScanCompletedEvent,
  ScanEvent,
  ScanFailedEvent,
  ScanStartedEvent,
  SubCriterionEvent,
  TERMINAL_EVENT_TYPES,
} from "@/lib/events";

// ---------------------------------------------------------------------------
// Aggregated state derived from the event stream
// ---------------------------------------------------------------------------
export type NodeStatus = "pending" | "running" | "completed";

export type PipelineNodeState = {
  id: PipelineNodeId;
  label: string;
  description: string;
  status: NodeStatus;
  startedAt: string | null;
  completedAt: string | null;
  meta: Record<string, unknown>;
};

export type DimensionState = {
  code: string;
  raw: number;
  max: number;
  weighted: number;
  subCriteria: SubCriterionEvent[];
  receivedAt: string;
};

export type JourneyState = AgentJourneyEvent["journey"] & {
  receivedAt: string;
};

export type ScanStreamState = {
  scanId: string;
  status: "connecting" | "running" | "completed" | "failed";
  brandSlug: string | null;
  mode: string | null;
  pipeline: PipelineNodeState[];
  dimensions: DimensionState[];
  journeys: JourneyState[];
  totalRaw: number | null;
  totalNormalized: number | null;
  band: string | null;
  elapsedMs: number | null;
  error: string | null;
  events: ScanEvent[];
};

export const initialPipeline = (): PipelineNodeState[] =>
  PIPELINE_NODES.map((n) => ({
    id: n.id,
    label: n.label,
    description: n.description,
    status: "pending" as NodeStatus,
    startedAt: null,
    completedAt: null,
    meta: {},
  }));

export const initialState = (scanId: string): ScanStreamState => ({
  scanId,
  status: "connecting",
  brandSlug: null,
  mode: null,
  pipeline: initialPipeline(),
  dimensions: [],
  journeys: [],
  totalRaw: null,
  totalNormalized: null,
  band: null,
  elapsedMs: null,
  error: null,
  events: [],
});

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------
export type Action = { type: "event"; event: ScanEvent } | { type: "reset"; scanId: string };

export function reducer(state: ScanStreamState, action: Action): ScanStreamState {
  if (action.type === "reset") return initialState(action.scanId);

  const event = action.event;
  const events = [...state.events, event];

  switch (event.type) {
    case "scan.started": {
      const e = event as ScanStartedEvent;
      return {
        ...state,
        status: "running",
        brandSlug: e.brand_slug,
        mode: e.mode,
        events,
      };
    }
    case "node.started": {
      const e = event as NodeStartedEvent;
      const pipeline = state.pipeline.map((n) =>
        n.id === e.node ? { ...n, status: "running" as NodeStatus, startedAt: e.ts } : n,
      );
      return { ...state, pipeline, events };
    }
    case "node.completed": {
      const e = event as NodeCompletedEvent;
      const { type: _t, scan_id: _s, node: _n, ts: _ts, ...meta } = e;
      void _t; void _s; void _n; void _ts;
      const pipeline = state.pipeline.map((n) =>
        n.id === e.node
          ? {
              ...n,
              status: "completed" as NodeStatus,
              completedAt: e.ts,
              meta,
            }
          : n,
      );
      return { ...state, pipeline, events };
    }
    case "dimension.scored": {
      const e = event as DimensionScoredEvent;
      const incoming: DimensionState = {
        code: e.code,
        raw: e.raw,
        max: e.max,
        weighted: e.weighted,
        subCriteria: e.sub_criteria,
        receivedAt: e.ts,
      };
      const existing = state.dimensions.findIndex((d) => d.code === e.code);
      const dimensions =
        existing >= 0
          ? state.dimensions.map((d, i) => (i === existing ? incoming : d))
          : [...state.dimensions, incoming];
      dimensions.sort((a, b) => a.code.localeCompare(b.code));
      return { ...state, dimensions, events };
    }
    case "agent.journey.observed": {
      const e = event as AgentJourneyEvent;
      return {
        ...state,
        journeys: [...state.journeys, { ...e.journey, receivedAt: e.ts }],
        events,
      };
    }
    case "scan.completed": {
      const e = event as ScanCompletedEvent;
      return {
        ...state,
        status: "completed",
        totalRaw: e.total_raw,
        totalNormalized: e.total_normalized,
        band: e.band,
        elapsedMs: e.elapsed_ms,
        events,
      };
    }
    case "scan.failed": {
      const e = event as ScanFailedEvent;
      return {
        ...state,
        status: "failed",
        error: e.error,
        elapsedMs: e.elapsed_ms,
        events,
      };
    }
    default:
      return { ...state, events };
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
function wsUrlFor(scanId: string): string {
  const httpBase = API_BASE_URL;
  const wsBase = httpBase.replace(/^http/, "ws");
  return `${wsBase}/api/scans/${scanId}/events`;
}

export function useScanStream(scanId: string | null): ScanStreamState | null {
  const [state, dispatch] = useReducer(
    reducer,
    scanId ? initialState(scanId) : initialState(""),
  );
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!scanId) return;
    dispatch({ type: "reset", scanId });

    const ws = new WebSocket(wsUrlFor(scanId));
    wsRef.current = ws;

    ws.onmessage = (msg) => {
      try {
        const event = JSON.parse(msg.data) as ScanEvent;
        dispatch({ type: "event", event });
        if (TERMINAL_EVENT_TYPES.has(event.type)) {
          ws.close();
        }
      } catch (err) {
        console.error("scan-stream: failed to parse event", err, msg.data);
      }
    };

    ws.onerror = (err) => {
      console.warn("scan-stream WebSocket error", err);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
      wsRef.current = null;
    };
  }, [scanId]);

  if (!scanId) return null;
  return state;
}
