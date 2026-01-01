import express from "express";
import {
  deleteComment,
  getComments,
  postComments,
} from "../controllers/comment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/posts/:postId/comments", authMiddleware, postComments);

router.get("/posts/:postId/comments", getComments);

router.delete(
  "/posts/:postId/comments/:commentId",
  authMiddleware,
  authorizeRoles("Admin", "Author"),
  deleteComment
);

export default router;
