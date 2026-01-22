import React from "react";
import { ConsumingDeviceSwitchesIcon } from "../../../assets/icon";
import ToggleSwitch from "../../../common/ToggleSwitch";
import { ProgressBar } from "../../../common/ProgressLine";
import { consumingDevices } from "../../../../dummyData";

const ConsumingDeviceSwitches = () => {
  return (
    <>
      <div className="p-6 py-10 w-full global-bg-color rounded-lg box-shadow ">
        <h2 className="text-xl font-vivita font-medium text-black mb-4">
          Top Consuming Areas
        </h2>
        {consumingDevices.length > 0 &&
          consumingDevices.map((device) => (
            <div
              key={device.id}
              className="items-center flex box-shadow-outer space-x-3 justify-between p-4 bg-white rounded-xl shadow-sm mb-4"
            >
              <div className="relative bottom-3 box-shadow-outer p-3 rounded-xl">
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                <ConsumingDeviceSwitchesIcon />
              </div>

              <div className="w-full space-y-1">
                <div className="flex  items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                      <h3 className="font-medium whitespace-nowrap font-vivita text-[#4F4B4C]">
                        {device.name}
                      </h3>
                      <p className="text-sm">
                        <span className="text-[#0060A9] font-light">
                          {device.usage}
                        </span>
                      </p>
                    </div>
                  </div>
                  <ToggleSwitch />
                </div>
                <ProgressBar value={device.progress} max={100} threshold={70} />
                <div className="flex justify-between space-x-2 mt-1">
                  <p className="text-lg font-semibold text-[#0060A9]">
                    {device.cost}
                  </p>
                  <div className="flex items-center text-xs font-vivita text-black">
                    <span>Time logged:</span>
                    <span className="ml-1 text-[#0060A9]">{device.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        <div className="text-center ">
          <a className="text-[#0060A9] cursor-pointer font-light ">View all</a>
        </div>
      </div>
    </>
  );
};

export default ConsumingDeviceSwitches;
