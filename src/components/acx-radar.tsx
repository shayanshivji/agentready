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
          <defs>
            <linearGradient id="acx-radar-fill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#7c5cff" stopOpacity={0.35} />
            </linearGradient>
          </defs>
          <PolarGrid stroke="#8ca5dc" strokeOpacity={0.18} />
          <PolarAngleAxis
            dataKey="short"
            tick={{ fontSize: 12, fill: "#94a3c4", fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "#5e6b8c" }}
            stroke="#8ca5dc"
            strokeOpacity={0.18}
          />
          <Radar
            name="Score"
            dataKey="pct"
            stroke="#22d3ee"
            strokeWidth={2}
            fill="url(#acx-radar-fill)"
            fillOpacity={1}
            isAnimationActive
            animationDuration={700}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
