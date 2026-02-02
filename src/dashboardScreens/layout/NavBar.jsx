import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import chatIcon from "../../assets/chatIcon.svg";
import notification from "../../assets/notification.svg";
import profileImage from "../../assets/profile.svg";
import Notifications from "../../common/Notifications";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { useChat } from "../../context/ChatContext";

const NavBar = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const { totalUnreadChatMessages } = useChat();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

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
    <div className="flex md:justify-between justify-end xl:mt-9 xl:my-4 my-4">
      <div className="sm:block hidden leading-8">
        <h1 className="font-[500px] xl:text-2xl text-lg  font-vivita">
          Welcome {user?.name || "Admin"}!
        </h1>
        <p className="text-[#337FBA] font-[300px] xl:text-base text-[14px] font-Geom">
          Manage users, devices, and system performance effortlessly.
        </p>
      </div>
      <div className="flex gap-4 relative items-center">
        <Link to="/chat" className="relative p-0 border-0 bg-transparent cursor-pointer inline-block" aria-label={totalUnreadChatMessages > 0 ? `${totalUnreadChatMessages} unread chat messages` : "Chat"}>
          <img src={chatIcon} width={25} height={25} alt="Chat" />
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
            <img src={notification} width={25} height={25} alt="" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-medium px-1">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-5 md:w-80 w-65 !mx-auto z-10">
              <Notifications />
            </div>
          )}
        </div>
        <img
          src={user?.profileImage || profileImage}
          alt="Profile"
          width={50}
          height={50}
          className="w-[50px] h-[50px] object-cover rounded-full"
          ref={profileRef}
        />
      </div>
    </div>
  );
};

export default NavBar;
