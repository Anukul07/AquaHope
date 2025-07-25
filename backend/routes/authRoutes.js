const express = require("express");
const router = express.Router();
const {
  register,
  login,
  validateEmail,
  validateOTP,
  resetPassword,
} = require("../controllers/authController");

// @route   POST /api/auth/register
// @desc    Register new user
router.post("/register", register);

// @route   POST /api/auth/login
// @desc    Login user
router.post("/login", login);
router.post("/validateEmail", validateEmail);
router.post("/validateOTP", validateOTP);
router.post("/resetPassword", resetPassword);

module.exports = router;
