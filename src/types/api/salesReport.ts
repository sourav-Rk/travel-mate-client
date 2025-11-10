export type DashboardPeriod = "daily" | "weekly" | "monthly" | "yearly" | "custom";

export interface SalesReportSummary {
  totalRevenue: number;
  adminRevenue: number;
  vendorRevenue: number;
  totalBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalTravellers: number;
  totalVendors: number;
  totalPackages: number;
  totalRefunds: number;
  avgBookingValue: number;
  conversionRate: number;
}

export interface VendorRevenueBreakdown {
  vendorId: string;
  vendorName: string;
  totalRevenue: number;
  vendorShare: number;
  adminCommission: number;
  totalBookings: number;
  refundsIssued: number;
}

export interface PackageRevenueBreakdown {
  packageId: string;
  packageName: string;
  vendorName: string;
  totalRevenue: number;
  adminCommission: number;
  vendorShare: number;
  totalBookings: number;
  refunds: number;
}

export interface RevenueTrendDataPoint {
  date: string;
  totalRevenue: number;
  adminRevenue: number;
  vendorRevenue: number;
  totalBookings?: number;
}

export interface RecentTransaction {
  bookingId: string;
  packageName: string;
  vendorName: string;
  travelerName: string;
  amount: number;
  adminShare: number;
  vendorShare: number;
  bookingStatus: string;
  paymentMode: string;
  date: string;
}

export interface ProfitVsCommission {
  vendorId: string;
  vendorName: string;
  adminCommission: number;
  vendorEarnings: number;
  profitRatio: number;
}

export interface AdminSalesReport {
  summary: SalesReportSummary;
  vendorBreakdown: VendorRevenueBreakdown[];
  packageBreakdown: PackageRevenueBreakdown[];
  revenueTrend: RevenueTrendDataPoint[];
  recentTransactions: RecentTransaction[];
  profitVsCommission: ProfitVsCommission[];
}

import type { ResponseWith } from "../common";

export type IGetSalesReportResponse = ResponseWith<"salesReport", AdminSalesReport>;

