import { Routes, Route } from "react-router-dom";

import OtpVerification from "@/components/auth/Otp";
import UserSignup from "@/pages/user/UserSignup";
import UserLogin from "@/pages/user/UserLogin";
import { NoAuthRoute } from "@/protected/PubliceRoute";
import { ProtectedRoute } from "@/protected/ProtectedRoute";
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
import GuideDetailsPage from "@/pages/user/GuideDetailsPage";
import ClientGuideChatPage from "@/pages/user/ClientGuideChatPage";
import { ChatSidebar } from "@/components/chat/chatSideBar/ChatSidebar";
import ChatPage from "@/pages/chatSidebar/ChatSidebarPage";
import ClientWalletPage from "@/pages/user/ClientWalletPage";

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
        <Route path="/change-password" element={<ProtectedRoute allowedRoles={["client"]} element={<UserPasswordChangePage />}/>}/>

        {/* Protected routes with layout */}
        <Route path="/" element={<ProtectedRoute allowedRoles={["client"]} element={<ClientLayout />} />}>
          <Route path="/home" element={<TravelHomePage />} />
          <Route path="/packages/checkout/:bookingId/:packageId" element={<CheckoutPage/>}/>
        </Route>

        {/* Protected routes client profile layout  */}
       <Route path="/pvt" element={ <ProtectedRoute allowedRoles={["client"]} element={<ClientLayoutProfile/>}/>}>
        <Route path="profile"element={<ProfilePage/>}/>
        <Route path="profile-edit" element={<ProtectedRoute allowedRoles={["client"]} element={<ProfileEditPage />}/>}/>
        <Route path="bookings" element={<ProtectedRoute allowedRoles={["client"]} element={<BookingsView/>}/>}/>
        <Route path="bookings/:bookingId/:packageId" element={<ProtectedRoute allowedRoles={["client"]} element={<BookingDetailsViewClientPage/>}/>}/>
        <Route path="wishlist" element={<WishlistPageClient/>}/>
        <Route path="guide/:guideId/:bookingId" element={<GuideDetailsPage/>}/>
        <Route path="wallet" element={<ClientWalletPage/>}/>
       </Route>
         <Route path="/chat" element={<ProtectedRoute allowedRoles={["client"]} element={<ChatPage/>}/>}/>
        <Route path="/chat/:guideId/:bookingId" element={<ProtectedRoute allowedRoles={["client"]} element={<ClientGuideChatPage/>}/> }/>
        <Route path="/cancel" element={<PaymentCancelledPage/>}/>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default ClientRouter;
