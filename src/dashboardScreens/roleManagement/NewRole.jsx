import React, { useState } from "react";
import CustomCheckbox from "../../common/CustomCheckbox";
import { initialPermissions } from "../../../dummyData";

const NewRole = () => {
  const [roleName, setRoleName] = useState("Admin");
  const [permissions, setPermissions] = useState(initialPermissions);
  const handleCheck = (id) => {
    setPermissions((prev) =>
      prev.map((perm) =>
        perm.id === id ? { ...perm, permission: !perm.permission } : perm
      )
    );
  };

  return (
    <div className="space-y-5 mb-10">
      <div>
        <h1 className="font-vivita font-medium text-[24px]">Create New Role</h1>
      </div>
      <div className="global-bg-color box-shadow rounded-2xl p-3 md:p-6">
        <div className="py-3 md:py-5">
          <label className="font-Geom">Role Name</label>
          <input
            className="w-full bg-white box-shadow rounded-lg px-3 md:px-4 py-3 md:py-4 text-gray-500 font-Geom focus:outline-none"
            placeholder="Admin"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
        </div>
        <div>
          <label className="font-Geom">Permissions</label>
          <div className="box-shadow grid md:grid-cols-2 gap-x-5 rounded-2xl p-3 md:pl-15 md:pr-8 md:py-8 bg-white">
            {permissions.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 my-2"
                >
                  <span className="text-[#0060A9] font-Geom font-light text-sm md:text-lg min-w-[140px] md:min-w-[200px] md:ml-2 ml-0">
                    {item.label}
                  </span>
                  <CustomCheckbox
                    id={index}
                    checked={item.permission}
                    onChange={() => handleCheck(item.id)}
                    className="md:mr-10 mr-2"
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-end">
            <div className="flex md:h-[60px] justify-end mt-5">
              <button className="custom-shadow-button font-vivita">
                Update Role
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRole;
