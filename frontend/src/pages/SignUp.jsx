import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { LoaderCircle } from "lucide-react";
import logo from "./../../public/blog.jpeg";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { toast } from "sonner";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Author",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    const { username, email, password, confirmPassword, role } = formData;

    if (!username || !email || !password || !confirmPassword) {
      return setErrorMessage("All fields are required.");
    }

    if (password !== confirmPassword) {
      return setErrorMessage("Password do not match.");
    }

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username,
          password,
          email,
          confirmPassword,
          role,
        },
        {
          withCredentials: true,
        }
      );
      navigate("/login");
      toast.success("User Registration Successful.");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 bg-white shadow-lg rounded-xl p-6">
        <div className="flex flex-col justify-center">
          <img
            src={logo}
            alt="BlogSphere"
            className="h-40 w-40 rounded-full mx-auto"
          />
          <h1 className="text-3xl font-bold text-center mt-4">
            Join BlogSphere
          </h1>
          <p className="text-sm text-gray-500 text-center mt-2">
            Create, publish, and manage blogs with role-based access.
          </p>
        </div>

        <div>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label className="py-0.5 mb-2">Username</Label>
              <Input
                name="username"
                placeholder="Lokesh"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label className="py-0.5 mb-2">Email</Label>
              <Input
                name="email"
                type="email"
                placeholder="name@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label className="py-0.5 mb-2">Password</Label>
              <Input
                name="password"
                type="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label className="py-0.5 mb-2">Confirm Password</Label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="********"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label className="py-0.5 mb-2">Role</Label>
              <Select onValueChange={handleRoleChange} defaultValue="Author">
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Author">Author</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner size={20} className="animate-spin" />
                  Signing up...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="text-sm mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
