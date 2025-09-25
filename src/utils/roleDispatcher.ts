import toast from "react-hot-toast";
import type { NavigateFunction } from "react-router-dom";

interface DispatchUserProps {
  userType: "client" | "vendor" | "admin" | "guide";
  navigate: NavigateFunction;
}

export function dispatchUserByRole({
  userType,
  navigate,
}: DispatchUserProps) {
  switch (userType) {
    case "client":
      navigate("/home");
      break;
    case "admin":
      navigate("/admin/ad_pvt");
      break;
    case "vendor":
      navigate("/vendor/locked");
      break;
    case "guide":
       navigate("/guide/profile");
       break;  
    default:
      toast.error("unknown user type");
  }
}
