import Post from "../models/Post.js";

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied: No Permission",
      });
    }
    next();
  };
};

export const authorOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (req.user.role !== "Author") {
    return res.status(403).json({
      success: false,
      message: "Only Author can do this action",
    });
  }
  console.log(`authorId: ${req.user?.id}`);
  const user = req.user;
  req.user = user;
  next();
};

export const adminOnly = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({
      success: false,
      message: "Only Admin can do this action",
    });
  }
  next();
};

export const isBlogOwner = async (req, res, next) => {
  try {
    const blogPostId = req.params.postId;
    const blog = await Post.findById(blogPostId);

    if (!blog) {
      return res.status(403).json({
        success: false,
        message: "Blog post not found.",
      });
    }

    if (blog.authorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You dont have access to modify this blog",
      });
    }
    req.blog = blog;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
