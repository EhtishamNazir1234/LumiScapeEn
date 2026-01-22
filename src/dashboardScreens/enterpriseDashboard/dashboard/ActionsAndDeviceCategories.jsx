import React, { useState } from "react";
import { timeOptions } from "../../../../dummyData";
import CustomDropdown from "../../../common/custom-dropdown";
import UsageProgressBar from "./UsageProgressBar";
import QuickActions from "./QuickActions";
import CustomDeviceCategories from "./CustomDeviceCategories";

const ActionsAndDeviceCategories = () => {
  const [selectedTime, setSelectedTime] = useState("This Month");
  const handleTimeChange = (value, dateData) => {
    setSelectedTime(value);
    if (value === "Date Range" && dateData) {
      console.log("Date Range Selected:", dateData);
    }
  };

  return (
    <div className="space-y-5">
      <CustomDropdown
        options={timeOptions}
        value={selectedTime}
        onChange={handleTimeChange}
        rounded
      />
      <UsageProgressBar />
      <QuickActions />
      <CustomDeviceCategories />
    </div>
  );
};

export default ActionsAndDeviceCategories;
