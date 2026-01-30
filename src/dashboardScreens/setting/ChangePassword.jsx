import React, { useState } from "react";
import InputField from "../../common/InputField";
import { authService } from "../../services/auth.service";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!currentPassword.trim()) {
      setMessage({ type: "error", text: "Current password is required." });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New password and confirmation do not match." });
      return;
    }
    if (currentPassword === newPassword) {
      setMessage({ type: "error", text: "New password must be different from current password." });
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      setMessage({ type: "success", text: "Password changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const text =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Failed to change password. Please check your current password.";
      setMessage({ type: "error", text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="global-bg-color lg:w-[65%] h-auto rounded-[20px] md:p-10 p-5 box-shadow">
      <h1 className="text-[20px] font-[500] font-vivita">Change Password</h1>
      <p className="text-[#337FBA] text-[15px] mt-1">
        Enter your current password and choose a new password.
      </p>

      <form onSubmit={handleSubmit}>
        {message.text && (
          <div
            className={`mt-4 mb-4 px-4 py-2 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="my-[3rem] space-y-6">
          <InputField
            id="currentPassword"
            label="Current Password"
            type="password"
            placeholder="Enter your current password"
            rounded
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            color="#0060A9"
          />
          <InputField
            id="newPassword"
            label="New Password"
            type="password"
            placeholder="At least 6 characters"
            rounded
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            color="#0060A9"
          />
          <InputField
            id="confirmPassword"
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter new password"
            rounded
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            color="#0060A9"
          />
        </div>

        <div className="flex justify-end mt-[4rem]">
          <button
            type="submit"
            className="custom-shadow-button font-vivita !py-3"
            disabled={loading}
          >
            {loading ? "Updating…" : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
