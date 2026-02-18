import { useState, useEffect } from "react";
import CircularStatusBar from "../../common/CircularStatusBar";
import LineChartComponent from "../../common/LineChart";
import MonthSelectField from "../../common/MonthSelectField";
import { LineChartData } from "../../../dummyData";
import { analyticsService } from "../../services/analytics.service";
import { subscriptionService } from "../../services/subscription.service";

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

  const fetchRevenue = async (options = {}) => {
    const { silent = false, fresh = false } = options || {};
    try {
      if (!silent) setRevenueLoading(true);
      const data = await subscriptionService.getRevenue({ fresh });
      setRevenue(data || null);
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
    <div className="lg:flex gap-4 mb-5">
      <div className="lg:w-[72%] h-auto space-y-4 flex flex-col">
        <div className="flex justify-between text-white bg-[#0161A8] py-4 px-8 rounded-[10px]">
          <h1 className="font-vivita">Revenue</h1>
          <h1>{revenueLoading ? "Loading..." : formatUsd(currentRevenue)}</h1>
        </div>
        <div className="w-full box-shadow flex-1  global-bg-color rounded-3xl pr-3">
          <div className="p-2 lg:h-[300px]">
            <div className="p-5 space-y-2">
              <h1 className="font-vivita">Revenue Overview</h1>
              <p className="text-[#669FCB]">
                This dashboard updates automatically based on active subscriptions.
              </p>
            </div>
            <LineChartComponent data={LineChartData} />
          </div>
        </div>
      </div>
      <div className="space-y-4 flex-1 lg:my-0 my-2">
        <MonthSelectField
          setSelectedOption={setSelectedOption}
          selectedOption={selectedOption}
        />
        <CircularStatusBar data={subscriptionData} loading={subscriptionLoading} />
      </div>
    </div>
  );
};

export default RevenueAnalytic;
