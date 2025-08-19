import { adminLogin } from "@/store/slices/adminSlice";
import { clientLogin } from "@/store/slices/clientSlice";
import { guideLogin } from "@/store/slices/guideSlice";
import { vendorLogin } from "@/store/slices/vendor.slice";
import type { AppDispatch } from "@/store/store";
import toast from "react-hot-toast";
import type { NavigateFunction } from "react-router-dom";

interface DispatchUserProps {
  userType: "client" | "vendor" | "admin" | "guide";
  user: any;
  dispatch: AppDispatch;
  navigate: NavigateFunction;
}

export function dispatchUserByRole({
  userType,
  user,
  dispatch,
  navigate,
}: DispatchUserProps) {
  switch (userType) {
    case "client":
      dispatch(clientLogin(user));
      navigate("/home");
      break;
    case "admin":
      dispatch(adminLogin(user));
      navigate("/admin/ad_pvt");
      break;
    case "vendor":
      dispatch(vendorLogin(user));
      navigate("/vendor/locked");
      break;
    case "guide":
       dispatch(guideLogin(user));
       navigate("/guide/profile");
       break;  
    default:
      toast.error("unknown user type");
  }
}
