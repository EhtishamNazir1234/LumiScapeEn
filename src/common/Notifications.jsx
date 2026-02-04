import React from "react";
import { useNavigate } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { NotificationIcon } from "../assets/icon";
import { useNotifications } from "../store/hooks";

const Notifications = ({ onClose }) => {
  const navigate = useNavigate();
  const { notifications, removeNotification, markAllAsRead } = useNotifications();

  const handleNotificationClick = (notification) => {
    removeNotification(notification.id);
    onClose?.();
    if (notification.link) {
      const chatId = notification.chatId != null ? String(notification.chatId) : null;
      if (chatId) {
        navigate(`/chat/${chatId}`, { replace: false });
      } else {
        navigate(notification.link, {});
      }
    }
  };

  return (
    <div className="md:w-100 w-75 md:p-7 py-4 px-3 bg-white rounded-[20px] box-shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-vivita font-[500]">Notifications</h2>
        {notifications.length > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="text-xs text-[#0060A9] hover:underline"
          >
            Mark all read
          </button>
        )}
        <IoSettingsOutline size={25} />
      </div>

      <div className="space-y-4 md:my-7 my-4 max-h-[70vh] overflow-auto scrollbar-hide">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">No notifications yet.</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              role="button"
              tabIndex={0}
              onClick={() => handleNotificationClick(notification)}
              onKeyDown={(e) => e.key === "Enter" && handleNotificationClick(notification)}
              className={`flex gap-2 rounded-lg cursor-pointer md:my-7 my-3 p-2 hover:bg-gray-50 ${!notification.isRead ? "bg-[#0060A9]/5" : ""}`}
            >
             
                <NotificationIcon fill={notification.isRead ? "" : "#0060A9"} />
              
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-700 text-[14px] font-light">
                  <span className="font-medium text-gray-900">{notification.label}</span>
                  <span className="text-[#666666] block mt-0.5">{notification.message}</span>
                </div>
                <span className="text-xs text-[#0060A9]">{notification.date}</span>
              </div>
              {!notification.isRead && (
                <span className="w-2 h-2 mt-2 bg-[#0060A9] rounded-full" aria-hidden />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
