
import { updateVendorStatus } from "@/services/vendor/vendorService";
import type { StatusPayload } from "@/types/authTypes";
import { useMutation,useQueryClient } from "@tanstack/react-query";

export const useUpdateVendorStatusMutation = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn : (data : StatusPayload) => updateVendorStatus(data),
        onSuccess :() =>{
            queryClient.invalidateQueries({queryKey : ["profile-query"]});
        }
        
    })
}