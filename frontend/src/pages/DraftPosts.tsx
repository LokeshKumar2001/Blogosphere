import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 5; // Number of drafts per page

const DraftPosts = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [publishing, setPublishing] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    totalPosts: 0,
  });

  const navigate = useNavigate();

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get("http://localhost:5000/api/draft/posts", {
        params: {
          page,
          limit: PAGE_SIZE,
        },
        withCredentials: true,
      });

      setDrafts(res.data.data || []);
      setPagination(
        res.data.pagination || {
          totalPages: 1,
          currentPage: 1,
          totalPosts: 0,
        }
      );
    } catch (err) {
      console.error("Error fetching drafts:", err);
      setError("Failed to fetch drafts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, [page]);

  if (loading) return <p className="text-center mt-10">Loading drafts...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (drafts.length === 0)
    return <p className="text-center mt-10">No drafts found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {drafts.map((post) => (
        <Card key={post._id}>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-xl">{post.title}</CardTitle>
            <Badge variant="destructive">Draft</Badge>
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
                  onClick={() => navigate(`/posts/${post._id}`)}
                >
                  View
                </Button>

                <Button
                  size="sm"
                  onClick={() => navigate(`/author/posts/${post._id}`)}
                >
                  Edit
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

export default DraftPosts;
