import { Outlet } from "react-router-dom";
import VendorSidebar from "../vendor/VendorSidebar";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useFcmToken } from "@/hooks/useFcmToken";

function VendorLayout() {
  const user = useSelector((state: RootState) => state.user.user);

  useFcmToken(user, "vendor");

  return (
    <div>
      <div className="min-h-screen bg-background">
        <VendorSidebar />
        <Outlet />
      </div>
    </div>
  );
}

export default VendorLayout;
