const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    return res.status(401).json({ message: "No access token" });
  }
  try {
    req.user = jwt.verify(accessToken, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid access token" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

module.exports = { authMiddleware, adminOnly };
