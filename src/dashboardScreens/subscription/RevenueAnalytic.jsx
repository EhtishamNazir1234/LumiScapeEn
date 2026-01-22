import React, { useState } from "react";
import CircularStatusBar from "../../common/CircularStatusBar";
import LineChartComponent from "../../common/LineChart";
import MonthSelectField from "../../common/MonthSelectField";
import { LineChartData } from "../../../dummyData";

const userData = {
  basic: 208,
  standard: 200,
  premium: 400,
};
const RevenueAnalytic = () => {
  const [selectedOption, setSelectedOption] = useState("Last Month");
  return (
    <div className="lg:flex gap-4 mb-5">
      <div className="lg:w-[72%] h-auto space-y-4 flex flex-col">
        <div className="flex justify-between text-white bg-[#0161A8] py-4 px-8 rounded-[10px]">
          <h1 className="font-vivita">Revenue</h1>
          <h1>$5000</h1>
        </div>
        <div className="w-full box-shadow flex-1  global-bg-color rounded-3xl pr-3">
          <div className="p-2 lg:h-[300px]">
            <div className="p-5 space-y-2">
              <h1 className="font-vivita">Revenue Overview</h1>
              <p className="text-[#669FCB]">
                This month’s revenue saw a 📈 70% boost compared to last month!
                Keep the momentum going!
              </p>
            </div>
            <LineChartComponent data={LineChartData} />
          </div>
        </div>
      </div>
      <div className="space-y-4 flex-1 lg:my-0 my-2">
        <MonthSelectField
          setSelectedOption={setSelectedOption}
          selectedOption={selectedOption}
        />
        <CircularStatusBar data={userData} />
      </div>
    </div>
  );
};

export default RevenueAnalytic;
