import { useMutation } from "@tanstack/react-query";
import { signupApi } from "@/services/auth/authService";

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: (email: string) => signupApi(email),
  });
};
