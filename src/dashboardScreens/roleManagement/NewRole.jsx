import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomCheckbox from "../../common/CustomCheckbox";
import { initialPermissions } from "../../../dummyData";
import { roleService } from "../../services/role.service";

const DEFAULT_PERMISSIONS = initialPermissions.map((p, i) => ({
  id: p.id ?? i + 1,
  label: p.label,
  permission: Boolean(p.permission),
}));

function mergePermissions(saved = [], defaultSet = DEFAULT_PERMISSIONS) {
  const byLabel = new Map(
    (saved || []).map((p) => [String(p.label).trim().toLowerCase(), p])
  );
  return defaultSet.map((d) => {
    const key = String(d.label).trim().toLowerCase();
    const savedItem = byLabel.get(key);
    return {
      id: d.id,
      label: d.label,
      permission: savedItem ? Boolean(savedItem.permission) : d.permission,
    };
  });
}

const NewRole = () => {
  const navigate = useNavigate();
  const { id: roleId } = useParams();
  const isEdit = Boolean(roleId);

  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState([...DEFAULT_PERMISSIONS]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    (async () => {
      try {
        setLoadError(null);
        const role = await roleService.getById(roleId);
        if (cancelled) return;
        setRoleName(role.roleName || "");
        setDescription(role.description || "");
        setPermissions(mergePermissions(role.permissions));
      } catch (err) {
        if (!cancelled) {
          setLoadError(err?.response?.data?.message || "Failed to load role");
        }
      }
    })();
    return () => { cancelled = true; };
  }, [isEdit, roleId]);

  const handleCheck = (id) => {
    setPermissions((prev) =>
      prev.map((perm) =>
        perm.id === id ? { ...perm, permission: !perm.permission } : perm
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    const name = roleName.trim();
    if (!name) {
      setSubmitError("Role name is required.");
      return;
    }

    const payload = {
      roleName: name,
      description: description.trim(),
      permissions: permissions.map((p) => ({
        id: p.id,
        label: p.label,
        permission: Boolean(p.permission),
      })),
    };

    setLoading(true);
    try {
      if (isEdit) {
        await roleService.update(roleId, payload);
      } else {
        await roleService.create(payload);
      }
      navigate("/roles");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        (isEdit ? "Failed to update role." : "Failed to create role.");
      setSubmitError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 mb-10">
      <div className="flex items-center justify-between w-full gap-4">
        <h1 className="font-vivita font-medium text-[24px]">
          {isEdit ? "Edit Role" : "Create New Role"}
        </h1>
        <button
          type="button"
          className="border border-[#2A7BB6] text-[#2A7BB6] font-vivita px-4 py-2 rounded-full cursor-pointer hover:bg-[#f4f8fb] shrink-0"
          onClick={() => navigate("/roles")}
        >
          Back to roles
        </button>
      </div>

      {loadError && (
        <div className="text-red-600 bg-red-50 px-4 py-2 rounded-lg">
          {loadError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="global-bg-color box-shadow rounded-2xl p-3 md:p-6"
      >
        <div className="py-3 md:py-5">
          <label className="font-Geom block mb-1">Role Name</label>
          <input
            className="w-full bg-white box-shadow rounded-lg px-3 md:px-4 py-3 md:py-4 text-gray-500 font-Geom focus:outline-none"
            placeholder="e.g. Admin, Customer Care"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
        </div>
        <div className="py-3 md:py-5">
          <label className="font-Geom block mb-1">Description (optional)</label>
          <input
            className="w-full bg-white box-shadow rounded-lg px-3 md:px-4 py-3 md:py-4 text-gray-500 font-Geom focus:outline-none"
            placeholder="Short description of this role"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="font-Geom block mb-2">Permissions</label>
          <div className="box-shadow grid md:grid-cols-2 gap-x-5 rounded-2xl p-3 md:pl-15 md:pr-8 md:py-8 bg-white">
            {permissions.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 my-2"
              >
                <span className="text-[#0060A9] font-Geom font-light text-sm md:text-lg min-w-[140px] md:min-w-[200px] md:ml-2 ml-0">
                  {item.label}
                </span>
                <CustomCheckbox
                  id={`perm-${item.id}-${index}`}
                  checked={item.permission}
                  onChange={() => handleCheck(item.id)}
                  className="md:mr-10 mr-2"
                />
              </div>
            ))}
          </div>
        </div>

        {submitError && (
          <div className="mt-4 text-red-600 text-sm">{submitError}</div>
        )}

        <div className="flex justify-end mt-5">
          <button
            type="submit"
            disabled={loading}
            className="custom-shadow-button font-vivita !w-auto shrink-0 !py-3 !px-6 disabled:opacity-50"
          >
            {loading ? "Saving..." : isEdit ? "Update Role" : "Create Role"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewRole;
