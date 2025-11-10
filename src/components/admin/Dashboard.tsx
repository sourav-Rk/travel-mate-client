"use client";


import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/Spinner";
import { useDashboardStats } from "@/hooks/admin/useDashboardStats";
import { StatCard } from "./dashboard/StatCard";
import { RevenueTrendChart } from "./dashboard/RevenueTrendChart";
import { RevenueDistributionChart } from "./dashboard/RevenueDistributionChart";
import { BookingStatusChart } from "./dashboard/BookingStatusChart";
import { TopAgenciesChart } from "./dashboard/TopAgenciesChart";
import { CategoryPerformanceChart } from "./dashboard/CategoryPerformanceChart";
import { TopSellingPackagesChart } from "./dashboard/TopSellingPackagesChart";
import { Users, Store, DollarSign, TrendingUp, RefreshCw, IndianRupee, IndianRupeeIcon } from "lucide-react";
import type { DashboardPeriod, DashboardStatsDto } from "@/types/api/dashboard";

export default function AdminDashboard() {
  const [period, setPeriod] = useState<DashboardPeriod>("monthly");
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useDashboardStats({
    period,
  });

  const dashboardData: DashboardStatsDto = stats?.dashboardStats!;

  if (isLoading) {
    return (
      <div className="ml-0 lg:ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    console.log(error, "-->error");
    return (
      <div className="ml-0 lg:ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <p className="text-red-600">
              Error loading dashboard data. Please try again.
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
     <div className="ml-0 lg:ml-64 min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#f0f4f8] transition-all duration-300">
      <div className="p-4 lg:p-6 pt-16 lg:pt-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back! Here's what's happening with your platform.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select
              value={period}
              onValueChange={(value) => setPeriod(value as DashboardPeriod)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <button
              onClick={() => refetch()}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

         {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          <StatCard
            title="Total Bookings"
            value={dashboardData?.totalSales!}
            icon={TrendingUp}
            color="text-blue-600"
            bgColor="bg-blue-100"
          />
          <StatCard
            title="Total Travellers"
            value={dashboardData?.totalTravellers ?? 0}
            icon={Users}
            color="text-green-600"
            bgColor="bg-green-100"
          />
          <StatCard
            title="Total Agencies"
            value={dashboardData?.totalAgencies ?? 0}
            icon={Store}
            color="text-purple-600"
            bgColor="bg-purple-100"
          />
          <StatCard
            title="Total Revenue"
            value={dashboardData?.totalRevenue ?? 0}
            icon={IndianRupeeIcon}
            color="text-orange-600"
            bgColor="bg-orange-100"
          />
          <StatCard
            title="Admin Revenue"
            value={dashboardData?.adminRevenue ?? 0}
            icon={IndianRupeeIcon}
            color="text-cyan-600"
            bgColor="bg-cyan-100"
          />
          <StatCard
            title="Agency Revenue"
            value={dashboardData?.agencyRevenue ?? 0}
            icon={IndianRupeeIcon}
            color="text-pink-600"
            bgColor="bg-pink-100"
          />
          <StatCard
            title="Total Packages"
            value={dashboardData?.totalPackages ?? 0}
            icon={TrendingUp}
            color="text-indigo-600"
            bgColor="bg-indigo-100"
          />
          <StatCard
            title="Completed Packages"
            value={dashboardData?.completedPackages ?? 0}
            icon={TrendingUp}
            color="text-teal-600"
            bgColor="bg-teal-100"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueTrendChart data={dashboardData?.revenueTrend!} />
          <RevenueDistributionChart
            data={dashboardData?.revenueDistribution!}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BookingStatusChart
            data={dashboardData?.bookingStatusDistribution!}
          />
          <TopAgenciesChart data={dashboardData?.topAgencies!} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dashboardData?.categoryPerformance.length 
             > 0 && (
              <CategoryPerformanceChart
                data={dashboardData?.categoryPerformance!}
              />
            )}
          {dashboardData?.topPackages.length 
             > 0 && (
              <TopSellingPackagesChart data={dashboardData?.topPackages!} />
            )}
        </div>
      </div>
    </div>
  );
}
