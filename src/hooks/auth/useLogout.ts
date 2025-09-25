
import { logoutUser } from "@/services/auth/authService";
import { useMutation } from "@tanstack/react-query";

export const useLogout = () => {
   return useMutation({
      mutationFn : logoutUser
   })
}