import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const EditPost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    status: "DRAFT",
  });

  // Fetch post by ID
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/api/posts/${postId}`,
          { withCredentials: true }
        );
        const { title, description, tags, status } = res.data.data;
        setFormData({
          title,
          content: description,
          tags: tags.join(", "),
          status,
        });
      } catch (err) {
        console.error("Fetch post error:", err);
        toast.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (status: string) => {
    if (!formData.title || !formData.content) {
      toast.error("Title and content are required.");
      return;
    }
    try {
      setSaving(true);
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/posts/${postId}`,
        {
          title: formData.title,
          description: formData.content,
          tags: formData.tags.split(",").map((t) => t.trim()),
          status,
        },
        { withCredentials: true }
      );
      toast.success(
        status === "PUBLISHED"
          ? "Post published successfully "
          : "Draft saved successfully "
      );
      navigate("/author/myPosts");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading post...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <div className="space-y-5">
        <div>
          <Label>Title</Label>
          <Input
            name="title"
            className="mt-2"
            placeholder="Enter post title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Content</Label>
          <Textarea
            className="mt-2"
            name="content"
            placeholder="Write your blog content here..."
            rows={8}
            value={formData.content}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Category </Label>
          <Input
            className="mt-2"
            name="tags"
            placeholder="Tech, Lifestyle, Education..."
            value={formData.tags}
            onChange={handleChange}
          />
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            disabled={saving}
            onClick={() => handleSubmit("DRAFT")}
          >
            Save as Draft
          </Button>

          <Button disabled={saving} onClick={() => handleSubmit("PUBLISHED")}>
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
