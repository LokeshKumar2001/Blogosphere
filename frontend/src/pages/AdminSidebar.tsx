import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  MessageSquare,
  UserCircle2,
  LogOut,
  Layers,
  Users,
  Heart,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const adminSidebarOptions = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    title: "Users",
    icon: Users,
    path: "/admin/users",
  },
  {
    title: "All Posts",
    icon: Layers,
    path: "/admin/posts",
  },
  {
    title: "Liked Posts",
    icon: Heart,
    path: "/admin/liked-posts",
  },
  {
    title: "Comments",
    icon: MessageSquare,
    path: "/admin/comments",
  },
  {
    title: "Profile",
    icon: UserCircle2,
    path: "/admin/profile",
  },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = async () => {
    await axios.post(
      "http://localhost:5000/api/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );
    navigate("/logout");
    logout();
  };
  return (
    <Sidebar className="flex flex-col h-[calc(100vh-4rem)] mt-16">
      <SidebarHeader className="p-4 text-xl font-bold">
        <span className="text-primary">BlogSphere</span>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminSidebarOptions.map((item, index) => {
                const isActive = location.pathname === item.path;

                return (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 p-4 rounded-md text-base transition ${
                          isActive
                            ? "bg-purple-100 text-orange-400 font-medium"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <item.icon className="h-6 w-6" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-4 border-t bg-gray-50">
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
