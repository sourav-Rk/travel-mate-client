import { updateUserStatus } from "@/services/admin/admin.service";
import type { IResponse } from "@/types/Response";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUpdateUserStatusMutation = () =>{
    const queryClient = useQueryClient();
    return useMutation<IResponse,Error,{userType : string; userId : any}>({
        mutationFn : updateUserStatus,
        onSuccess : () => queryClient.invalidateQueries({queryKey : ["users"]})
    })
}