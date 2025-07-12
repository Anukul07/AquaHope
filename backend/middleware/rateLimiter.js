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
