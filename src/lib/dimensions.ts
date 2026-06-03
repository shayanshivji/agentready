/**
 * Static metadata for the 8 ACX dimensions.
 *
 * Keeps the frontend self-sufficient even before any backend event arrives;
 * lets the radar render its skeleton, the legend display labels, and copy
 * stay consistent across the dashboard, drawer, and PDF.
 */

export type DimensionMeta = {
  code: string;
  name: string;
  short: string;
  weight: number; // % of total 50 (Brand archetype baseline)
  description: string;
};

export const DIMENSIONS: DimensionMeta[] = [
  {
    code: "D1",
    name: "Product Data Foundation",
    short: "Data",
    weight: 15,
    description:
      "Structured product catalogue, JSON-LD, products.json, real-time availability.",
  },
  {
    code: "D2",
    name: "Agent Discoverability (AEO)",
    short: "Discover",
    weight: 15,
    description:
      "Citation rate in agent answers; canonical-vs-retailer split; findability foundations.",
  },
  {
    code: "D3",
    name: "Access & Authorization",
    short: "Access",
    weight: 10,
    description:
      "Agent UA permissions, WAF posture, robots/agents.md governance.",
  },
  {
    code: "D4",
    name: "Mandate & Transaction",
    short: "Mandate",
    weight: 15,
    description:
      "Agent-initiated checkout viability, AP2 / mandate.json / well-known endpoints.",
  },
  {
    code: "D5",
    name: "Protocol Adoption",
    short: "Protocol",
    weight: 10,
    description:
      "MCP / A2A / UCP / ACP / AP2 surface area for downstream automation.",
  },
  {
    code: "D6",
    name: "Performance & Latency",
    short: "Perf",
    weight: 10,
    description:
      "PDP latency for agent UAs; HTML weight; response-time consistency.",
  },
  {
    code: "D7",
    name: "Trust & Governance",
    short: "Trust",
    weight: 10,
    description:
      "Three Proofs (authorization, intent, accountability), refusal patterns, audit trail.",
  },
  {
    code: "D8",
    name: "Brand Voice & Experience",
    short: "Voice",
    weight: 15,
    description:
      "Sentiment in agent responses; tone preservation; recommendation language.",
  },
];

export const DIMENSION_BY_CODE: Record<string, DimensionMeta> = Object.fromEntries(
  DIMENSIONS.map((d) => [d.code, d]),
);

export type Band = {
  key: string;
  label: string;
  min: number;
  max: number;
  color: string;
};

// Mirrors agentready/api/scoring/bands.py — the canonical 0–100 ACX scale.
export const SCORE_MAX = 100;

export const BANDS: Band[] = [
  { key: "blind", label: "Agent-Blind", min: 0, max: 19.99, color: "#dc2626" },
  { key: "exposed", label: "Agent-Exposed", min: 20, max: 39.99, color: "#ea580c" },
  { key: "aware", label: "Agent-Aware", min: 40, max: 59.99, color: "#ca8a04" },
  { key: "ready", label: "Agent-Ready", min: 60, max: 79.99, color: "#16a34a" },
  { key: "native", label: "Agent-Native", min: 80, max: 100, color: "#2563eb" },
];

export function bandFor(score: number): Band {
  return (
    BANDS.find((b) => score >= b.min && score <= b.max) ??
    BANDS[BANDS.length - 1]
  );
}

export function bandByLabel(label: string | null): Band | null {
  if (!label) return null;
  return BANDS.find((b) => b.label.toLowerCase() === label.toLowerCase()) ?? null;
}
