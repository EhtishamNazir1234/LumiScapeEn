import React from "react";
import { faqs } from "../../../../dummyData";
const FAQs = () => {
  return (
    <div className="w-[80%]  box-shadow flex-1 global-bg-color rounded-3xl ">
      <div className="p-7 space-y-5">
        {faqs.map((item) => (
          <div
            key={item.id}
            className="w-full space-y-5 p-5 pl-7 pt-7 bg-[#E1ECF6] shadow-[2px_2px_5px_rgba(0,0,0,0.2)] rounded-3xl"
          >
            <div className="">
              <h2 className="font-vivita font-medium text-black ">
                {item.question}
              </h2>
            </div>

            <p className="text-[#7B7879] tracking-tighter font-vivita font-light">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
