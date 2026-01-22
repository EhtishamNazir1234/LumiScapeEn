import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { data } from "../../dummyData";


const DeviceManagemenyGraph = () => {
  const xKey = "name";
  const yKey = Object.keys(data[0]).find((key) => key !== "name" && key !== "fill");

  // Max value in the data
  const maxValue = Math.max(...data.map((d) => d[yKey]));

  // Dynamically determine step size based on maxValue
  let step;
  if (maxValue <= 200) step = 50;
  else if (maxValue <= 1000) step = 100;
  else if (maxValue <= 3000) step = 500;
  else step = 1000;

  const roundedMax = Math.ceil(maxValue / step) * step;

  // Generate ticks: 0, step, 2*step, ..., roundedMax
  const ticks = Array.from({ length: Math.ceil(roundedMax / step) + 1 }, (_, i) => i * step);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barSize={140}>
        <defs>
          <linearGradient id="allDevicesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2A7BB6" />
            <stop offset="100%" stopColor="#96F6AE" />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} horizontal={false} />

        <XAxis
          dataKey={xKey}
          axisLine={{ stroke: "#AAB8C2", strokeWidth: 1 }}
          tickLine={false}
          tick={{ fill: "#669FCB", fontFamily: "Geom", fontSize: 14 }}
        />

        <YAxis
          axisLine={{ stroke: "#AAB8C2", strokeWidth: 1 }}
          tickLine={false}
          tick={{ fill: "#669FCB", fontFamily: "Geom", fontSize: 14 }}
          ticks={ticks}
        />

        <Tooltip cursor={false} />

        <Bar dataKey={yKey} radius={[0, 0, 0, 0]}>
          {data.map((entry, index) => (
            <cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DeviceManagemenyGraph;
