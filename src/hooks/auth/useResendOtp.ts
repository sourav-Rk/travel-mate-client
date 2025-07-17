import { resendOtp } from "@/services/auth/authService"
import type { ResendOtptType } from "@/types/authTypes"
import { useMutation } from "@tanstack/react-query"

export const useResendOtpMutation = () => {
    return useMutation({
        mutationFn : (data : ResendOtptType ) => resendOtp(data)
    })
}