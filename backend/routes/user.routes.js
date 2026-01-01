import express from "express";
import {
  deletePost,
  getAllUsers,
  getProfile,
  updatePostStatus,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, authorizeRoles("Admin"), getAllUsers);

router.get("/profile", authMiddleware, getProfile);
export default router;

router.patch("/posts/:id/status", authMiddleware, updatePostStatus);

router.delete("/posts/:postId", authMiddleware, deletePost);

// create,edit, delete, comment, like
