import { payAdvanceAmount, payFullAmount } from "@/services/client/client.service";
import { useMutation } from "@tanstack/react-query";

export const usePayAdvanceAmount = () => {
  return useMutation({
    mutationFn: ({ bookingId, amount }: { bookingId: string; amount: number }) =>
      payAdvanceAmount(bookingId, amount),
  });
};

export const usePayFullAmount = () => {
  return useMutation({
    mutationFn: ({ bookingId, amount }: { bookingId: string; amount: number }) =>
      payFullAmount(bookingId, amount),
  });
};
