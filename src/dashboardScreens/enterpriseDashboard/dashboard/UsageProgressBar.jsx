import React from "react";
import { ProgressBar } from "../../../common/ProgressLine";
import { barUsage } from "../../../../dummyData";
const UsageProgressBar = () => {
  return (
    <>
      <div className="w-full mt-7">
        <div className="p-7 space-y-7 global-bg-color box-shadow rounded-xl">
          {barUsage.map((item) => (
            <>
              <div key={item.id} className="justify-between flex">
                <h1 className="font-vivita font-medium text-sm ">
                  {item.usageDuration} Usage
                </h1>
                <div className="text-[#0060A9] flex flex-col justify-between text-lg font-vivita font-medium">
                  <h1>{item.consumption}</h1>
                </div>
              </div>
              <div className="">
                <ProgressBar
                  height="h-4"
                  gradient="linear-gradient(to right, #96f6ae, #2a7bb6)"
                  value={75}
                  max={100}
                  threshold={80}
                />
              </div>
              <div className="flex justify-between">
                <p className="text-[#0060A9] text-lg font-light">
                  {item.connectedDevices} Connected Devices
                </p>
                <h1 className="font-vivita text-[#0060A9] font-medium text-lg">
                  {item.terrif}
                </h1>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default UsageProgressBar;
