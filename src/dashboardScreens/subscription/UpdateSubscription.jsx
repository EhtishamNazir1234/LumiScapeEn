import React, { useState } from "react";
import ToggleSwitch from "../../common/ToggleSwitch";
import InputField from "../../common/InputField";
import { plansDetails } from "../../../dummyData";

const UpdateSubscription = () => {
  const [plansDetail, setPlanDetail] = useState(plansDetails);

  const handleToggle = (planId, featureIndex, newState) => {
    console.log(planId);
    setPlanDetail((prevPlans) => {
      const updatedPlans = prevPlans.map((plan) => {
        if (plan.id === planId) {
          const updatedFeatures = plan.features.map((feature, index) => {
            if (index === featureIndex) {
              return { ...feature, allow: newState };
            }
            return feature;
          });
          return { ...plan, features: updatedFeatures };
        }
        return plan;
      });
      return updatedPlans;
    });

    console.log(
      `Plan ID: ${planId}, Feature Index: ${featureIndex}, New State: ${newState}`
    );
  };
  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 gap-5">
      {plansDetail.length > 0 &&
        plansDetail
          ?.filter((item) => item.billingCycle === "monthly")
          ?.map((plan, planIndex) => (
            <div
              key={plan.id}
              className="bg-[#EEF3F9]  w-[100%] rounded-lg shadow overflow-hidden md:rounded-2xl"
              style={{ boxShadow: "inset 0px 2px 5px rgba(0, 0, 0, 0.15)" }}
            >
              <div className="p-6 space-y-10 mb-10">
                <div className="min-h-[85px]">
                  <h2 className="text-[26px] font-medium font-vivita text-[#0060A9]">
                    {plan.name} {plan.id}
                  </h2>
                  <p className="mt-2 text-sm font-light text-[#669FCB]">
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="text-[16px] flex items-center justify-between font-medium font-vivita text-[#0060A9]">
                    <h1>Plan Price</h1>
                    <div>
                      {" "}
                      <input
                        value={plan.price}
                        type="number"
                        style={{
                          boxShadow: "inset 2px 3px 5px rgba(0, 0, 0, 0.15)",
                        }}
                        className="bg-white w-[170px] px-5 py-2 rounded"
                      />
                    </div>
                  </div>
                  <ul
                    role="list"
                    className="space-y-4 grid lg:grid-cols-1 sm:grid-cols-2 gap-4 p-4"
                  >
                    {plan?.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-3"
                      >
                        <ToggleSwitch
                          label={feature.label}
                          checked={feature.allow}
                          onChange={(newState) =>
                            handleToggle(plan.id, featureIndex, newState)
                          }
                        />
                      </li>
                    ))}
                  </ul>
                  <div className="text-[16px] flex items-center justify-between font-medium font-vivita text-[#0060A9]">
                    <h1>Number of devices</h1>
                    <div>
                      {" "}
                      <input
                        value="Unlimited"
                        //   type="number"
                        style={{
                          boxShadow: "inset 2px 3px 5px rgba(0, 0, 0, 0.15)",
                        }}
                        className="bg-white w-[170px] px-5 py-2 rounded"
                      />
                    </div>
                  </div>

                  <div className="w-[70%] mx-auto">
                    <button className="custom-shadow-button font-vivita !py-3 !px-6">
                      Update Subscription Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
    </div>
  );
};

export default UpdateSubscription;
