import { useMutation } from "@tanstack/react-query";
import { verifyOtp } from "@/services/auth/authService";
import type { OtpVerifyType } from "@/types/authTypes";

export const useVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: (data: OtpVerifyType) => verifyOtp(data),
  });
};
