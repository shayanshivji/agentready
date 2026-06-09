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
        setError("Demo mode: pick one of the eight seeded brands below.");
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
        className="flex-1 rounded-lg border border-[var(--border)] bg-black/30 px-4 py-3 font-mono text-base text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-faint)] focus:border-[var(--accent)] focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]"
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 text-base font-semibold text-[#04060f] shadow-[0_0_28px_-6px_var(--glow-cyan)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Starting…" : "Run ACX scan"}
      </button>
      {error ? (
        <p className="sm:basis-full text-sm text-rose-400">{error}</p>
      ) : null}
    </form>
  );
}
