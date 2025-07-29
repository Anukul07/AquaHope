import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import defaultProfile from "../assets/profile-default.jpg";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [profile, setProfile] = useState({});
  const [imagePreview, setImagePreview] = useState(defaultProfile);
  const [selectedImage, setSelectedImage] = useState(null);
  const [updateMsg, setUpdateMsg] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("Kathmandu");
  const [province] = useState("Bagmati");
  const [zip, setZip] = useState("");
  const [showSecurity, setShowSecurity] = useState(false);
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpStage, setOtpStage] = useState(false);
  const [otp, setOtp] = useState("");
  const [securityMsg, setSecurityMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    fetchProfile(user.id);
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const localUser = JSON.parse(localStorage.getItem("user"));
      const res = await axios.get(
        `http://localhost:8000/api/profile/${userId}`
      );
      setProfile({
        ...res.data,
        fullName: res.data.fullName || localUser.fullName || "",
      });
      setAddress1(res.data.addressLine1 || "");
      setAddress2(res.data.addressLine2 || "");
      setCity(res.data.city || "Kathmandu");
      setZip(res.data.zipcode || "");
      if (res.data.photo) {
        setImagePreview(`/profiles/${res.data.photo}`);
      }
    } catch {
      setProfile({});
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("fullName", profile.fullName || "");
      formData.append("phone", profile.phone || "");
      formData.append("addressLine1", address1);
      formData.append("addressLine2", address2);
      formData.append("city", city);
      formData.append("province", province);
      formData.append("zipcode", zip);

      if (selectedImage && imagePreview !== `/profiles/${profile.photo}`) {
        formData.append("photo", selectedImage);
      }

      await axios.post("http://localhost:8000/api/profile/update", formData);
      setUpdateMsg("Profile updated successfully.");
      fetchProfile(user.id);
    } catch {
      setUpdateMsg("Failed to update profile.");
    }
  };

  const validatePassword = (pwd) => {
    const lengthCheck = pwd.length >= 8;
    const numberCheck = /\d/.test(pwd);
    const symbolCheck = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    return lengthCheck && numberCheck && symbolCheck;
  };

  const handleSecurityUpdate = async () => {
    if (!validatePassword(newPassword)) {
      setPasswordError(
        "Password must be at least 8 characters long, contain a number and a symbol."
      );
      return;
    }
    setPasswordError("");

    try {
      await axios.post("http://localhost:8000/api/auth/validate-password", {
        userId: user.id,
        oldPassword,
        newPassword,
      });
      setOtpStage(true);
      setSecurityMsg("OTP sent to your email. Please enter it below.");
    } catch (err) {
      setSecurityMsg("Your old password does not match.");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await axios.post("http://localhost:8000/api/auth/verify-security-otp", {
        userId: user.id,
        otp,
        newPassword,
        email,
      });
      setSecurityMsg("Security information updated successfully.");
      setOtpStage(false);
    } catch (err) {
      setSecurityMsg(err.response?.data?.message || "OTP verification failed.");
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === "old") {
      setShowOldPassword(!showOldPassword);
    } else {
      setShowNewPassword(!showNewPassword);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main Profile Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#00b4d8] to-[#0077b6] px-8 py-12 text-center relative">
              <div className="absolute inset-0 bg-black opacity-5"></div>
              <div className="relative z-10">
                <div className="relative inline-block mb-6">
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-36 h-36 rounded-full object-cover border-6 border-white shadow-xl"
                  />
                  <label className="absolute bottom-2 right-2 bg-white rounded-full p-3 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 group">
                    <svg
                      className="w-5 h-5 text-[#00b4d8] group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Edit Profile
                </h1>
                <p className="text-blue-100">
                  Update your personal information
                </p>
              </div>
            </div>

            {/* Form Section */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <svg
                        className="inline w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={profile.fullName || ""}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#00b4d8] focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your phone number"
                      value={profile.phone || ""}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#00b4d8] focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your primary address"
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#00b4d8] focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Location Information */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Additional address information"
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#00b4d8] focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#00b4d8] focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        placeholder="Postal code"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#00b4d8] focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Province
                    </label>
                    <input
                      type="text"
                      value={province}
                      readOnly
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-100 cursor-not-allowed text-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Success Message */}
              {updateMsg && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-xl">
                  <div className="flex items-center">
                    <div className="text-green-700 font-medium">
                      {updateMsg}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleUpdate}
                  className="flex-1 py-4 bg-gradient-to-r from-[#00b4d8] to-[#0077b6] text-white rounded-xl font-semibold hover:from-[#0096c7] hover:to-[#005f8d] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Update Profile
                </button>

                <button
                  onClick={() => setShowSecurity(!showSecurity)}
                  className="flex-1 py-4 bg-white border-2 border-[#00b4d8] text-[#00b4d8] rounded-xl font-semibold hover:bg-[#00b4d8] hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {showSecurity
                    ? "Hide Security Settings"
                    : "Update Security Info"}
                </button>
              </div>
            </div>
          </div>

          {/* Security Settings Card */}
          {showSecurity && (
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Security Header */}
              <div className="bg-gradient-to-r from-[#00b4d8] to-[#0077b6] px-8 py-8 text-center relative">
                <div className="absolute inset-0 bg-black opacity-5"></div>
                <div className="relative z-10">
                  <svg
                    className="w-12 h-12 text-white mx-auto mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Security Settings
                  </h2>
                  <p className="text-blue-100">
                    Update your email and password
                  </p>
                </div>
              </div>

              <div className="p-8">
                {/* Security Message */}
                {securityMsg && (
                  <div
                    className={`mb-6 p-4 rounded-xl border-l-4 ${
                      securityMsg.includes("successfully")
                        ? "bg-green-50 border-green-400 text-green-700"
                        : "bg-blue-50 border-blue-400 text-blue-700"
                    }`}
                  >
                    <div className="font-medium">{securityMsg}</div>
                  </div>
                )}

                {!otpStage ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <svg
                          className="inline w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        New Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your new email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#00b4d8] focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showOldPassword ? "text" : "password"}
                          placeholder="Enter your current password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-[#00b4d8] focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("old")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showOldPassword ? (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter your new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-[#00b4d8] focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("new")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showNewPassword ? (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      {passwordError && (
                        <p className="text-red-500 text-sm mt-2 bg-red-50 p-2 rounded-lg">
                          {passwordError}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleSecurityUpdate}
                      className="w-full py-4 bg-gradient-to-r from-[#00b4d8] to-[#0077b6] text-white rounded-xl font-semibold hover:from-[#0096c7] hover:to-[#005f8d] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Send OTP
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="bg-gradient-to-br from-[#00b4d8] to-[#0077b6] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Enter Verification Code
                      </h3>
                      <p className="text-gray-600">
                        We've sent a verification code to your email
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
                        OTP Code
                      </label>
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#00b4d8] focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white text-center text-lg font-mono tracking-wider"
                        maxLength="6"
                      />
                    </div>

                    <button
                      onClick={handleVerifyOTP}
                      className="w-full py-4 bg-gradient-to-r from-[#00b4d8] to-[#0077b6] text-white rounded-xl font-semibold hover:from-[#0096c7] hover:to-[#005f8d] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Verify OTP & Update
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
