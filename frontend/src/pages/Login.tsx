import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "./../../public/blog.jpeg";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const { email, password } = formData;

    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const { user, success } = res.data;

      if (!success || !user) {
        throw new Error("Invalid login response");
      }

      login(user);
      toast.success("Login successful");

      // Role-based redirect
      switch (user.role) {
        case "Admin":
          navigate("/admin");
          break;
        case "Author":
          navigate("/author");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 bg-white shadow-lg rounded-xl p-6">
        {/* Left Section */}
        <div className="flex flex-col justify-center">
          <img
            src={logo}
            alt="BlogSphere"
            className="h-40 w-40 rounded-full mx-auto"
          />
          <h1 className="text-3xl font-bold text-center mt-4">Welcome Back</h1>
          <p className="text-sm text-gray-500 text-center mt-2">
            Sign in to continue to BlogSphere
          </p>
        </div>

        {/* Right Section */}
        <div>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label className="mb-1 block">Email</Label>
              <Input
                name="email"
                type="email"
                placeholder="name@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label className="mb-1 block">Password</Label>
              <Input
                name="password"
                type="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner size={20} className="animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="text-sm mt-4 text-center">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
