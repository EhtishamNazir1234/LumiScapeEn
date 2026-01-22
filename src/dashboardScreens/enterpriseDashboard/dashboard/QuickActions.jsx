import React from "react";
import { PlusIcon } from "../../../assets/icon";
import OnOffDevices from "../../../common/OnOffDevices";
import { deviceActions } from "../../../../dummyData";

const QuickActions = () => {
  return (
    <div className="p-7 py-14 global-bg-color box-shadow rounded-xl">
      <div className="flex mb-8 justify-between">
        <h1 className="font-vivita font-medium">Quick Actions</h1>
        <PlusIcon color="#0060A9" />
      </div>
      <div className="py-4 gap-y-6 gap-4 grid grid-cols-2">
        <OnOffDevices data={deviceActions} />
      </div>
    </div>
  );
};

export default QuickActions;
