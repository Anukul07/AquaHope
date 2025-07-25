const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadCampaignImage");
const {
  addCampaign,
  getAllCampaigns,
} = require("../controllers/campaignController");

// @route   POST /api/campaigns/add
// @desc    Add new campaign
router.post("/add", upload.single("image"), addCampaign);

// @route   GET /api/campaigns
// @desc    Get all campaigns
router.get("/", getAllCampaigns);

module.exports = router;
