import React from "react";
import { DeviceSwitchIcon } from "../assets/icon";

const CustomDevices = ({ data }) => {
  const list = Array.isArray(data) ? data : [];

  if (list.length === 0) {
    return (
      <div className="col-span-2 py-8 text-center text-gray-500 text-sm">
        No custom devices yet. Click the + button to add one.
      </div>
    );
  }

  return (
    <>
      {list.map((item, index) => (
        <div
          key={item.id ?? item._id ?? index}
          className="bg-white box-shadow-outer flex w-[100%] rounded-xl p-7 items-center h-36"
        >
          <div className="">
            <DeviceSwitchIcon />
            <div className="flex ml-5 flex-col">
              <h3 className="font-light text-[#0060A9] text-sm">
                {item.device ?? item.name ?? item.type ?? "Custom Device"}
              </h3>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CustomDevices;
