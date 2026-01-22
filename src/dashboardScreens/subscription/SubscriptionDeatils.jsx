import React from "react";
import { subscriptionData } from "../../../dummyData";
import { IoEyeOutline } from "react-icons/io5";

const SubscriptionDeatils = () => {
  return (
    <div className="overflow-x-auto my-7">
      <table className="w-full">
        <thead>
          <tr className="table-header">
            <th>Name</th>
            <th>Email Address</th>
            <th>Subscriptions</th>
            <th>Status</th>
            <th className="!text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {subscriptionData?.map((subscription, index) => (
            <tr
              key={subscription.id}
              className="border-b-[1px] border-[#DEDFE0] last:border-0"
            >
              <td className="py-3 px-4 text-sm font-light ">
                {subscription.name}
              </td>
              <td className="py-3 font-light text-sm">{subscription.email}</td>
              <td className="py-3 px-4 text-sm font-light">
                {subscription.subscription}
              </td>
              <td className="py-3 px-4 text-sm font-light">
                {subscription.status}
              </td>
              <td className="py-3 px-4 font-light flex justify-center gap-3">
                <IoEyeOutline
                  onClick={() => setIsViewModalOpen(true)}
                  size={22}
                  className="text-[#0061A9]"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriptionDeatils;
