const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");

const activityLogger = (req, res, next) => {
  let user = "Unauthenticated";

  try {
    const token = req.cookies.accessToken;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = decoded?.email || "Authenticated User";
    }
  } catch (err) {}

  const logMessage = `${req.method} ${req.originalUrl} - IP: ${req.ip} - User: ${user} - Agent: ${req.headers["user-agent"]}`;
  logger.info(logMessage);
  next();
};

module.exports = activityLogger;
