import { resetPassword } from "@/services/guide/guide.service"
import type { ResetFormType } from "@/types/authTypes"
import type { IResponse } from "@/types/Response"
import { useMutation } from "@tanstack/react-query"

export const useResetPassword = () =>{
    return useMutation<IResponse,Error,ResetFormType>({
        mutationFn : (data : ResetFormType) => resetPassword(data)
    })
}