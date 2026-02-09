import React, { useState, useEffect, useMemo } from "react";
import total from "../../assets/total.svg";
import standardColor from "../../assets/standardColor.svg";
import basicColor from "../../assets/basicColor.svg";
import DeviceManagemenyGraph from "../../common/RechartSlideGraph";
import DeviceManagementSocketGraph from "../../common/RechartSocketGraph";
import CustomDropdown from "../../common/custom-dropdown";
import { timeOptions } from "../../../dummyData";
import { deviceService } from "../../services/device.service";

// Normalize time options to { value, label } for dropdown
const TIME_OPTIONS_NORMALIZED = timeOptions.map((t) =>
  typeof t === "string" ? { value: t, label: t } : { value: t.value, label: t.label }
);

// Simple deterministic "random" from seed (so graph doesn't jump on re-render)
function seeded(seed) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Build energy consumption graph data by period and optional base value (from device)
function buildSocketGraphData(period, baseKwh = 1000) {
  const base = Math.max(100, baseKwh);
  const dayKeys = ["day1", "day2", "day3", "day4", "day5", "day6", "day7"];

  const configs = {
    "Last 7 days": { rows: 1, label: "Day" },
    "Last 14 days": { rows: 2, label: "Week" },
    "This Month": { rows: 4, label: "Week" },
    "Last Month": { rows: 4, label: "Week" },
    "Last 3 Month": { rows: 12, label: "Week" },
    "Last 6 Month": { rows: 12, label: "Month" },
    "Last year": { rows: 12, label: "Month" },
    "Date Range": { rows: 4, label: "Week" },
  };
  const config = configs[period] || configs["This Month"];
  const rows = config.rows;
  const labelPrefix = config.label;
  const rand = seeded(Math.round(base) + period.length);

  const data = [];
  for (let i = 0; i < rows; i++) {
    const row = { week: `${labelPrefix} ${i + 1}` };
    dayKeys.forEach((key, j) => {
      const v = (base / rows / 7) * (0.8 + (j % 3) * 0.2);
      row[key] = Math.round(v * (0.7 + rand() * 0.6));
    });
    data.push(row);
  }
  return data;
}

const Analytics = () => {
  const [selectedTime, setSelectedTime] = useState("This Month");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [deviceOptions, setDeviceOptions] = useState([]);
  const [devicesList, setDevicesList] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingDevices, setLoadingDevices] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingDevices(true);
        const res = await deviceService.getAll({ limit: 500 });
        const list = res.devices || res || [];
        setDevicesList(list);
        setDeviceOptions(
          list.map((d) => ({
            value: d._id,
            label: d.name || d.serial || d.deviceId || String(d._id),
          }))
        );
      } catch (err) {
        console.error("Error fetching devices for analytics:", err);
        setDeviceOptions([]);
        setDevicesList([]);
      } finally {
        setLoadingDevices(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingStats(true);
        const res = await deviceService.getStats();
        setStats(res);
      } catch (err) {
        console.error("Error fetching device stats:", err);
        setStats(null);
      } finally {
        setLoadingStats(false);
      }
    };
    load();
  }, []);

  const handleTimeChange = (value, dateData) => {
    setSelectedTime(typeof value === "string" ? value : value?.value ?? "This Month");
    if (value === "Date Range" && dateData) {
      // Could use dateData.startDate/endDate for API later
    }
  };

  // Bar chart data from stats (All / Online / Offline / Maintenance)
  const chartData = useMemo(() => {
    if (!stats) return null;
    const totalDevices = stats.totalDevices ?? 0;
    const online = stats.onlineDevices ?? 0;
    const offline = stats.offlineDevices ?? 0;
    const maintenance = stats.maintenanceDevices ?? 0;
    return [
      { name: "All Lumiscape devices", value: totalDevices, fill: "url(#allDevicesGradient)" },
      { name: "Online devices", value: online, fill: "#669FCB" },
      { name: "Offline devices", value: offline, fill: "#9FFFAE" },
      { name: "Maintenance", value: maintenance, fill: "#AAB8C2" },
    ].filter((d) => d.value > 0 || d.name === "All Lumiscape devices");
  }, [stats]);

  // Selected device's energy total for second chart
  const selectedDeviceRecord = useMemo(() => {
    if (!selectedDevice) return null;
    return devicesList.find((d) => d._id === selectedDevice);
  }, [selectedDevice, devicesList]);

  const baseConsumptionKwh = selectedDeviceRecord?.energyConsumption?.totalUsage
    ?? selectedDeviceRecord?.energyConsumption?.currentUsage
    ?? 1000;

  // Energy graph data: depends on time period and selected device
  const socketGraphData = useMemo(
    () => buildSocketGraphData(selectedTime, baseConsumptionKwh),
    [selectedTime, baseConsumptionKwh]
  );

  const consumptionLabel = selectedDeviceRecord
    ? (selectedDeviceRecord.energyConsumption?.totalUsage ?? 0)
    : (stats?.totalDevices ? Math.round((stats.totalDevices || 0) * 400) : 0);

  return (
    <div className="w-full flex max-md:flex-col gap-4">
      <div className="w-[50%] max-md:w-full">
        <div className="global-bg-color mb-6 max-md:mb-4 box-shadow rounded-2xl p-4 sm:p-5 md:p-6 ">
          <h2 className="font-vivita font-medium text-lg mb-1">
            Lumiscape Devices
          </h2>
          <p className="text-[#0060A9] font-Geom text-sm sm:text-base mb-4 sm:mb-6">
            {stats
              ? `Total devices: ${stats.totalDevices ?? 0} (${stats.onlineDevices ?? 0} online, ${stats.offlineDevices ?? 0} offline)`
              : "Total devices overview"}
          </p>

          {loadingStats ? (
            <div className="h-[280px] flex items-center justify-center text-gray-500">
              Loading...
            </div>
          ) : (
            <DeviceManagemenyGraph data={chartData} />
          )}

          <div className="pt- sm:mt-8 space-y-2 text-[#0060A9] font-light text-sm sm:text-base">
            <div className="flex items-start sm:items-center gap-2">
              <img src={total} alt="total" className="w-4 h-4 sm:w-auto sm:h-auto" />
              <span>
                {stats?.totalDevices
                  ? `${Math.round(((stats.onlineDevices ?? 0) / (stats.totalDevices || 1)) * 100)}% of Lumiscape devices are currently online.`
                  : "Device status overview"}
              </span>
            </div>
            <div className="flex items-start sm:items-center gap-2">
              <img src={basicColor} alt="basic" className="w-4 h-4 sm:w-auto sm:h-auto" />
              <span>Online device ratio based on current stats.</span>
            </div>
            <div className="flex items-start sm:items-center gap-2">
              <img src={standardColor} alt="standard" className="w-4 h-4 sm:w-auto sm:h-auto" />
              <span>Offline and maintenance devices shown in the chart above.</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[50%] max-md:w-full space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <CustomDropdown
              options={deviceOptions}
              placeholder={loadingDevices ? "Loading devices..." : "Choose Device"}
              value={selectedDevice}
              onChange={setSelectedDevice}
              disabled={loadingDevices}
            />
          </div>
          <div className="flex-1">
            <CustomDropdown
              options={TIME_OPTIONS_NORMALIZED}
              placeholder="Select Time Period"
              value={selectedTime}
              onChange={handleTimeChange}
            />
          </div>
        </div>
        <div className="global-bg-color mb-4 box-shadow rounded-2xl p-5 md:p-6">
          <div className="flex justify-between items-center mb-1">
            <h2 className="font-vivita font-medium md:text-xl mb-1">
              {selectedDeviceRecord
                ? `Energy: ${selectedDeviceRecord.name || selectedDeviceRecord.serial}`
                : "Energy Consumption (all devices)"}
            </h2>
            <span className="text-[#0060A9] font-vivita font-medium text-xl">
              {consumptionLabel} kWh
            </span>
          </div>
          <p className="text-[#0060A9] font-Geom text-base mb-6">
            Period: {selectedTime}
          </p>
          <DeviceManagementSocketGraph
            data={socketGraphData}
            selectedTime={selectedTime}
            selectedDeviceName={selectedDeviceRecord?.name}
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
