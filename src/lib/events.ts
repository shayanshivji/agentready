/**
 * Scan event types (mirrors agentready/api/orchestrator/events.py).
 *
 * The FastAPI WebSocket at `/api/scans/{id}/events` ships these events in
 * the order: scan.started → node.started/completed (× nodes) →
 * dimension.scored (× 8) → agent.journey.observed (× N) → scan.completed.
 */

export type ScanStartedEvent = {
  type: "scan.started";
  scan_id: string;
  brand_slug: string;
  mode: string;
  ts: string;
};

export type NodeStartedEvent = {
  type: "node.started";
  scan_id: string;
  node: string;
  mode?: string;
  ts: string;
};

export type NodeCompletedEvent = {
  type: "node.completed";
  scan_id: string;
  node: string;
  ts: string;
  receipts_count?: number;
  kinds?: Record<string, number>;
  journeys_count?: number;
  agents?: string[];
  total_raw?: number;
  total_normalized?: number;
  mode?: string;
  cache_root?: string;
};

export type SubCriterionEvent = {
  code: string;
  label: string;
  score: number;
  notes?: string | null;
  evidence?: string[];
};

export type DimensionScoredEvent = {
  type: "dimension.scored";
  scan_id: string;
  code: string;
  raw: number;
  max: number;
  weighted: number;
  sub_criteria: SubCriterionEvent[];
  ts: string;
};

export type AgentJourneyEvent = {
  type: "agent.journey.observed";
  scan_id: string;
  journey: {
    agent: string;
    intent_id: number;
    intent_label: string;
    layer: "L1" | "L2" | "L3";
    success: boolean;
    cited: boolean;
    canonical_url: string | null;
    sentiment: "positive" | "neutral" | "negative";
    dropoff_reason: string | null;
    evidence_path: string | null;
    transcript_preview: string;
  };
  ts: string;
};

export type ScanCompletedEvent = {
  type: "scan.completed";
  scan_id: string;
  total_raw: number;
  total_normalized: number;
  band: string;
  elapsed_ms: number;
  ts: string;
};

export type ScanFailedEvent = {
  type: "scan.failed";
  scan_id: string;
  error: string;
  elapsed_ms: number;
  ts: string;
};

export type ScanEvent =
  | ScanStartedEvent
  | NodeStartedEvent
  | NodeCompletedEvent
  | DimensionScoredEvent
  | AgentJourneyEvent
  | ScanCompletedEvent
  | ScanFailedEvent;

export const TERMINAL_EVENT_TYPES = new Set([
  "scan.completed",
  "scan.failed",
]);

export const PIPELINE_NODES = [
  { id: "load_receipts", label: "Probe sweep", description: "robots, llms, agents.md, /.well-known/*, products.json, sitemap, PDP" },
  { id: "load_panel", label: "Agent panel", description: "L1/L2/L3 journeys per intent × agent" },
  { id: "score", label: "ACX scoring", description: "8 dimensions, archetype-weighted" },
  { id: "emit_journeys", label: "Persist evidence", description: "receipts + journeys → DB" },
] as const;

export type PipelineNodeId = (typeof PIPELINE_NODES)[number]["id"];
