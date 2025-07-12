const express = require("express");
const router = express.Router();
const {
  register,
  login,
  validateEmail,
  validateResetOTP,
  resetPassword,
  verifyEmailOTP,
} = require("../controllers/authController");
const { registrationLimiter } = require("../middleware/rateLimiter");

router.post("/register", registrationLimiter, register);

router.post("/login", login);
router.post("/validateEmail", validateEmail);
router.post("/validateOTP", validateResetOTP);
router.post("/resetPassword", resetPassword);
router.post("/verifyEmailOTP", verifyEmailOTP);

module.exports = router;
