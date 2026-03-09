import React, { useEffect, useMemo, useState } from "react";
import AnalyticsGraph from "../../common/AnalyticsGraph";
import basicColor from "../../assets/basicColor.svg";
import standardColor from "../../assets/standardColor.svg";
import ActiveInactiveCard from "../dashboard/Active-InactiveCard";
import LowPerformingDeviceCard from "./LowPerformingDeviceCard";
import TopUsedDevices from "./PieGraph";
import { devices } from "../../../dummyData";
import { analyticsService } from "../../services/analytics.service";

const AREA_KEYS = ["managers", "endUsers"];
const AREA_LABELS = ["Managers", "End Users"];
const AREA_COLORS = ["#9FFFAE", "#2A7BB6"];

const Analytics = () => {
  const [chartData, setChartData] = useState([]);
  const [legendValues, setLegendValues] = useState([0, 0]);

  useEffect(() => {
    let isMounted = true;

    const loadSystemAnalytics = async () => {
      try {
        const data = await analyticsService.getSystem();
        if (!isMounted || !data) return;

        const userActivity = Array.isArray(data.userActivityOverTime)
          ? data.userActivityOverTime
          : [];

        const mappedChartData =
          userActivity.length > 0
            ? userActivity.map((row, idx) => ({
                name: row.name || `Week ${idx + 1}`,
                managers: row.managers ?? 0,
                endUsers: row.endUsers ?? 0,
              }))
            : [
                { name: "Week 1", managers: 0, endUsers: 0 },
                { name: "Week 2", managers: 0, endUsers: 0 },
                { name: "Week 3", managers: 0, endUsers: 0 },
                { name: "Week 4", managers: 0, endUsers: 0 },
              ];

        const userRoles = Array.isArray(data.userRoles) ? data.userRoles : [];
        const managersTotal = userRoles
          .filter((r) => r._id === "super-admin" || r._id === "admin")
          .reduce((sum, r) => sum + (r.count || 0), 0);
        const endUsersTotal = userRoles
          .filter((r) => r._id === "end-user" || r._id === "enterprise")
          .reduce((sum, r) => sum + (r.count || 0), 0);

        setChartData(mappedChartData);
        setLegendValues([managersTotal, endUsersTotal]);
      } catch (err) {
        console.error("Error fetching system analytics:", err);
        if (!isMounted) return;
        setChartData([
          { name: "Week 1", managers: 0, endUsers: 0 },
          { name: "Week 2", managers: 0, endUsers: 0 },
          { name: "Week 3", managers: 0, endUsers: 0 },
          { name: "Week 4", managers: 0, endUsers: 0 },
        ]);
        setLegendValues([0, 0]);
      }
    };

    loadSystemAnalytics();

    return () => {
      isMounted = false;
    };
  }, []);

  const { roundedMax, ticks } = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return { roundedMax: 100, ticks: [0, 25, 50, 75, 100] };
    }

    const maxValue = Math.max(
      ...chartData.flatMap((d) => AREA_KEYS.map((key) => d[key] || 0))
    );

    let step = 100;
    if (maxValue <= 200) step = 50;
    else if (maxValue <= 1000) step = 100;
    else if (maxValue <= 3000) step = 500;
    else step = 1000;

    const computedMax = Math.max(step, Math.ceil(maxValue / step) * step);
    const ticks = Array.from(
      { length: Math.ceil(computedMax / step) + 1 },
      (_, i) => i * step
    );

    return { roundedMax: computedMax, ticks };
  }, [chartData]);

  return (
    <>
      <div className="flex xl:flex-row flex-col gap-x-4">
        <div className="global-bg-color mb-6 w-full box-shadow rounded-2xl p-6">
          <div className="font-vivita font-medium text-sm ">
            User Activity Over Time
          </div>
          <div className="-mt-8">
            <div className="flex md:justify-end justify-start md:mr-7 -mt-4">
              <div className="flex-col relative top-10 ">
                {AREA_LABELS.map((label, idx) => (
                  <div key={label} className="flex items-center gap-2">
                    {idx === 0 && (
                      <img
                        src={basicColor}
                        alt="Managers color"
                        className="w-4 inline-block rounded"
                      />
                    )}
                    {idx === 1 && (
                      <img
                        src={standardColor}
                        alt="End Users color"
                        className="w-4 inline-block rounded"
                      />
                    )}
                    <span className="font-light text-[#2A7BB6]">{label}</span>
                    <span
                      className={`mx-2 inline-block h-0.5 rounded ${
                        idx === 1 ? "w-10" : "w-8"
                      }`}
                      style={{
                        backgroundColor: AREA_COLORS[idx],
                      }}
                    />
                    <span className="font-light text-[#2A7BB6]">
                      {legendValues[idx]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <AnalyticsGraph
              data={chartData}
              areaKeys={AREA_KEYS}
              areaColors={AREA_COLORS}
              xAxisKey="name"
              roundedMax={roundedMax}
              ticks={ticks}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-x-4">
          <div className="space-y-4">
            <ActiveInactiveCard
              title="Users"
              data={{ active: 2235, inactive: 583 }}
              totalLabel="Total Users"
              activeLabel="Active Users"
              inactiveLabel="Inactive Users"
            />
            <LowPerformingDeviceCard
              data={{
                deviceName: "Smart Thermostat",
                userCount: 0,
                message: "Users this month.",
              }}
            />
          </div>
          <TopUsedDevices devicesData={devices} />
        </div>
      </div>
    </>
  );
};
export default Analytics;
