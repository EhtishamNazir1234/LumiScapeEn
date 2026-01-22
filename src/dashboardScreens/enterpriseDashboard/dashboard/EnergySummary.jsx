import React from "react";
import { EnterpriseDashboardEnergyStats } from "../../../../dummyData";

const Energysummary = () => {
  return (
    <div className="flex w-full gap-x-7 ">
      {EnterpriseDashboardEnergyStats.map((item) => (
        <div className="mt-7 w-full" key={item.id}>
          <div className=" p-7 global-bg-color box-shadow rounded-xl">
            <h1 className="font-vivita mb-2 font-medium text-center text-[#0060A9] text-xl ">
              {item.title}
            </h1>
            <p className="text-center font-light">{item.subheading}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Energysummary;
