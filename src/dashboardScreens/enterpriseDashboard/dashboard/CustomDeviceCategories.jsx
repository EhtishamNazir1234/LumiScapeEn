import React from "react";
import { PlusIcon } from "../../../assets/icon";
import CustomDevices from "../../../common/CustomDevices";
import { deviceCategories } from "../../../../dummyData";

const CustomDeviceCategories = () => {
  return (
    <div className="p-7 global-bg-color box-shadow rounded-xl">
      <div className="flex mb-8 justify-between">
        <h1 className="font-vivita font-medium">Custom Device Categories</h1>
        <PlusIcon color="#0060A9" />
      </div>
      <div className="gap-y-6 gap-4 grid grid-cols-2">
        <CustomDevices data={deviceCategories} />
      </div>
    </div>
  );
};

export default CustomDeviceCategories;
