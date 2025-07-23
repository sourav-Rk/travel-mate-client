import { Routes, Route } from "react-router-dom";

import OtpVerification from "@/components/auth/Otp";
import UserSignup from "@/pages/user/UserSignup";
import UserLogin from "@/pages/user/UserLogin";
import { NoAuthRoute } from "@/protected/PubliceRoute";
import { AuthRoute } from "@/protected/ProtectedRoute";
import ClientLayout from "@/components/layouts/ClientLayout";
import TravelMateLanding from "@/components/client/landingPage/TravelMateLanding";
import NotFoundPage from "@/components/NotFound";
import LandingPage from "@/pages/common/LandingPage";
import AuthPage from "@/components/logindemo/AuthPage";
import { ProfilePage } from "@/components/client/Profile";
import { ProfileEditPage } from "@/components/client/ProfileEdit";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import PasswordResetForm from "@/components/auth/PasswordResetForm";
import { UserPasswordChangePage } from "@/pages/user/UserPasswordChange";

const ClientRouter = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={<NoAuthRoute element={<UserLogin />} />}
        />
        <Route
          path="/login/auth"
          element={<NoAuthRoute element={<AuthPage />} />}
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
          path="/profile"
          element={
            <AuthRoute element={<ProfilePage/>} allowedRoles={["client"]} />
          }
        />

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
          <Route path="/landing" element={<TravelMateLanding />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default ClientRouter;
