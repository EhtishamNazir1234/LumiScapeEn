import React from "react";
import { PowerIcon } from "../assets/icon";
import ToggleSwitch from "./ToggleSwitch";

const OnOffDevices = ({ data }) => {
  return (
    <>
      {data.map((item) => (
        <div key={item.id} className="w-full">
          <div className="bg-white box-shadow-outer flex w-[100%] rounded-xl p-7 items-center h-36">
            <div className="-ml-4 mb-8">
              <PowerIcon size={35} />
            </div>
            <div className="flex ml-5 flex-col">
              <h3 className="font-light text-sm">{item.action}</h3>
              <div className="mr-12">
                <ToggleSwitch />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default OnOffDevices;
