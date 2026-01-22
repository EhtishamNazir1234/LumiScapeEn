import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
const AnalyticsGraph = ({
  data,
  areaKeys,
  areaColors,
  xAxisKey,
  roundedMax,
  ticks,
  height = 260,
}) => {
  return (
    <div className="mt-15 md:mt-0">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ left: -20 }}>
          <defs>
            {areaKeys.map((key, idx) => (
              <linearGradient
                key={key}
                id={`color${key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                {idx === 0 ? (
                  <>
                    <stop offset="0%" stopColor="#9FFFAE" stopOpacity={1} />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                  </>
                ) : (
                  <>
                    <stop offset="0%" stopColor="#2A7BB6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#96F6AE" stopOpacity={0.5} />
                  </>
                )}
              </linearGradient>
            ))}
          </defs>
          <XAxis
            dataKey={xAxisKey}
            padding={{ left: 15, right: 15 }}
            tick={{ fontFamily: "Geom", fontSize: 16, fill: areaColors[0] }}
            axisLine={{ stroke: "#669FCB", strokeWidth: 1 }}
            tickLine={true}
          />
          <YAxis
            tick={{
              fontFamily: "Geom, sans-serif",
              fontSize: 14,
              fill: "#669FCB",
            }}
            padding={{ top: 20, bottom: 20 }}
            axisLine={{ stroke: "#669FCB", strokeWidth: 1 }}
            tickLine={false}
            domain={[0, roundedMax]}
            ticks={ticks}
          />
          {areaKeys.map((key) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke="none"
              fill={`url(#color${key})`}
              strokeWidth={5}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
export default AnalyticsGraph;
