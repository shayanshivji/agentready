"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { STATIC_MODE, staticBrandByHost } from "@/lib/static";

export function UrlForm() {
  const router = useRouter();
  const [url, setUrl] = useState("https://www.stanley1913.com");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    if (STATIC_MODE) {
      const slug = staticBrandByHost(url);
      if (slug) {
        router.push(`/scans/${slug}`);
      } else {
        setError("Demo mode: pick one of the seven seeded brands below.");
        setSubmitting(false);
      }
      return;
    }
    try {
      const { scan_id } = await api.scans.create({ url });
      router.push(`/scans/${scan_id}`);
    } catch (err) {
      const msg = err instanceof ApiError ? `${err.code}: ${err.message}` : "Failed to start scan";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
    >
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.example.com"
        required
        className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none ring-blue-500/20 transition focus:border-blue-500 focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Starting…" : "Run ACX scan"}
      </button>
      {error ? (
        <p className="sm:basis-full text-sm text-rose-600 dark:text-rose-400">{error}</p>
      ) : null}
    </form>
  );
}
