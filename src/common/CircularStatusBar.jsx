import { useState, useEffect } from "react";
import total from "../assets/total.svg";
import basicColor from "../assets/basicColor.svg";
import primiumColor from "../assets/primiumColor.svg";
import standardColor from "../assets/standardColor.svg";
const CircularStatusBar = ({ data }) => {
  const [transformData, setTransformData] = useState([]);

  const totalUsers = data.basic + data.standard + data.premium;
  // Calculate percentages for the donut chart
  const basicPercentage = (data.basic / totalUsers) * 100;
  const standardPercentage = (data.standard / totalUsers) * 100;
  const premiumPercentage = (data.premium / totalUsers) * 100;

  // SVG circle properties
  const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 20;

  // Calculate stroke dash arrays for each segment
  const basicDashArray = (basicPercentage / 100) * circumference;
  const standardDashArray = (standardPercentage / 100) * circumference;
  const premiumDashArray = (premiumPercentage / 100) * circumference;

  useEffect(() => {
    const colorMapping = {
      basic: "#0360A9",
      standard: "#9FFFAE",
      premium: "#9ca3af",
    };

    const imageMapping = {
      basic: basicColor,
      standard: standardColor,
      premium: primiumColor,
    };

    let arr = Object.keys(data).map((key) => ({
      name: key,
      value: data[key],
      color: colorMapping[key],
      image: imageMapping[key],
    }));

    setTransformData(arr);
  }, [data]);

  return (
    <div
      className="rounded-3xl w-full p-5 global-bg-color box-shadow"
    >
      <h1 className="font-vivita my-2 font-[500]">Active Subscriptions</h1>
      <div className="flex gap-3">
        <img src={total} alt="image" />
        <span className="text-[#0060A9] text-[15px]">Total Users : {totalUsers}</span>
      </div>

      <div className="flex justify-center my-3">
        <div className="relative">
          <svg width="200" height="200" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              strokeWidth={strokeWidth}
              style={{ filter: "drop-shadow(0 0 5px rgba(0, 0, 0, 0.3))" }}
            />

            {/* Basic Users (Blue) */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#0360A9"
              strokeWidth={strokeWidth}
              strokeDasharray={`${basicDashArray - 30} ${
                circumference - basicDashArray + 50
              }`}
              strokeDashoffset="0"
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{ filter: "drop-shadow(0 0 5px rgba(0, 0, 0, 0.3))" }}
            />

            {/* Standard Users (Green) */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#9FFFAE"
              strokeWidth={strokeWidth}
              strokeDasharray={`${standardDashArray - 30} ${
                circumference - standardDashArray
              }`}
              strokeDashoffset={-basicDashArray}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{ filter: "drop-shadow(0 0 5px rgba(0, 0, 0, 0.3))" }}
            />

            {/* Premium Users (Light Gray) */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#9ca3af"
              strokeWidth={strokeWidth}
              strokeDasharray={`${premiumDashArray - 30} ${
                circumference - premiumDashArray + 30
              }`}
              strokeDashoffset={-(basicDashArray + standardDashArray)}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{ filter: "drop-shadow(0 0 5px rgba(0, 0, 0, 0.3))" }} // Shadow added here
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              
              className="text-2xl font-bold box-shadow  text-white bg-gradient-to-br from-[#9FFFAE] to-[#0360A9] shadow-lg rounded-full w-25 h-25 flex items-center justify-center"
            >
              {totalUsers}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-1">
        {transformData.map((item) => {
          return (
            <div key={item.name} className="flex items-center space-x-2 mx-1 my-2">
              <img src={item.image} alt="image" />
              <span className="#0060A9 text-[14px]">{item.name} users</span>
              <div
                className="flex-grow h-[2px]"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-[14px]">{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CircularStatusBar;
