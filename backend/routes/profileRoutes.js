const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const uploadProfileImage = require("../middleware/updateProfileImage");

router.get("/:userId", profileController.getProfile);

router.post(
  "/update",
  uploadProfileImage.single("photo"),
  profileController.updateProfile
);

module.exports = router;
