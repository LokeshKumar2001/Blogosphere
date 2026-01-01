import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Profile {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  // 🔹 Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          withCredentials: true,
        });

        const user = res.data.data;

        setProfile(user);
        setFormData({
          username: user.username,
          email: user.email,
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);

      const res = await axios.put(
        "http://localhost:5000/api/users/profile",
        formData,
        { withCredentials: true }
      );

      setProfile(res.data.data);
      setEditMode(false);
      toast.success("Profile updated successfully ✅");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return <p className="text-center mt-10 text-red-500">Profile not found</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>My Profile</CardTitle>

          {!editMode && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditMode(true)}
            >
              Edit
            </Button>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Username</Label>
            <Input
              disabled={!editMode}
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input disabled value={formData.email} />
          </div>

          <div>
            <Label>Role</Label>
            <Input disabled value={profile.role} />
          </div>

          <div>
            <Label>Joined</Label>
            <Input
              disabled
              value={new Date(profile.createdAt).toLocaleDateString()}
            />
          </div>

          {editMode && (
            <div className="flex gap-3 pt-4">
              <Button disabled={saving} onClick={handleSave}>
                {saving ? "Saving..." : "Save"}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setEditMode(false);
                  setFormData({
                    username: profile.username,
                    email: profile.email,
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
