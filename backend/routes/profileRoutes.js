const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const uploadProfileImage = require("../middleware/updateProfileImage");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/:userId", authMiddleware, profileController.getProfile);

router.post(
  "/update",
  authMiddleware, // ← enforce auth here
  uploadProfileImage.single("photo"),
  profileController.updateProfile
);

module.exports = router;
