const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

router.get("/users", authMiddleware, adminOnly, userController.getAllUsers);
router.post(
  "/unlockUser/:userId",
  authMiddleware,
  adminOnly,
  userController.unlockUser
);

module.exports = router;
