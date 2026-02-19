import { useState, useEffect } from "react";
import CircularStatusBar from "../../common/CircularStatusBar";
import { IoIosWarning } from "react-icons/io";
import { FaCircle } from "react-icons/fa6";
import { SlEnergy } from "react-icons/sl";
import ActiveInactiveCard from "./Active-InactiveCard";
import total from "../../assets/total.svg";
import standardColor from "../../assets/standardColor.svg";
import RevenueLineChart from "../../common/RevenueLineChart";
import { alerts } from "../../../dummyData";
import CustomcDropdown from "../../common/custom-dropdown";
import TIME_OPTIONS from "../../constant";
import { useAuth } from "../../store/hooks";
import { analyticsService } from "../../services/analytics.service";
import { subscriptionService } from "../../services/subscription.service";

const REVENUE_HISTORY_LENGTH = 12;

const DEFAULT_SUBSCRIPTION_DATA = {
  basic: 0,
  standard: 0,
  premium: 0,
};

const DashboardAnalytics = () => {
  const [subscriptionData, setSubscriptionData] = useState(DEFAULT_SUBSCRIPTION_DATA);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [revenue, setRevenue] = useState(null);
  const [revenueLoading, setRevenueLoading] = useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [revenueHistory, setRevenueHistory] = useState([]);
  const { user } = useAuth();

  const fetchSubscriptions = async (options = {}) => {
    const { silent = false, fresh = false } = options || {};
    try {
      if (!silent) setSubscriptionLoading(true);
      const data = fresh ? await analyticsService.getDashboardFresh() : await analyticsService.getDashboard();
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
      if (!silent) setSubscriptionLoading(false);
    }
  };

  const fetchRevenue = async (options = {}) => {
    const { silent = false, fresh = false } = options || {};
    try {
      if (!silent) setRevenueLoading(true);
      const data = await subscriptionService.getRevenue({ fresh });
      setRevenue(data || null);
      setLastUpdatedAt(new Date());
      pushRevenueToHistory(data || null);
    } catch (err) {
      console.error("Error fetching revenue analytics:", err);
    } finally {
      if (!silent) setRevenueLoading(false);
    }
  };

  const pushRevenueToHistory = (revenueData) => {
    const monthly = revenueData?.monthlyRevenue;
    const total = revenueData?.totalRevenue;
    const value = Number.isFinite(monthly) ? monthly : (Number.isFinite(total) ? total : 0);
    const now = Date.now();
    setRevenueHistory((prev) => {
      const next = [...prev, { value: Math.round(value), time: now }];
      return next.slice(-REVENUE_HISTORY_LENGTH);
    });
  };

  useEffect(() => {
    // Use cache on mount so switching sidebar menus doesn't refetch
    fetchSubscriptions();
    fetchRevenue();

    const intervalId = setInterval(() => {
      fetchSubscriptions({ silent: true, fresh: true });
      fetchRevenue({ silent: true, fresh: true });
    }, 30_000);

    const onFocus = () => {
      fetchSubscriptions({ silent: true, fresh: true });
      fetchRevenue({ silent: true, fresh: true });
    };
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
    };
  }, []);
  const role = user?.role || "super-admin";

  const formatUsd = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Number.isFinite(value) ? value : 0);

  const monthLabel = new Date().toLocaleString("en-US", { month: "long" });
  const monthlyRevenue = revenue?.monthlyRevenue;
  const annualRevenue = revenue?.annualRevenue;
  const totalRevenue = revenue?.totalRevenue;
  const currentRevenue = Number.isFinite(monthlyRevenue) ? monthlyRevenue : totalRevenue;

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
      <div className="relative">
        <button
          onClick={() => {
            fetchSubscriptions({ fresh: true });
            fetchRevenue({ fresh: true });
          }}
          disabled={subscriptionLoading || revenueLoading}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-lg text-[#0060A9] hover:bg-[#0060A9]/10 disabled:opacity-50"
          title="Refresh subscription and revenue data"
          aria-label="Refresh"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 2v6h-6" />
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
            <path d="M3 22v-6h6" />
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          </svg>
        </button>
        <CircularStatusBar
          data={subscriptionData}
          loading={subscriptionLoading}
        />
      </div>
      <div className="space-y-3 flex flex-col min-h-0 min-w-0 h-full">
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
          <div className="global-bg-color rounded-3xl box-shadow p-3 sm:p-5 flex flex-col min-h-0 h-full overflow-hidden min-w-0">
            <h3 className="font-vivita font-medium my-2 text-base sm:text-lg shrink-0 truncate">
              Current Revenue:
            </h3>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 shrink-0 min-w-0 overflow-hidden">
              <img
                src={total}
                alt="image"
                className="w-12 h-12 sm:w-auto sm:h-auto shrink-0"
              />
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0 overflow-hidden">
                <span className="text-[#0060A9] text-[13px] sm:text-[15px] text-light truncate">
                  Revenue generated in {monthLabel}
                </span>
                <div className="hidden sm:block w-8 h-[3px] rounded-4xl bg-[#0060A9] shrink-0"></div>
                <span className="text-[#0060A9] font-semibold truncate shrink-0">
                  {revenueLoading ? "Loading..." : formatUsd(currentRevenue)}
                </span>
              </div>
            </div>

            <div className="flex gap-3 shrink-0 min-w-0 overflow-hidden">
              <div className="text-[12px] sm:text-[14px] break-words overflow-hidden min-w-0">
                <span className="text-light">Performance alert: </span>
                <span className="text-[#0060A9]">
                  Live revenue updates based on active subscriptions
                </span>
              </div>
            </div>

            <div className="mt-2 flex-1 flex flex-col min-h-[120px] overflow-hidden min-w-0">
              <p className="text-[#669FCB] text-xs sm:text-sm mb-2 shrink-0 break-words overflow-hidden">
                Live trend (last {REVENUE_HISTORY_LENGTH} updates).
              </p>
              <div className="flex-1 min-h-[100px] sm:min-h-[120px] overflow-hidden min-w-0">
                <RevenueLineChart
                  data={revenueHistory.map((point, i, arr) => ({
                    week: i === arr.length - 1 ? "Now" : new Date(point.time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
                    revenue: point.value,
                  }))}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[12px] sm:text-sm">
              <img
                src={standardColor}
                alt="image"
                className="w-4 h-4 flex-shrink-0"
              />
              <span className="text-gray-700 whitespace-nowrap overflow-hidden">
                <span className="text-[#0060A9] font-semibold">
                  {revenueLoading ? "Loading..." : formatUsd(monthlyRevenue)}
                </span>{" "}
                monthly ·{" "}
                <span className="text-[#0060A9] font-semibold">
                  {revenueLoading ? "Loading..." : formatUsd(annualRevenue)}
                </span>{" "}
                annual ·{" "}
                <span className="text-[#0060A9] font-semibold">
                  {revenueLoading ? "Loading..." : formatUsd(totalRevenue)}
                </span>{" "}
                total
              </span>
            </div>

            <div className="flex items-center space-x-2 text-[12px] sm:text-[14px]">
              <img
                src={standardColor}
                alt="image"
                className="w-4 h-4 flex-shrink-0"
              />
              <span className="text-gray-700 whitespace-nowrap overflow-hidden scrollbar-hide">
                Last updated:{" "}
                <span className="text-[#0060A9] font-semibold">
                  {lastUpdatedAt ? lastUpdatedAt.toLocaleTimeString() : "—"}
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
                Auto-refresh:{" "}
                <span className="text-[#0060A9] font-semibold">every 30 seconds</span>
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3 min-h-0 h-full">
        <div className="shrink-0">
          <CustomcDropdown
            options={TIME_OPTIONS}
            placeholder="Select Time Period"
            // value={selectedTime}
            // onChange={handleTimeChange}
          />
        </div>
        <div className="space-y-4 global-bg-color rounded-[20px] p-5 box-shadow min-h-[265px] flex-1 flex flex-col min-h-0">
          <h3 className="font-vivita font-[500] shrink-0">Critical Alerts:</h3>
          <div className="space-y-5 min-h-[220px] flex-1 overflow-auto">
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
