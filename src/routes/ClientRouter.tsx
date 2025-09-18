import { Routes, Route } from "react-router-dom";

import OtpVerification from "@/components/auth/Otp";
import UserSignup from "@/pages/user/UserSignup";
import UserLogin from "@/pages/user/UserLogin";
import { NoAuthRoute } from "@/protected/PubliceRoute";
import { AuthRoute } from "@/protected/ProtectedRoute";
import ClientLayout from "@/components/layouts/ClientLayout";
import NotFoundPage from "@/components/NotFound";
import { ProfilePage } from "@/components/client/Profile";
import { ProfileEditPage } from "@/components/client/ProfileEdit";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import PasswordResetForm from "@/components/auth/PasswordResetForm";
import { UserPasswordChangePage } from "@/pages/user/UserPasswordChange";
import ClientLayoutProfile from "@/components/layouts/ClientLayoutProfile";
import TravelHomePage from "@/pages/user/TravelHomePage";
import PackagesListingPage from "@/pages/user/PackagesListingPage";
import PackageDetailsPage from "@/pages/user/PackageDetailsPage";
import VolunteeringLanding from "@/components/client/VolunteeringLanding";
import BookingsView from "@/components/client/Bookings/BookingView";
import BookingDetailsViewClientPage from "@/pages/user/BookingDetailsViewClientPage";
import CheckoutPage from "@/pages/user/CheckoutPage";
import PaymentCancelledPage from "@/pages/user/PaymentCancelledPage";
import WishlistPageClient from "@/pages/user/WishlistPage";

const ClientRouter = () => {
  return (
    <div>
      <Routes>
       
       {/* No auth needed - landing */}
        <Route path="/" element={<ClientLayout />} >
          <Route path="/" element={<TravelHomePage />} />
          <Route path="/packages/:packageId" element={<PackageDetailsPage/>}/>
          <Route path="packages" element={<PackagesListingPage/>} />
          <Route path="volunteering" element={<VolunteeringLanding/>}/>
        </Route>
        
        {/* authentication routes */}
        <Route path="/login" element={<NoAuthRoute element={<UserLogin />} />} />
        <Route path="/signup" element={<NoAuthRoute element={<UserSignup />} />} />
        <Route path="/otp/verify" element={<NoAuthRoute element={<OtpVerification />} />}/>
        <Route  path="/forgot-password/sendmail" element={<ForgotPasswordForm/>}/>
        <Route  path="reset-password" element={<PasswordResetForm/>}/>
        <Route path="/change-password" element={<AuthRoute allowedRoles={["client"]} element={<UserPasswordChangePage />}/>}/>

        {/* Protected routes with layout */}
        <Route path="/" element={<AuthRoute allowedRoles={["client"]} element={<ClientLayout />} />}>
          <Route path="/home" element={<TravelHomePage />} />
          <Route path="/packages/checkout/:bookingId/:packageId" element={<CheckoutPage/>}/>
        </Route>

        {/* Protected routes client profile layout  */}
       <Route path="/pvt" element={ <AuthRoute allowedRoles={["client"]} element={<ClientLayoutProfile/>}/>}>
        <Route path="profile"element={<ProfilePage/>}/>
        <Route path="profile-edit" element={<AuthRoute allowedRoles={["client"]} element={<ProfileEditPage />}/>}/>
        <Route path="bookings" element={<AuthRoute allowedRoles={["client"]} element={<BookingsView/>}/>}/>
        <Route path="bookings/:bookingId/:packageId" element={<AuthRoute allowedRoles={["client"]} element={<BookingDetailsViewClientPage/>}/>}/>
        <Route path="wishlist" element={<WishlistPageClient/>}/>
       </Route>

        <Route path="/cancel" element={<PaymentCancelledPage/>}/>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default ClientRouter;
