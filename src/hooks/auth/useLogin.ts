import { useMutation } from "@tanstack/react-query";
import { loginApi } from "@/services/auth/authService";
import type { LoginType } from "@/types/authTypes";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginType) => loginApi(data),
  });
};
