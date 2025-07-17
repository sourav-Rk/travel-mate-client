import { vendorAxiosInstance } from "@/api/vendor.axios";
import type { ResetFormType } from "@/types/authTypes";


export const resetPassword = async(data : ResetFormType) =>{
        const response = await vendorAxiosInstance.post("/_gu/guide/reset-password",data);
        return response.data;
}