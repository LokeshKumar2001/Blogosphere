import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 5;

interface Post {
  _id: string;
  title: string;
  description: string;
  status: "DRAFT" | "PUBLISHED";
  createdAt: string;
}

interface Pagination {
  totalPages: number;
  currentPage: number;
  totalPosts: number;
}

const MyPost = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    totalPages: 1,
    currentPage: 1,
    totalPosts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchPosts = async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/posts/myPosts`,
        {
          params: { page: pageNumber, limit: PAGE_SIZE },
          withCredentials: true,
        }
      );

      setPosts((res.data.data as Post[]) ?? []);
      setPagination(
        (res.data.pagination as Pagination) ?? {
          totalPages: 1,
          currentPage: 1,
          totalPosts: 0,
        }
      );
    } catch (err) {
      console.error("Fetch posts error:", err);
      setError("Failed to fetch your posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const handlePublish = async (postId: string) => {
    if (!window.confirm("Publish this post?")) return;

    try {
      setPublishing(postId);

      await axios.patch(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/api/posts/${postId}/publish`,
        {},
        { withCredentials: true }
      );

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, status: "PUBLISHED" } : post
        )
      );
    } catch (err) {
      console.error("Publish error:", err);
      alert("Failed to publish post");
    } finally {
      setPublishing(null);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      setDeleting(postId);

      await axios.delete(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/posts/${postId}`,
        { withCredentials: true }
      );

      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete post");
    } finally {
      setDeleting(null);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-muted-foreground">
        Loading your posts...
      </p>
    );

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  if (posts.length === 0)
    return (
      <p className="text-center mt-10 text-muted-foreground">No posts found.</p>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {posts.map((post) => (
        <Card key={post._id}>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-xl">{post.title}</CardTitle>
            <Badge
              variant={post.status === "DRAFT" ? "destructive" : "secondary"}
            >
              {post.status}
            </Badge>
          </CardHeader>

          <CardContent>
            <p className="text-gray-700 mb-2">{post.description}</p>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Created: {new Date(post.createdAt).toLocaleDateString()}
              </span>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/api/posts/${post._id}`)}
                >
                  View
                </Button>

                <Button
                  size="sm"
                  onClick={() => navigate(`/author/posts/${post._id}`)}
                >
                  Edit
                </Button>

                {post.status === "DRAFT" && (
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={publishing === post._id}
                    onClick={() => handlePublish(post._id)}
                  >
                    {publishing === post._id ? "Publishing..." : "Publish"}
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="destructive"
                  disabled={deleting === post._id}
                  onClick={() => handleDelete(post._id)}
                >
                  {deleting === post._id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

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

export default MyPost;
