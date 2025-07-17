import { addVendorKyc } from "@/services/vendor/vendorService";
import type { KYCRequestPayload } from "@/types/kycType";
import { useMutation } from "@tanstack/react-query";

export const useAddKycMutation = () => {
  return useMutation<unknown,unknown,KYCRequestPayload>({
    mutationFn: (data) => addVendorKyc(data),
  });
};
