import type { RootState } from "@/store/store";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux"
import type { JSX } from "react";

interface NoAuthRouteProps{
    element : JSX.Element
}

export const NoAuthRoute = ({element } : NoAuthRouteProps) =>{
    const client = useSelector((state : RootState) => state.client.client);
    if(client && client?.role !== "client"){
        return <Navigate to={"/unauthorized"}/>
    }

    if (client){
        return <Navigate to={"/home"}/>
    }

    return element

}

export const NoAdminAuthRoute = ({element} : NoAuthRouteProps) =>{
    const admin = useSelector((state : RootState) => state.admin.admin );

    if(admin && admin?.role !== "admin"){
        return <Navigate to={"/unauthorized"} />
    }

    if(admin){
        return <Navigate to={"/admin/ad_pvt"}/>
    }

    return element
}


export const NoAuthVendorRoute = ({element} : NoAuthRouteProps) =>{
    const vendor = useSelector((state : RootState) => state.vendor.vendor);

    if (vendor) {
    if (vendor.status === "verified") return <Navigate to="/vendor/dashboard" />;
    if (vendor.status === "pending") return <Navigate to="/vendor/locked" />;
    if (vendor.status === "reviewing") return <Navigate to="/vendor/locked" />;
  }
    if(vendor && vendor?.role !== "vendor"){
        return <Navigate to={"/unauthorized"}/>
    }
    return element
}

export const NoAuthGuideRoute = ({element} : NoAuthRouteProps) =>{
    const guide = useSelector((state : RootState) => state.guide.guide);

    if(guide && guide?.role !== "guide"){
        return <Navigate to={"/unauthorized"}/>
    }

    if(guide){
        return <Navigate to={"/guide/dashboard"}/>
    }
    return element
}
