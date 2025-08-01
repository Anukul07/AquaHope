const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadCampaignImage");
const {
  addCampaign,
  getAllCampaigns,
  updateCampaign,
  deleteCampaign,
} = require("../controllers/campaignController");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

router.post(
  "/add",
  upload.single("image"),
  authMiddleware,
  adminOnly,
  addCampaign
);

router.get("/", getAllCampaigns);

router.post(
  "/update/:id",
  upload.single("image"),
  authMiddleware,
  adminOnly,
  updateCampaign
);

router.delete("/:id", authMiddleware, adminOnly, deleteCampaign);

module.exports = router;
