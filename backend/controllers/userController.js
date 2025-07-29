const User = require("../models/User");
const Profile = require("../models/Profile");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -otp -otpExpires");

    const usersWithProfiles = await Promise.all(
      users.map(async (user) => {
        const profile = await Profile.findOne({ userId: user._id }).select(
          "-_id photo fullName phone addressLine1 addressLine2 city province zipcode"
        );
        return {
          ...user.toObject(),
          profile: profile || null,
        };
      })
    );

    res.status(200).json(usersWithProfiles);
  } catch (err) {
    console.error("getAllUsers error:", err);
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
};

exports.unlockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.isLocked) {
      return res.status(400).json({ message: "User is not locked" });
    }

    user.isLocked = false;
    user.failedAttempts = 0;
    await user.save();

    res.json({ message: "User unlocked successfully" });
  } catch (err) {
    console.error("unlockUser error:", err);
    res
      .status(500)
      .json({ message: "Failed to unlock user", error: err.message });
  }
};
