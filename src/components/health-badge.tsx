"use client";

import { useEffect, useState } from "react";
import { api, type Health } from "@/lib/api";
import { STATIC_MODE } from "@/lib/static";

export function HealthBadge() {
  const [health, setHealth] = useState<Health | null>(
    STATIC_MODE ? { status: "ok", mode: "receipts", db: "connected", version: "demo" } : null,
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    if (STATIC_MODE) return;
    let cancelled = false;
    api.health()
      .then((h) => !cancelled && setHealth(h))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-300">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> API unreachable
      </span>
    );
  }

  if (!health) {
    return (
      <span className="chip">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--ink-faint)]" /> checking…
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-3)]/35 bg-[var(--accent-3)]/10 px-2.5 py-1 text-xs font-medium text-[var(--accent-3)]">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-3)] opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent-3)]" />
      </span>
      {STATIC_MODE ? "Demo · receipts mode" : `API ${health.status} · mode ${health.mode}`}
    </span>
  );
}
