import { Outlet } from "react-router-dom";
import VendorSidebar from "../vendor/VendorSidebar";

function VendorLayout(){
    return(
        <div>
            <div className="min-h-screen bg-background">
                <VendorSidebar/>
                <Outlet/>
            </div>
        </div>
    )
}

export default VendorLayout