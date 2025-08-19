import type { RootState } from "@/store/store";
import type { JSX} from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  element: JSX.Element;
  allowedRoles: string[];
}

export const AuthRoute = ({ element, allowedRoles }: ProtectedRouteProps) => {
  const userRole = useSelector((state: RootState) => state.client.client?.role);

  if (!userRole) {
    return <Navigate to={"/login"} />;
  }

  return allowedRoles.includes(userRole) ? (
    element
  ) : (
    <Navigate to={"/unauthorized"} />
  );
};

export const AuthAdminRoute = ({
  element,
  allowedRoles,
}: ProtectedRouteProps) => {
  const userRole = useSelector((state: RootState) => state.admin.admin?.role);

  if (!userRole) {
    return <Navigate to={"/admin"} />;
  }

  return allowedRoles.includes(userRole) ? (
    element
  ) : (
    <Navigate to={"/unauthorized"} />
  );
};


export const AuthGuideRoute = ({
  element,
  allowedRoles,
}: ProtectedRouteProps) => {
  const userRole = useSelector((state: RootState) => state.guide.guide?.role);

  if (!userRole) {
    return <Navigate to={"/guide/login"} />;
  }

  return allowedRoles.includes(userRole) ? (
    element
  ) : (
    <Navigate to={"/unauthorized"} />
  );
}


export const AuthVendorRoute = ({
  element,
}: ProtectedRouteProps) => {
  const user = useSelector((state: RootState) => state.vendor.vendor);

  const location = useLocation();


  if (!user) return <Navigate to={"/vendor"} />;

  const {status} = user;

  if(status === "pending") {
    if(location.pathname === "/vendor/locked" || location.pathname.startsWith("/vendor/signup/step")){
      return element
    }else{
      return <Navigate to={"/vendor/locked"}/>
    }
  }

  if(status === "reviewing"){
    return location.pathname === "/vendor/locked"
    ?element
    :<Navigate to={"/vendor/locked"}/>
  }

  if(status === "verified"){
      if (location.pathname === "/vendor/locked") {
      return <Navigate to="/vendor/dashboard" />;
    }
    return element
  }
  
  return <Navigate to={"/vendor"}/>

};

  //   return allowedRoles.includes("vendor") ? (
  //   element
  // ) : (
  //   <Navigate to={"/unauthorized"} />
  // );

