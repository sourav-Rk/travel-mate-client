import { useMutation } from "@tanstack/react-query";
import { sendOtp } from "@/services/auth/authService";
import type { SignupFormValues } from "@/types/authTypes";


export const useSendOTPMutation = () => {
    return useMutation({
        mutationFn : (data : SignupFormValues) => sendOtp(data),
    })
}