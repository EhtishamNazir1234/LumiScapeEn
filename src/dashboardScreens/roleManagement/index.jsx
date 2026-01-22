import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RolesManagement = () => {
  const navigate = useNavigate();
  const [roleUserList ] = useState(["Admin 1", "Admin 2", "Admin 3", "Admin 5", "Admin 6", "Admin 7", "Admin 8"])
  return (
    <div className="md:mt-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="font-vivita text-[24px] font-medium w-full">Create New Role</h1>
        <div className="flex gap-5 w-full md:flex-row-reverse">
          <button
            className="font-vivita custom-shadow-button hover:opacity-90 w-full md:!w-40 px-6 md:px-10 py-3 md:py-4"
            onClick={() => navigate("/new-role")}
          >
            Add New Role
          </button>
          <button className="border border-[#2A7BB6] text-[#2A7BB6] whitespace-nowrap font-vivita px-6 md:px-10 py-2 md:py-4 rounded-full cursor-pointer hover:bg-[#f4f8fb] w-full md:w-auto">
            Edit Roles
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {roleUserList.map((role, idx) => (
          <div
            key={role}
            className="flex-1 box-shadow h-16 md:h-22 flex items-center justify-center bg-[#F3F7FA] rounded-xl text-base md:text-lg font-Geom"
          >
            {role}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RolesManagement;