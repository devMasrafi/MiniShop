const express = require("express");
const {
    registerUser,
    loginUser,
    getCurrentUser,
    updateCurrentUser,
    updateCurrentUserPassword,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/users/me", authMiddleware, getCurrentUser);
router.put("/users/me", authMiddleware, updateCurrentUser);
router.patch("/users/me/password", authMiddleware, updateCurrentUserPassword);

module.exports = router;
