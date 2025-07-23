import {  getVendorKycUrlsForAdmin } from "@/services/admin/admin.service"
import { getVendorKycUrls } from "@/services/vendor/vendorService";
import { useMutation } from "@tanstack/react-query"

type Role = "vendor" | "admin";

export const useGetSignedUrlsMutation = (role : Role)=>{
    const mutationFunctionMap = {
        vendor : getVendorKycUrls,
        admin : getVendorKycUrlsForAdmin
    }
    return useMutation({
        mutationFn : mutationFunctionMap[role]
    })
}