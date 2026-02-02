import React, { useState } from "react";
import { Link } from "react-router-dom";
import loginImage from "../../assets/login.png";
import InputField from "../../common/InputField";
import Logo from "../../assets/logo.svg";
import { authService } from "../../services/auth.service";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setResetUrl("");
    setLoading(true);

    if (!email?.trim()) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    try {
      const data = await authService.forgotPassword(email.trim());
      setMessage(data.message || "If an account exists with this email, a reset link has been sent.");
      if (data.resetUrl) setResetUrl(data.resetUrl);
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
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
              Forgot password?
            </h2>
            <p className="text-gray-600 text-sm text-center mb-6">
              Enter your email and we’ll send you a link to reset your password.
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            {message && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-800 rounded space-y-2">
                <p>{message}</p>
                {resetUrl && (
                  <p className="text-sm">
                    <span className="text-gray-600">Dev mode – </span>
                    <a href={resetUrl} className="text-[#0060A9] underline break-all" target="_blank" rel="noopener noreferrer">
                      Open reset link
                    </a>
                  </p>
                )}
              </div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <InputField
                id="email"
                label="Email address"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                rounded
                color="#0060A9"
                required
              />
              <button
                type="submit"
                className="custom-shadow-button my-3 w-full"
                disabled={loading}
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>
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

export default ForgotPassword;
