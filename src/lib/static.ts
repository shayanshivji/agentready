/**
 * STATIC_MODE — the frontend runs entirely off bundled fixtures, no backend.
 *
 * Enabled by setting NEXT_PUBLIC_STATIC_MODE=1 (the Vercel demo deploy). In
 * this mode the brand grid, scan pages, and PDF links all resolve against
 * `src/data/*` instead of calling the FastAPI service.
 */

import { STATIC_BRANDS, STATIC_SCANS, type StaticScanPayload } from "@/data";

export const STATIC_MODE = process.env.NEXT_PUBLIC_STATIC_MODE === "1";

export function getStaticScan(slug: string): StaticScanPayload | null {
  return STATIC_SCANS[slug] ?? null;
}

/** Resolve a typed URL (or bare host) to a known brand slug, if seeded. */
export function staticBrandByHost(input: string): string | null {
  let host = input.trim().toLowerCase();
  try {
    host = new URL(host.includes("://") ? host : `https://${host}`).hostname;
  } catch {
    // keep the raw string; fall through to substring match
  }
  host = host.replace(/^www\./, "");
  const match = STATIC_BRANDS.find(
    (b) => b.domain.toLowerCase() === host || host.includes(b.slug),
  );
  return match?.slug ?? null;
}

/** PDF report path for a brand in static mode (bundled under /public/reports). */
export function staticReportHref(slug: string): string {
  return `/reports/${slug}.pdf`;
}
