import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getSalesReport } from "@/services/admin/admin.service";
import type { DashboardPeriod } from "@/types/api/salesReport";
import type { IGetSalesReportResponse } from "@/types/api/salesReport";

interface UseSalesReportFilters {
  period?: DashboardPeriod;
  startDate?: string;
  endDate?: string;
  vendorId?: string;
  packageId?: string;
}

interface UseSalesReportOptions {
  enabled?: boolean;
}

export const useSalesReport = (
  filters: UseSalesReportFilters = {},
  options: UseSalesReportOptions = {}
) => {
  return useQuery<IGetSalesReportResponse>({
    queryKey: ["salesReport", filters],
    queryFn: () => getSalesReport(filters),
    enabled: options.enabled ?? true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

