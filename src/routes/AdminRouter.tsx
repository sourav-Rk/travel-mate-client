import VendorView from "@/components/admin/VendorView"
import AdminLayout from "@/components/layouts/AdminLayout"
import NotFoundPage from "@/components/NotFound"
import AdminLogin from "@/pages/admin/AdminLogin"
import DashboardPage from "@/pages/admin/DashboardPage"
import UserManagementPage from "@/pages/admin/UserManagementPage"
import VendorManagementPage from "@/pages/admin/VendorManagement"
import { AuthAdminRoute } from "@/protected/ProtectedRoute"
import { NoAdminAuthRoute } from "@/protected/PubliceRoute"
import { Route, Routes } from "react-router-dom"

const AdminRouter = () => {
    return(
       <div>
        <Routes>
            <Route path="/" element={<NoAdminAuthRoute element={<AdminLogin/>}/>}/>
            <Route path="/ad_pvt" element={<AuthAdminRoute allowedRoles={["admin"]} element={<AdminLayout/>}/>}>
            <Route index element={<DashboardPage/>}/>
            <Route path="vendors" element={<VendorManagementPage/>}/>
            <Route path="users" element={<UserManagementPage/>}/>
            <Route path="vendor/:userId" element={<VendorView/>}/>
            </Route>
            <Route path="*" element={<NotFoundPage />} /> 
        </Routes>
       </div> 
    )
}

export default AdminRouter