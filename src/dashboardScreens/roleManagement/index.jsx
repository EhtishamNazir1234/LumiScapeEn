import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { roleService } from "../../services/role.service";
import { MdOutlineEdit } from "react-icons/md";

const RolesManagement = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await roleService.getAll();
      setRoles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching roles:", err);
      setError(err?.response?.data?.message || "Failed to load roles");
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="md:mt-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="font-vivita text-[24px] font-medium w-full">
          Role Management
        </h1>
        <div className="flex gap-5 w-full md:flex-row-reverse">
          <button
            className="font-vivita custom-shadow-button hover:opacity-90 w-full md:!w-40 px-6 md:px-10 py-3 md:py-4"
            onClick={() => navigate("/new-role")}
          >
            Add New Role
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading roles...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error}</div>
      ) : roles.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No roles yet. Create one with &quot;Add New Role&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {roles.map((role) => (
            <div
              key={role._id}
              className="flex-1 box-shadow min-h-[4rem] md:min-h-[5.5rem] flex items-center justify-between gap-3 bg-[#F3F7FA] rounded-xl text-base md:text-lg font-Geom px-4 py-3 cursor-pointer hover:bg-[#E8EEF4] transition"
              onClick={() => navigate(`/roles/edit/${role._id}`)}
            >
              <span className="truncate flex-1">
                {role.roleName || "Unnamed role"}
              </span>
              <MdOutlineEdit
                className="flex-shrink-0 text-[#0061A9]"
                size={22}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/roles/edit/${role._id}`);
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RolesManagement;
