import express from 'express';
import {
  createCarpool,
  getAllCarpools,
  deleteCarpoolById
} from '../controllers/carpool.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// Create a new carpool listing (requires authentication)
router.post('/carpools', isAuthenticated, createCarpool);

// Get all carpool listings (public)
router.get('/carpools', getAllCarpools);

// Delete a carpool listing by ID (requires authentication)
router.delete('/carpools/:id', isAuthenticated, deleteCarpoolById);

export default router;
