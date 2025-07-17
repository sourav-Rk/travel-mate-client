import { useMutation } from "@tanstack/react-query";
import { sendOtp } from "@/services/auth/authService";
import type { User } from "@/types/User";


export const useSendOTPMutation = () => {
    return useMutation({
        mutationFn : (data : User) => sendOtp(data),
    })
}