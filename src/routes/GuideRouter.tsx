
import GuideDashboard from "@/components/guide/GuideDashboard";
import GuideLayout from "@/components/layouts/GuideLayout";
import NotFoundPage from "@/components/NotFound";
import GroupChatPage from "@/pages/group-chat/GroupChatPage";
import AssignedTripsPage from "@/pages/guide/AssignedTripsPage";
import BookingDetailsGuidePage from "@/pages/guide/BookingDetailsGuidePage";
import BookingListGuidePage from "@/pages/guide/BookingListPage";
import GuideClientChatPage from "@/pages/guide/GuideClientChatPage";
import GuideLogin from "@/pages/guide/GuideLogin";
import GuidePackageDetailsPage from "@/pages/guide/GuidePackageDetailsPage";
import { GuidePasswordChangePage } from "@/pages/guide/GuidePasswordChangePage";
import GuideProfilePage from "@/pages/guide/GuideProfilePage";
import PasswordResetPage from "@/pages/guide/PasswordResetPage";
import { ProtectedRoute } from "@/protected/ProtectedRoute";
import { NoAuthRoute } from "@/protected/PubliceRoute";
import { Routes, Route } from "react-router-dom";
const GuideRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<NoAuthRoute element={<GuideLogin />} />} />
      <Route path="/reset-password" element={<PasswordResetPage />} />

      {/* Protected routes with layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute element={<GuideLayout />} allowedRoles={["guide"]} />
        }
      >
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["guide"]}
              element={<GuideDashboard />}
            />
          }
        />
        <Route path="profile" element={<GuideProfilePage />} />
        <Route path="change-password" element={<GuidePasswordChangePage />} />
        <Route path="assigned-trips" element={<AssignedTripsPage />} />
        <Route path="package/:packageId" element={<GuidePackageDetailsPage />} />
        <Route path="bookings/users/:bookingId" element={<BookingDetailsGuidePage/>}/>
        <Route path="bookings/:packageId" element={<BookingListGuidePage/>}/>   
        <Route path="chat/:clientId/:bookingId" element={<GuideClientChatPage/>}/>   
      </Route>
      <Route path="/groups" element={<ProtectedRoute allowedRoles={["guide"]} element={<GroupChatPage/>}/>}/>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default GuideRouter;
