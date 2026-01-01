import express from "express";
import { likePost } from "../controllers/like.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/posts/:postId/like",
  authMiddleware,
  authorizeRoles("Admin", "Author"),
  likePost
);

export default router;
