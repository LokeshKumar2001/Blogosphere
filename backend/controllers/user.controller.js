import Post from "../models/Post.js";
import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({
      success: true,
      message: "Fetched all users successfully.",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal Server error: ${error.message}`,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");
    console.log(user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
};

export const updatePostStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const postId = req.params.id;

    if (!["PUBLISHED", "DRAFT"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (
      req.user.role === "Author" &&
      post.authorId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You can update only your own posts",
      });
    }
    post.status = status;
    await post.save();

    return res.status(200).json({
      success: true,
      message: `Post ${status.toLowerCase()} successfully`,
      data: post,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
};

export const deletePost = async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }

  await Post.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
