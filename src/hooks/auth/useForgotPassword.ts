import {
  forgotPasswordReset,
  forgotPasswordSendMail,
} from "@/services/auth/authService";
import type { ResetFormType } from "@/types/authTypes";
import type { IResponse } from "@/types/Response";
import { useMutation } from "@tanstack/react-query";

export const useForgotPasswordSendMailMutation = () => {
  return useMutation<IResponse, Error, { email: string }>({
    mutationFn: ({ email }) => forgotPasswordSendMail(email),
  });
};

export const useForgotPasswordResetMutaion = () => {
  return useMutation<IResponse, Error, ResetFormType>({
    mutationFn: (data: ResetFormType) => forgotPasswordReset(data),
  });
};
