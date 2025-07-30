import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../../components/AuthHeader";
import Footer from "../../components/Footer";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function Login() {
  const [loginStage, setLoginStage] = useState("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpPurpose, setOtpPurpose] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const res = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });

      if (res.data.otpRequired) {
        setOtpPurpose(res.data.purpose);
        setEmail(res.data.email);
        setLoginStage("otp");
        setSuccessMessage(res.data.message);
        return;
      }
    } catch (err) {
      const data = err.response?.data;
      if (data?.otpRequired && data?.purpose === "verify") {
        setOtpPurpose("verify");
        setLoginStage("otp");
        setSuccessMessage(data.message);
        return;
      }
      setError(data?.message || "Login failed");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const res = await axiosInstance.post("/api/auth/verifyLoginOTP", {
        email,
        otp,
        purpose: otpPurpose,
      });

      if (res.data.loginRequired) {
        setSuccessMessage("Email verified. Please log in again.");
        setLoginStage("form");
        setOtp("");
        return;
      }

      setSuccessMessage(res.data.message);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/homepage");
      }
    } catch (err) {
      console.error("verifyLoginOTP failed:", err.response?.data);
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AuthHeader />

      <div className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">
          {/* Left Panel */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#0077b6] to-[#00b4d8] items-center justify-center p-8 text-white">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Welcome to AquaHope</h2>
              <p className="text-sm leading-relaxed">
                Bringing clean water to those who need it most.
                <br /> Let’s make a difference together.
              </p>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-1/2 p-6 sm:p-10">
            {loginStage === "form" ? (
              <form onSubmit={handleLogin}>
                <h2 className="text-2xl font-semibold text-center mb-2">
                  Login
                </h2>
                <p className="text-center text-sm text-gray-500 mb-6">
                  Welcome back! Please login to your account
                </p>

                {error && (
                  <p className="text-red-500 text-sm mb-4 text-center">
                    {error}
                  </p>
                )}
                {successMessage && (
                  <p className="text-green-600 text-sm mb-4 text-center">
                    {successMessage}
                  </p>
                )}

                <div className="mb-4 relative">
                  <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full pl-10 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#0077b6]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4 relative">
                  <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full pl-10 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#0077b6]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0077b6] text-white p-3 rounded font-medium hover:bg-[#005f8d] hover:scale-105 transition duration-300"
                >
                  Login
                </button>

                <div className="text-sm text-center mt-6">
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
            ) : (
              <form onSubmit={handleVerifyOTP}>
                <h2 className="text-2xl font-semibold text-center mb-2">
                  {otpPurpose === "verify" ? "Verify Email" : "Enter MFA Code"}
                </h2>
                <p className="text-center text-sm text-gray-500 mb-6">
                  {otpPurpose === "verify"
                    ? "An OTP has been sent to your email to verify your account."
                    : "An OTP has been sent to your email for login verification."}
                </p>

                {successMessage && (
                  <p className="text-green-600 text-sm mb-4 text-center">
                    {successMessage}
                  </p>
                )}
                {error && (
                  <p className="text-red-500 text-sm mb-4 text-center">
                    {error}
                  </p>
                )}

                <div className="mb-4">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#0077b6]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0077b6] text-white p-3 rounded font-medium hover:bg-[#005f8d] hover:scale-105 transition duration-300"
                >
                  Verify OTP
                </button>

                <div className="text-sm text-center mt-6">
                  <p>
                    Mistyped your password?{" "}
                    <span
                      className="text-blue-600 cursor-pointer hover:underline"
                      onClick={() => {
                        setLoginStage("form");
                        setOtp("");
                        setSuccessMessage("");
                      }}
                    >
                      Go back
                    </span>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
