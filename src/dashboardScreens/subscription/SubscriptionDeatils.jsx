import { useState, useEffect } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { subscriptionService } from "../../services/subscription.service";
import ViewModal from "../../common/ViewModal";

const SubscriptionDeatils = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await subscriptionService.getAll();
      setSubscriptions(response.subscriptions || response || []);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (subscription) => {
    const viewData = {
      modalTitle: "Subscription Details",
      "User Name": subscription.userId?.name || subscription.userName || "N/A",
      "Email": subscription.userId?.email || subscription.email || "N/A",
      "Plan Name": subscription.planName || subscription.planId?.name || "N/A",
      "Price": `$${subscription.price || subscription.planId?.price || "0"}`,
      "Billing Cycle": subscription.billingCycle || "N/A",
      "Status": subscription.status || "Active",
      "Expiry Date": subscription.expiryDate 
        ? new Date(subscription.expiryDate).toLocaleDateString() 
        : "N/A",
    };
    setSelectedSubscription(viewData);
    setIsViewModalOpen(true);
  };

  return (
    <>
      <div className="overflow-x-auto my-7">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : subscriptions.length === 0 ? (
          <div className="text-center py-8">No subscriptions found</div>
        ) : (
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
              {subscriptions.map((subscription, index) => (
                <tr
                  key={subscription._id || index}
                  className="border-b-[1px] border-[#DEDFE0] last:border-0"
                >
                  <td className="py-3 px-4 text-sm font-light ">
                    {subscription.userId?.name || subscription.userName || "N/A"}
                  </td>
                  <td className="py-3 font-light text-sm">
                    {subscription.userId?.email || subscription.email || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-sm font-light">
                    {subscription.planName || subscription.planId?.name || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-sm font-light">
                    {subscription.status || "Active"}
                  </td>
                  <td className="py-3 px-4 font-light flex justify-center gap-3">
                    <IoEyeOutline
                      onClick={() => handleView(subscription)}
                      size={22}
                      className="text-[#0061A9] cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedSubscription(null);
        }}
        viewData={selectedSubscription}
      />
    </>
  );
};

export default SubscriptionDeatils;
