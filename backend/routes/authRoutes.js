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
  validatePassword,
  verifySecurityOtp,
  refreshToken,
  logout,
} = require("../controllers/authController");
const {
  registrationLimiter,
  loginLimiter,
} = require("../middleware/rateLimiter");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/register", registrationLimiter, register);

router.post("/login", loginLimiter, login);
router.post("/validateEmail", validateEmail);
router.post("/validateOTP", validateResetOTP);
router.post("/resetPassword", resetPassword);
router.post("/verifyEmailOTP", verifyEmailOTP);
router.post("/verifyLoginOTP", verifyLoginOTP);
router.post("/validate-password", validatePassword);
router.post("/verify-security-otp", verifySecurityOtp);
router.get("/refresh", refreshToken);
router.get("/check-role", authMiddleware, (req, res) => {
  res.json({ role: req.user.role });
});
router.post("/logout", authMiddleware, logout);

module.exports = router;
