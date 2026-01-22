import React from "react";
import { troubleshootingData } from "../../../../dummyData";
const TroubleShootingGuides = () => {
  return (
    <div className="w-[80%] box-shadow flex-1 global-bg-color rounded-3xl ">
      <div className="p-7 space-y-5">
        {troubleshootingData.map((item) => (
          <div
            key={item.id}
            className="w-full space-y-3 tracking-tighter p-5 pl-7 bg-[#E1ECF6] shadow-[2px_2px_5px_rgba(0,0,0,0.2)] rounded-3xl"
          >
            <div>
              <h2 className="font-vivita font-medium text-black">
                {item.title}
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 ">
              <h3 className="text-[#337FBA] font-vivita font-medium">
                {item.subheading}:
              </h3>
              <ul className=" text-[#7B7879] font-vivita font-light">
                {item.steps.map((step, index) => (
                  <li key={index} className="list-disc ml-5">
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TroubleShootingGuides;
