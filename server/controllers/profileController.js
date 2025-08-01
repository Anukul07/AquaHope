const Profile = require("../models/Profile");
const path = require("path");

exports.updateProfile = async (req, res) => {
  try {
    const { phone, addressLine1, addressLine2, city, zipcode, fullName } =
      req.body;
    const userId = req.body.userId || req.params.userId;

    const update = {
      phone,
      addressLine1,
      addressLine2,
      city,
      zipcode,
      fullName,
      province: "Bagmati",
    };

    if (req.file) {
      update.photo = req.file.filename;
    }

    const profile = await Profile.findOneAndUpdate(
      { userId },
      { $set: update },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Profile updated", profile });
  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const profile = await Profile.findOne({ userId });

    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json(profile);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch profile", error: err.message });
  }
};
