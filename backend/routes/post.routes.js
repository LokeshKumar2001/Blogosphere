import express from "express";
import {
  createPost,
  deletePost,
  getAllDraftedPosts,
  getAllPosts,
  getAuthorPosts,
  getPost,
  togglePublish,
  updatePost,
} from "../controllers/post.controller.js";
import {
  adminOnly,
  authorOnly,
  isBlogOwner,
} from "../middleware/role.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get All Posts
router.get("/posts", authMiddleware, getAllPosts);

// GET ALL DRAFT Posts
router.get("/draft/posts", authMiddleware, getAllDraftedPosts);

//Author
// Create Blog Post
router.post("/posts", authMiddleware, authorOnly, createPost);

// Edit the Blog Post
router.put(
  "/posts/:postId",
  authMiddleware,
  authorOnly,
  isBlogOwner,
  updatePost
);

// Get Author Post
router.get("/posts/myPosts", authMiddleware, authorOnly, getAuthorPosts);

//GET single post
router.get("/posts/:postId", authMiddleware, getPost);

// Delete the Blog post
router.delete(
  "/posts/:postId",
  authMiddleware,
  authorOnly,
  isBlogOwner,
  deletePost
);

// Admin
router.delete("/posts/:postId/admin", authMiddleware, adminOnly, deletePost);

router.patch("/posts/:postId/publish", authMiddleware, togglePublish);

export default router;
