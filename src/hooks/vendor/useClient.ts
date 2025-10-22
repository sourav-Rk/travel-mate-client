import { getClientDetailsVendor } from "@/services/vendor/vendorService";
import { useQuery } from "@tanstack/react-query";

export const useClientDetailsVendorQuery = (clientId: string) => {
  return useQuery({
    queryKey: ["client-details-vendor"],
    queryFn: () => getClientDetailsVendor(clientId),
  });
};
