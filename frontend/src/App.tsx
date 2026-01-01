import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import AuthorDashboard from "./pages/AuthorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./context/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/NavBar";
import AuthorLayout from "./pages/AuthorLayout";
import Logout from "./pages/Logout";
import AllPosts from "./pages/AllPosts";
import MyPost from "./pages/MyPost";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import DraftPosts from "./pages/DraftPosts";
import PostDetails from "./pages/PostDetails";
import EditPost from "./pages/EditPost";
import AdminLayout from "./pages/AdminLayout";
import Users from "./pages/Users";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute allowedRoles={["Author", "Admin"]}>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/signup",
    element: <SignUp />,
  },

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/api/posts/:postId",
    element: <PostDetails />,
  },

  {
    path: "/author",
    element: (
      <ProtectedRoute allowedRoles={["Author"]}>
        <Navbar />
        <AuthorLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AuthorDashboard />,
      },
      {
        path: "create",
        element: <CreatePost />,
      },
      { path: "posts/:postId", element: <EditPost /> },
      {
        path: "posts",
        element: <AllPosts />,
      },
      {
        path: "drafts",
        element: <DraftPosts />,
      },
      {
        path: "myPosts",
        element: <MyPost />,
      },

      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["Admin"]}>
        <Navbar />
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },

      {
        path: "users",
        element: <Users />,
      },
      {
        path: "posts",
        element: <AllPosts />,
      },

      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);
function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
