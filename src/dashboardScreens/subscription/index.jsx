import SubscriptionDeatils from "./SubscriptionDeatils";
import React, { useState } from "react";
import { subscriptionData } from "../../../dummyData";
import SearchField from "../../common/SearchField";
import Filters from "../../common/Filters";
import PlanDetails from "./PlanDetails";
import { useNavigate } from "react-router-dom";
import RevenueAnalytic from "./RevenueAnalytic";

const Subscription = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("subscriptions");
  const [billingCycleTab, setBillingCycleTab] = useState("monthly");
  return (
    <>
      <RevenueAnalytic />
      <div className="flex">
        <div className={`space-y-7 w-full`}>
          <div
            className={`${
              activeTab === "subscriptions" ? "global-bg-color" : "bg-white"
            } h-auto rounded-[20px] md:p-7 p-3 box-shadow`}
          >
            <div className="flex md:flex-row flex-col-reverse justify-between items-center lg:gap-10 gap-3 md:space-y-0 space-y-0">
              <div className="xl:w-[50%] md:w-[60%] w-full sm:flex items-center gap-3">
                <div
                  className="shadow flex-1 flex p-2 rounded-xl"
                  style={{ boxShadow: "inset 0px 2px 5px rgba(0, 0, 0, 0.15)" }}
                >
                  <button
                    className={`flex-1 py-[3px] font-light cursor-pointer rounded-lg lg:text-base text-sm ${
                      activeTab === "subscriptions"
                        ? "bg-[#337FBA] text-white"
                        : ""
                    }`}
                    onClick={() => setActiveTab("subscriptions")}
                  >
                    Subscriptions
                  </button>
                  <button
                    data-tip="This is a tooltip!"
                    className={`flex-1 py-[3px] font-light cursor-pointer lg:text-base text-sm rounded-lg ${
                      activeTab === "plans" ? "bg-[#337FBA] text-white" : ""
                    }`}
                    onClick={() => setActiveTab("plans")}
                  >
                    Subscriptions Plans
                  </button>
                </div>
                {activeTab === "plans" && (
                  <div className="flex md:gap-0 gap-7 my-3 justify-center text-center ">
                    <h1
                      onClick={() => setBillingCycleTab("monthly")}
                      className={`font-medium lg:text-base text-xs cursor-pointer ${
                        billingCycleTab === "monthly"
                          ? "text-[#337FBA]"
                          : "text-gray-600"
                      }`}
                    >
                      Monthly
                    </h1>
                    <h1
                      onClick={() => setBillingCycleTab("annual")}
                      className={`font-medium lg:text-base text-xs cursor-pointer lg:mx-5 ${
                        billingCycleTab === "annual"
                          ? "text-[#337FBA]"
                          : "text-gray-600"
                      }`}
                    >
                      Annual
                    </h1>
                  </div>
                )}
              </div>
              {activeTab === "subscriptions" ? (
                <div className="flex gap-3 md:w-[60%] w-full">
                  <SearchField placeholder="Search" />
                  <Filters
                    onClick={() => setIsFilterBarOpen(!isFilterBarOpen)}
                  />
                </div>
              ) : (
                <div className="flex justify-end md:w-[20%] w-full">
                  <button
                    onClick={() => navigate("/subscriptions-update")}
                    className="custom-shadow-button md:!w-full !w-[50%] font-vivita 2xl:!py-3 2xl:!px-6 !py-2 !px-3 2xl:!text-base text-sm whitespace-nowrap"
                  >
                    Edit Subscription Plans
                  </button>
                </div>
              )}
            </div>
            {activeTab === "subscriptions" ? (
              <SubscriptionDeatils />
            ) : (
              <PlanDetails billingCycleTab={billingCycleTab} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscription;
