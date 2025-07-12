const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  isLocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  otp: { type: String },
  otpExpires: { type: Date },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", userSchema);
