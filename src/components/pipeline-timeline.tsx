"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

import { PipelineNodeState } from "@/lib/use-scan-stream";

type Props = {
  nodes: PipelineNodeState[];
};

const STATUS_COPY: Record<string, string> = {
  pending: "Pending",
  running: "Running",
  completed: "Complete",
};

export function PipelineTimeline({ nodes }: Props) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {nodes.map((node, idx) => {
        const Icon =
          node.status === "completed"
            ? CheckCircle2
            : node.status === "running"
              ? Loader2
              : Circle;
        const color =
          node.status === "completed"
            ? "text-emerald-600"
            : node.status === "running"
              ? "text-blue-600"
              : "text-slate-400";
        const border =
          node.status === "completed"
            ? "border-emerald-200"
            : node.status === "running"
              ? "border-blue-200"
              : "border-slate-200";
        return (
          <motion.li
            key={node.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.25 }}
            className={`relative rounded-xl border bg-white p-4 shadow-sm dark:bg-slate-900/40 ${border} dark:border-slate-800`}
          >
            <div className="flex items-start gap-3">
              <Icon
                className={`mt-0.5 h-5 w-5 ${color} ${
                  node.status === "running" ? "animate-spin" : ""
                }`}
              />
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Step {idx + 1} · {STATUS_COPY[node.status] ?? node.status}
                </p>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {node.label}
                </p>
                <p className="mt-1 text-xs text-slate-500">{node.description}</p>
                <NodeMeta node={node} />
              </div>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}

function NodeMeta({ node }: { node: PipelineNodeState }) {
  if (node.status !== "completed") return null;
  const m = node.meta;
  const lines: string[] = [];
  if (typeof m.receipts_count === "number") {
    lines.push(`${m.receipts_count} receipts indexed`);
  }
  if (typeof m.journeys_count === "number") {
    lines.push(`${m.journeys_count} journeys loaded`);
  }
  if (Array.isArray(m.agents) && m.agents.length > 0) {
    lines.push(`agents: ${(m.agents as string[]).join(", ")}`);
  }
  if (typeof m.total_normalized === "number") {
    lines.push(`ACX total: ${(m.total_normalized as number).toFixed(2)}/50`);
  }
  if (lines.length === 0) return null;
  return (
    <ul className="mt-2 space-y-0.5 text-[11px] text-slate-500">
      {lines.map((l) => (
        <li key={l}>· {l}</li>
      ))}
    </ul>
  );
}
