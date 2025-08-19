import { Outlet } from "react-router-dom";
import { ClientHeader } from "../headers/ClientHeader";
import TravelFooter from "../client/HomePage/TravelFooter";

function ClientLayout(){
    return(
        <div>
            <div className="min-h-screen bg-background">
                <ClientHeader/>
                <Outlet/>
                <TravelFooter/>
            </div>
        </div>
    )
}

export default ClientLayout