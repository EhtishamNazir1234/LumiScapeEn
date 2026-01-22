import React from "react";
import Consumptions from "./Consumptions";
import ActionsAndDeviceCategories from "./ActionsAndDeviceCategories";
const Index = () => {
  return (
      <div className="flex mt-4 gap-x-4">
        <div className="w-[65%]">
          <Consumptions />
        </div>
        <div className="w-[35%]">
          <ActionsAndDeviceCategories />
        </div>
      </div>
  );
};

export default Index;
