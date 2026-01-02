import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Comments from "./Comments";
import { Heart } from "lucide-react";

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/api/posts/${postId}`,
          { withCredentials: true }
        );
        setPost(res.data.data);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return <p className="text-center mt-10">Loading post...</p>;
  }

  if (!post) {
    return <p className="text-center mt-10">Post not found</p>;
  }

  const handleLike = async () => {
    if (likeLoading) return;

    try {
      setLikeLoading(true);

      const res = await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/api/posts/${postId}/like`,
        {},
        { withCredentials: true }
      );

      setPost((prev) => ({
        ...prev,
        likesCount: res.data.likesCount,
        liked: res.data.liked,
      }));
    } catch (error) {
      console.error("Like failed", error);
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{post.title}</CardTitle>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>By {post.authorName}</span>
            <span>•</span>
            <span>{new Date(post.createdAt).toDateString()}</span>

            {post.status && (
              <Badge variant="outline" className="ml-auto">
                {post.status}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-lg leading-relaxed">{post.description}</p>

          <Separator className="my-4" />

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={likeLoading}
              className="flex items-center gap-2"
            >
              <Heart
                className={`h-5 w-5 ${
                  post.liked
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground"
                }`}
              />
              {post.likesCount}
            </Button>

            {post.tags?.length > 0 && (
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Comments postId={postId} />
    </div>
  );
};

export default PostDetails;
