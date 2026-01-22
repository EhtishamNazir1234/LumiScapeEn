import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const LineChartComponent = ({ data, color="#0161A8", strokeWidth = 10 }) => {

const renderCustomDot = (props) => {
    const { cx, cy, payload, index } = props;
    if (index !== data.length - 1) return null;
    return (
      <>
        <defs>
          <linearGradient id="circleGradient" gradientUnits="userSpaceOnUse" x1="10%" y1="10%" x2="100%" y2="10%">
            <stop offset="30%" stopColor="#2A7BB6" />
            <stop offset="70%" stopColor="#96F6AE" />
          </linearGradient>
        </defs>
  
        <circle cx={cx} cy={cy} r={8} fill="url(#circleGradient)" stroke="url(#circleGradient)" strokeWidth={4} />
        <circle cx={cx} cy={cy} r={4} fill="#0161A8" stroke="#0161A8" strokeWidth={1} />
      </>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="week" stroke="#669FCB" tick={{ fill: "#669FCB" }} />
        <YAxis stroke="#669FCB" tick={{ fill: "#669FCB" }} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke={color}
          strokeWidth={strokeWidth}
          dot={renderCustomDot}
          strokeLinecap="round"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
