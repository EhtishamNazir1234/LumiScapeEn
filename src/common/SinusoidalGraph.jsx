import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Sinusoidal = ({ data }) => {
  const renderCustomDot = (props) => {
    const { cx, cy, payload, index } = props;
    if (index !== data.length - 1) return null;
    return (
      <>
        <defs>
          <linearGradient
            id="circleGradient"
            gradientUnits="userSpaceOnUse"
            x1="10%"
            y1="10%"
            x2="100%"
            y2="10%"
          >
            <stop offset="30%" stopColor="#2A7BB6" />
            <stop offset="70%" stopColor="#96F6AE" />
          </linearGradient>
        </defs>
        <circle
          cx={cx}
          cy={cy}
          r={8}
          fill="url(#circleGradient)"
          stroke="url(#circleGradient)"
          strokeWidth={4}
        />
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill="#0161A8"
          stroke="#0161A8"
          strokeWidth={1}
        />
      </>
    );
  };

  return (
    <ResponsiveContainer>
      <LineChart data={data}>
        <CartesianGrid stroke="global-bg-color" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#0161A8"
          strokeWidth={10}
          dot={renderCustomDot}
          strokeLinecap="round"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Sinusoidal;
