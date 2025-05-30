import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  updateProfile,
  getCurrentUser,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
} from '../controllers/user.controller.js';

import isAuthenticated from '../middlewares/isAuthenticated.js';
import { verifyEmail } from '../controllers/verifyEmail.controller.js';

const router = express.Router();

// --- Public Routes ---
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);

// ➕ Forgot/Reset Password Routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword); // :token comes from the URL

// --- Protected Routes ---
router.get('/profile', isAuthenticated, getCurrentUser);
router.post('/logout', isAuthenticated, logoutUser);
router.put('/update-profile', isAuthenticated, updateProfile);

export default router;
