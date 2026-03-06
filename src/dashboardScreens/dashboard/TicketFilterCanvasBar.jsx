import React from "react";
import { RxCross2 } from "react-icons/rx";
import ToggleSwitch from "../../common/ToggleSwitch";

const TICKET_STATUSES = ["New", "In Progress", "Resolved", "Unresolved"];

const TicketFilterCanvasBar = ({ statusFilters, setStatusFilters, onClose }) => {
  const handleStatusChange = (status, checked) => {
    if (!setStatusFilters) return;

    setStatusFilters((prev = []) => {
      if (checked) {
        if (prev.includes(status)) return prev;
        return [...prev, status];
      }
      return prev.filter((s) => s !== status);
    });
  };

  const clearFilters = () => {
    setStatusFilters([]);
  };

  const isChecked = (status) => statusFilters?.includes(status);

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
            {TICKET_STATUSES.map((status) => (
              <ToggleSwitch
                key={status}
                label={status}
                checked={isChecked(status)}
                onChange={(checked) => handleStatusChange(status, checked)}
              />
            ))}
          </div>
        </div>

        <div className="!space-y-7">
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-[#0060A9] underline"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketFilterCanvasBar;

