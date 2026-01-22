import React from "react";
import Energysummary from "./Energysummary";
import ConsumingDeviceSwitches from "./ConsumingDeviceSwitches";
import Locations from "./Locations";
import AnalyticsGraph from "../../../common/AnalyticsGraph";
import { chartData, areaKeys, areaColors } from "../../../../dummyData";
import { IoIosClose } from "react-icons/io";

const Consumptions = () => {
  const maxValue = Math.max(
    ...chartData.flatMap((d) => areaKeys.map((key) => d[key]))
  );
  let step = 100;
  if (maxValue <= 200) step = 50;
  else if (maxValue <= 1000) step = 100;
  else if (maxValue <= 3000) step = 500;
  else step = 1000;
  const roundedMax = Math.ceil(maxValue / step) * step;
  const ticks = Array.from(
    { length: Math.ceil(roundedMax / step) + 1 },
    (_, i) => i * step
  );
  return (
    <>
      <div className="rounded-xl w-full py-3 bg-[#0060A9]">
        <h1 className="mx-5 text-white flex justify-between">
          Device #E-209 is using 30% more energy than average.
          <IoIosClose size={30} color="red" />
        </h1>
      </div>
      <Energysummary />
      <div className="flex w-full mt-6 gap-x-4">
        <ConsumingDeviceSwitches />
        <div className="w-[75%]">
          <Locations />
        </div>
      </div>
      <div className="global-bg-color h-[34%] my-7 w-full box-shadow rounded-2xl p-6">
        <div className="space-y-3">
          <h1 className="font-vivita font-medium text-xl ">
            Energy Consumption
          </h1>
          <p className="text-[#0060A9] mb-3">+10% compared to last month</p>
        </div>
        <AnalyticsGraph
          data={chartData}
          areaKeys={areaKeys}
          areaColors={areaColors}
          xAxisKey="name"
          roundedMax={roundedMax}
          ticks={ticks}
        />
      </div>
    </>
  );
};

export default Consumptions;
