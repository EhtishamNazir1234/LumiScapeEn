import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeviceManagementTable from "./DeviceManagementTable";
import Analytics from "./Analytics";
import DeviceFilterBar from "./DeviceFilterBar";

const DeviceManagement = () => {
  const navigate = useNavigate();
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const handleCloseFilterBar = () => {
    setFilterCategory("");
    setFilterStatus("");
    setIsFilterBarOpen(false);
  };

  return (
    <div className="flex py-3">
      <div
        className={`space-y-5 ${isFilterBarOpen ? "w-[82%]" : "w-full"} transition-[width] duration-200`}
      >
        <div className="flex flex-col w-40 md:w-full sm:flex-row justify-between whitespace-nowrap mb-5 gap-3">
          <h1 className="font-vivita text-2xl font-medium">Device Management</h1>
          <div className="flex justify-end md:w-[25%] w-full">
            <button
              onClick={() => navigate("/add-device")}
              className="custom-shadow-button font-vivita whitespace-nowrap !py-3 !px-6 md:!w-full !w-[50%]"
            >
              Add New Device
            </button>
          </div>
        </div>
        <div className="flex gap-x-6 max-md:flex-col">
          <Analytics />
        </div>
        <DeviceManagementTable
          isFilterBarOpen={isFilterBarOpen}
          setIsFilterBarOpen={setIsFilterBarOpen}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
      </div>
      {isFilterBarOpen && (
        <DeviceFilterBar
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          onClose={handleCloseFilterBar}
        />
      )}
    </div>
  );
};

export default DeviceManagement;
