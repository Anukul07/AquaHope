const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/users", userController.getAllUsers);
router.post("/unlockUser/:userId", userController.unlockUser);

module.exports = router;
