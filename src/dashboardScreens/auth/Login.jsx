import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import loginImage from "../../assets/login.png";
import InputField from "../../common/InputField";
import Logo from "../../assets/logo.svg";
import { useAuth } from "../../store/hooks";
import { getRoleBasedRoute } from "../../utils/roleRouting";

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!emailOrPhone?.trim() || !password) {
      setError("Please enter your email or phone number and password");
      setLoading(false);
      return;
    }

    try {
      const userData = await login(emailOrPhone.trim(), password, rememberMe);
      // Redirect based on user role
      const roleBasedRoute = getRoleBasedRoute(userData?.role);
      navigate(roleBasedRoute);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
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
            <img src={Logo} width={300} height={300} />
          </div>

          <div
            className="bg-white bg-opacity-90 rounded-2xl p-8 w-full "
            style={{ boxShadow: "inset 0 0px 4px rgba(0, 0, 0, 0.6)" }}
          >
            <h2 className="text-2xl font-semibold text-center mb-10">
              Welcome Back!
            </h2>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <InputField
                  id="emailOrPhone"
                  label="Email or Phone number"
                  type="text"
                  placeholder="Email or mobile number"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  rounded
                  color="#0060A9"
                  required
                />
              </div>
              <div>
                <InputField
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  rounded
                  color="#0060A9"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="custom-shadow-button my-3 w-full"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <div className="flex justify-between items-center mt-4 text-sm text-blue-600 ">
              <label className="flex items-center gap-2 cursor-pointer font-light text-[#0060A9]">
                <input 
                  type="checkbox" 
                  className="w-4 h-4" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="hover:underline font-light text-[#669FCB]">
                Forgot password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
