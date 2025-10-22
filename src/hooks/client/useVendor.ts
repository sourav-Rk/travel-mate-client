import { getVendorDetailsClient } from "@/services/client/client.service";
import { useQuery } from "@tanstack/react-query";

export const useGetVendorDetailsForClientQuery = (vendorId: string) => {
  return useQuery({
    queryKey: ["vendor-details-client"],
    queryFn: () => getVendorDetailsClient(vendorId),
  });
};
