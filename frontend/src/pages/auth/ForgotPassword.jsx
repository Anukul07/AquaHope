import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../../components/AuthHeader";
import Footer from "../../components/Footer";
import { FaEnvelope, FaKey, FaLock } from "react-icons/fa";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "http://192.168.1.75:8000/api/auth/validateEmail",
        { email }
      );
      setSuccess(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Email verification failed");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "http://192.168.1.75:8000/api/auth/validateOTP",
        { email, otp }
      );
      setSuccess(res.data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "http://192.168.1.75:8000/api/auth/resetPassword",
        { email, otp, newPassword }
      );
      setSuccess(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AuthHeader />

      <div className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">
          {/* Left Info Panel */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#0077b6] to-[#00b4d8] items-center justify-center p-6 lg:p-10 text-white">
            <div className="text-center space-y-2">
              <h2 className="text-2xl lg:text-3xl font-bold">Reset Password</h2>
              <p className="text-sm lg:text-base font-light">
                Don’t worry, we’ll help you get back in.
              </p>
            </div>
          </div>

          {/* Right Form Section */}
          <form
            onSubmit={
              step === 1
                ? handleEmailSubmit
                : step === 2
                ? handleOtpSubmit
                : handlePasswordReset
            }
            className="w-full md:w-1/2 p-6 sm:p-8 lg:p-10"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-center mb-1 sm:mb-2">
              {step === 1
                ? "Enter Your Email"
                : step === 2
                ? "Enter OTP"
                : "Set New Password"}
            </h2>

            <p className="text-center text-sm text-gray-500 mb-4 sm:mb-6">
              {step === 1
                ? "We’ll send a verification code to your email."
                : step === 2
                ? "Check your email for the code."
                : "Enter a strong new password."}
            </p>

            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}
            {success && (
              <p className="text-green-500 text-sm mb-4 text-center">
                {success}
              </p>
            )}

            {step === 1 && (
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
            )}

            {step === 2 && (
              <div className="mb-4 relative">
                <FaKey className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full pl-10 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#0077b6] text-sm"
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
            )}

            {step === 3 && (
              <div className="mb-4 relative">
                <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full pl-10 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#0077b6] text-sm"
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#0077b6] text-white p-3 rounded font-medium hover:bg-[#005f8d] hover:scale-[1.02] transition duration-300 text-sm"
            >
              {step === 1
                ? "Send OTP"
                : step === 2
                ? "Verify OTP"
                : "Reset Password"}
            </button>

            {step === 3 && success === "Password reset successfully" && (
              <p className="text-center text-sm mt-4 text-gray-500">
                Redirecting to login...
              </p>
            )}
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
