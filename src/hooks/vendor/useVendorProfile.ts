import { getVendorDetails } from "@/services/vendor/vendorService"
import { useQuery } from "@tanstack/react-query"

export const useVendorProfileQuery = () =>{
    return useQuery({
        queryKey : ["vendor-profile"],
        queryFn : getVendorDetails,
    })
};


