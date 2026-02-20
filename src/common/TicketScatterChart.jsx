import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/**
 * Builds scatter data for a single card (one metric).
 * Number of dots scales with value relative to maxValue:
 * - highest value → 3 dots
 * - mid values   → 2 dots
 * - lowest       → 1 dot
 * If value is 0, no dots are shown.
 *
 * @param {number} value - Count for this metric
 * @param {number} maxValue - Maximum count across all metrics
 * @returns {{ x: number, y: number, z: number }[]}
 */
const buildCardScatterData = (value = 0, maxValue = 0) => {
  const v = Number(value) || 0;
  const max = Number(maxValue) || 0;
  if (v <= 0 || max <= 0) return [];

  const ratio = v / max;
  let dots = Math.round(ratio * 3);
  dots = Math.max(1, Math.min(3, dots));

  const points = [];
  for (let i = 1; i <= dots; i += 1) {
    // slight jitter around the base value so dots don't overlap perfectly
    const jitter = (i - (dots + 1) / 2) * (v * 0.02);
    points.push({
      x: i,
      y: v + jitter,
      z: 20 + i * 4,
    });
  }
  return points;
};

/**
 * Small scatter chart for one ticket stat card.
 * - value: count for this card
 * - maxValue: max count across all cards (for scaling dot count)
 * - color: bubble color
 */
const TicketScatterChart = ({ value = 0, maxValue = 0, color = "#2A7BB6" }) => {
  const data = buildCardScatterData(value, maxValue);

  return (
    <ResponsiveContainer width="100%" height={130}>
      <ScatterChart
        margin={{ top: 8, right: 8, bottom: 0, left: -20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis type="number" dataKey="x" hide />
        <YAxis type="number" dataKey="y" hide />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="bg-white border border-gray-200 rounded shadow px-2 py-1 text-xs">
                Count: {payload[0]?.payload?.y}
              </div>
            );
          }}
        />
        <Scatter
          data={data}
          fill={color}
          fillOpacity={0.8}
          activeShape={{ fill: color, stroke: "#333" }}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default TicketScatterChart;
export { buildCardScatterData };
