"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { HealthBadge } from "@/components/health-badge";

const LANDING_LINKS = [
  { href: "/#platform", label: "Platform" },
  { href: "/#how", label: "How it works" },
  { href: "/app#acx500", label: "ACX 500" },
];

export function SiteNav({ variant = "app" }: { variant?: "app" | "landing" }) {
  const pathname = usePathname();
  const isLanding = variant === "landing" || pathname === "/";

  return (
    <nav className="sticky top-0 z-30 border-b border-[var(--border)] bg-[rgba(5,8,19,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--ink)] font-display text-xs font-bold text-[var(--bg)]">
            AR
          </span>
          <span className="font-display text-base font-semibold tracking-tight text-[var(--ink)]">
            AgentReady
          </span>
        </Link>

        {isLanding ? (
          <>
            <div className="hidden items-center gap-8 md:flex">
              {LANDING_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[var(--ink-soft)] transition hover:text-[var(--ink)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/app"
                className="hidden text-sm font-medium text-[var(--ink-soft)] transition hover:text-[var(--ink)] sm:inline"
              >
                Log in
              </Link>
              <Link
                href="/app"
                className="group inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-[var(--bg)] transition hover:opacity-90"
              >
                Get a demo
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </Link>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden text-sm font-medium text-[var(--ink-soft)] transition hover:text-[var(--ink)] sm:inline"
            >
              Home
            </Link>
            <HealthBadge />
          </div>
        )}
      </div>
    </nav>
  );
}
