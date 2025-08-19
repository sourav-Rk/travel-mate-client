import { Outlet } from "react-router-dom";
import ClientSidebar from "../client/ClientSidebar";

function ClientLayoutProfile(){
    return(
        <div>
            <div className="min-h-screen bg-background">
                <ClientSidebar/>
                <Outlet/>
            </div>
        </div>
    )
}

export default ClientLayoutProfile