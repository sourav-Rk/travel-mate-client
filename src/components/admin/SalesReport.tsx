"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner";
import { useSalesReport } from "@/hooks/admin/useSalesReport";
import {
  DollarSign,
  Users,
  Store,
  Package,
  TrendingUp,
  RefreshCw,
  FileText,
  BarChart3,
  Calendar,
  Filter,
  X,
  Download,
  FileDown,
} from "lucide-react";
import type { DashboardPeriod, AdminSalesReport } from "@/types/api/salesReport";
import { exportAdminSalesReportToPDF, exportAdminSalesReportToExcel } from "@/utils/adminSalesReportExport";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-IN").format(num);
};

export default function SalesReport() {
  const [period, setPeriod] = useState<DashboardPeriod>("monthly");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [vendorId, setVendorId] = useState<string>("");
  const [packageId, setPackageId] = useState<string>("");
  
  // Debounced values for vendorId and packageId
  const [debouncedVendorId, setDebouncedVendorId] = useState<string>("");
  const [debouncedPackageId, setDebouncedPackageId] = useState<string>("");

  // Debounce vendorId with 500ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedVendorId(vendorId);
    }, 500);

    return () => clearTimeout(timer);
  }, [vendorId]);

  // Debounce packageId with 500ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPackageId(packageId);
    }, 500);

    return () => clearTimeout(timer);
  }, [packageId]);

  // Clear dates when switching away from custom period
  const handlePeriodChange = useCallback((newPeriod: DashboardPeriod) => {
    setPeriod(newPeriod);
    if (newPeriod !== "custom") {
      setStartDate("");
      setEndDate("");
    }
  }, []);

  // Determine if we should fetch data
  // Don't fetch if custom period is selected but dates are not provided
  const shouldFetch = useMemo(() => {
    if (period === "custom") {
      return !!(startDate && endDate);
    }
    return true;
  }, [period, startDate, endDate]);

  const { data, isLoading, error, refetch } = useSalesReport(
    {
      period,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      vendorId: debouncedVendorId || undefined,
      packageId: debouncedPackageId || undefined,
    },
    {
      enabled: shouldFetch,
    }
  );

  const salesReport: AdminSalesReport | undefined = data?.salesReport;

  // Show message when custom period is selected but dates are not provided
  const showDateRequiredMessage = period === "custom" && (!startDate || !endDate);

  // Show error state (but still show filters)
  const showError = error && shouldFetch;

  // Extract data if available
  const { summary, vendorBreakdown, packageBreakdown, revenueTrend, recentTransactions, profitVsCommission } = salesReport || {
    summary: {
      totalRevenue: 0,
      adminRevenue: 0,
      vendorRevenue: 0,
      totalBookings: 0,
      confirmedBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      totalRefunds: 0,
      totalTravellers: 0,
      totalVendors: 0,
      totalPackages: 0,
      avgBookingValue: 0,
      conversionRate: 0,
    },
    vendorBreakdown: [],
    packageBreakdown: [],
    revenueTrend: [],
    recentTransactions: [],
    profitVsCommission: [],
  };

  return (
    <div className="ml-0 lg:ml-64 min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#f0f4f8] transition-all duration-300">
      <div className="p-4 lg:p-6 pt-16 lg:pt-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-8 h-8 text-blue-600" />
              Sales Report
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive sales analytics and revenue insights
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            {salesReport && (
              <>
                <Button
                  onClick={() => exportAdminSalesReportToPDF({
                    report: salesReport,
                    period,
                    startDate: startDate || undefined,
                    endDate: endDate || undefined,
                  })}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                >
                  <FileDown className="w-4 h-4" />
                  Export PDF
                </Button>
                <Button
                  onClick={() => exportAdminSalesReportToExcel({
                    report: salesReport,
                    period,
                    startDate: startDate || undefined,
                    endDate: endDate || undefined,
                  })}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                >
                  <Download className="w-4 h-4" />
                  Export Excel
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Period
                </label>
                <Select
                  value={period}
                  onValueChange={(value) => handlePeriodChange(value as DashboardPeriod)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Start Date {period === "custom" && <span className="text-red-500">*</span>}
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={period !== "custom"}
                  className={period !== "custom" ? "bg-gray-100" : ""}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  End Date {period === "custom" && <span className="text-red-500">*</span>}
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={period !== "custom"}
                  className={period !== "custom" ? "bg-gray-100" : ""}
                  min={startDate || undefined}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Vendor ID
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Optional"
                    value={vendorId}
                    onChange={(e) => setVendorId(e.target.value)}
                  />
                  {vendorId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setVendorId("")}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Package ID
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Optional"
                    value={packageId}
                    onChange={(e) => setPackageId(e.target.value)}
                  />
                  {packageId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPackageId("")}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Show error message */}
        {showError && (
          <Card className="border-0 shadow-lg border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="text-center py-4">
                <p className="text-red-600 mb-2 font-semibold">
                  Error loading sales report. Please try again.
                </p>
                {error instanceof Error && (
                  <p className="text-sm text-gray-600 mb-4">{error.message}</p>
                )}
                <Button onClick={() => refetch()} variant="outline" className="mt-2">
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Show message when custom period is selected but dates are not provided */}
        {showDateRequiredMessage && (
          <Card className="border-0 shadow-lg border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="text-center py-4">
                <Calendar className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Please Select Date Range
                </h3>
                <p className="text-gray-600">
                  Select a start date and end date to generate the sales report for the custom period.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Show loading indicator */}
        {isLoading && shouldFetch && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12">
              <div className="flex items-center justify-center">
                <Spinner />
                <span className="ml-4 text-gray-600">Loading sales report...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Only show report data if we have data and not waiting for custom dates */}
        {!showDateRequiredMessage && !isLoading && salesReport && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(summary.totalRevenue)}</p>
                </div>
                <DollarSign className="w-10 h-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Admin Revenue</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(summary.adminRevenue)}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Vendor Revenue</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(summary.vendorRevenue)}</p>
                </div>
                <Store className="w-10 h-10 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Bookings</p>
                  <p className="text-2xl font-bold mt-1">{formatNumber(summary.totalBookings)}</p>
                </div>
                <Package className="w-10 h-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-xl font-bold text-gray-900">{formatNumber(summary.confirmedBookings)}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-xl font-bold text-green-600">{formatNumber(summary.completedBookings)}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Cancelled</p>
              <p className="text-xl font-bold text-red-600">{formatNumber(summary.cancelledBookings)}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Travellers</p>
              <p className="text-xl font-bold text-gray-900">{formatNumber(summary.totalTravellers)}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Avg Booking</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(summary.avgBookingValue)}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Conversion</p>
              <p className="text-xl font-bold text-blue-600">{summary.conversionRate.toFixed(1)}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Trend Chart */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Revenue Trend Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis
                  stroke="#6b7280"
                  tickFormatter={(value) => `₹${value / 1000}K`}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalRevenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Total Revenue"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="adminRevenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Admin Revenue"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="vendorRevenue"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  name="Vendor Revenue"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vendor Breakdown */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              Revenue Breakdown by Vendor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor Name</TableHead>
                    <TableHead>Total Revenue</TableHead>
                    <TableHead>Vendor Share</TableHead>
                    <TableHead>Admin Commission</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Refunds</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorBreakdown.map((vendor) => (
                    <TableRow key={vendor.vendorId}>
                      <TableCell className="font-medium">{vendor.vendorName}</TableCell>
                      <TableCell>{formatCurrency(vendor.totalRevenue)}</TableCell>
                      <TableCell className="text-green-600">{formatCurrency(vendor.vendorShare)}</TableCell>
                      <TableCell className="text-blue-600">{formatCurrency(vendor.adminCommission)}</TableCell>
                      <TableCell>{formatNumber(vendor.totalBookings)}</TableCell>
                      <TableCell className="text-red-600">{formatCurrency(vendor.refundsIssued)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Package Breakdown */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Revenue Breakdown by Package
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Package Name</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Total Revenue</TableHead>
                    <TableHead>Vendor Share</TableHead>
                    <TableHead>Admin Commission</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Refunds</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packageBreakdown.map((pkg) => (
                    <TableRow key={pkg.packageId}>
                      <TableCell className="font-medium">{pkg.packageName}</TableCell>
                      <TableCell>{pkg.vendorName}</TableCell>
                      <TableCell>{formatCurrency(pkg.totalRevenue)}</TableCell>
                      <TableCell className="text-green-600">{formatCurrency(pkg.vendorShare)}</TableCell>
                      <TableCell className="text-blue-600">{formatCurrency(pkg.adminCommission)}</TableCell>
                      <TableCell>{formatNumber(pkg.totalBookings)}</TableCell>
                      <TableCell className="text-red-600">{formatCurrency(pkg.refunds)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Profit vs Commission Chart */}
        {profitVsCommission.length > 0 && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Profit vs Commission by Vendor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={profitVsCommission}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="vendorName" stroke="#6b7280" angle={-45} textAnchor="end" height={100} />
                  <YAxis
                    stroke="#6b7280"
                    tickFormatter={(value) => `₹${value / 1000}K`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
                  />
                  <Legend />
                  <Bar dataKey="adminCommission" fill="#10b981" name="Admin Commission" />
                  <Bar dataKey="vendorEarnings" fill="#f59e0b" name="Vendor Earnings" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Recent Transactions */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Traveler</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Admin Share</TableHead>
                    <TableHead>Vendor Share</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.bookingId}>
                      <TableCell className="font-mono text-sm">{transaction.bookingId}</TableCell>
                      <TableCell className="max-w-xs truncate">{transaction.packageName}</TableCell>
                      <TableCell>{transaction.vendorName}</TableCell>
                      <TableCell>{transaction.travelerName}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell className="text-blue-600">{formatCurrency(transaction.adminShare)}</TableCell>
                      <TableCell className="text-green-600">{formatCurrency(transaction.vendorShare)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.bookingStatus === "completed" ? "bg-green-100 text-green-800" :
                          transaction.bookingStatus === "cancelled" ? "bg-red-100 text-red-800" :
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {transaction.bookingStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
          </>
        )}
      </div>
    </div>
  );
}

