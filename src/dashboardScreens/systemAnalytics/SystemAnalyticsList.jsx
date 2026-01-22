import React, { useState, useEffect } from "react";
import { smartHomeDeviceData } from "../../../dummyData";
import SearchField from "../../common/SearchField";
import Pagination from "../../common/Pagination";
import { SYSTEM_ANALYTICS_TABLE_HEADERS } from "../../constant";

const Table = () => {
  const [activeTab, setActiveTab] = useState("enterprise");
  const [userRole, setUserRole] = useState("super-admin");

  useEffect(() => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        const parsedUser = JSON.parse(userInfo);
        console.log("userDatauserData", parsedUser);
        if (parsedUser && parsedUser.role) {
          setUserRole(parsedUser.role);
        }
      }
    } catch (error) {
      console.error("Error parsing userInfo from localStorage:", error);
      // Keep default role if there's an error
    }
  }, []);
  return (
    <>
      <div className="global-bg-color rounded-3xl md:p-7 p-3 box-shadow">
        <div className="md:flex  justify-between items-center gap-4">
          <h1 className="font-Geom text-lg md:text-xl">Device Usage Table</h1>
          <div className="flex gap-3 sm:w-[48%] w-fulls">
            <SearchField placeholder="Search" />
          </div>
        </div>
        <div className="overflow-x-auto my-7">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                {SYSTEM_ANALYTICS_TABLE_HEADERS.map((header, index) => (
                  <th key={index} className="py-4 text-sm font-light">
                    {header}
                  </th>
                ))}
                {activeTab === "admins" && <th>Role</th>}
                {activeTab === "endUsers" && <></>}
              </tr>
            </thead>
            <tbody>
              {smartHomeDeviceData?.map((supplier, index) => (
                <tr key={index} className="border-b-[1px] border-[#DEDFE0]">
                  <td className="py-3 px-4 text-sm font-light">
                    {supplier.device}
                  </td>
                  <td className="py-3 px-4 font-light text-sm">
                    {supplier.category}
                  </td>
                  <td className="py-3 px-4 text-sm font-light">
                    {supplier.count}
                  </td>
                  <td className="py-3 px-4 text-sm font-light">
                    {supplier.percentage}
                  </td>
                  <td className="py-3 px-4 text-sm font-light">
                    <div className="flex justify-start gap-3">
                      {supplier.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination totalPages={3} />
      </div>
    </>
  );
};
export default Table;
