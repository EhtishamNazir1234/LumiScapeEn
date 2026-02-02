import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import loginImage from "../../assets/login.png";
import InputField from "../../common/InputField";
import Logo from "../../assets/logo.svg";
import { authService } from "../../services/auth.service";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please use the link from your email or request a new one.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Invalid reset link. Please request a new one from the Forgot password page.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const data = await authService.setNewPassword(token, newPassword);
      setMessage(data.message || "Password has been reset. You can now log in.");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid or expired link. Please request a new password reset."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen flex bg-cover bg-center"
      style={{
        backgroundImage: `
        linear-gradient(
          to right, 
          rgba(37, 99, 235, 0.6),
          rgba(134, 239, 172, 0.3),
          rgba(74, 222, 128, 0)
        ),
        url(${loginImage})
      `,
      }}
    >
      <div className="lg:w-[80%] w-[90%] mx-auto">
        <div className="lg:w-[43%] md:w-[53%]">
          <div className="flex justify-center items-center my-10">
            <img src={Logo} alt="Logo" width={300} height={300} />
          </div>

          <div
            className="bg-white bg-opacity-90 rounded-2xl p-8 w-full"
            style={{ boxShadow: "inset 0 0px 4px rgba(0, 0, 0, 0.6)" }}
          >
            <h2 className="text-2xl font-semibold text-center mb-2">
              Set new password
            </h2>
            <p className="text-gray-600 text-sm text-center mb-6">
              Enter your new password below.
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            {message && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-800 rounded">
                {message}
              </div>
            )}
            {token ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <InputField
                  id="newPassword"
                  label="New password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  rounded
                  color="#0060A9"
                  required
                />
                <InputField
                  id="confirmPassword"
                  label="Confirm new password"
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  rounded
                  color="#0060A9"
                  required
                />
                <button
                  type="submit"
                  className="custom-shadow-button my-3 w-full"
                  disabled={loading}
                >
                  {loading ? "Resetting…" : "Reset password"}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <Link
                  to="/forgot-password"
                  className="block w-full text-center custom-shadow-button py-3"
                >
                  Request new reset link
                </Link>
              </div>
            )}
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-[#0060A9] hover:underline font-light text-sm"
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
