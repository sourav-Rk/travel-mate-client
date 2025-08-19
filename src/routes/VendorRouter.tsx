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
import GuideListPage from "@/pages/vendor/GuideListPage";
import GuideDetailsPage from "@/pages/vendor/GuideDetailsPage";
import AddPackageForm from "@/components/vendor/package/addPackage/AddPackageForm";
import { PackagesTable } from "@/components/vendor/package/packageTable/PackagesTable";
import { PackageDetailsPage } from "@/pages/vendor/PackageDetailsPage";
import { EditPackage } from "@/components/vendor/package/editPackage/EditPackage";


const VendorRouter = () => {
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<NoAuthVendorRoute element={<VendorSignup />} />}/>
        <Route index element={<NoAuthVendorRoute element={<VendorLogin />} />} />
        <Route path="/signup/step/" element={<AuthVendorRoute allowedRoles={["vendor"]} element={<VendorSignupFlow />} /> } />
        <Route path="/locked" element={ <AuthVendorRoute allowedRoles={["vendor"]} element={<VendorLockedPage />} />} />
       <Route path="/" element={<AuthVendorRoute element={<VendorLayout/>} allowedRoles={["vendor"]}/> }>
       <Route path="dashboard" element={<AuthVendorRoute allowedRoles={["vendor"]} element={<DashboardPage />}/>}/>
       <Route path="profile" element={<AuthVendorRoute allowedRoles={["vendor"]} element={<VendorProfilePage/>}/>}/>
       <Route path="profile/edit" element={<AuthVendorRoute allowedRoles={["vendor"]} element={<VendorProfileEditPage/>}/>}/>
       <Route path="change-password" element={<AuthVendorRoute allowedRoles={["vendor"]} element={<VendorPasswordChangePage/>}/>}/>
       <Route path="guide" element={<GuideListPage/>}/>
       <Route path="guide/:id" element={<GuideDetailsPage/>}/>
       <Route path="guide/add" element={<AddGuideForm/>}/>
       <Route path="packages/edit/:packageId" element={<EditPackage/>}/>
       <Route path="packages/:packageId" element={<PackageDetailsPage/>}/>
       <Route path="packages/add" element={<AddPackageForm/>}/>
       <Route path="packages" element={<PackagesTable/>}/>
       </Route>
        <Route path="*" element={<NotFoundPage />} /> 
      </Routes>
    </div>
  );
};

export default VendorRouter;
