import React, { useState } from "react";
import total from "../../assets/total.svg";
import standardColor from "../../assets/standardColor.svg";
import basicColor from "../../assets/basicColor.svg";
import DeviceManagemenyGraph from "../../common/RechartSlideGraph";
import DeviceManagementSocketGraph from "../../common/RechartSocketGraph";
import CustomDropdown from "../../common/custom-dropdown";
import { timeOptions } from "../../../dummyData";
import { deviceOptions } from "../../../dummyData";

const Analytics = () => {
  const [selectedTime, setSelectedTime] = useState("This Month");
  const [selectedDevice, setSelectedDevice] = useState("");
  const handleTimeChange = (value, dateData) => {
    setSelectedTime(value);
    if (value === "Date Range" && dateData) {
      console.log("Date Range Selected:", dateData);
    }
  };
  return (
    <div className="w-full flex max-md:flex-col gap-4">
      <div className="w-[50%] max-md:w-full">
        <div className="global-bg-color mb-6 max-md:mb-4 box-shadow rounded-2xl p-4 sm:p-5 md:p-6 ">
          <h2 className="font-vivita font-medium text-lg  mb-1">
            Lumiscape Devices
          </h2>
          <p className="text-[#0060A9] font-Geom text-sm sm:text-base mb-4 sm:mb-6">
            Total devices increased by 500+ this month
          </p>

          <DeviceManagemenyGraph />

          <div className="pt- sm:mt-8 space-y-2 text-[#0060A9] font-light text-sm sm:text-base">
            <div className="flex items-start sm:items-center gap-2">
              <img
                src={total}
                alt="total"
                className="w-4 h-4 sm:w-auto sm:h-auto"
              />
              <span>85% of Lumiscape devices are currently online.</span>
            </div>

            <div className="flex items-start sm:items-center gap-2">
              <img
                src={basicColor}
                alt="basic"
                className="w-4 h-4 sm:w-auto sm:h-auto"
              />
              <span>Online device ratio stable compared to last month</span>
            </div>

            <div className="flex items-start sm:items-center gap-2">
              <img
                src={standardColor}
                alt="standard"
                className="w-4 h-4 sm:w-auto sm:h-auto"
              />
              <span>
                Only 10% of devices are offline—system running smoothly.
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[50%] max-md:w-full space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <CustomDropdown
              options={deviceOptions}
              placeholder="Choose Device"
              value={selectedDevice}
              onChange={setSelectedDevice}
            />
          </div>
          <div className="flex-1">
            <CustomDropdown
              options={timeOptions}
              placeholder="Select Time Period"
              value={selectedTime}
              onChange={handleTimeChange}
            />
          </div>
        </div>
        <div className="global-bg-color mb-4 box-shadow rounded-2xl p-5 md:p-6">
          <div className="flex justify-between items-center mb-1">
            <h2 className="font-vivita font-medium md:text-xl mb-1">
              Energy Consumption of Smart Sockets
            </h2>
            <span className="text-[#0060A9] font-vivita font-medium text-xl">
              2311
            </span>
          </div>
          <p className="text-[#0060A9] font-Geom text-base mb-6">
            +10% consumption than last month
          </p>
          <DeviceManagementSocketGraph />
        </div>
      </div>
    </div>
  );
};
export default Analytics;
