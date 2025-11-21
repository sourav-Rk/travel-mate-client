import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/services/admin/admin.service";
import type { DashboardPeriod } from "@/types/api/dashboard";

export const useDashboardStats = (filters?: {
  period?: DashboardPeriod;
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ["dashboardStats", filters],
    queryFn : ()=> getDashboardStats(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};




















