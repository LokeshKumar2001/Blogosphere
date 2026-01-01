import mongoose from "mongoose";

const likeSchema = mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// only one like is allowed per user per post
likeSchema.index({ userId: 1, postId: 1 }, { unique: true });

const Like = mongoose.model("Like", likeSchema);
export default Like;
