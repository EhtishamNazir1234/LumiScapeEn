import React from "react";
import {
  LineChart,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const REVENUE_COLOR = "#0161A9";
const GRID_COLOR = "#669FCB";

const formatRevenue = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    Number.isFinite(value) ? value : 0
  );

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.value;
  return (
    <div className="bg-white border border-[#DEDFE0] rounded-lg shadow-md px-3 py-2 text-sm">
      <div className="text-[#669FCB] font-light">{label}</div>
      <div className="text-[#0060A9] font-semibold">{formatRevenue(value)}</div>
    </div>
  );
};

const RevenueLineChart = ({ data }) => {
  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-[200px] text-[#669FCB] text-sm">
        No revenue data yet. Data updates automatically.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={REVENUE_COLOR} stopOpacity={0.25} />
            <stop offset="100%" stopColor={REVENUE_COLOR} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
        <XAxis
          dataKey="week"
          stroke={GRID_COLOR}
          tick={{ fill: GRID_COLOR, fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: "#e0e0e0" }}
          interval="preserveStartEnd"
        />
        <YAxis
          stroke={GRID_COLOR}
          tick={{ fill: GRID_COLOR, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => (v >= 1000 ? `$${v / 1000}K` : `$${v}`)}
          width={42}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="none"
          fill="url(#revenueAreaFill)"
          fillOpacity={1}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke={REVENUE_COLOR}
          strokeWidth={2.5}
          dot={{ r: 2.5, fill: REVENUE_COLOR, strokeWidth: 0 }}
          activeDot={{ r: 4, fill: REVENUE_COLOR, stroke: "#fff", strokeWidth: 2 }}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default RevenueLineChart;
