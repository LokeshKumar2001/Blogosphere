import express from "express";
import dotenv from "dotenv";
import { connection } from "./database/db.js";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import likeRoutes from "./routes/like.routes.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api", postRoutes);
app.use("/api", commentRoutes);
app.use("/api", likeRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  connection();
  console.log(`Server is running on ${PORT} successfully.`);
});
