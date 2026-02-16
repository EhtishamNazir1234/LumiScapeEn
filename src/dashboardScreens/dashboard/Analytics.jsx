import { useState, useEffect } from "react";
import CircularStatusBar from "../../common/CircularStatusBar";
import MonthSelectField from "../../common/MonthSelectField";
import { IoIosWarning } from "react-icons/io";
import { FaCircle } from "react-icons/fa6";
import { SlEnergy } from "react-icons/sl";
import ActiveInactiveCard from "./Active-InactiveCard";
import total from "../../assets/total.svg";
import standardColor from "../../assets/standardColor.svg";
import LineChartComponent from "../../common/LineChart";
import { alerts } from "../../../dummyData";
import { LineChartData } from "../../../dummyData";
import CustomcDropdown from "../../common/custom-dropdown";
import TIME_OPTIONS from "../../constant";
import { useAuth } from "../../store/hooks";
import { analyticsService } from "../../services/analytics.service";

const DEFAULT_SUBSCRIPTION_DATA = {
  basic: 0,
  standard: 0,
  premium: 0,
};

const DashboardAnalytics = () => {
  const [selectedOption, setSelectedOption] = useState("Last Month");
  const [subscriptionData, setSubscriptionData] = useState(DEFAULT_SUBSCRIPTION_DATA);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setSubscriptionLoading(true);
        const data = await analyticsService.getDashboardFresh();
        const byPlan = data?.subscriptions?.byPlan;
        if (byPlan) {
          setSubscriptionData({
            basic: byPlan.basic ?? 0,
            standard: byPlan.standard ?? 0,
            premium: byPlan.premium ?? 0,
          });
        }
      } catch (err) {
        console.error("Error fetching subscription analytics:", err);
      } finally {
        setSubscriptionLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);
  const role = user?.role || "super-admin";

  const getIcons = (key) => {
    switch (key) {
      case "Security Alert":
        return <FaCircle size={15} className="text-red-500 " />;
      case "Device Offline":
        return <IoIosWarning size={18} className="text-[#FFCE00]" />;
      case "Subscription Expiring":
        return <FaCircle size={15} className="text-[#FFCE00]" />;
      case "High Energy Consumption":
        return <SlEnergy size={18} className="text-[#FFCE00]" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <CircularStatusBar
          data={subscriptionData}
          loading={subscriptionLoading}
        />
      </div>
      <div className="space-y-3">
        {role === "admin" && (
          <>
            <ActiveInactiveCard
              title="Users"
              data={{ active: 700, inactive: 208 }}
              totalLabel="Total Users"
              activeLabel="Active Users"
              inactiveLabel="Inactive Users"
            />
            <ActiveInactiveCard
              title="Devices"
              data={{ active: 700, inactive: 208 }}
              totalLabel="Total Devices"
              activeLabel="Active Devices"
              inactiveLabel="Inactive Devices"
            />
          </>
        )}
        {role === "super-admin" && (
          <div className="global-bg-color rounded-3xl box-shadow p-3 sm:p-5 space-y-2">
            <h3 className="font-vivita font-medium my-2 text-base sm:text-lg">
              Current Revenue:
            </h3>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
              <img
                src={total}
                alt="image"
                className="w-12 h-12 sm:w-auto sm:h-auto"
              />
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <span className="text-[#0060A9] text-[13px] sm:text-[15px] text-light whitespace-nowrap">
                  Revenue generated in april
                </span>
                <div className="hidden sm:block w-8 h-[3px] rounded-4xl bg-[#0060A9]"></div>
                <span className="text-[#0060A9] font-semibold whitespace-nowrap">
                  $6,200
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-[12px] sm:text-[14px] whitespace-nowrap">
                <span className="text-light">Performance alert: </span>
                <span className="text-[#0060A9]">
                  50% growth in monthly revenue
                </span>
              </div>
            </div>

            <div className="h-[140px] sm:h-[180px] mt-4 -ml-3 sm:-ml-6">
              <LineChartComponent data={LineChartData} />
            </div>

            <div className="flex items-center space-x-2 text-[12px] sm:text-sm">
              <img
                src={standardColor}
                alt="image"
                className="w-4 h-4 flex-shrink-0"
              />
              <span className="text-gray-700 whitespace-nowrap overflow-hidden">
                <span className="text-[#0060A9] font-semibold">$6,200 </span>
                generated this month vs
                <span className="text-[#0060A9] font-semibold"> $4,100 </span>
                last month
              </span>
            </div>

            <div className="flex items-center space-x-2 text-[12px] sm:text-[14px]">
              <img
                src={standardColor}
                alt="image"
                className="w-4 h-4 flex-shrink-0"
              />
              <span className="text-gray-700 whitespace-nowrap overflow-hidden scrollbar-hide">
                Revenue increased:
                <span className="text-[#0060A9] font-semibold">
                 
                  65% compared to April 2024
                </span>
              </span>
            </div>

            <div className="flex items-center space-x-2 text-[12px] sm:text-[14px]">
              <img
                src={standardColor}
                alt="image"
                className="w-4 h-4 flex-shrink-0"
              />
              <span className="text-gray-700 whitespace-nowrap overflow-x-auto">
                Expected to reach:
                <span className="text-[#0060A9] font-semibold">
                  {" "}
                  $7.5K by end of April
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <div>
          <CustomcDropdown
            options={TIME_OPTIONS}
            placeholder="Select Time Period"
            // value={selectedTime}
            // onChange={handleTimeChange}
          />
        </div>
        <div className="space-y-4 global-bg-color rounded-[20px] p-5 box-shadow">
          <h3 className="font-vivita font-[500]">Critical Alerts:</h3>
          <div className="space-y-5 max-h-[265px] overflow-scroll">
            {alerts.map((alert) => {
              return (
                <div key={alert.id} className="bg-white  rounded-lg">
                  <div className="px-3 py-[6px] box-shadow rounded-lg bg-white ">
                    <div className="leading-4">
                      <span className="text-[#0060A9] font-light text-sm inline-flex  items-center gap-1">
                        {getIcons(alert.type)}
                        {alert.type}:
                      </span>
                      <span className="text-[#669FCB] font-light text-sm ml-1">
                        {alert.description}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
