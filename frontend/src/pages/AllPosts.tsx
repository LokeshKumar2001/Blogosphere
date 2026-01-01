import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const PAGE_SIZE = 5;

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    totalPosts: 0,
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/posts", {
        params: {
          page,
          limit: PAGE_SIZE,
        },
        withCredentials: true,
      });
      setPosts(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.log("Error fetching Post", err);
    } finally {
      setLoading(false);
    }
  };

  const canEditPost = (post) => {
    if (!user) return false;

    if (user.role === "Admin") return true;

    if (user.role === "Author" && post.authorId._id === user._id) return true;

    return false;
  };

  const updateStatus = async (postId: string, status: string) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/users/posts/${postId}/status`,
        { status }
      );

      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, status } : p))
      );
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/posts/${postId}`, {
        withCredentials: true,
      });

      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">All Posts</h1>
      <Separator />
      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && posts.length === 0 && (
        <p className="text-center text-muted-foreground">No posts</p>
      )}

      {!loading && (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card
              key={post._id}
              className="cursor-pointer hover:shadow-md transition"
              onClick={() => navigate(`/api/posts/${post._id}`)}
            >
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <CardTitle>{post.title}</CardTitle>
                {canEditPost(post) && (
                  <div className="flex gap-2">
                    {post.status === "DRAFT" ? (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(post._id, "PUBLISHED");
                        }}
                      >
                        Publish
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(post._id, "DRAFT");
                        }}
                      >
                        Move to Draft
                      </Button>
                    )}

                    {user?.role === "Admin" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(post._id);
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.description}
                </p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>
                    By {post.authorName} •{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex gap-4 items-center">
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {post.likesCount}
                    </span>

                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {post.commentsCount ?? 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* Pagination */}
      <div className="flex justify-between items-center pt-6">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <Button
          variant="outline"
          disabled={page === pagination.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AllPosts;
