import React from "react";
import { RxCross2 } from "react-icons/rx";
import SelectField from "../../common/SelectField";

const CATEGORY_OPTIONS = [
  { value: "", label: "All categories" },
  { value: "Switch", label: "Switch" },
  { value: "Sensor", label: "Sensor" },
  { value: "Energy", label: "Energy" },
  { value: "Lighting", label: "Lighting" },
  { value: "Other", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "Online", label: "Online" },
  { value: "Offline", label: "Offline" },
  { value: "Maintenance", label: "Maintenance" },
];

const DeviceFilterBar = ({
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
  onClose,
}) => {
  return (
    <div className="bg-[#EFF5F9] top-0 right-0 absolute w-[60%] md:w-[18%] min-h-screen z-50 box-shadow">
      <div className="flex justify-end my-5 mx-3">
        <button
          type="button"
          className="text-2xl cursor-pointer text-gray-600"
          onClick={onClose}
          aria-label="Close filters"
        >
          <RxCross2 />
        </button>
      </div>
      <div className="my-5 lg:px-7 p-3 px-4">
        <h1 className="font-vivita font-medium text-[20px] mb-6">Filters</h1>
        <div className="space-y-6">
          <SelectField
            id="filter-category"
            label="Category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            options={CATEGORY_OPTIONS}
          />
          <SelectField
            id="filter-status"
            label="Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>
    </div>
  );
};

export default DeviceFilterBar;
