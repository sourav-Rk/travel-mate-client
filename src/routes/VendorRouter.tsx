import VendorSignup from "@/pages/vendor/VendorSignup";
import VendorLogin from "@/pages/vendor/VendorLogin";
import { Route, Routes } from "react-router-dom";
import { NoAuthVendorRoute } from "@/protected/PubliceRoute";
import { AuthVendorRoute } from "@/protected/ProtectedRoute";
import VendorLockedPage from "@/components/vendor/VendorLockedPage";
import VendorSignupFlow from "@/components/vendor/VendorSignupFlow";
import VendorLayout from "@/components/layouts/VendorLayout";
import DashboardPage from "@/pages/admin/DashboardPage";
import NotFoundPage from "@/components/NotFound";
import AddGuideForm from "@/components/vendor/addGuide/AddGuideForm";
import VendorProfilePage from "@/pages/vendor/VendorProfilePage";
import { VendorPasswordChangePage } from "@/pages/vendor/VendorPasswordChange";
import VendorProfileEditPage from "@/pages/vendor/VendorProfileEditPage";

const VendorRouter = () => {
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<NoAuthVendorRoute element={<VendorSignup />} />}/>
        <Route index element={<NoAuthVendorRoute element={<VendorLogin />} />} />
        <Route path="/signup/step/" element={<AuthVendorRoute allowedRoles={["vendor"]} element={<VendorSignupFlow />} /> } />
        <Route path="/locked" element={ <AuthVendorRoute allowedRoles={["vendor"]} element={<VendorLockedPage />} />} />
       <Route path="/" element={<VendorLayout/>}>
       <Route path="dashboard" element={<AuthVendorRoute allowedRoles={["vendor"]} element={<DashboardPage />}/>}/>
       <Route path="profile" element={<AuthVendorRoute allowedRoles={["vendor"]} element={<VendorProfilePage/>}/>}/>
       <Route path="profile/edit" element={<AuthVendorRoute allowedRoles={["vendor"]} element={<VendorProfileEditPage/>}/>}/>
       <Route path="change-password" element={<AuthVendorRoute allowedRoles={["vendor"]} element={<VendorPasswordChangePage/>}/>}/>
       <Route path="guide" element={<AddGuideForm/>}/>
       </Route>
        <Route path="*" element={<NotFoundPage />} /> 
      </Routes>
    </div>
  );
};

export default VendorRouter;
