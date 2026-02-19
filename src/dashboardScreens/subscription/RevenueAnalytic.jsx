import { useState, useEffect } from "react";
import CircularStatusBar from "../../common/CircularStatusBar";
import RevenueLineChart from "../../common/RevenueLineChart";
import MonthSelectField from "../../common/MonthSelectField";
import { analyticsService } from "../../services/analytics.service";
import { subscriptionService } from "../../services/subscription.service";

const REVENUE_HISTORY_LENGTH = 12;

const DEFAULT_SUBSCRIPTION_DATA = {
  basic: 0,
  standard: 0,
  premium: 0,
};

const RevenueAnalytic = () => {
  const [selectedOption, setSelectedOption] = useState("Last Month");
  const [subscriptionData, setSubscriptionData] = useState(DEFAULT_SUBSCRIPTION_DATA);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [revenue, setRevenue] = useState(null);
  const [revenueLoading, setRevenueLoading] = useState(true);
  const [revenueHistory, setRevenueHistory] = useState([]);

  const formatUsd = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Number.isFinite(value) ? value : 0);

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

  const fetchRevenue = async (options = {}) => {
    const { silent = false, fresh = false } = options || {};
    try {
      if (!silent) setRevenueLoading(true);
      const data = await subscriptionService.getRevenue({ fresh });
      setRevenue(data || null);
      pushRevenueToHistory(data || null);
    } catch (err) {
      console.error("Error fetching revenue analytics:", err);
    } finally {
      if (!silent) setRevenueLoading(false);
    }
  };

  useEffect(() => {
    // Use cache on mount so switching sidebar menus doesn't refetch
    fetchSubscriptions();
    fetchRevenue();

    const intervalId = setInterval(() => {
      fetchSubscriptions({ silent: true, fresh: true });
      fetchRevenue({ silent: true, fresh: true });
    }, 30_000);

    return () => clearInterval(intervalId);
  }, []);

  const currentRevenue =
    revenue?.monthlyRevenue ?? revenue?.totalRevenue ?? 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[72%_1fr] gap-4 mb-5 lg:items-stretch">
      <div className="flex flex-col gap-4 min-h-0 min-w-0 overflow-hidden">
        <div className="flex justify-between items-center gap-2 text-white bg-[#0161A8] py-4 px-4 sm:px-8 rounded-[10px] shrink-0 min-w-0">
          <h1 className="font-vivita truncate">Revenue</h1>
          <h1 className="font-vivita truncate ml-2 shrink-0">
            {revenueLoading ? "Loading..." : formatUsd(currentRevenue)}
          </h1>
        </div>
        <div className="w-full min-w-0 box-shadow flex-1 flex flex-col min-h-0 global-bg-color rounded-3xl overflow-hidden">
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden px-4 sm:px-5 pt-4 sm:pt-5">
            <div className="space-y-2 shrink-0 min-w-0 overflow-hidden">
              <h1 className="font-vivita truncate">Revenue Overview</h1>
              <p className="text-[#669FCB] text-sm break-words overflow-hidden">
                Live trend (last {REVENUE_HISTORY_LENGTH} updates).
              </p>
            </div>
            <div className="flex-1 min-h-[140px] pt-2 pb-4 overflow-hidden">
              <RevenueLineChart
                data={revenueHistory.map((point, i, arr) => ({
                  week: i === arr.length - 1 ? "Now" : new Date(point.time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
                  revenue: point.value,
                }))}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 lg:my-0 my-2 min-w-0 min-h-0 overflow-hidden">
        <MonthSelectField
          setSelectedOption={setSelectedOption}
          selectedOption={selectedOption}
        />
        <div className="min-h-0 flex-1 flex flex-col overflow-hidden">
          <CircularStatusBar data={subscriptionData} loading={subscriptionLoading} />
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytic;
