import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const CreatePost = () => {
  const navigate = useNavigate();
  useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
  });

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (status: string) => {
    if (!formData.title || !formData.content) {
      toast.error("Title and content are required.");
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/posts",
        {
          title: formData.title,
          description: formData.content,
          tags: formData.tags,
          status,
        },
        { withCredentials: true }
      );
      toast.success(
        status === "PUBLISHED"
          ? "Post published successfully "
          : "Draft saved successfully "
      );

      navigate("/author/posts");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <div className="space-y-5">
        <div>
          <Label>Title</Label>
          <Input
            name="title"
            placeholder="Enter post title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Content</Label>
          <Textarea
            name="content"
            placeholder="Write your blog content here..."
            rows={8}
            value={formData.content}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Category</Label>
          <Input
            name="tags"
            placeholder="Tech, Lifestyle, Education..."
            value={formData.tags}
            onChange={handleChange}
          />
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => handleSubmit("DRAFT")}
          >
            Save as Draft
          </Button>

          <Button disabled={loading} onClick={() => handleSubmit("PUBLISHED")}>
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
