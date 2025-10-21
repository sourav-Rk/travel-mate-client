import { getVendorDetails, getVendorProfile, updateVendorDetails, vendorResendOtp, vendorSendEmailOtp } from "@/services/vendor/vendorService"
import type { IVendor } from "@/types/User";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useVendorProfileQuery = () =>{
    return useQuery({
        queryKey : ["vendor-profile"],
        queryFn : getVendorDetails,
    })
};

export const useVendorDetailsQuery = () =>{
    return useQuery({
        queryKey : ["vendor-details"],
        queryFn : getVendorProfile,
    })  
}


export const useVendorUpdateDetailsMutation = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn : (data : Partial<IVendor>) => updateVendorDetails(data),
        onSuccess : () =>{
            queryClient.invalidateQueries({queryKey : ["vendor-details"]})
        }
    })
}

export const useVendorSendEmailMutation = () =>{
    return useMutation({
        mutationFn : vendorSendEmailOtp,
    })
}

export const useVendorResendEmailOtp = () =>{
    return useMutation({
        mutationFn : vendorResendOtp,
    })
}


