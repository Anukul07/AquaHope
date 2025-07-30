const express = require("express");
const router = express.Router();
const { createDonation } = require("../controllers/donationController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { donationLimiter } = require("../middleware/rateLimiter");

router.post("/create", authMiddleware, donationLimiter, createDonation);

module.exports = router;
