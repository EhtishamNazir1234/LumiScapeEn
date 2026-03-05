import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import chatIcon from "../../assets/chatIcon.svg";
import notification from "../../assets/notification.svg";
import profileImage from "../../assets/profile.svg";
import Notifications from "../../common/Notifications";
import { useAuth } from "../../store/hooks";
import { useNotifications } from "../../store/hooks";
import { useChat } from "../../store/hooks";

const NavBar = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const { totalUnreadChatMessages } = useChat();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const toggleNotifications = () => setShowNotifications((prev) => !prev);
  const closeNotifications = () => setShowNotifications(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-start md:justify-between mt-2 mb-1 sm:mt-4 sm:mb-4 xl:mt-9 xl:mb-4 pl-14 lg:pl-0">
      {/* Mobile: only show welcome line */}
      <div className="block sm:hidden leading-4 mr-1">
        <h1 className="font-[500px] text-[11px] font-vivita">
          Welcome {user?.name || "Admin"}!
        </h1>
      </div>

      {/* Tablet / Desktop: full heading + subtitle */}
      <div className="hidden sm:block leading-6 sm:leading-8 mr-4">
        <h1 className="font-[500px] xl:text-2xl text-lg font-vivita">
          Welcome {user?.name || "Admin"}!
        </h1>
        <p className="text-[#337FBA] font-[300px] xl:text-base text-[14px] font-Geom">
          Manage users, devices, and system performance effortlessly.
        </p>
      </div>
      <div className="flex gap-4 relative items-center mt-[2px] sm:mt-0">
        <Link
          to="/chat"
          className="relative p-0 border-0 bg-transparent cursor-pointer inline-block"
          aria-label={
            totalUnreadChatMessages > 0
              ? `${totalUnreadChatMessages} unread chat messages`
              : "Chat"
          }
        >
          <img
            src={chatIcon}
            width={25}
            height={25}
            alt="Chat"
            className="w-5 h-5 sm:w-[25px] sm:h-[25px]"
          />
          {totalUnreadChatMessages > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-medium px-1">
              {totalUnreadChatMessages > 99 ? "99+" : totalUnreadChatMessages}
            </span>
          )}
        </Link>
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={toggleNotifications}
            className="relative p-0 border-0 bg-transparent cursor-pointer"
            aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"}
          >
            <img
              src={notification}
              width={25}
              height={25}
              alt=""
              className="w-5 h-5 sm:w-[25px] sm:h-[25px]"
            />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-medium px-1">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-5 md:w-80 w-65 !mx-auto z-10">
              <Notifications onClose={closeNotifications} />
            </div>
          )}
        </div>
        <Link
          to="/personal-detail"
          ref={profileRef}
          className="inline-block rounded-full focus:outline-none focus:ring-2 focus:ring-[#0060A9] focus:ring-offset-2"
          aria-label="Go to profile"
        >
          <img
            src={user?.profileImage || profileImage}
            alt="Profile"
            width={50}
            height={50}
            className="w-8 h-8 sm:w-[50px] sm:h-[50px] object-cover rounded-full"
          />
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
