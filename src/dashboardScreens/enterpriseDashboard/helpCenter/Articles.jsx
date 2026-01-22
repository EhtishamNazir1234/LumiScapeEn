import React from "react";
import { articleCards } from "../../../../dummyData";
const Articles = () => {
  return (
    <div className="w-full p-4 md:p-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-7">
        {articleCards.map((card) => (
          <div key={card.id} className="global-bg-color rounded-2xl">
            <div className="w-full">
              <img
                src={card.image || "cover Image"}
                alt={card.title}
                className="w-full rounded-t-2xl h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col h-full">
              <h3 className="text-medium text-center xl:whitespace-nowrap font-medium font-vivita text-black mb-3 leading-tight">
                {card.title}
              </h3>
              <p className="text-sm text-center text-[#7B7879] mb-4 ">
                {card.description}
              </p>
              <div className="flex justify-center">
                <button className="text-[#337FBA] font-vivita font-medium text-sm">
                  Read more...
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Articles;
