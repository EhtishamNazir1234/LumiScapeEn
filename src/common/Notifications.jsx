import React, { useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { NotificationIcon } from "../assets/icon";

const Notifications = () => {
  const [notifications] = useState([
    {
      label: "High Energy Consumption",
      message: "Device #E-209 is consuming 30% more energy than average.",
      isRead: true,
      date: "2d ago",
    },
    {
      label: "High Energy Consumption",
      message: "Device #E-209 is consuming 30% more energy than average.",
      isRead: false,
      date: "2d ago",
    },
    {
      label: "High Energy Consumption",
      message: "Device #E-209 is consuming 30% more energy than average.",
      isRead: true,
      date: "2d ago",
    },
    {
      label: "High Energy Consumption",
      message: "Device #E-209 is consuming 30% more energy than average.",
      isRead: false,
      date: "2d ago",
    },
    {
      label: "High Energy Consumption",
      message: "Device #E-209 is consuming 30% more energy than average.",
      isRead: true,
      date: "2d ago",
    },
    {
      label: "High Energy Consumption",
      message: "Device #E-209 is consuming 30% more energy than average.",
      isRead: false,
      date: "2d ago",
    },
    {
      label: "High Energy Consumption",
      message: "Device #E-209 is consuming 30% more energy than average.",
      isRead: true,
      date: "2d ago",
    },
    {
      label: "High Energy Consumption",
      message: "Device #E-209 is consuming 30% more energy than average.",
      isRead: false,
      date: "2d ago",
    },
    {
      label: "High Energy Consumption",
      message: "Device #E-209 is consuming 30% more energy than average.",
      isRead: true,
      date: "2d ago",
    },
    {
      label: "High Energy Consumption",
      message: "Device #E-209 is consuming 30% more energy than average.",
      isRead: false,
      date: "2d ago",
    },
  ]);

  return (
    <div className="md:w-100 w-75 md:p-7 py-4 px-3 bg-white rounded-[20px] box-shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-vivita font-[500]">Notifications</h2>
        <IoSettingsOutline size={25} />
      </div>

      <div className="space-y-4 md:my-7 my-4 max-h-[70vh] overflow-auto scrollbar-hide">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className="flex gap-2 rounded-lg cursor-pointer md:my-7 my-3"
          >
            <div className="">
              <NotificationIcon fill={notification.isRead ? "" : "#0060A9"} />
            </div>

            <div className="flex">
              <div className="">
                <div className="flex-1 text-sm text-gray-700 text-[14px] font-light">
                  <span className="">{notification.label}</span>
                  <span className="text-[#666666]">{notification.message}</span>
                </div>
                <span className="text-xs text-[#0060A9]">
                  {notification.date}
                </span>
              </div>
              {!notification.isRead && (
                <span className="w-4.5 h-2.5 mt-1 bg-[#0060A9] rounded-full"></span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
