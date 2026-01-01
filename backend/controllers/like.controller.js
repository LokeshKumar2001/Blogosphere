import Like from "../models/Like.js";
import Post from "../models/Post.js";

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id; // clearer naming

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const existingLike = await Like.findOne({
      postId,
      authorId: userId,
    });

    // 🔁 UNLIKE
    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });

      post.likesCount = Math.max(0, post.likesCount - 1);
      await post.save();

      return res.status(200).json({
        success: true,
        liked: false,
        likesCount: post.likesCount,
        message: "Post unliked",
      });
    }

    // ❤️ LIKE
    await Like.create({
      postId,
      authorId: userId,
    });

    post.likesCount += 1;
    await post.save();

    return res.status(201).json({
      success: true,
      liked: true,
      likesCount: post.likesCount,
      message: "Post liked",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error liking post: ${error.message}`,
    });
  }
};
