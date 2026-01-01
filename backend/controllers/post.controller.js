import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
  try {
    const { title, description, tags, status } = req.body;

    if (req.user.role !== "Author") {
      return res.status(403).json({
        success: false,
        message: "Only authors can create blog posts",
      });
    }

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }

    const post = await Post.create({
      title,
      description,
      authorId: req.user.id,
      authorName: user.username,
      status: status || "DRAFT",
      tags: Array.isArray(tags) ? tags : [],
    });

    res.status(201).json({
      success: true,
      message: "Blog post created successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error Posting Blog ${error.message}`,
    });
  }
};

export const getAuthorPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    console.log(req.user);
    const posts = await Post.find({
      authorId: req.user.id,
      status: "PUBLISHED",
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalPosts = await Post.countDocuments({ authorId: req.user.id });

    return res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        totalPosts,
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        limit,
      },
    });
  } catch (error) {
    console.log(req.user);
    return res.status(500).json({
      success: false,
      message: `Error fetching author posts: ${error.message}`,
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ status: "PUBLISHED" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("authorId", "authorName role");

    const totalPosts = await Post.countDocuments({
      status: "PUBLISHED",
    });

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        totalPosts,
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        pageSize: limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error fetching posts: ${error.message}`,
    });
  }
};

export const getAllDraftedPosts = async (req, res) => {
  const { id, role } = req.user;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ status: "DRAFT", authorId: id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("authorId", "authorName role");

    const totalPosts = await Post.countDocuments({
      status: "DRAFT",
    });

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        totalPosts,
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        pageSize: limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error fetching posts: ${error.message}`,
    });
  }
};

export const getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const user = req.user;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    // post is published allowed access
    if (post.status === "PUBLISHED") {
      return res.status(200).json({
        success: true,
        data: post,
      });
    }

    // post is draft -> allow only admin or owner Author
    if (
      (user && user.role === "Admin") ||
      post.authorId.toString() === user.id
    ) {
      return res.status(200).json({
        success: true,
        data: post,
      });
    }

    return res.status(403).json({
      success: false,
      message: "You are not allowed to view this post",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error fetching post: ${error.message}`,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, description, tags, status } = req.body;
    const { id: userId, role } = req.user;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (role === "Author" && post.authorId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own posts",
      });
    }

    if (title) post.title = title;
    if (description) post.description = description;
    if (tags) post.tags = tags;
    if (status) post.status = status;

    await post.save();
    return res.status(201).json({
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error updating post: ${error.message}`,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (req.user.role !== "Admin" && post.authorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this post",
      });
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error deleting post: ${error.message}`,
    });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const { postId } = req.params;
    const { id, role } = req.user;

    // find post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    //Author is the owner of the post
    if (role === "Author" && post.authorId.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: "You can publish only your own posts",
      });
    }

    post.status = post.status === "DRAFT" ? "PUBLISHED" : "DRAFT";

    await post.save();

    res.status(200).json({
      success: true,
      message: `Post ${
        post.status === "PUBLISHED" ? "published" : "unpublished"
      } successfully`,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Publish error: ${error.message}`,
    });
  }
};
