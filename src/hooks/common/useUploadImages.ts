// hooks/vendor/useUploadImagesMutation.ts
import { useMutation } from "@tanstack/react-query";
import { uploadImages } from "@/services/vendor/vendorService";

export const useUploadImagesMutation = () => {
  return useMutation({
    mutationFn: uploadImages,
  });
};

