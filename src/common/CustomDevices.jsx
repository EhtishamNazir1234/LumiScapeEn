import React from "react";
import { DeviceSwitchIcon } from "../assets/icon";

const CustomDevices = ({ data }) => {
  return (
    <>
      {data.map((item) => (
        <div
          key={item.id}
          className="bg-white box-shadow-outer flex w-[100%] rounded-xl p-7 items-center h-36"
        >
          <div className="">
            <DeviceSwitchIcon />
            <div className="flex ml-5 flex-col">
              <h3 className="font-light text-[#0060A9] text-sm">
                {item.device}
              </h3>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CustomDevices;
