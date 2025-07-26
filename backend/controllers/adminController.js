const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -otp -otpExpires");
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
};
