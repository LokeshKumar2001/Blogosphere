import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    role: string;
  };
  createdAt: string;
}

const Comments = ({ postId }: { postId: string }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch comments
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/api/posts/${postId}/comments`
      );
      setComments(res.data.data || []);
    } catch {
      toast.error("Failed to load comments");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // 🔹 Add comment
  const handleAddComment = async () => {
    if (!content.trim()) return;

    try {
      setLoading(true);
      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/api/posts/${postId}/comments`,
        { content },
        { withCredentials: true }
      );
      setContent("");
      fetchComments();
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete comment
  const handleDelete = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;

    try {
      await axios.delete(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/api/posts/${postId}/comments/${commentId}`,
        { withCredentials: true }
      );

      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      );
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Comments</h2>

      {/* Add Comment */}
      {user && (
        <div className="space-y-2">
          <Textarea
            placeholder="Write a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button disabled={loading} onClick={handleAddComment}>
            {loading ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      )}

      {!user && (
        <p className="text-sm text-muted-foreground">Login to post a comment</p>
      )}

      {/* Comments List */}
      {comments.length === 0 && (
        <p className="text-sm text-muted-foreground">No comments yet</p>
      )}

      {comments.map((comment) => (
        <Card key={comment._id} className="p-4 flex justify-between">
          <div>
            <p className="font-medium">{comment.username}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(comment.createdAt).toLocaleString()}
            </p>
            <p className="mt-2">{comment.content}</p>
          </div>

          {/* Delete (Admin or Author) */}
          {(user?.role === "Admin" || user?._id === comment.author._id) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(comment._id)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </Card>
      ))}
    </div>
  );
};

export default Comments;
