import React, { useState, useEffect, useRef } from "react";
import chatIcon from "../../assets/chatIcon.svg";
import notification from "../../assets/notification.svg";
import profileImage from "../../assets/profile.svg";
import Notifications from "../../common/Notifications";
import { useAuth } from "../../context/AuthContext";

const NavBar = () => {
  const { user } = useAuth();
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
        <img src={chatIcon} width={25} height={25} />
        <div className="relative" ref={notificationRef}>
          <img
            src={notification}
            width={25}
            height={25}
            className="cursor-pointer"
            onClick={toggleNotifications}
          />
          {showNotifications && (
            <div className="absolute right-0 mt-5 md:w-80 w-65 !mx-auto z-10">
              <Notifications />
            </div>
          )}
        </div>
        <img src={profileImage} width={50} height={50} ref={profileRef} />
      </div>
    </div>
  );
};

export default NavBar;
