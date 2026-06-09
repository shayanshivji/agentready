/**
 * Static metadata for the 8 ACX dimensions.
 *
 * Names aligned with pitch deck slide 6 and 02-acx-scoring-rubric.md v1.2.
 */

export type DimensionMeta = {
  code: string;
  name: string;
  short: string;
  weight: number;
  description: string;
};

export const DIMENSIONS: DimensionMeta[] = [
  {
    code: "D1",
    name: "Catalog Agentability",
    short: "Catalog",
    weight: 12.5,
    description:
      "Can AI read your product data — price, stock, specs — accurately enough to decide?",
  },
  {
    code: "D2",
    name: "Discoverability (AEO)",
    short: "Discover",
    weight: 12.5,
    description:
      "When buyers ask AI for recommendations, does your brand show up — and is it cited correctly?",
  },
  {
    code: "D3",
    name: "API Readiness",
    short: "API",
    weight: 12.5,
    description:
      "Can an agent check out programmatically, or must it click through your website like a human?",
  },
  {
    code: "D4",
    name: "Mandate Resolution",
    short: "Mandate",
    weight: 12.5,
    description:
      "Can you recognize and fulfill a standing agent instruction (buy under $X, reorder when low)?",
  },
  {
    code: "D5",
    name: "Three Proofs Trust",
    short: "Trust",
    weight: 12.5,
    description:
      "Can you prove who authorized the purchase, what the user wanted, and who is liable if it fails?",
  },
  {
    code: "D6",
    name: "Service, Returns & Disputes",
    short: "Service",
    weight: 12.5,
    description:
      "Can agents handle returns, tracking, and disputes without calling your support line?",
  },
  {
    code: "D7",
    name: "Selectability",
    short: "Select",
    weight: 12.5,
    description:
      "When agents compare options, do they pick you — and can they apply loyalty on the customer's behalf?",
  },
  {
    code: "D8",
    name: "Risk & Resilience",
    short: "Risk",
    weight: 12.5,
    description:
      "Are agents blocked, slowed, or confused — or is the experience fast and reliable end-to-end?",
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
