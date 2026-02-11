import React from "react";
import ToggleSwitch from "../../common/ToggleSwitch";
import { RxCross2 } from "react-icons/rx";

const FilterCanvasBar = ({
  activeTab,
  statusFilters,
  setStatusFilters,
  planFilters,
  setPlanFilters,
  showArchived,
  setShowArchived,
  onClose,
}) => {
  const handleStatusChange = (key, checked) => {
    if (!setStatusFilters) return;
    setStatusFilters((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  const handlePlanChange = (key, checked) => {
    if (!setPlanFilters) return;
    setPlanFilters((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  const handleArchivedChange = (checked) => {
    if (!setShowArchived) return;
    setShowArchived(checked);
  };

  return (
    <div className="bg-[#EFF5F9] top-0 right-0 absolute w-[60%] md:w-[15%] min-h-screen md:min-h-screen z-50">
      <div className="flex justify-end my-5 mx-3">
        <button
          className="text-2xl cursor-pointer text-gray-600"
          onClick={onClose}
        >
          <RxCross2 />
        </button>
      </div>
      <div className="my-5 lg:px-7 px-4 space-y-10">
        <h1 className="font-vivita font-medium text-[20px]">Filters</h1>

        <div className="!space-y-7">
          <label className="block font-medium font-vivita text-sm text-[#0060A9] mb-2">
            Filter by Status
          </label>
          <div className="space-y-5">
            <ToggleSwitch
              label="Show Inactive"
              checked={statusFilters?.inactive ?? true}
              onChange={(checked) => handleStatusChange("inactive", checked)}
            />
          </div>
        </div>

        {activeTab === "endUsers" && (
          <div className="!space-y-7">
            <label className="block font-medium font-vivita text-sm text-[#0060A9] mb-2">
              Filter by Plan
            </label>
            <div className="space-y-5">
              <ToggleSwitch
                label="Basic"
                checked={planFilters?.Basic ?? false}
                onChange={(checked) => handlePlanChange("Basic", checked)}
              />
              <ToggleSwitch
                label="Standard"
                checked={planFilters?.Standard ?? false}
                onChange={(checked) => handlePlanChange("Standard", checked)}
              />
              <ToggleSwitch
                label="Premium"
                checked={planFilters?.Premium ?? false}
                onChange={(checked) => handlePlanChange("Premium", checked)}
              />
            </div>
          </div>
        )}

        <div className="!space-y-7">
          <label className="block font-medium font-vivita text-sm text-[#0060A9] mb-2">
            Filter by Archived Users
          </label>
          <div>
            <ToggleSwitch
              label="Show Archived"
              checked={showArchived ?? false}
              onChange={handleArchivedChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterCanvasBar;
