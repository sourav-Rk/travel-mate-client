import { Outlet } from "react-router-dom";
import { ClientHeader } from "../headers/ClientHeader";
import TravelFooter from "../client/HomePage/TravelFooter";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useFcmToken } from "@/hooks/useFcmToken";

function ClientLayout() {
  const user = useSelector((state: RootState) => state.client.client);

  useFcmToken(user,"client");

  return (
    <div>
      <div className="min-h-screen bg-background">
        <ClientHeader />
        <Outlet />
        <TravelFooter />
      </div>
    </div>
  );
}

export default ClientLayout;
