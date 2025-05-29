import express from 'express';
import {
  createNewsroomEvent,
  getAllNewsroomEvents,
  updateNewsroomEvent,
  deleteNewsroomEvent,
  getNewsroomEventsByEmail
} from '../controllers/newsroom.controller.js';

import isAuthenticated from '../middlewares/isAuthenticated.js';
import { singleUpload } from '../middlewares/multer.js';

const router = express.Router();

// Public routes
router.get('/', getAllNewsroomEvents);

// Protected routes (requires login)
router.post('/', isAuthenticated, singleUpload, createNewsroomEvent);
router.put('/:id', isAuthenticated, singleUpload, updateNewsroomEvent);
router.delete('/:id', isAuthenticated, deleteNewsroomEvent);

// Get all listings by logged-in user's email (secured)
router.get('/by-user/:email', isAuthenticated, getNewsroomEventsByEmail);

export default router;
