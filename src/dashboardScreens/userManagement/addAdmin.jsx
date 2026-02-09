import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import InputField from "../../common/InputField";
import { userService } from "../../services/user.service";
import { userManagementRoleOptions, userManagementRoleToTab } from "../../../dummyData";

const AddAdmin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roleFromUrl = searchParams.get("role");
  useEffect(() => {
    if (roleFromUrl && ["admin", "enterprise", "end-user"].includes(roleFromUrl)) {
      setRole(roleFromUrl);
    }
  }, [roleFromUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const name = [firstName, lastName].filter(Boolean).join(" ").trim();
    if (!name) {
      setError("Name is required.");
      return;
    }
    if (!email?.trim()) {
      setError("Email is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!role) {
      setError("Please select a role.");
      return;
    }
    setLoading(true);
    try {
      await userService.create({
        name,
        email: email.trim(),
        password,
        phone: (phone || "").trim(),
        role,
      });
      const tab = userManagementRoleToTab[role] || "enterprise";
      navigate(`/user-management?tab=${tab}`, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || err.message || "Failed to add user.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const roleLabel = userManagementRoleOptions.find((r) => r.value === role)?.label || "";
  const pageTitle =
    role === "admin"
      ? "Add New Admin"
      : role === "enterprise"
      ? "Add New Enterprise User"
      : role === "end-user"
      ? "Add New End User"
      : "Add New User";

  return (
    <div className="global-bg-color md:w-[75%] h-auto rounded-[20px] md:p-7 p-4 box-shadow">
      <h1 className="text-[20px] font-vivita">{pageTitle}</h1>
      <form onSubmit={handleSubmit} className="md:mt-[3rem] mt-[1rem] space-y-6">
        {error && (
          <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <InputField
            id="firstName"
            label="First Name"
            type="text"
            placeholder=""
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <InputField
            id="lastName"
            label="Last Name"
            type="text"
            placeholder=""
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <InputField
            id="phone"
            label="Phone number"
            type="tel"
            placeholder=""
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-light mb-2 text-black">
            Role
          </label>
          <div
            id="role"
            className="w-full rounded-lg bg-gray-100 px-4 py-2 text-gray-700 text-sm border border-gray-200 cursor-not-allowed"
          >
            {roleLabel || "—"}
          </div>
        </div>
        <div>
          <InputField
            id="email"
            label="Email"
            type="email"
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="Min 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3 my-5">
          <button
            type="button"
            onClick={() => navigate("/user-management")}
            className="px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="custom-shadow-button font-vivita md:!w-[30%] !py-3 disabled:opacity-60"
          >
            {loading ? "Adding…" : "Add User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAdmin;
