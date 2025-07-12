const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const sanitizeHtml = require("sanitize-html");

exports.register = async (req, res) => {
  try {
    let { fullName, email, password, phone } = req.body;

    fullName = sanitizeHtml(fullName, {
      allowedTags: [],
      allowedAttributes: {},
    });
    email = sanitizeHtml(email, { allowedTags: [], allowedAttributes: {} });
    phone = sanitizeHtml(phone, { allowedTags: [], allowedAttributes: {} });

    const isPasswordStrong = (pwd) => {
      const lengthCheck = pwd.length >= 8;
      const numberCheck = /\d/.test(pwd);
      const symbolCheck = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
      return lengthCheck && numberCheck && symbolCheck;
    };

    if (!isPasswordStrong(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include a number and a symbol.",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
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
    const user = await User.findOne({ email });

    if (!user || user.isLocked)
      return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user: { id: user._id, fullName: user.fullName, role: user.role },
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
