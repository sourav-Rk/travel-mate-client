import { useQuery } from "@tanstack/react-query";
import { getVendorDashboardStats } from "@/services/vendor/vendorService";
import type { VendorDashboardPeriod } from "@/types/api/vendor-dashboard";

export const useVendorDashboardStats = (filters?: {
  period?: VendorDashboardPeriod;
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ["vendorDashboardStats", filters],
    queryFn: () => getVendorDashboardStats(filters),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};



















