import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  updateProfile,
  getCurrentUser
} from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';



const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Routes
router.get('/profile', isAuthenticated, getCurrentUser);
router.post('/logout', isAuthenticated, logoutUser);
router.put('/update-profile', isAuthenticated, updateProfile);

export default router;
