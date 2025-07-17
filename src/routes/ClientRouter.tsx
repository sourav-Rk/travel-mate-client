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

const ClientRouter = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/login" element={<NoAuthRoute element={<UserLogin />} />} />
        <Route
          path="/signup"
          element={<NoAuthRoute element={<UserSignup />} />}
        />
        <Route
          path="/otp/verify"
          element={<NoAuthRoute element={<OtpVerification />} />}
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
