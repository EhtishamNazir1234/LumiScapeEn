import React, { useState, useEffect } from "react";
import { subscriptionService } from "../../services/subscription.service";
import listIcon from "../../assets/list.svg";

const PlanDetails = ({ billingCycleTab }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const data = await subscriptionService.getPlans(billingCycleTab);
        setPlans(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching plans:", err);
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [billingCycleTab]);

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-500">Loading plans...</div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        No plans available. Run <code className="bg-gray-100 px-1 rounded">npm run seed:plans</code> in the backend folder to add plans.
      </div>
    );
  }

  return (
    <div className="lg:grid lg:grid-cols-3 lg:gap-8 py-5">
      {plans.map((plan, index) => (
            <div
              key={plan._id || index}
              className="bg-[#EEF3F9] rounded-lg shadow overflow-hidden md:rounded-2xl my-2"
              style={{ boxShadow: "inset 0px 2px 5px rgba(0, 0, 0, 0.15)" }}
            >
              <div className="md:p-6 p-5 md:space-y-7 space-y-4">
                <div className="min-h-[85px]">
                  <h2 className="text-[26px] font-medium font-vivita text-[#0060A9]">
                    {plan.name}
                  </h2>
                  <p className="mt-2 text-sm font-light">{plan.description}</p>
                </div>

                <div className="md:space-y-5 space-y-3">
                  <h2 className="md:text-[26px] text-[22px] font-medium font-vivita text-[#0060A9]">
                    ${plan.price}/{plan.billingCycle}
                  </h2>
                  {plan.features?.length > 0 && (
                    <ul
                      role="list"
                      className="grid lg:grid-cols-1 sm:grid-cols-2 gap-4 py-4"
                    >
                      {plan.features
                        .filter((f) => f?.allow)
                        .map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <img src={listIcon} alt={feature.label} />
                            <span className="md:text-base text-[15px] font-light">
                              {feature.label}
                            </span>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
    </div>
  );
};

export default PlanDetails;
