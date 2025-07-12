import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../../components/AuthHeader";
import Footer from "../../components/Footer";
import { FaEnvelope, FaLock, FaUser, FaPhone } from "react-icons/fa";

export default function Registration() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const navigate = useNavigate();
  const [registrationStage, setRegistrationStage] = useState("form");
  const [otp, setOtp] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isPasswordStrong = (password) => {
    const lengthCheck = password.length >= 8;
    const numberCheck = /\d/.test(password);
    const symbolCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return lengthCheck && numberCheck && symbolCheck;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    if (!isPasswordStrong(form.password)) {
      setPasswordError(
        "Password must be at least 8 characters long and include a number and a symbol."
      );
      return;
    } else {
      setPasswordError("");
    }

    try {
      await axios.post("http://192.168.1.75:8000/api/auth/register", form);
      setRegistrationStage("otp");
      setSuccessMessage(
        "Registration successful. An OTP has been sent to your email."
      );
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://192.168.1.75:8000/api/auth/verifyEmailOTP", {
        email: form.email,
        otp,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AuthHeader />

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">
          {/* Left Panel */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#0077b6] to-[#00b4d8] items-center justify-center p-8 text-white">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Join AquaHope</h2>
              <p className="text-sm font-light leading-relaxed max-w-xs mx-auto">
                Create your account to support clean water initiatives and help
                bring hope to every village.
              </p>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-1/2 p-8 sm:p-10">
            {registrationStage === "form" ? (
              <form onSubmit={handleRegister}>
                <h2 className="text-2xl font-semibold text-center mb-2">
                  Register
                </h2>
                <p className="text-center text-sm text-gray-500 mb-6">
                  Start your journey with us today.
                </p>

                {error && (
                  <p className="text-red-500 text-sm mb-4 text-center">
                    {error}
                  </p>
                )}

                {/* Full Name */}
                <div className="mb-4 relative">
                  <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    className="w-full pl-10 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#0077b6]"
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="mb-4 relative">
                  <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full pl-10 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#0077b6]"
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="mb-4 relative">
                  <FaPhone className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    className="w-full pl-10 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#0077b6]"
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password */}
                <div className="mb-4 relative">
                  <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full pl-10 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#0077b6]"
                    onChange={handleChange}
                    required
                  />
                  {hasSubmitted && passwordError && (
                    <p className="text-red-500 text-xs mt-1 pl-2">
                      {passwordError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0077b6] text-white p-3 rounded font-medium hover:bg-[#005f8d] hover:scale-105 transition duration-300"
                >
                  Register
                </button>

                <div className="text-sm text-center mt-6">
                  <p>
                    Already have an account?{" "}
                    <span
                      className="text-blue-600 cursor-pointer hover:underline"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </span>
                  </p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP}>
                <h2 className="text-2xl font-semibold text-center mb-2">
                  Verify Email
                </h2>
                <p className="text-center text-sm text-gray-500 mb-6">
                  Please enter the OTP sent to your email.
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
                    Want to verify later and login instead?{" "}
                    <span
                      className="text-blue-600 cursor-pointer hover:underline"
                      onClick={() => navigate("/login")}
                    >
                      Back to Login
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
