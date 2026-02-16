import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { subscriptionService } from "../../services/subscription.service";
import { useAuth } from "../../store/hooks";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/authSlice";
import { authService } from "../../services/auth.service";
import listIcon from "../../assets/list.svg";

const SubscribePlans = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [plans, setPlans] = useState([]);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [subscribingId, setSubscribingId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { user } = useAuth();
  const dispatch = useDispatch();

  const currentPlan = user?.subscription;
  const subscriptionStatus = user?.subscriptionStatus;

  useEffect(() => {
    fetchPlans();
  }, [billingCycle]);

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    if (success === "true") {
      authService.getCurrentUser().then((updatedUser) => {
        dispatch(setUser(updatedUser));
        localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      });
      setMessage({ type: "success", text: "Payment successful! You are now subscribed." });
      setSearchParams({}, { replace: true });
    } else if (canceled === "true") {
      setMessage({ type: "info", text: "Payment was canceled." });
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, dispatch, setSearchParams]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getPlans(billingCycle);
      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching plans:", err);
      setPlans([]);
      setMessage({ type: "error", text: "Failed to load plans." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    try {
      setSubscribingId(planId);
      setMessage({ type: "", text: "" });
      const { url } = await subscriptionService.createCheckoutSession(planId);
      if (url) {
        window.location.href = url;
        return;
      }
      setMessage({ type: "error", text: "Could not start checkout." });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to start checkout.";
      setMessage({ type: "error", text: msg });
    } finally {
      setSubscribingId(null);
    }
  };

  const isCurrentPlan = (plan) => {
    if (!currentPlan || subscriptionStatus !== "Active") return false;
    const planName = typeof plan === "string" ? plan : plan?.name;
    return planName && String(currentPlan).toLowerCase() === String(planName).toLowerCase();
  };

  return (
    <div className="global-bg-color rounded-[20px] p-5 md:p-7 box-shadow">
      <h1 className="font-vivita font-[500] text-xl mb-2">Subscribe to a Plan</h1>
      <p className="text-sm text-gray-600 mb-4">
        Choose a plan that fits your needs. You can change or upgrade at any time.
      </p>

      {currentPlan && subscriptionStatus === "Active" && (
        <div className="mb-4 p-3 rounded-lg bg-[#E8F5E9] text-[#2E7D32] text-sm">
          Your current plan: <strong>{currentPlan}</strong>
          {user?.subscriptionExpiryDate && (
            <span className="ml-2">
              (expires {new Date(user.subscriptionExpiryDate).toLocaleDateString()})
            </span>
          )}
        </div>
      )}

      {message.text && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-[#E8F5E9] text-[#2E7D32]"
              : message.type === "info"
              ? "bg-[#E3F2FD] text-[#1565C0]"
              : "bg-[#FFEBEE] text-[#C62828]"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex gap-6 mb-6">
        <button
          onClick={() => setBillingCycle("monthly")}
          className={`font-medium text-sm sm:text-base ${
            billingCycle === "monthly" ? "text-[#337FBA] underline" : "text-gray-600"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingCycle("annual")}
          className={`font-medium text-sm sm:text-base ${
            billingCycle === "annual" ? "text-[#337FBA] underline" : "text-gray-600"
          }`}
        >
          Annual
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading plans...</div>
      ) : plans.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No plans available. Please contact support.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = isCurrentPlan(plan);
            return (
              <div
                key={plan._id}
                className="bg-[#EEF3F9] rounded-lg shadow overflow-hidden md:rounded-2xl"
                style={{ boxShadow: "inset 0px 2px 5px rgba(0, 0, 0, 0.15)" }}
              >
                <div className="md:p-6 p-5 md:space-y-7 space-y-4">
                  {isCurrent && (
                    <div className="inline-block px-2 py-1 rounded text-xs font-medium bg-[#337FBA] text-white">
                      Current Plan
                    </div>
                  )}
                  <div className="min-h-[85px]">
                    <h2 className="text-[26px] font-medium font-vivita text-[#0060A9]">
                      {plan.name}
                    </h2>
                    <p className="mt-2 text-sm font-light">
                      {plan.description || "Energy management plan"}
                    </p>
                  </div>
                  <div className="md:space-y-5 space-y-3">
                    <h2 className="md:text-[26px] text-[22px] font-medium font-vivita text-[#0060A9]">
                      ${plan.price}/{plan.billingCycle}
                    </h2>
                    {plan.features?.length > 0 && (
                      <ul className="grid gap-4 py-4">
                        {plan.features
                          .filter((f) => f?.allow)
                          .map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-3">
                              <img src={listIcon} alt="" className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm md:text-base font-light">
                                {feature.label}
                              </span>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                  <button
                    onClick={() => handleSubscribe(plan._id)}
                    disabled={isCurrent || subscribingId === plan._id}
                    className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition ${
                      isCurrent
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : subscribingId === plan._id
                        ? "bg-[#6699cc] text-white cursor-wait"
                        : "custom-shadow-button text-white hover:opacity-90"
                    }`}
                  >
                    {subscribingId === plan._id
                      ? "Redirecting to payment..."
                      : isCurrent
                      ? "Current Plan"
                      : "Subscribe with Payment"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubscribePlans;
