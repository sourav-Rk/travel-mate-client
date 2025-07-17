import { Outlet } from "react-router-dom";
import AdminSidebar from "../admin/AdminSidebar";

function AdminLayout() {
  return (
    <div>
      <div className="min-h-screen bg-background">
        <AdminSidebar />
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
