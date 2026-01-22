import React, { useState, useEffect } from "react";
import { userData } from "../../../dummyData";
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
import { userViewData } from "../../../dummyData";

const UserManagement = () => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("enterprise");
  const [userRole, setUserRole] = useState("super-admin");
  const handleDelete = () => {
    console.log("delete");
    setIsDeleteModalOpen(false);
    alert("ok");
  };
  useEffect(() => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        const userData = JSON.parse(userInfo);
        console.log("userDatauserData>>>>", userData);
        if (userData && userData.role) {
          setUserRole(userData.role);
        }
      }
    } catch (error) {
      console.error("Error parsing userInfo from localStorage:", error);
      // Keep default role if there's an error
    }
  }, []);

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
            <h1 className="font-Geom text-lg md:text-xl">Admins</h1>
            <div className="flex gap-3 sm:w-[70%] w-full">
              <SearchField placeholder="Search" />
              <Filters onClick={() => setIsFilterBarOpen(!isFilterBarOpen)} />
            </div>
          </div>

          <div className="overflow-x-auto my-7">
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
                      <th>Subscription</th>
                      <th>Status</th>
                    </>
                  )}
                  <th className="!text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {userData?.map((supplier, index) => (
                  <tr
                    key={supplier.id}
                    className="border-b-[1px] border-[#DEDFE0] last:border-0"
                  >
                    <td className="py-3 px-4 text-sm font-light ">
                      {supplier.name}
                    </td>
                    <td className="py-3 font-light text-sm">
                      {supplier.email}
                    </td>
                    <td className="py-3 px-4 text-sm font-light">
                      {supplier.phone}
                    </td>
                    <td className="py-3 px-4 text-sm font-light">
                      {supplier._id}
                    </td>
                    {activeTab === "admins" && (
                      <td className="py-3 px-4 text-sm font-light">
                        {supplier.role}
                      </td>
                    )}
                    {activeTab === "endUsers" && (
                      <>
                        <td className="py-3 px-4 text-sm font-light">
                          {supplier.subscription}
                        </td>
                        <td
                          className={`py-3 px-4 text-sm font-light ${
                            supplier.status == "Expire" ? "text-red-600" : ""
                          }`}
                        >
                          {supplier.status}
                        </td>
                      </>
                    )}

                    <td className="py-3 px-4 font-light flex justify-center gap-3">
                      <Tooltip tooltipContent="Archive User">
                        <img src={archivedIcon} width={19} />
                      </Tooltip>
                      <Tooltip tooltipContent="View User">
                        <IoEyeOutline
                          onClick={() => setIsViewModalOpen(true)}
                          size={22}
                          className="text-[#0061A9]"
                        />
                      </Tooltip>
                      {activeTab !== "endUsers" && (
                        <RiDeleteBin6Line
                          onClick={() => setIsDeleteModalOpen(true)}
                          size={20}
                          className="text-red-600"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <ViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          viewData={userViewData}
        />
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
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
