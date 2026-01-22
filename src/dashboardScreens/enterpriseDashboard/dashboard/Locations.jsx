import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { locations } from "../../../../dummyData";
const Locations = () => {
  return (
    <div className="w-full space-y-5 ">
      {locations.map((item) => (
        <div
          key={item.id}
          className=" flex justify-between p-7 pb-8 global-bg-color box-shadow rounded-xl"
        >
          <div className="space-y-5">
            <h1 className="font-vivita font-medium text-sm ">
              {item.localCategory}
            </h1>
            <p className="text-[#0060A9] text-lg font-light">
              {item.count} {item.localCategory}
            </p>
          </div>
          <div className="text-[#0060A9] flex flex-col justify-between text-lg font-vivita font-medium">
            <IoIosArrowForward className="ml-14" size={20} />
            <h1>{item.consumptions}</h1>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Locations;
