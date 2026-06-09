import Link from "next/link";

import { api } from "@/lib/api";
import { STATIC_MODE, getStaticScan } from "@/lib/static";
import { LiveScanView } from "@/components/live-scan-view";
import { ScanErrorState } from "@/components/scan-error-state";

export const dynamic = "force-dynamic";

export default async function ScanPage({
  params,
}: {
  params: Promise<{ scanId: string }>;
}) {
  const { scanId } = await params;

  if (STATIC_MODE) {
    const payload = getStaticScan(scanId);
    if (!payload) {
      return (
        <ScanErrorState
          title="No demo scan for this brand"
          detail={
            <>
              <code className="font-mono text-[var(--accent)]">{scanId}</code> is not in the
              bundled benchmark set. Pick one of the eight seeded brands from the console.
            </>
          }
        />
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
      <ScanErrorState
        title="Scan not found"
        detail={
          <>
            No scan with id <code className="font-mono text-[var(--accent)]">{scanId}</code>.
            Start a new run from the console.
          </>
        }
      />
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
