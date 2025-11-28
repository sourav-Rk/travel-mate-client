import type { RootState } from "@/store/store";
import type { JSX} from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  element: JSX.Element;
  allowedRoles: string[];
}


export const ProtectedRoute = ({ element, allowedRoles }: ProtectedRouteProps) => {
  const user = useSelector((state: RootState) => state.user.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based check
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  //Vendor-specific status logic
  if (user.role === "vendor") {
    const { status } = user;

    if (status === "pending") {
      return location.pathname.startsWith("/vendor/signup/step") ||
        location.pathname === "/vendor/locked"
        ? element
        : <Navigate to="/vendor/locked" replace />;
    }

    if (status === "reviewing") {
      return location.pathname === "/vendor/locked"
        ? element
        : <Navigate to="/vendor/locked" replace />;
    }

    if (status === "verified" && location.pathname === "/vendor/locked") {
      return <Navigate to="/vendor/dashboard" replace />;
    }
  }

  return element;
};
