import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { graphData as defaultGraphData } from "../../dummyData";

const DeviceManagementSocketGraph = ({ data: dataProp, selectedTime, selectedDeviceName }) => {
  const graphData = dataProp && dataProp.length > 0 ? dataProp : defaultGraphData;
  const firstRow = graphData[0] || {};
  const barKeys = Object.keys(firstRow).filter((key) => key !== "week");

  const allValues = graphData.flatMap((row) =>
    barKeys.map((k) => (typeof row[k] === "number" ? row[k] : 0))
  );
  const maxVal = allValues.length ? Math.max(...allValues) : 1500;
  const step = maxVal <= 500 ? 100 : maxVal <= 2000 ? 500 : 1000;
  const topTick = Math.ceil(maxVal / step) * step;
  const ticks = [0, ...Array.from({ length: Math.ceil(topTick / step) }, (_, i) => (i + 1) * step)].filter(
    (t) => t <= topTick + step
  );

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={graphData} barCategoryGap={12} barGap={2}>
        <CartesianGrid vertical={false} horizontal={false} />
        <XAxis
          dataKey="week"
          axisLine={{ stroke: "#669FCB", strokeWidth: 0 }}
          tickLine={false}
          tick={{ fill: "#0060A9", fontFamily: "Vivita", fontSize: 16 }}
        />
        <YAxis
          axisLine={{ stroke: "#669FCB", strokeWidth: 0 }}
          tickLine={false}
          tick={{ fill: "#669FCB", fontFamily: "Vivita", fontSize: 16 }}
          ticks={ticks.length ? ticks : [0, 100, 500, 1000, 1500]}
          tickFormatter={(v) => `${v} kWh`}
        />
        {barKeys.map((key) => (
          <Bar
            key={key}
            dataKey={key}
            fill="#669FCB"
            radius={[8, 8, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DeviceManagementSocketGraph;
