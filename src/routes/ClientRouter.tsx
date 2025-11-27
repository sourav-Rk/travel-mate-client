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
import GuideServiceChatPage from "@/pages/user/GuideServiceChatPage";
import ClientGuideChatPage from "@/pages/user/ClientGuideChatPage";
import ChatPage from "@/pages/chatSidebar/ChatSidebarPage";
import ClientWalletPage from "@/pages/user/ClientWalletPage";
import ClientVendorChatPage from "@/pages/user/ClientVendorChatPage";
import GroupChatSidebarPage from "@/pages/group-chat/GroupChatSideBarPage";
import { LocalGuideVerificationForm } from "@/components/client/local-guide/LocalGuideVerificationForm";
import VolunteerPostsPage from "@/pages/user/VolunteerPostsPage";
import VolunteerPostDetailPage from "@/pages/user/VolunteerPostDetailPage";
import CreateVolunteerPostPage from "@/pages/user/CreateVolunteerPostPage";
import MyVolunteerPostsPage from "@/pages/user/MyVolunteerPostsPage";
import LocalGuideProfilePage from "@/pages/user/LocalGuideProfilePage";
import { VolunteeringLayout } from "@/components/client/volunteer-post/layout/VolunteeringLayout";
import { VerificationCheck } from "@/components/client/local-guide/VerificationCheck";
import LocalGuideBookingsPage from "@/pages/user/LocalGuideBookingsPage";
import LocalGuideBookingDetailsPage from "@/pages/user/LocalGuideBookingDetailsPage";
import GuideLocalGuideBookingsPage from "@/pages/user/GuideLocalGuideBookingsPage";
import { LocalGuideDetails } from "@/components/client/local-guide/LocalGuideDetails";
import { VolunteeringMapPage } from "@/pages/user/VolunteeringMapPage";

const ClientRouter = () => {
  return (
    <div>
      <Routes>
       
       {/* No auth needed - landing */}
        <Route path="/" element={<ClientLayout />} >
          <Route path="/" element={<TravelHomePage />} />
          <Route path="/packages/:packageId" element={<PackageDetailsPage/>}/>
          <Route path="packages" element={<PackagesListingPage/>} />
        </Route>

        {/* Volunteering routes with VolunteeringLayout */}
        <Route path="/" element={<VolunteeringLayout />}>
          <Route path="volunteering" element={ <VerificationCheck><VolunteeringLanding /></VerificationCheck>}/>
          <Route path="volunteer-posts" element={<VolunteerPostsPage/>}/>
          <Route path="volunteer-posts/:postId" element={<VolunteerPostDetailPage/>}/>
          <Route path="local-guide/details/:profileId" element={<VerificationCheck><LocalGuideDetails/></VerificationCheck>}/>
          <Route path="volunteering/guide-chat" element={<VerificationCheck><GuideServiceChatPage /></VerificationCheck>} />
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
        <Route path="guide-chat/:guideId/:bookingId" element={<ProtectedRoute allowedRoles={["client"]} element={<ClientGuideChatPage/>}/> }/>
        <Route path="vendor-chat/:vendorId/:packageId" element={<ProtectedRoute allowedRoles={["client"]} element={<ClientVendorChatPage/>}/> }/>
        <Route path="wallet" element={<ClientWalletPage/>}/>
        <Route path="local-guide/verification" element={<ProtectedRoute allowedRoles={["client"]} element={<LocalGuideVerificationForm/>}/>}/>
       </Route>

        {/* Protected volunteering routes with VolunteeringLayout */}
        <Route path="/pvt" element={<ProtectedRoute allowedRoles={["client"]} element={<VolunteeringLayout />}/>}>
          <Route path="local-guide/profile" element={<LocalGuideProfilePage/>}/>
          <Route path="posts/create" element={<VerificationCheck><CreateVolunteerPostPage/></VerificationCheck>}/>
          <Route path="posts/edit/:postId" element={<VerificationCheck><CreateVolunteerPostPage/></VerificationCheck>}/>
          <Route path="my-posts" element={<VerificationCheck><MyVolunteerPostsPage/></VerificationCheck>}/>
          <Route path="local-guide/bookings" element={<ProtectedRoute allowedRoles={["client"]} element={<VerificationCheck><LocalGuideBookingsPage/></VerificationCheck>}/>}/>
          <Route path="local-guide/bookings/:bookingId" element={<ProtectedRoute allowedRoles={["client"]} element={<LocalGuideBookingDetailsPage/>}/>}/>
          <Route path="local-guide/my-service-bookings" element={<ProtectedRoute allowedRoles={["client"]} element={<VerificationCheck><GuideLocalGuideBookingsPage/></VerificationCheck>}/>}/>
    
        </Route>
         
         <Route path="/volunteering/map" element={<VolunteeringMapPage/>}/>

         <Route path="/chat" element={<ProtectedRoute allowedRoles={["client"]} element={<ChatPage/>}/>}/>
         <Route path="/groups" element={<ProtectedRoute allowedRoles={["client"]} element={<GroupChatSidebarPage/>}/>}/>
         <Route path="/cancel" element={<PaymentCancelledPage/>}/>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default ClientRouter;
