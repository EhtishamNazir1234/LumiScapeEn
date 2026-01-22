import AnalyticsGraph from "../../common/AnalyticsGraph";
import basicColor from "../../assets/basicColor.svg";
import standardColor from "../../assets/standardColor.svg";
import ActiveInactiveCard from "../dashboard/Active-InactiveCard";
import LowPerformingDeviceCard from "./LowPerformingDeviceCard";
import TopUsedDevices from "./PieGraph";
import {
  devices,
  chartData,
  areaKeys,
  areaLabels,
  areaColors,
  legendValues,
} from "../../../dummyData";

const Analytics = () => {
  const maxValue = Math.max(
    ...chartData.flatMap((d) => areaKeys.map((key) => d[key]))
  );
  let step = 100;
  if (maxValue <= 200) step = 50;
  else if (maxValue <= 1000) step = 100;
  else if (maxValue <= 3000) step = 500;
  else step = 1000;
  const roundedMax = Math.ceil(maxValue / step) * step;
  const ticks = Array.from(
    { length: Math.ceil(roundedMax / step) + 1 },
    (_, i) => i * step
  );
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
                {areaLabels.map((label, idx) => (
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
                        backgroundColor: areaColors[idx],
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
              areaKeys={areaKeys}
              areaColors={areaColors}
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
