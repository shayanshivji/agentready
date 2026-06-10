import Link from "next/link";

const COLS = [
  {
    title: "Platform",
    links: [
      { label: "ACX Diagnostic", href: "/app" },
      { label: "ACX 500 Preview", href: "/app#acx500" },
      { label: "Agent Panel", href: "/app" },
      { label: "Board Reports", href: "/app" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "How it works", href: "/#how" },
      { label: "Eight dimensions", href: "/#platform" },
      { label: "Benchmark data", href: "/app#acx500" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "McKinsey Innovation Olympics 2026", href: "/" },
      { label: "Contact", href: "/app" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-black/20">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="flex flex-col gap-3 md:col-span-1">
          <span className="font-display text-lg font-semibold tracking-tight text-[var(--ink)]">
            AgentReady
          </span>
          <p className="text-sm leading-relaxed text-[var(--ink-soft)]">
            The productized diagnostic for agentic commerce readiness. Built for
            the McKinsey Innovation Olympics.
          </p>
        </div>
        {COLS.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink)]">
              {col.title}
            </span>
            <ul className="flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--ink-soft)] transition hover:text-[var(--ink)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--border)] px-6 py-5 text-center text-xs text-[var(--ink-faint)]">
        © 2026 AgentReady · McKinsey Innovation Olympics · CONFIDENTIAL
      </div>
    </footer>
  );
}
