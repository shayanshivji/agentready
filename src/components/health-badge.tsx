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
      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> API unreachable
      </span>
    );
  }

  if (!health) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" /> checking…
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {STATIC_MODE ? "Demo · receipts mode" : `API ${health.status} · mode ${health.mode}`}
    </span>
  );
}
