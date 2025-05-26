import express from "express";
import {
  createNewsroomPost,
  getAllNewsroomPosts,
  getNewsroomPostById,
  deleteNewsroomPost,
} from "../controllers/newsroomController.js";
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// @route   POST /api/newsroom
router.post("/", isAuthenticated, createNewsroomPost);

// @route   GET /api/newsroom
router.get("/", getAllNewsroomPosts);

// @route   GET /api/newsroom/:id
router.get("/:id", getNewsroomPostById);

// @route   DELETE /api/newsroom/:id
router.delete("/:id", isAuthenticated, deleteNewsroomPost);

export default router;
