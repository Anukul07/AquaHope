const express = require("express");
const router = express.Router();
const { createDonation } = require("../controllers/donationController");

router.post("/create", createDonation);

module.exports = router;
