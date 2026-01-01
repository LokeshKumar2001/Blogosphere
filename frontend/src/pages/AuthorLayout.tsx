import { SidebarProvider } from "@/components/ui/sidebar";
import AuthorSidebar from "@/pages/AuthorSidebar";
import { Outlet } from "react-router-dom";

const AuthorLayout = () => {
  return (
    <SidebarProvider>
      <AuthorSidebar />

      <div className="w-full">
        <div className="p-10 mt-10">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AuthorLayout;
