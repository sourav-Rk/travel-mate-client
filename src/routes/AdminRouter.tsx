
import VendorView from "@/components/admin/vendor view/VendorView"
import AdminLayout from "@/components/layouts/AdminLayout"
import NotFoundPage from "@/components/NotFound"
import AdminLogin from "@/pages/admin/AdminLogin"
import AdminPackagesTableViewPage from "@/pages/admin/AdminPackagesTableViewPage"
import DashboardPage from "@/pages/admin/DashboardPage"
import { PackageDetailsPageAdmin } from "@/pages/admin/PackageDetailsPageAdmin"
import UserManagementPage from "@/pages/admin/UserManagementPage"
import VendorManagementPage from "@/pages/admin/VendorManagement"
import { ProtectedRoute } from "@/protected/ProtectedRoute"
import { NoAuthRoute } from "@/protected/PubliceRoute"
import { Route, Routes } from "react-router-dom"

const AdminRouter = () => {
    return(
       <div>
        <Routes>
            <Route path="/" element={<NoAuthRoute element={<AdminLogin/>}/>}/>
            <Route path="/ad_pvt" element={<ProtectedRoute allowedRoles={["admin"]} element={<AdminLayout/>}/>}>
            <Route index element={<DashboardPage/>}/>
            <Route path="packages/:packageId" element={<PackageDetailsPageAdmin/>}/>
            <Route path="packages" element={<AdminPackagesTableViewPage/>}/>
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