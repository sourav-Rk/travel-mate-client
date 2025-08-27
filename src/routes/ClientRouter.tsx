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

const ClientRouter = () => {
  return (
    <div>
      <Routes>

        <Route
          path="/"
          element={<ClientLayout />} >
           <Route path="/" element={<TravelHomePage />} />
          <Route path="/packages/:packageId" element={<PackageDetailsPage/>}/>
          <Route path="packages" element={<PackagesListingPage/>} />

          <Route path="volunteering" element={<VolunteeringLanding/>}/>
        </Route>
        
        <Route
          path="/login"
          element={<NoAuthRoute element={<UserLogin />} />}
        />
        <Route
          path="/signup"
          element={<NoAuthRoute element={<UserSignup />} />}
        />
        <Route
          path="/otp/verify"
          element={<NoAuthRoute element={<OtpVerification />} />}
        />

        <Route  path="/forgot-password/sendmail" element={<ForgotPasswordForm/>}/>
        <Route  path="reset-password" element={<PasswordResetForm/>}/>


        <Route
          path="/profile-edit"
          element={
            <AuthRoute
              allowedRoles={["client"]}
              element={<ProfileEditPage />}
            />
          }
        />
        <Route
          path="/change-password"
          element={
            <AuthRoute
              allowedRoles={["client"]}
              element={<UserPasswordChangePage />}
            />
          }
        />

        {/* Protected routes with layout */}
        <Route
          path="/"
          element={
            <AuthRoute allowedRoles={["client"]} element={<ClientLayout />} />
          }
        >
          <Route path="/home" element={<TravelHomePage />} />
         
        </Route>

        {/*  */}

       <Route
        path="/pvt"
        element={
          <AuthRoute allowedRoles={["client"]} element={<ClientLayoutProfile/>}/>
        }
       >
            <Route
          path="profile"
          element={
           <ProfilePage/>}
          
        />

        <Route
          path="profile-edit"
          element={
            <AuthRoute
              allowedRoles={["client"]}
              element={<ProfileEditPage />}
            />
          }
        />
         
       </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default ClientRouter;
