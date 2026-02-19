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
 * Builds scatter data for a single card (one metric): 4 points with slight variation for visual.
 * @param {number} value - Count for this metric
 * @returns {{ x: number, y: number, z: number }[]}
 */
const buildCardScatterData = (value = 0) => {
  const v = Math.max(Number(value) || 0, 1);
  return [
    { x: 1, y: v, z: Math.max(v * 0.3, 20) },
    { x: 2, y: v * 0.92, z: Math.max(v * 0.28, 20) },
    { x: 3, y: v * 0.97, z: Math.max(v * 0.29, 20) },
    { x: 4, y: v * 1.05, z: Math.max(v * 0.31, 20) },
  ];
};

/**
 * Small scatter chart for one ticket stat card. Pass value (count) and color (hex).
 */
const TicketScatterChart = ({ value = 0, color = "#2A7BB6" }) => {
  const data = buildCardScatterData(value);

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
