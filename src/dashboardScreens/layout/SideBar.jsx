import React, { useState, useEffect } from "react";
import {
  BackArrow,
  NextIcon,
  DashboardIcon,
  UserManagementIcon,
  SupplierManagement,
  DeviceManagement,
  Subscription,
  SystemAnalytics,
  Tickets,
  Chat,
  Settings,
  Logout,
  TariffIcon,
  RoleIcon,
  EnterpriseReports,
  HelpCenterIcon,
} from "../../assets/icon.jsx";
import colorLogo from "../../assets/colorLogo.svg";
import LogoIcon from "../../assets/logoIcon.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../../store/hooks";
import { useChat } from "../../store/hooks";
import { chatActions } from "../../store/slices/chatSlice";

// Permission labels must match Role permissions (e.g. dummyData.initialPermissions). If set, sidebar shows item only when user has that permission granted. If user has no permissions array, role-based visibility is used.
const menuItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    Icon: DashboardIcon,
    roles: ["super-admin", "admin"],
    navigate: "/",
  },
  {
    key: "userManagement",
    label: "User Management",
    Icon: UserManagementIcon,
    roles: ["super-admin", "admin"],
    permissionLabel: "View User",
    navigate: "/user-management",
  },
  {
    key: "supplierManagement",
    label: "Supplier Management",
    Icon: SupplierManagement,
    roles: ["super-admin"],
    navigate: "/supplier-management",
  },
  {
    key: "deviceManagement",
    label: "Device Management",
    Icon: DeviceManagement,
    roles: ["super-admin", "admin"],
    permissionLabel: "View Devices",
    navigate: "/device-management",
  },
  {
    key: "subscriptionRevenue",
    label: "Subscription & Revenue",
    Icon: Subscription,
    roles: ["super-admin"],
    navigate: "/subscriptions",
  },
  {
    key: "systemAnalytics ",
    label: "System Analytics ",
    Icon: SystemAnalytics,
    roles: ["super-admin"],
    navigate: "/system-analytics",
  },
  {
    key: "ticketsComplaints",
    label: "Tickets and Complaints",
    Icon: Tickets,
    roles: ["super-admin", "admin"],
    permissionLabel: "See Tickets and COmplaints",
    navigate: "/tickets",
  },
  {
    key: "chat",
    label: "Chat",
    Icon: Chat,
    roles: ["super-admin", "admin", "enterprise", "end-user"],
    permissionLabel: "Answer Chats",
    navigate: "/chat",
  },
  {
    key: "rolemanagement",
    label: "Role Management",
    Icon: RoleIcon,
    roles: ["super-admin"],
    navigate: "/roles",
  },
  {
    key: "discotariffrates",
    label: "DISCO Tariff Rates",
    Icon: TariffIcon,
    roles: ["super-admin"],
    navigate: "/tariff",
  },
  {
    key: "settings ",
    label: "Settings ",
    Icon: Settings,
    roles: ["super-admin", "admin"],
    navigate: "/settings",
  },
  {
    key:"dashboard",
    label:"Dashboard",
    Icon:DashboardIcon,
    roles:["enterprise", "end-user"],
    navigate:"/enterpriseDashboard",
  },
  {
    key: "subscribe",
    label: "Subscribe",
    Icon: Subscription,
    roles: ["enterprise", "end-user"],
    navigate: "/subscribe",
  },
  {
    key: "reports ",
    label: "Reports ",
    Icon:EnterpriseReports,
    roles: ["enterprise", "end-user"],
    navigate: "/reports",
  },
  {
    key: "helpCenter ",
    label: "Help Center ",
    Icon:HelpCenterIcon,
    roles: ["enterprise", "end-user"],
    navigate: "/help-center",
  },
  {
    key: "logout",
    label: "Logout",
    Icon: Logout,
    roles: ["super-admin", "admin", "enterprise", "end-user"],
  },
];

const Sidebar = ({}) => {
  const dispatch = useDispatch();
  const { user, logout } = useAuth();
  const { totalUnreadChatMessages } = useChat();
  const location = useLocation();
  const [isExpandSideBar, setIsExpandSideBar] = useState(
    window.innerWidth > 1024
  );
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const navigate = useNavigate();

  const userRole = user?.role || "super-admin";
  const userPermissions = user?.permissions || [];

  const hasPermission = (label) => {
    if (!label || !Array.isArray(userPermissions) || userPermissions.length === 0) return true;
    const entry = userPermissions.find((p) => String(p?.label).trim() === String(label).trim());
    return entry ? Boolean(entry.permission) : false;
  };

  const visibleMenuItems = menuItems.filter((item) => {
    if (!item.roles.includes(userRole)) return false;
    if (item.permissionLabel && userPermissions.length > 0) return hasPermission(item.permissionLabel);
    return true;
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile && !isExpandSideBar) {
    return (
      <div className="fixed top-4 left-2 z-50 rounded-xl  flex flex-col items-center justify-center p-2 w-12 h-12">
        <button
          className="w-8 h-8 flex items-center justify-center"
          onClick={() => setIsExpandSideBar(true)}
          aria-label="Open sidebar"
        >
          <svg
            width="28"
            height="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    );
  }

  const overlayClass =
    isExpandSideBar && isMobile ? "fixed top-0 left-0 z-50" : "";
  const widthClass = isExpandSideBar ? "w-72" : "w-20 mx-5 my-3 rounded-xl";

  return (
    <div
      className={`${overlayClass} ${widthClass} global-bg-color transition-all duration-600 h-screen flex flex-col shadow-2xl`}
    >
      <div className="px-6 pl-6 xl:py-10 py-5">
        {isExpandSideBar ? (
          <div className="flex justify-between gap-4 items-center">
            <img src={colorLogo} className="w-[130px] lg:w-[200px]" />
            <div
              className="cursor-pointer"
              onClick={() => setIsExpandSideBar(false)}
            >
              <BackArrow />
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-start items-start gap-2">
            <img src={LogoIcon} />
            <div
              className="cursor-pointer"
              onClick={() => setIsExpandSideBar(true)}
            >
              <NextIcon />
            </div>
          </div>
        )}
      </div>
      <nav className="flex-1 flex flex-col space-y-2">
        {visibleMenuItems.map(({ key, label, Icon, navigate: path }, idx, arr) => {
            const isActive = path === location.pathname;
            const isBottomItem =
              (key === "settings " || key === "logout") &&
              (arr.slice(idx).filter((i) => i.key === "settings " || i.key === "logout").length >= 1);
            const isLogoutRightAfterSettings = key === "logout" && arr[idx - 1]?.key === "settings ";
            return (
              <div
                key={key}
                onClick={() => {
                  if (key === "logout") {
                    dispatch(chatActions.resetChatState());
                    logout();
                    navigate("/login", { replace: true });
                  } else if (path) {
                    navigate(path);
                  }
                  if (isMobile) setIsExpandSideBar(false);
                }}
                style={
                  isActive
                    ? { boxShadow: "inset 4px 5px 5px rgba(0, 0, 0, 0.25)" }
                    : {}
                }
                className={`flex items-center gap-3 w-full lg:px-7 px-4 lg:py-3 py-2 cursor-pointer transition font-normal ${
                  isActive
                    ? "text-white bg-[linear-gradient(to_right,#96F6AE,#2A7BB6)]"
                    : ""
                } ${isBottomItem ? "mt-auto" : ""} ${isLogoutRightAfterSettings ? "!mt-0" : ""}`}
              >
                <span className="relative inline-flex">
                  <Icon fill={isActive ? "#fff" : "#000"} className="w-6 h-6" />
                  {key === "chat" && totalUnreadChatMessages > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-medium px-1">
                      {totalUnreadChatMessages > 99 ? "99+" : totalUnreadChatMessages}
                    </span>
                  )}
                </span>
                {isExpandSideBar && (
                  <span className="font-light lg:text-base text-[14px]">
                    {label}
                  </span>
                )}
              </div>
            );
          })}
      </nav>
    </div>
  );
};

export default Sidebar;
