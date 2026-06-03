/**
 * Typed AgentReady API client.
 *
 * Mirrors the contract in agentready/API.md.  Sprint 4 will replace the
 * hand-rolled fetch with TanStack Query / Suspense; Sprint 1 keeps it minimal.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

// ---------------------------------------------------------------------------
// Domain types (mirror agentready/api/schemas.py)
// ---------------------------------------------------------------------------
export type ScanSummary = {
  id: string;
  started_at: string;
  completed_at: string | null;
  status: "queued" | "running" | "completed" | "failed";
  total_score: number | null;
  band: string | null;
};

export type Brand = {
  id: string;
  slug: string;
  name: string;
  domain: string;
  archetype: string;
  target_curve: string;
  target_band: [number, number];
  latest_scan: ScanSummary | null;
};

export type SubCriterion = {
  code: string;
  label: string;
  score: number;
  evidence: unknown[];
  notes: string | null;
};

export type Dimension = {
  code: string;
  name: string;
  weight: number;
  raw_subtotal: number;
  max_subtotal: number;
  weighted_score: number;
  sub_criteria: SubCriterion[];
};

export type Scan = {
  id: string;
  brand: { id: string; slug: string; name: string };
  url: string;
  mode: string;
  status: "queued" | "running" | "completed" | "failed";
  started_at: string;
  completed_at: string | null;
  total_score: number | null;
  band: string | null;
  dimensions: Dimension[];
};

export type ScanCreated = {
  scan_id: string;
  status: string;
  events_url: string;
  result_url: string;
};

export type Health = {
  status: "ok" | "degraded";
  mode: "receipts" | "hybrid" | "live";
  db: "connected" | "unreachable";
  version: string;
};

export type Intent = {
  id: number;
  text: string;
  primary_tests: string[];
  pass_criteria: string;
  section: string;
};

// ---------------------------------------------------------------------------
// Low-level fetcher
// ---------------------------------------------------------------------------
class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let code = "http_error";
    let message = res.statusText;
    let details: unknown;
    try {
      const body = await res.json();
      code = body?.error?.code ?? code;
      message = body?.error?.message ?? message;
      details = body?.error?.details;
    } catch {
      // body wasn't JSON; keep statusText
    }
    throw new ApiError(res.status, code, message, details);
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// API surface
// ---------------------------------------------------------------------------
export const api = {
  health: () => request<Health>("/healthz"),

  brands: {
    list: () => request<{ brands: Brand[]; next_cursor: string | null }>("/api/brands"),
    get: (id: string) => request<Brand>(`/api/brands/${id}`),
  },

  scans: {
    create: (payload: { url: string; brand_id?: string; mode?: string }) =>
      request<ScanCreated>("/api/scans", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    get: (id: string) => request<Scan>(`/api/scans/${id}`),
    reportUrl: (id: string, format: "html" | "pdf" = "pdf") =>
      `${API_BASE_URL}/api/scans/${id}/report.${format}`,
  },

  intents: {
    list: () => request<{ intents: Intent[] }>("/api/intents"),
  },
};

export { ApiError };
