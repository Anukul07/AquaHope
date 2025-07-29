const express = require("express");
const router = express.Router();
const {
  register,
  login,
  validateEmail,
  validateResetOTP,
  resetPassword,
  verifyEmailOTP,
  verifyLoginOTP,
} = require("../controllers/authController");
const {
  registrationLimiter,
  loginLimiter,
} = require("../middleware/rateLimiter");

router.post("/register", registrationLimiter, register);

router.post("/login", loginLimiter, login);
router.post("/validateEmail", validateEmail);
router.post("/validateOTP", validateResetOTP);
router.post("/resetPassword", resetPassword);
router.post("/verifyEmailOTP", verifyEmailOTP);
router.post("/verifyLoginOTP", verifyLoginOTP);

module.exports = router;
