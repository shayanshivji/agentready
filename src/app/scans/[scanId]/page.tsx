import Link from "next/link";

import { api } from "@/lib/api";
import { STATIC_MODE, getStaticScan } from "@/lib/static";
import { LiveScanView } from "@/components/live-scan-view";

export const dynamic = "force-dynamic";

export default async function ScanPage({
  params,
}: {
  params: Promise<{ scanId: string }>;
}) {
  const { scanId } = await params;

  // STATIC_MODE: the route param is a brand slug, resolved from bundled data.
  if (STATIC_MODE) {
    const payload = getStaticScan(scanId);
    if (!payload) {
      return (
        <main className="mx-auto max-w-3xl px-6 py-16">
          <p className="rounded-lg border border-rose-300 bg-rose-50 p-4 text-rose-700">
            No demo scan for <code>{scanId}</code>.
          </p>
          <Link href="/" className="mt-4 inline-block text-blue-600 underline">
            ← Back home
          </Link>
        </main>
      );
    }
    const { scan } = payload;
    return (
      <LiveScanView
        scanId={scan.id}
        brandName={scan.brand.name}
        brandSlug={scan.brand.slug}
        url={scan.url}
        startedAt={scan.started_at}
        mode={scan.mode}
        staticMode
      />
    );
  }

  let scan;
  try {
    scan = await api.scans.get(scanId);
  } catch {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="rounded-lg border border-rose-300 bg-rose-50 p-4 text-rose-700">
          Scan <code>{scanId}</code> not found.
        </p>
        <Link href="/" className="mt-4 inline-block text-blue-600 underline">
          ← Back home
        </Link>
      </main>
    );
  }

  return (
    <LiveScanView
      scanId={scan.id}
      brandName={scan.brand.name}
      brandSlug={scan.brand.slug}
      url={scan.url}
      startedAt={scan.started_at}
      mode={scan.mode}
    />
  );
}
