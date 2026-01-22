import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { graphData } from "../../dummyData";

const DeviceManagementSocketGraph = () => {
  const barKeys = Object.keys(graphData[0]).filter((key) => key !== "week");
  
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
          ticks={[0, 100, 500, 1000, 1500]}
          tickFormatter={(v) => `${v} Kwh`}
        />
        {/* <Tooltip
          contentStyle={{
            background: "transparent",
            border: "none",
            boxShadow: "none",
          }}
        /> */}
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
