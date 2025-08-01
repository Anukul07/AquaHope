const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  photo: { type: String },
  fullName: { type: String },
  phone: { type: String },
  addressLine1: { type: String },
  addressLine2: { type: String },
  city: { type: String },
  province: { type: String, default: "Bagmati" },
  zipcode: { type: String },
});

module.exports = mongoose.model("Profile", profileSchema);
