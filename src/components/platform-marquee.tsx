"use client";

import { useEffect, useState } from "react";

const PLATFORMS = [
  "ChatGPT",
  "Claude",
  "Perplexity",
  "Gemini",
  "Amazon Rufus",
  "Operator",
  "Microsoft Copilot",
];

export function PlatformMarquee() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % PLATFORMS.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm font-medium text-[var(--ink-soft)]">
        Agent readiness to win in
      </p>
      <div className="relative flex h-14 min-w-[280px] items-center justify-center overflow-hidden">
        <span
          key={PLATFORMS[index]}
          className="platform-flip font-display text-4xl font-semibold tracking-tight text-[var(--ink)] sm:text-5xl"
        >
          {PLATFORMS[index]}
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        {PLATFORMS.map((p) => (
          <span
            key={p}
            className={`rounded-full border px-3 py-1 text-[11px] font-medium transition ${
              p === PLATFORMS[index]
                ? "border-[var(--border-strong)] bg-white/10 text-[var(--ink)]"
                : "border-transparent bg-white/[0.03] text-[var(--ink-faint)]"
            }`}
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}

export function PlatformLogoStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 opacity-70">
      {PLATFORMS.map((p) => (
        <span
          key={p}
          className="text-sm font-semibold tracking-wide text-[var(--ink-faint)]"
        >
          {p}
        </span>
      ))}
    </div>
  );
}
