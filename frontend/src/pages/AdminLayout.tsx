import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <div className="w-full">
        <div className="p-10 mt-10">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
