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

  const score = brand.latest_scan?.total_score ?? null;

  return (
    <article className="glass-card group flex flex-col gap-4 p-5">
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-lg font-semibold tracking-tight text-[var(--ink)]">
            {brand.name}
          </h3>
          <p className="font-mono text-xs text-[var(--ink-faint)]">{brand.domain}</p>
        </div>
        <span className="chip shrink-0">{brand.archetype}</span>
      </header>

      {/* Score readout */}
      <div className="flex items-end justify-between rounded-xl border border-[var(--border)] bg-black/25 px-4 py-3">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--ink-faint)]">
            ACX Score
          </span>
          <span
            className="font-display text-3xl font-bold tabular-nums leading-none"
            style={{ color: band?.color ?? "var(--ink)" }}
          >
            {score?.toFixed(1) ?? "—"}
            <span className="ml-1 text-sm font-medium text-[var(--ink-faint)]">/100</span>
          </span>
        </div>
        {band ? (
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide"
            style={{
              color: band.color,
              backgroundColor: `${band.color}1f`,
              border: `1px solid ${band.color}55`,
            }}
          >
            {band.label}
          </span>
        ) : (
          <span className="text-xs text-[var(--ink-faint)]">
            {brand.latest_scan?.status ?? "not scanned"}
          </span>
        )}
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-[10px] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
            Target curve
          </dt>
          <dd className="font-mono font-semibold text-[var(--ink)]">{brand.target_curve}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
            Target band
          </dt>
          <dd className="font-mono font-semibold text-[var(--ink)]">
            {brand.target_band[0]}–{brand.target_band[1]}
          </dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={runScan}
        disabled={submitting}
        className="group/btn mt-1 inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border-strong)] bg-gradient-to-r from-cyan-500/15 to-violet-500/15 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-[var(--ink)] transition hover:from-cyan-500/30 hover:to-violet-500/30 hover:shadow-[0_0_24px_-6px_var(--glow-cyan)] disabled:opacity-60"
      >
        <Play className="h-3.5 w-3.5 text-[var(--accent)] transition group-hover/btn:translate-x-0.5" />
        {submitting ? "Starting…" : STATIC_MODE ? "Replay ACX scan" : "Run live ACX scan"}
      </button>
      {error ? <p className="text-[11px] text-rose-400">{error}</p> : null}
    </article>
  );
}
