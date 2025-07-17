import { updateVendorStatus } from "@/services/admin/admin.service"
import type { IResponse } from "@/types/Response"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useVendorStatusUpdateMutation = () =>{
    const queryClient = useQueryClient();
    return useMutation<IResponse,Error, {vendorId : any,status : string}>({
       mutationFn : updateVendorStatus,
       onSuccess :() => {
          queryClient.invalidateQueries({queryKey : ["user-details"]})
       }
    })
}