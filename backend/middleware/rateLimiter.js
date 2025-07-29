const rateLimit = require("express-rate-limit");

exports.registrationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    message:
      "Too many registration attempts from this IP. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  handler: (req, res) => {
    return res.status(429).json({
      message: "Too many login attempts. Try again after 15 minutes.",
    });
  },
});
