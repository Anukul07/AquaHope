const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const sanitizeHtml = require("sanitize-html");
const Profile = require("../models/Profile");

const accessCookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 15 * 60 * 1000,
};
const refreshCookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 2 * 60 * 60 * 1000,
};
exports.register = async (req, res) => {
  try {
    let { fullName, email, password, phone } = req.body;
    fullName = sanitizeHtml(fullName);
    email = sanitizeHtml(email);
    phone = sanitizeHtml(phone);

    const isPasswordStrong = (pwd) =>
      pwd.length >= 8 && /\d/.test(pwd) && /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

    if (!isPasswordStrong(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include a number and a symbol.",
      });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      otp,
      otpExpires,
      isEmailVerified: false,
    });

    await Profile.create({
      userId: newUser._id,
      fullName,
      phone,
    });

    await sendEmail(email, "Verify your AquaHope email", `Your OTP is: ${otp}`);

    res.status(201).json({
      message:
        "Account created. Please verify your email soon using the OTP sent.",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Invalid request format." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.isLocked) {
      return res.status(403).json({
        message:
          "Account locked due to multiple failed login attempts. Try again later.",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      user.failedAttempts = (user.failedAttempts || 0) + 1;
      if (user.failedAttempts >= 5) {
        user.isLocked = true;
        setTimeout(async () => {
          user.isLocked = false;
          user.failedAttempts = 0;
          await user.save();
        }, 10 * 60 * 1000);
      }
      await user.save();
      return res.status(401).json({ message: "Invalid credentials" });
    }

    user.failedAttempts = 0;
    user.isLocked = false;

    if (!user.isEmailVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();

      await sendEmail(
        user.email,
        "Verify your AquaHope email",
        `Your verification OTP is: ${otp}`
      );

      return res.status(403).json({
        message: "Email not verified. OTP sent to your email.",
        otpRequired: true,
        purpose: "verify",
        email: user.email,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendEmail(
      user.email,
      "AquaHope Login OTP",
      `Your login OTP is: ${otp}`
    );

    return res.status(206).json({
      message: "MFA OTP sent. Please verify to complete login.",
      otpRequired: true,
      purpose: "login",
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
exports.validateEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User does not exist" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  await sendEmail(email, "Your AquaHope OTP", `Your OTP: ${otp}`);

  res.json({ message: "OTP sent successfully" });
};

exports.verifyEmailOTP = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.otp || user.otp !== otp || new Date() > user.otpExpires) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.otp = null;
  user.otpExpires = null;
  user.isEmailVerified = true;
  await user.save();

  res.json({ message: "Email verified successfully" });
};

exports.validateResetOTP = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.otp || user.otp !== otp || new Date() > user.otpExpires) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }
  user.otp = null;
  user.otpExpires = null;

  res.json({ message: "OTP verified successfully" });
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || new Date() > user.otpExpires) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  res.json({ message: "Password reset successfully" });
};

exports.verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp, purpose } = req.body;
    const user = await User.findOne({ email });

    if (
      !user ||
      user.otp !== otp ||
      new Date() > user.otpExpires ||
      !["verify", "login"].includes(purpose)
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpires = null;

    if (purpose === "verify") {
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
        await user.save();
      }
      return res.status(200).json({
        message: "Email verified successfully. Please log in again.",
        emailVerified: true,
        loginRequired: true,
      });
    }

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role, mfaVerified: true },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    await user.save();

    return res
      .cookie("accessToken", accessToken, accessCookieOpts)
      .cookie("refreshToken", refreshToken, refreshCookieOpts)
      .json({
        message: "Login successful",
        user: { id: user._id, fullName: user.fullName, role: user.role },
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "OTP verification failed", error: err.message });
  }
};

exports.validatePassword = async (req, res) => {
  try {
    const { userId, oldPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendEmail(
      user.email,
      "Your AquaHope Security Update OTP",
      `Your one-time security update OTP is: ${otp}`
    );

    return res.json({
      message:
        "OTP sent to your email. Please enter it to complete the update.",
      otpRequired: true,
    });
  } catch (err) {
    console.error("validatePassword error:", err);
    return res
      .status(500)
      .json({ message: "Failed to validate password", error: err.message });
  }
};

exports.verifySecurityOtp = async (req, res) => {
  try {
    const { userId, otp, newPassword, email } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp || user.otp !== otp || new Date() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpires = null;

    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
    }

    if (email) {
      user.email = sanitizeHtml(email, {
        allowedTags: [],
        allowedAttributes: {},
      });
    }

    await user.save();
    return res.json({ message: "Security information updated successfully" });
  } catch (err) {
    console.error("verifySecurityOtp error:", err);
    return res
      .status(500)
      .json({ message: "Failed to verify OTP", error: err.message });
  }
};
exports.refreshToken = (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  if (!payload.mfaVerified) {
    return res.status(403).json({ message: "MFA required" });
  }

  const newAccessToken = jwt.sign(
    { userId: payload.userId, role: payload.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  const newRefreshToken = jwt.sign(
    { userId: payload.userId, role: payload.role, mfaVerified: true },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  return res
    .cookie("accessToken", newAccessToken, accessCookieOpts)
    .cookie("refreshToken", newRefreshToken, refreshCookieOpts)
    .json({ message: "Tokens refreshed" });
};
exports.logout = (req, res) => {
  return res
    .clearCookie("accessToken", { httpOnly: true, sameSite: "lax" })
    .clearCookie("refreshToken", { httpOnly: true, sameSite: "lax" })
    .status(200)
    .json({ message: "Logged out successfully" });
};
