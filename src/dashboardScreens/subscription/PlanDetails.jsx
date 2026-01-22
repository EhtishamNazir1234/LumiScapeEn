import React from "react";
import { plansDetails } from "../../../dummyData";
import listIcon from "../../assets/list.svg";

const PlanDetails = ({ billingCycleTab }) => {
  return (
    <div className="lg:grid lg:grid-cols-3 lg:gap-8 py-5">
      {plansDetails.length > 0 &&
        plansDetails
          ?.filter((item) => item.billingCycle === billingCycleTab)
          .map((plan, index) => (
            <div
              key={index}
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
                  <ul
                    role="list"
                    className="grid lg:grid-cols-1 sm:grid-cols-2 gap-4 py-4"
                  >
                    {plan.features.map(
                      (feature, idx) =>
                        feature?.allow && (
                          <li key={idx} className="flex items-center gap-3">
                            <img src={listIcon} alt={feature.label} />
                            <span className="md:text-base text-[15px] font-light">
                              {feature.label}
                            </span>
                          </li>
                        )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ))}
    </div>
  );
};

export default PlanDetails;
