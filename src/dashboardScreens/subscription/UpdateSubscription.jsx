import { useState, useEffect } from "react";
import ToggleSwitch from "../../common/ToggleSwitch";
import { subscriptionService } from "../../services/subscription.service";

const UpdateSubscription = () => {
  const [billingCycleTab, setBillingCycleTab] = useState("monthly");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingPlanId, setSavingPlanId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });
      const data = await subscriptionService.getPlans(billingCycleTab);
      const list = Array.isArray(data) ? data : [];
      setPlans(list.map((p) => ({ ...p, price: String(p.price ?? "") })));
    } catch (err) {
      console.error("Error fetching plans:", err);
      setPlans([]);
      setMessage({ type: "error", text: "Failed to load plans." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [billingCycleTab]);

  const handlePriceChange = (planId, value) => {
    setPlans((prev) =>
      prev.map((p) =>
        p._id === planId ? { ...p, price: value } : p
      )
    );
    setMessage({ type: "", text: "" });
  };

  const handleToggle = (planId, featureIndex, newState) => {
    setPlans((prev) =>
      prev.map((plan) => {
        if (plan._id !== planId) return plan;
        const features = (plan.features || []).map((f, i) =>
          i === featureIndex ? { ...f, allow: newState } : f
        );
        return { ...plan, features };
      })
    );
    setMessage({ type: "", text: "" });
  };

  const handleUpdate = async (plan) => {
    const priceNum = Number(plan.price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      setMessage({ type: "error", text: "Please enter a valid price." });
      return;
    }
    try {
      setSavingPlanId(plan._id);
      setMessage({ type: "", text: "" });
      await subscriptionService.updatePlan(plan._id, {
        price: priceNum,
        features: plan.features || [],
      });
      setMessage({ type: "success", text: `${plan.name} plan updated successfully.` });
      await fetchPlans();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to update plan.";
      setMessage({ type: "error", text: msg });
    } finally {
      setSavingPlanId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="font-medium text-[#0060A9]">Billing cycle:</span>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setBillingCycleTab("monthly")}
            className={`font-medium text-sm sm:text-base ${
              billingCycleTab === "monthly" ? "text-[#337FBA] underline" : "text-gray-600"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycleTab("annual")}
            className={`font-medium text-sm sm:text-base ${
              billingCycleTab === "annual" ? "text-[#337FBA] underline" : "text-gray-600"
            }`}
          >
            Annual
          </button>
        </div>
      </div>

      {message.text && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-[#E8F5E9] text-[#2E7D32]"
              : "bg-[#FFEBEE] text-[#C62828]"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading plans...</div>
      ) : plans.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          No plans for this billing cycle. Run{" "}
          <code className="bg-gray-100 px-1 rounded">npm run seed:plans</code> in the backend.
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-5">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="bg-[#EEF3F9] w-[100%] rounded-lg shadow overflow-hidden md:rounded-2xl"
              style={{ boxShadow: "inset 0px 2px 5px rgba(0, 0, 0, 0.15)" }}
            >
              <div className="p-6 space-y-10 mb-10">
                <div className="min-h-[85px]">
                  <h2 className="text-[26px] font-medium font-vivita text-[#0060A9]">
                    {plan.name}
                  </h2>
                  <p className="mt-2 text-sm font-light text-[#669FCB]">
                    {plan.description || ""}
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="text-[16px] flex items-center justify-between font-medium font-vivita text-[#0060A9]">
                    <h1>Plan Price ($)</h1>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={plan.price}
                      onChange={(e) => handlePriceChange(plan._id, e.target.value)}
                      style={{
                        boxShadow: "inset 2px 3px 5px rgba(0, 0, 0, 0.15)",
                      }}
                      className="bg-white w-[170px] px-5 py-2 rounded"
                    />
                  </div>
                  <ul
                    role="list"
                    className="space-y-4 grid lg:grid-cols-1 sm:grid-cols-2 gap-4 p-4"
                  >
                    {(plan.features || []).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <ToggleSwitch
                          label={feature.label}
                          checked={!!feature.allow}
                          onChange={(newState) =>
                            handleToggle(plan._id, featureIndex, newState)
                          }
                        />
                      </li>
                    ))}
                  </ul>
                  <div className="text-[16px] flex items-center justify-between font-medium font-vivita text-[#0060A9]">
                    <h1>Number of devices</h1>
                    <span className="bg-white w-[170px] px-5 py-2 rounded inline-block text-sm font-light">
                      Unlimited
                    </span>
                  </div>

                  <div className="w-[70%] mx-auto">
                    <button
                      type="button"
                      onClick={() => handleUpdate(plan)}
                      disabled={savingPlanId === plan._id}
                      className="custom-shadow-button font-vivita !py-3 !px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {savingPlanId === plan._id ? "Saving..." : "Update Subscription Plan"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpdateSubscription;
