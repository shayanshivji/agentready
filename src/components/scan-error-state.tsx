import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = {
  title: string;
  detail: ReactNode;
};

export function ScanErrorState({ title, detail }: Props) {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-3xl flex-col justify-center px-6 py-16">
      <div className="glass-card border border-rose-500/30 p-6">
        <p className="font-display text-lg font-semibold text-[var(--ink)]">{title}</p>
        <div className="mt-2 text-sm text-[var(--ink-soft)]">{detail}</div>
        <Link
          href="/app"
          className="mt-5 inline-flex w-fit items-center gap-1.5 text-xs font-medium text-[var(--accent)] transition hover:text-[var(--ink)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to benchmark brands
        </Link>
      </div>
    </main>
  );
}
