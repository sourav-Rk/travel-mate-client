// import { vendorAxiosInstance } from "@/api/vendor.axios";

// import { useMutation } from "@tanstack/react-query";

// export const useUploadImagesMutation = () => {
//   return useMutation<string[], Error, File[]>({
//     mutationFn: async (files) => {
//       const form = new FormData();
//       files.forEach((f) => form.append("image", f));
//       const res = await vendorAxiosInstance.post("_ve/vendor/images/upload", form, {
//         headers: { "Content‑Type": "multipart/form-data" },
//       });
//       return res.data.data as string[];
//     },
//   });
// };


// import { vendorAxiosInstance } from "@/api/vendor.axios";
// import { useMutation } from "@tanstack/react-query";
// import { AxiosError } from "axios";

// export const useUploadImagesMutation = () => {
//   return useMutation<string[], Error, File[]>({
//     mutationFn: async (files) => {
//       const form = new FormData();
//       files.forEach((f) => form.append("image", f));

//       try {
//         const res = await vendorAxiosInstance.post("_ve/vendor/images/upload", form, {
//           headers: { "Content-Type": "multipart/form-data" },

//         });
//         return res.data.data as string[];
//       } catch (err) {
//         const error = err as AxiosError;
//         const message =
//           error?.response?.data.message ||

      
//           error?.message ||
//           "Image upload failed";
//         throw new Error(message);
//       }
//     },
//   });
// };

// hooks/vendor/useUploadImagesMutation.ts
import { useMutation } from "@tanstack/react-query";
import { uploadImages } from "@/services/vendor/vendorService";

export const useUploadImagesMutation = () => {
  return useMutation({
    mutationFn: uploadImages,
  });
};

