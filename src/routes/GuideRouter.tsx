import GuideDashboard from "@/components/guide/GuideDashboard";
import GuideLayout from "@/components/layouts/GuideLayout";
import NotFoundPage from "@/components/NotFound";
import GuideLogin from "@/pages/guide/GuideLogin";
import { GuidePasswordChangePage } from "@/pages/guide/GuidePasswordChangePage";
import GuideProfilePage from "@/pages/guide/GuideProfilePage";
import PasswordResetPage from "@/pages/guide/PasswordResetPage";
import { AuthGuideRoute } from "@/protected/ProtectedRoute";
import { NoAuthGuideRoute } from "@/protected/PubliceRoute";
import { Routes, Route } from "react-router-dom";
const GuideRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<NoAuthGuideRoute element={<GuideLogin />} />}/>
      <Route path="/reset-password" element={<PasswordResetPage />} />

      {/* Protected routes with layout */}
      <Route path="/" element={ <AuthGuideRoute element={<GuideLayout />} allowedRoles={["guide"]} />}>
      <Route path="/dashboard" element={<AuthGuideRoute allowedRoles={["guide"]} element={<GuideDashboard />}/>}/>
      <Route path="profile" element={<GuideProfilePage/>}/>
      <Route path="change-password" element={<GuidePasswordChangePage/>}/>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default GuideRouter;
