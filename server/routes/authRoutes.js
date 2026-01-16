import express from "express";
import {
  registerUser,
  loginUser,
  googleLogin,
  getMe,
  logoutUser,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Email/password
router.post("/register", registerUser);
router.post("/login", loginUser);

// Google OAuth
router.post("/google", googleLogin);

// Authenticated user
router.get("/me", protect, getMe);

// Logout
router.post("/logout", logoutUser);

export default router;
