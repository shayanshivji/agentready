"use client";

import { motion } from "framer-motion";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

import { DimensionState } from "@/lib/use-scan-stream";
import { DIMENSIONS } from "@/lib/dimensions";

type Props = {
  dimensions: DimensionState[];
  height?: number;
};

/**
 * 8-axis radar chart that animates as dimensions arrive over WebSocket.
 *
 * The radius is normalised to 100% of the dimension's max sub-criterion total
 * (so all axes are commensurable visually) but the tooltip / cards keep raw
 * scores.
 */
export function AcxRadar({ dimensions, height = 360 }: Props) {
  const byCode = new Map(dimensions.map((d) => [d.code, d]));

  const data = DIMENSIONS.map((meta) => {
    const dim = byCode.get(meta.code);
    const pct = dim ? Math.round((dim.raw / dim.max) * 100) : 0;
    return {
      code: meta.code,
      short: meta.short,
      pct,
      raw: dim?.raw ?? 0,
      max: dim?.max ?? 0,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{ width: "100%", height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="80%">
          <PolarGrid stroke="#cbd5e1" strokeOpacity={0.6} />
          <PolarAngleAxis
            dataKey="short"
            tick={{ fontSize: 12, fill: "#475569", fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            stroke="#e2e8f0"
          />
          <Radar
            name="Score"
            dataKey="pct"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.28}
            isAnimationActive
            animationDuration={700}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
