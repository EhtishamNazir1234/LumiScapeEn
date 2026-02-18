import React, { useState, useEffect } from "react";
import SearchField from "../../common/SearchField";
import Filters from "../../common/Filters";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate, useSearchParams } from "react-router-dom";
import DeleteModal from "../../common/DeleteModal";
import ViewModal from "../../common/ViewModal";
import archivedIcon from "../../assets/archived.svg";
import Tooltip from "../../common/Toltip";
import FilterCanvasBar from "./FilterCanvasBar";
import { userService } from "../../services/user.service";
import { userManagementAddButtonByTab, userManagementValidTabs } from "../../../dummyData";

const UserManagement = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("enterprise");
  const [userRole, setUserRole] = useState("super-admin");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchQueries, setSearchQueries] = useState({
    admins: "",
    enterprise: "",
    endUsers: "",
  });
  const [viewData, setViewData] = useState(null);
  const [statusFilters, setStatusFilters] = useState({
    inactive: true,
  });
  const [planFilters, setPlanFilters] = useState({
    Basic: false,
    Standard: false,
    Premium: false,
  });
  const [showArchived, setShowArchived] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  // Fetch all users once and use client-side filtering for tabs/search/filters.
  // Use cache on mount so switching sidebar menus doesn't refetch; pass true for explicit refresh.
  const fetchUsers = async (skipCache = false) => {
    try {
      setLoading(true);
      const response = await userService.getAll({ limit: 5000 }, { skipCache });
      setUsers(response.users || response || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        const userData = JSON.parse(userInfo);
        if (userData && userData.role) {
          setUserRole(userData.role);
        }
      }
    } catch (error) {
      console.error("Error parsing userInfo from localStorage:", error);
    }
  }, []);

  const tabFromUrl = searchParams.get("tab");
  useEffect(() => {
    if (tabFromUrl && userManagementValidTabs.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("tab", tab);
      return next;
    });
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await userService.delete(userToDelete._id);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  const handleArchive = async (user) => {
    try {
      await userService.archive(user._id);
      fetchUsers();
    } catch (error) {
      console.error("Error archiving user:", error);
      alert("Failed to archive user. Please try again.");
    }
  };

  // Derive end user status primarily from explicit status,
  // and use lastLogin only to distinguish never-logged-in users.
  const getEndUserStatus = (user) => {
    // Respect archived state explicitly
    if (user.status === "Archived") {
      return "Archived";
    }

    // If admin has explicitly marked user as Inactive, keep it
    if (user.status === "Inactive") {
      return "Inactive";
    }

    // For "Active" users:
    // - If they have never logged in, treat as Inactive
    // - If they have logged in at least once, treat as Active
    if (!user.lastLogin) {
      return "Inactive";
    }

    return "Active";
  };

  const getFilteredUsers = () => {
    let result = Array.isArray(users) ? [...users] : [];

    // First, apply role-based filtering per tab
    if (activeTab === "admins") {
      // Show both admin and super-admin roles in Admins tab
      result = result.filter(
        (user) => user.role === "admin" || user.role === "super-admin"
      );
    } else if (activeTab === "enterprise") {
      result = result.filter((user) => user.role === "enterprise");
    } else if (activeTab === "endUsers") {
      result = result.filter((user) => user.role === "end-user");
    }

    // Search filter (client-side: name, email, userId/_id), per tab
    const currentSearch =
      activeTab && searchQueries[activeTab]
        ? searchQueries[activeTab]
        : "";
    const query = currentSearch.trim().toLowerCase();
    if (query) {
      result = result.filter((user) => {
        const name = (user.name || "").toLowerCase();
        const email = (user.email || "").toLowerCase();
        const idStr = String(user.userId || user._id || "").toLowerCase();
        return (
          name.includes(query) ||
          email.includes(query) ||
          idStr.includes(query)
        );
      });
    }

    // If "Show Archived" is ON, show only archived users for this tab
    if (showArchived) {
      result = result.filter((user) => user.status === "Archived");
    } else {
      // Otherwise, exclude archived users and control visibility of inactive users.
      result = result.filter((user) => user.status !== "Archived");

      const showInactive = statusFilters.inactive;

      result = result.filter((user) => {
        if (activeTab === "endUsers") {
          const derivedStatus = getEndUserStatus(user); // "Active" | "Inactive"

          if (derivedStatus === "Active") return true; // Active users always shown
          if (derivedStatus === "Inactive") return showInactive;
          return false;
        }

        // For non-end-users, use explicit status
        if (user.status === "Active") return true; // Active always shown
        if (user.status === "Inactive") return showInactive;
        return false;
      });
    }

    // Plan filters for End Users and Enterprise - match subscription (Basic/Standard/Premium)
    if (activeTab === "endUsers" || activeTab === "enterprise") {
      const selectedPlans = Object.entries(planFilters)
        .filter(([, value]) => value)
        .map(([key]) => key);

      if (selectedPlans.length > 0) {
        result = result.filter((user) => {
          const sub = (user.subscription || "").trim();
          if (!sub) return false;
          const subLower = sub.toLowerCase();
          return selectedPlans.some((plan) => {
            const planLower = plan.toLowerCase();
            if (planLower === "premium") {
              return subLower.includes("premium") || subLower.includes("primium");
            }
            return subLower.includes(planLower);
          });
        });
      }
    }

    return result;
  };

  const filteredUsers = getFilteredUsers();

  const highlightMatch = (value) => {
    const text = String(value ?? "");
    const currentSearch =
      activeTab && searchQueries[activeTab]
        ? searchQueries[activeTab]
        : "";
    const query = currentSearch.trim();
    if (!query) return text;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const result = [];
    let start = 0;

    while (true) {
      const index = lowerText.indexOf(lowerQuery, start);
      if (index === -1) {
        if (start === 0) return text;
        result.push(text.slice(start));
        break;
      }
      if (index > start) {
        result.push(text.slice(start, index));
      }
      result.push(
        <span key={index} className="bg-yellow-200">
          {text.slice(index, index + query.length)}
        </span>
      );
      start = index + query.length;
    }

    return result;
  };

  const hasUsersWithStatusInCurrentTab = (desiredStatus) => {
    return users.some((user) => {
      // Apply tab role filter
      if (activeTab === "admins") {
        if (!(user.role === "admin" || user.role === "super-admin")) {
          return false;
        }
      } else if (activeTab === "enterprise") {
        if (user.role !== "enterprise") return false;
      } else if (activeTab === "endUsers") {
        if (user.role !== "end-user") return false;
      }

      // Respect archived toggle
      if (!showArchived && user.status === "Archived") {
        return false;
      }

      if (activeTab === "endUsers") {
        const derived = getEndUserStatus(user);
        return derived === desiredStatus;
      }

      // For non-end-users, use explicit status; ignore Archived when checking Active/Inactive
      if (user.status === "Archived") return false;
      return user.status === desiredStatus;
    });
  };

  const setStatusFiltersWithToast = (updater) => {
    setStatusFilters((prev) => {
      const next =
        typeof updater === "function" ? updater(prev) : { ...prev, ...updater };

      // If Inactive just turned on, but there are no inactive users in this tab
      if (!prev.inactive && next.inactive) {
        const hasInactive = hasUsersWithStatusInCurrentTab("Inactive");
        if (!hasInactive) {
          setToastMessage("No inactive user");
        }
      }

      return next;
    });
  };

  const handleView = (user) => {
    // Avoid extra API calls – use already loaded list data
    const safeUser = user || {};
    setViewData({
      modalTitle: "User Details",
      userId: String(safeUser.userId || safeUser._id || "").replace(/^User/i, ""),
      name: safeUser.name || "N/A",
      email: safeUser.email || "N/A",
      phone: safeUser.phone || "N/A",
      role: safeUser.role || "N/A",
      lastLogin: safeUser.lastLogin || "N/A",
    });
    setIsViewModalOpen(true);
  };

  return (
    <div className="flex py-3">
      <div className={`space-y-5 ${isFilterBarOpen ? "w-[82%]" : "w-full"}`}>
        <div className="flex md:flex-row flex-col-reverse  justify-between items-start md:items-center gap-4">
          <div className="shadow w-full md:w-[60%] flex p-2 rounded-xl gap-4 box-shadow">
            {userRole == "super-admin" && (
              <button
                className={`flex-1 py-1 cursor-pointer rounded-lg box-shadow ${
                  activeTab === "admins" ? "bg-[#337FBA] text-white" : ""
                }`}
                onClick={() => handleTabChange("admins")}
              >
                Admins
              </button>
            )}
            <button
              data-tip="This is a tooltip!"
              className={`flex-1 py-1 cursor-pointer rounded-lg box-shadow ${
                activeTab === "enterprise" ? "bg-[#337FBA] text-white" : ""
              }`}
              onClick={() => handleTabChange("enterprise")}
            >
              Enterprise
            </button>
            <button
              className={`flex-1 py-1 cursor-pointer rounded-lg box-shadow ${
                activeTab === "endUsers" ? "bg-[#337FBA] text-white" : ""
              }`}
              onClick={() => handleTabChange("endUsers")}
            >
              End Users
            </button>
          </div>
          {userRole == "super-admin" && userManagementAddButtonByTab[activeTab] && (
            <div className="flex justify-end md:w-[23%] w-full">
              <button
                onClick={() => navigate(`/add-admin?role=${userManagementAddButtonByTab[activeTab].role}`)}
                className="custom-shadow-button font-vivita whitespace-nowrap !py-3 !px-6 md:!w-full !w-[50%]"
              >
                {userManagementAddButtonByTab[activeTab].label}
              </button>
            </div>
          )}
        </div>
        <div className="global-bg-color rounded-[20px] md:p-7 p-3 box-shadow">
          <div className="md:flex  justify-between items-center gap-4">
            <h1 className="font-Geom text-lg md:text-xl">
              {activeTab === "admins" ? "Admins" : activeTab === "enterprise" ? "Enterprise Users" : "End Users"}
            </h1>
            <div className="flex gap-3 sm:w-[70%] w-full items-center">
              <SearchField 
                placeholder="Search" 
                value={searchQueries[activeTab] || ""}
                onChange={(e) =>
                  setSearchQueries((prev) => ({
                    ...prev,
                    [activeTab]: e.target.value,
                  }))
                }
              />
              <button
                onClick={() => fetchUsers(true)}
                disabled={loading}
                className="px-3 py-2 text-sm border border-[#0060A9] text-[#0060A9] rounded-lg hover:bg-[#0060A9]/10 disabled:opacity-50"
                title="Refresh users"
              >
                Refresh
              </button>
              <Filters onClick={() => setIsFilterBarOpen(!isFilterBarOpen)} />
            </div>
          </div>

          <div className="overflow-x-auto my-7">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">No users found</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="table-header">
                    <th>Name</th>
                    <th>Email Address</th>
                    <th>Phone</th>
                    <th>User Id</th>
                    {activeTab === "admins" && <th>Role</th>}
                    {(activeTab === "endUsers" || activeTab === "enterprise") && (
                      <>
                        {activeTab === "endUsers" && <th>Status</th>}
                        <th>Subscription</th>
                      </>
                    )}
                    <th className="!text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user._id || index}
                      className="border-b-[1px] border-[#DEDFE0] last:border-0"
                    >
                      <td className="py-3 px-4 text-sm font-light ">
                        {highlightMatch(user.name)}
                      </td>
                      <td className="py-3 font-light text-sm">
                        {highlightMatch(user.email)}
                      </td>
                      <td className="py-3 px-4 text-sm font-light">
                        {highlightMatch(user.phone || "N/A")}
                      </td>
                      <td className="py-3 px-4 text-sm font-light">
                        {highlightMatch(
                          String(user.userId || user._id || "").replace(
                            /^User/i,
                            ""
                          )
                        )}
                      </td>
                      {activeTab === "admins" && (
                        <td className="py-3 px-4 text-sm font-light">
                          {user.role}
                        </td>
                      )}
                      {activeTab === "endUsers" && (
                        <td
                          className={`py-3 px-4 text-sm font-light ${
                            getEndUserStatus(user) === "Archived" ? "text-red-600" : ""
                          }`}
                        >
                          {getEndUserStatus(user)}
                        </td>
                      )}
                      {(activeTab === "endUsers" || activeTab === "enterprise") && (
                        <td className="py-3 px-4 text-sm font-light">
                          {user.subscriptionStatus === "Active" && user.subscription
                            ? `${user.subscription}`
                            : "—"}
                        </td>
                      )}

                      <td className="py-3 px-4 font-light flex justify-center gap-3">
                        <Tooltip
                          tooltipContent={
                            user.status === "Archived"
                              ? "Unarchive User"
                              : "Archive User"
                          }
                        >
                          <img 
                            src={archivedIcon} 
                            width={19} 
                            className="cursor-pointer"
                            onClick={() => handleArchive(user)}
                            alt="Archive"
                          />
                        </Tooltip>
                        <Tooltip tooltipContent="View User">
                          <IoEyeOutline
                            onClick={() => handleView(user)}
                            size={22}
                            className="text-[#0061A9] cursor-pointer"
                          />
                        </Tooltip>
                        {activeTab !== "endUsers" && (
                          <RiDeleteBin6Line
                            onClick={() => {
                              setUserToDelete(user);
                              setIsDeleteModalOpen(true);
                            }}
                            size={20}
                            className="text-red-600 cursor-pointer"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <ViewModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewData(null);
          }}
          viewData={viewData}
        />
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
          }}
          module="Admin"
          handleDelete={handleDelete}
        />
      </div>
      {isFilterBarOpen && (
        <FilterCanvasBar
          activeTab={activeTab}
          statusFilters={statusFilters}
          setStatusFilters={setStatusFiltersWithToast}
          planFilters={planFilters}
          setPlanFilters={setPlanFilters}
          showArchived={showArchived}
          setShowArchived={(checked) => {
            if (checked) {
              const hasArchivedInTab = users.some((user) => {
                if (activeTab === "admins") {
                  if (!(user.role === "admin" || user.role === "super-admin")) {
                    return false;
                  }
                } else if (activeTab === "enterprise") {
                  if (user.role !== "enterprise") return false;
                } else if (activeTab === "endUsers") {
                  if (user.role !== "end-user") return false;
                }
                return user.status === "Archived";
              });

              if (!hasArchivedInTab) {
                setToastMessage("No archived entity");
              }
            }
            setShowArchived(checked);
          }}
          onClose={() => setIsFilterBarOpen(false)}
        />
      )}
      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-4 py-2 rounded shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
