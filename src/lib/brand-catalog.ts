import { STATIC_BRANDS } from "@/data";
import pipelineBrands from "@/data/pipeline-brands.json";
import type { Brand, BrandDemoStatus } from "@/lib/api";

export type BrandWithStatus = Brand & { demo_status: BrandDemoStatus };

export const ACX500_TARGET = 500;

export const PIPELINE_BRANDS = pipelineBrands as BrandWithStatus[];

export type ArchetypeCoverageStatus = "scored" | "in_progress" | "planned";

export type ArchetypeCoverage = {
  archetype: string;
  status: ArchetypeCoverageStatus;
  detail: string;
};

/** Firm seven buyer archetypes — coverage is honest about what is scored vs queued. */
export const ARCHETYPE_COVERAGE: ArchetypeCoverage[] = [
  { archetype: "Brand", status: "scored", detail: "6 entities scored" },
  { archetype: "B2B Distributor", status: "scored", detail: "2 scored · 3 in capture" },
  { archetype: "Retailer", status: "in_progress", detail: "Target in capture" },
  { archetype: "Marketplace", status: "in_progress", detail: "Etsy in capture" },
  { archetype: "Commerce Platform", status: "in_progress", detail: "Shopify in capture" },
  { archetype: "Advertiser", status: "planned", detail: "ACX 500 queue" },
  { archetype: "PSP / Bank", status: "planned", detail: "ACX 500 queue" },
];

export function scoredBrands(): BrandWithStatus[] {
  return STATIC_BRANDS.map((b) => ({ ...b, demo_status: "scored" as const }));
}

export function inProgressBrands(): BrandWithStatus[] {
  return PIPELINE_BRANDS;
}

export function allCatalogBrands(): BrandWithStatus[] {
  return [...scoredBrands(), ...inProgressBrands()];
}

export function sortScoredByRank(brands: BrandWithStatus[]): BrandWithStatus[] {
  return [...brands]
    .filter((b) => b.demo_status === "scored" && b.latest_scan?.total_score != null)
    .sort(
      (a, b) =>
        (b.latest_scan?.total_score ?? 0) - (a.latest_scan?.total_score ?? 0),
    );
}

export function demoStats() {
  const scored = scoredBrands();
  const inProgress = inProgressBrands();
  const scores = scored
    .map((b) => b.latest_scan?.total_score)
    .filter((s): s is number => s != null);
  const best = scores.length ? Math.max(...scores) : 0;
  const agentAware = scores.filter((s) => s >= 40).length;
  const queued = ACX500_TARGET - scored.length - inProgress.length;

  return {
    scoredCount: scored.length,
    inProgressCount: inProgress.length,
    queuedCount: queued,
    bestScore: Math.round(best),
    agentAwareCount: agentAware,
    archetypesActive: ARCHETYPE_COVERAGE.filter((a) => a.status !== "planned").length,
  };
}
