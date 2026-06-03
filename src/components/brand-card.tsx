"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";

import { api, ApiError, type Brand } from "@/lib/api";
import { STATIC_MODE } from "@/lib/static";
import { bandByLabel } from "@/lib/dimensions";

export function BrandCard({ brand }: { brand: Brand }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const band = bandByLabel(brand.latest_scan?.band ?? null);

  async function runScan() {
    if (STATIC_MODE) {
      setSubmitting(true);
      router.push(`/scans/${brand.slug}`);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const { scan_id } = await api.scans.create({
        url: `https://${brand.domain}`,
        brand_id: brand.id,
      });
      router.push(`/scans/${scan_id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to start scan");
      setSubmitting(false);
    }
  }

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/40">
      <header className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {brand.name}
        </h3>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {brand.archetype}
        </span>
      </header>
      <p className="-mt-2 font-mono text-xs text-slate-500">{brand.domain}</p>

      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-slate-500">Target curve</dt>
          <dd className="font-semibold text-slate-900 dark:text-slate-100">{brand.target_curve}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-slate-500">Target band</dt>
          <dd className="font-semibold text-slate-900 dark:text-slate-100">
            {brand.target_band[0]}–{brand.target_band[1]}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[11px] uppercase tracking-wide text-slate-500">Latest scan</dt>
          <dd className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            {brand.latest_scan ? (
              <>
                <span className="text-lg font-bold tabular-nums text-slate-900 dark:text-slate-100">
                  {brand.latest_scan.total_score?.toFixed(1) ?? "—"}
                </span>
                {band ? (
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                    style={{ backgroundColor: band.color }}
                  >
                    {band.label}
                  </span>
                ) : (
                  <span className="text-slate-500">{brand.latest_scan.status}</span>
                )}
              </>
            ) : (
              <span className="text-slate-500">not yet scanned</span>
            )}
          </dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={runScan}
        disabled={submitting}
        className="inline-flex items-center justify-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-600 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-blue-500 dark:hover:text-white"
      >
        <Play className="h-3.5 w-3.5" />
        {submitting ? "Starting…" : STATIC_MODE ? "Replay ACX scan" : "Run live ACX scan"}
      </button>
      {error ? <p className="text-[11px] text-rose-600">{error}</p> : null}
    </article>
  );
}
