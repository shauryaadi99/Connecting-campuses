import express from "express";
import { addItem, getItems, deleteItem } from "../controllers/lostFound.controller.js";
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

/**
 * @route   GET /api/lost-found/
 * @desc    Get all lost/found items (public route)
 * @access  Public
 */
router.get("/", getItems);

/**
 * @route   POST /api/lost-found/
 * @desc    Add a new lost/found item
 * @access  Private (user must be authenticated)
 */
router.post("/", isAuthenticated,singleUpload, addItem);

/**
 * @route   DELETE /api/lost-found/:id
 * @desc    Delete a lost/found item by ID
 * @access  Private (user must be authenticated)
 */
router.delete("/:id", isAuthenticated, deleteItem);

export default router;
