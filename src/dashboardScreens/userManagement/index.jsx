import React, { useState, useEffect } from "react";
import SearchField from "../../common/SearchField";
import Filters from "../../common/Filters";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../../common/DeleteModal";
import ViewModal from "../../common/ViewModal";
import archivedIcon from "../../assets/archived.svg";
import Tooltip from "../../common/Toltip";
import FilterCanvasBar from "./FilterCanvasBar";
import { userService } from "../../services/user.service";

const UserManagement = () => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("enterprise");
  const [userRole, setUserRole] = useState("super-admin");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewData, setViewData] = useState(null);

  // Map activeTab to role filter
  const getRoleFilter = () => {
    if (activeTab === "admins") return "admin";
    if (activeTab === "enterprise") return "enterprise";
    if (activeTab === "endUsers") return "end-user";
    return null;
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const role = getRoleFilter();
      const params = {};
      if (role) params.role = role;
      if (searchQuery) params.search = searchQuery;

      const response = await userService.getAll(params);
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

  useEffect(() => {
    fetchUsers();
  }, [activeTab, searchQuery]);

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

  const handleView = async (user) => {
    try {
      const userDetails = await userService.getById(user._id);
      setViewData({
        modalTitle: "User Details",
        userId: userDetails.userId || userDetails._id,
        name: userDetails.name,
        email: userDetails.email,
        phone: userDetails.phone || "N/A",
        role: userDetails.role,
        lastLogin: userDetails.lastLogin || "N/A",
      });
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      alert("Failed to load user details.");
    }
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
                onClick={() => setActiveTab("admins")}
              >
                Admins
              </button>
            )}
            <button
              data-tip="This is a tooltip!"
              className={`flex-1 py-1 cursor-pointer rounded-lg box-shadow ${
                activeTab === "enterprise" ? "bg-[#337FBA] text-white" : ""
              }`}
              onClick={() => setActiveTab("enterprise")}
            >
              Enterprise
            </button>
            <button
              className={`flex-1 py-1 cursor-pointer rounded-lg box-shadow ${
                activeTab === "endUsers" ? "bg-[#337FBA] text-white" : ""
              }`}
              onClick={() => setActiveTab("endUsers")}
            >
              End Users
            </button>
          </div>
          {userRole == "super-admin" && (
            <div className="flex justify-end md:w-[23%] w-full">
              <button
                onClick={() => navigate("/add-admin")}
                className="custom-shadow-button font-vivita whitespace-nowrap !py-3 !px-6 md:!w-full !w-[50%]"
              >
                Add New Admin
              </button>
            </div>
          )}
        </div>
        <div className="global-bg-color rounded-[20px] md:p-7 p-3 box-shadow">
          <div className="md:flex  justify-between items-center gap-4">
            <h1 className="font-Geom text-lg md:text-xl">
              {activeTab === "admins" ? "Admins" : activeTab === "enterprise" ? "Enterprise Users" : "End Users"}
            </h1>
            <div className="flex gap-3 sm:w-[70%] w-full">
              <SearchField 
                placeholder="Search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Filters onClick={() => setIsFilterBarOpen(!isFilterBarOpen)} />
            </div>
          </div>

          <div className="overflow-x-auto my-7">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : users.length === 0 ? (
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
                    {activeTab === "endUsers" && (
                      <>
                        <th>Status</th>
                      </>
                    )}
                    <th className="!text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user._id || index}
                      className="border-b-[1px] border-[#DEDFE0] last:border-0"
                    >
                      <td className="py-3 px-4 text-sm font-light ">
                        {user.name}
                      </td>
                      <td className="py-3 font-light text-sm">
                        {user.email}
                      </td>
                      <td className="py-3 px-4 text-sm font-light">
                        {user.phone || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm font-light">
                        {user.userId || user._id}
                      </td>
                      {activeTab === "admins" && (
                        <td className="py-3 px-4 text-sm font-light">
                          {user.role}
                        </td>
                      )}
                      {activeTab === "endUsers" && (
                        <td
                          className={`py-3 px-4 text-sm font-light ${
                            user.status === "Archived" || user.status === "Expire" ? "text-red-600" : ""
                          }`}
                        >
                          {user.status || "Active"}
                        </td>
                      )}

                      <td className="py-3 px-4 font-light flex justify-center gap-3">
                        <Tooltip tooltipContent="Archive User">
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
          onClose={() => setIsFilterBarOpen(false)}
        />
      )}
    </div>
  );
};

export default UserManagement;
