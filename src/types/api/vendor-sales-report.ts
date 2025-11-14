export type VendorSalesReportPeriod = "daily" | "weekly" | "monthly" | "yearly" | "custom";

export interface VendorSalesReportSummary {
  totalRevenue: number;
  totalVendorRevenue: number;
  totalAdminCommission: number;
  totalRefundAmount: number;
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  refundedBookings: number;
  totalTravellers: number;
  totalPackages: number;
}

export interface VendorSalesReportRevenueBreakdown {
  packageId: string;
  packageName: string;
  totalBookings: number;
  totalRevenue: number;
  vendorShare: number;
  adminCommission: number;
  totalRefunds: number;
  travellersCount: number;
}

export interface VendorSalesReportRevenueTrend {
  date: string;
  totalRevenue: number;
  vendorShare: number;
  adminCommission: number;
}

export interface VendorSalesReportProfitVsCommission {
  tripId: string;
  tripName: string;
  vendorShare: number;
  adminCommission: number;
}

export interface VendorSalesReportLatestBooking {
  bookingId: string;
  tripName: string;
  travelerName: string;
  amount: number;
  date: string;
  status: string;
}

export interface VendorSalesReport {
  summary: VendorSalesReportSummary;
  revenueBreakdown: VendorSalesReportRevenueBreakdown[];
  revenueTrend: VendorSalesReportRevenueTrend[];
  profitVsCommission: VendorSalesReportProfitVsCommission[];
  latestBookings: VendorSalesReportLatestBooking[];
}

export interface IGetVendorSalesReportResponse {
  message: string;
  salesReport: VendorSalesReport;
}

export interface GetVendorSalesReportParams {
  period?: VendorSalesReportPeriod;
  startDate?: string;
  endDate?: string;
  packageId?: string;
  bookingStatus?: string;
  paymentMode?: string;
}







