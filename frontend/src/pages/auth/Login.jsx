import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../../components/AuthHeader";
import Footer from "../../components/Footer";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://192.168.1.75:8000/api/auth/login", {
        email,
        password,
      });
      const user = res.data.user;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/homepage");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AuthHeader />

      <div className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">
          {/* Left Section */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#0077b6] to-[#00b4d8] items-center justify-center p-6 lg:p-10 text-white">
            <div className="text-center space-y-2">
              <h2 className="text-2xl lg:text-3xl font-bold">
                Welcome to AquaHope
              </h2>
              <p className="text-sm lg:text-base font-light">
                Bringing clean water to those who need it most.
                <br />
                Let's make a difference together.
              </p>
            </div>
          </div>

          {/* Right Section (Form) */}
          <form
            onSubmit={handleLogin}
            className="w-full md:w-1/2 p-6 sm:p-8 lg:p-10"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-center mb-1 sm:mb-2">
              Login
            </h2>
            <p className="text-center text-sm text-gray-500 mb-4 sm:mb-6">
              Welcome back! Please login to your account
            </p>

            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}

            {/* Email Input */}
            <div className="mb-4 relative">
              <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-10 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#0077b6] text-sm"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-4 relative">
              <FaLock className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#0077b6] text-sm"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#0077b6] text-white p-3 rounded font-medium hover:bg-[#005f8d] hover:scale-[1.02] transition duration-300 text-sm"
            >
              Login
            </button>

            {/* Links */}
            <div className="text-sm text-center mt-5">
              <p>
                Forgot password?{" "}
                <span
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={() => navigate("/forgot-password")}
                >
                  Reset here
                </span>
              </p>
              <p className="mt-2">
                Don’t have an account?{" "}
                <span
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={() => navigate("/register")}
                >
                  Register
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
