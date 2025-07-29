const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadCampaignImage");
const {
  addCampaign,
  getAllCampaigns,
  updateCampaign,
  deleteCampaign,
} = require("../controllers/campaignController");

router.post("/add", upload.single("image"), addCampaign);

router.get("/", getAllCampaigns);

router.post("/update/:id", upload.single("image"), updateCampaign);

router.delete("/:id", deleteCampaign);

module.exports = router;
