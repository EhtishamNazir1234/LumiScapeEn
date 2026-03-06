import React, { useState } from "react";
import TicketsAndComplain from "./TicketsAndComplain";
import SearchField from "../../common/SearchField";
import Filters from "../../common/Filters";
import RecentDeviceAlerts from "./RecentDeviceAlerts";
import DashboardAnalytics from "./Analytics";
import TicketFilterCanvasBar from "./TicketFilterCanvasBar";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("tickets/Complaints");
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState([]);

  return (
    <div className="flex py-3">
      <div
        className={`space-y-5 ${
          activeTab === "tickets/Complaints" && isFilterBarOpen
            ? "w-[82%]"
            : "w-full"
        }`}
      >
        <div>
          <DashboardAnalytics />
        </div>

        <div className="relative global-bg-color rounded-[20px] p-7 box-shadow">
          <div className="w-full flex xl:flex-row flex-col items-center gap-3">
            <div className="box-shadow flex-1 flex p-2 rounded-xl xl:w-[35%] w-full gap-4 box-shadow">
              <button
                className={`flex-1 py-[4px] font-light box-shadow cursor-pointer rounded-lg lg:text-base text-sm ${
                  activeTab === "tickets/Complaints"
                    ? "bg-[#337FBA] text-white"
                    : ""
                }`}
                onClick={() => setActiveTab("tickets/Complaints")}
              >
                Tickets/Complaints
              </button>
              <button
                data-tip="This is a tooltip!"
                className={`flex-1 py-[4px] box-shadow font-light cursor-pointer lg:text-base text-sm rounded-lg ${
                  activeTab === "deviceAlerts"
                    ? "bg-[#337FBA] text-white"
                    : ""
                }`}
                onClick={() => setActiveTab("deviceAlerts")}
              >
                Recent Device alerts
              </button>
            </div>
            <div className="flex gap-3 xl:w-[65%] w-full mt-3 md:mt-0">
              <SearchField
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Filters onClick={() => setIsFilterBarOpen(!isFilterBarOpen)} />
            </div>
          </div>

          {activeTab === "tickets/Complaints" ? (
            <TicketsAndComplain
              searchQuery={searchQuery}
              statusFilters={statusFilters}
            />
          ) : (
            <RecentDeviceAlerts />
          )}
        </div>
      </div>

      {activeTab === "tickets/Complaints" && isFilterBarOpen && (
        <TicketFilterCanvasBar
          statusFilters={statusFilters}
          setStatusFilters={setStatusFilters}
          onClose={() => setIsFilterBarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
