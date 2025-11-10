import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getVendorSalesReport } from "@/services/vendor/vendorService";
import type { GetVendorSalesReportParams } from "@/types/api/vendor-sales-report";
import type { IGetVendorSalesReportResponse } from "@/types/api/vendor-sales-report";

export const useVendorSalesReport = (
  params?: GetVendorSalesReportParams,
  options?: Omit<UseQueryOptions<IGetVendorSalesReportResponse, Error>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: ["vendor-sales-report", params],
    queryFn: () => getVendorSalesReport(params),
    staleTime: 30000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

