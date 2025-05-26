import NewsroomPost from "../models/newsroom.model.js";

// Create a new post
export const createNewsroomPost = async (req, res) => {
  try {
    const {
      category,
      club,
      title,
      src,
      content,
      date,
    } = req.body;

    const userId = req.user._id; // Assumes user is authenticated and available in req.user

    const newPost = await NewsroomPost.create({
      category,
      club,
      title,
      src,
      content,
      date,
      createdBy: userId,
    });

    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all posts
export const getAllNewsroomPosts = async (req, res) => {
  try {
    const posts = await NewsroomPost.find().populate("createdBy", "name email");
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single post by ID
export const getNewsroomPostById = async (req, res) => {
  try {
    const post = await NewsroomPost.findById(req.params.id).populate("createdBy", "name email");

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a post
export const deleteNewsroomPost = async (req, res) => {
  try {
    const post = await NewsroomPost.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
