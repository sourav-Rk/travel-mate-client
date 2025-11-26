"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Download, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Package,
  BarChart3,
  PieChart,
  FileText,
  FileDown,
  FileSpreadsheet
} from "lucide-react";
import { useVendorSalesReport } from "@/hooks/vendor/useVendorSalesReport";
import { Spinner } from "@/components/Spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { VendorSalesReportPeriod } from "@/types/api/vendor-sales-report";
import { BOOKINGSTATUS } from "@/types/bookingType";
import { formatCurrency } from "@/lib/utils";
import { exportToPDF, exportToExcel } from "@/utils/exportReport";

export default function VendorSalesReportPage() {
  const [period, setPeriod] = useState<VendorSalesReportPeriod>("yearly");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [packageId, setPackageId] = useState<string>("");
  const [debouncedPackageId, setDebouncedPackageId] = useState<string>("");
  const [bookingStatus, setBookingStatus] = useState<string>("");


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPackageId(packageId);
    }, 500); 

    return () => clearTimeout(timer);
  }, [packageId]);


  const shouldFetch = useMemo(() => {
    if (period === "custom") {
      return Boolean(startDate && endDate);
    }
    return true;
  }, [period, startDate, endDate]);

  const params = useMemo(() => {
    const result: {
      period?: VendorSalesReportPeriod;
      startDate?: string;
      endDate?: string;
      packageId?: string;
      bookingStatus?: string;
      paymentMode?: string;
    } = {
      period: period === "custom" ? "custom" : period,
    };

    if (period === "custom") {
      if (startDate) result.startDate = startDate;
      if (endDate) result.endDate = endDate;
    }

    if (debouncedPackageId) result.packageId = debouncedPackageId;
    if (bookingStatus && bookingStatus !== "all") result.bookingStatus = bookingStatus;

    return result;
  }, [period, startDate, endDate, debouncedPackageId, bookingStatus]);

  const { data, isLoading, error, refetch } = useVendorSalesReport(params, {
    enabled: shouldFetch,
  });

  const handleGenerateReport = useCallback(() => {
    if (period === "custom" && (!startDate || !endDate)) {
      alert("Please select both start and end dates for custom period.");
      return;
    }
    refetch();
  }, [refetch, period, startDate, endDate]);

  const handleExportPDF = useCallback(() => {
    if (!data?.salesReport) return;
    
    exportToPDF({
      report: data.salesReport,
      period,
      startDate: period === "custom" ? startDate : undefined,
      endDate: period === "custom" ? endDate : undefined,
    });
  }, [data, period, startDate, endDate]);

  const handleExportExcel = useCallback(() => {
    if (!data?.salesReport) return;
    
    exportToExcel({
      report: data.salesReport,
      period,
      startDate: period === "custom" ? startDate : undefined,
      endDate: period === "custom" ? endDate : undefined,
    });
  }, [data, period, startDate, endDate]);

  const handleExportCSV = useCallback(() => {
    if (!data?.salesReport) return;
    
    const report = data?.salesReport;
    const csvContent = [
      ["Vendor Sales Report"],
      [`Period: ${period}`],
      [""],
      ["Summary"],
      ["Metric", "Value"],
      ["Total Revenue", formatCurrency(report.summary.totalRevenue)],
      ["Vendor Revenue", formatCurrency(report.summary.totalVendorRevenue)],
      ["Admin Commission", formatCurrency(report.summary.totalAdminCommission)],
      ["Total Refunds", formatCurrency(report.summary.totalRefundAmount)],
      ["Total Bookings", report.summary.totalBookings.toString()],
      ["Confirmed Bookings", report.summary.confirmedBookings.toString()],
      ["Cancelled Bookings", report.summary.cancelledBookings.toString()],
      ["Refunded Bookings", report.summary.refundedBookings.toString()],
      ["Total Travellers", report.summary.totalTravellers.toString()],
      ["Total Packages", report.summary.totalPackages.toString()],
      [""],
      ["Revenue Breakdown"],
      ["Package ID", "Package Name", "Bookings", "Revenue", "Vendor Share", "Admin Commission", "Refunds", "Travellers"],
      ...report.revenueBreakdown.map(item => [
        item.packageId,
        item.packageName,
        item.totalBookings.toString(),
        formatCurrency(item.totalRevenue),
        formatCurrency(item.vendorShare),
        formatCurrency(item.adminCommission),
        formatCurrency(item.totalRefunds),
        item.travellersCount.toString(),
      ]),
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [data, period]);

  if (shouldFetch && isLoading) {
    return (
      <div className="flex h-screen bg-[#f5f7fa] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (shouldFetch && error) {
    return (
      <div className="flex h-screen bg-[#f5f7fa] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Report</CardTitle>
            <CardDescription>
              {error instanceof Error ? error.message : "An error occurred while loading the sales report"}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const report = data?.salesReport;

  if (period === "custom" && (!startDate || !endDate) && !report) {
    return (
      <div className="flex h-screen bg-[#f5f7fa] overflow-hidden">
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 md:ml-80 flex flex-col h-full"
        >
          <div className="p-4 md:p-8 h-full w-full overflow-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Report</h1>
              <p className="text-gray-600">Detailed financial and booking summary for your packages</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Select Date Range</CardTitle>
                <CardDescription>
                  Please select both start and end dates to generate the custom period sales report.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.main>
      </div>
    );
  }

  if (!report) {
    if (shouldFetch) {
      return (
        <div className="flex h-screen bg-[#f5f7fa] items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>No Data Available</CardTitle>
              <CardDescription>No sales data found for the selected period.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="flex h-screen bg-[#f5f7fa] overflow-hidden">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 md:ml-80 flex flex-col h-full"
      >
        <div className="p-4 md:p-8 h-full w-full overflow-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Report</h1>
            <p className="text-gray-600">Detailed financial and booking summary for your packages</p>
          </div>

          {/* Filters Section */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters
                  </CardTitle>
                  <CardDescription>Customize your sales report by applying filters</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleGenerateReport} className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Generate Report
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2" disabled={!data?.salesReport}>
                        <Download className="h-4 w-4" />
                        Export Report
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
                        <FileDown className="h-4 w-4 mr-2" />
                        Export as PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleExportExcel} className="cursor-pointer">
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Export as Excel
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleExportCSV} className="cursor-pointer">
                        <FileText className="h-4 w-4 mr-2" />
                        Export as CSV
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="period">Period</Label>
                  <Select value={period} onValueChange={(value) => setPeriod(value as VendorSalesReportPeriod)}>
                    <SelectTrigger id="period">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {period === "custom" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="packageId">Package ID (Optional)</Label>
                  <Input
                    id="packageId"
                    placeholder="Enter package ID"
                    value={packageId}
                    onChange={(e) => setPackageId(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bookingStatus">Booking Status (Optional)</Label>
                  <Select value={bookingStatus || "all"} onValueChange={(value) => setBookingStatus(value === "all" ? "" : value)}>
                    <SelectTrigger id="bookingStatus">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {Object.values(BOOKINGSTATUS).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.replace("_", " ").toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(report.summary.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">Platform revenue</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendor Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(report.summary.totalVendorRevenue)}</div>
                <p className="text-xs text-muted-foreground">Your share (90%)</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Admin Commission</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(report.summary.totalAdminCommission)}</div>
                <p className="text-xs text-muted-foreground">Platform commission (10%)</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.summary.totalBookings}</div>
                <p className="text-xs text-muted-foreground">
                  {report.summary.confirmedBookings} confirmed, {report.summary.cancelledBookings} cancelled
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
                <DollarSign className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(report.summary.totalRefundAmount)}</div>
                <p className="text-xs text-muted-foreground">{report.summary.refundedBookings} refunded bookings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Travellers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.summary.totalTravellers}</div>
                <p className="text-xs text-muted-foreground">Unique travellers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.summary.totalPackages}</div>
                <p className="text-xs text-muted-foreground">Active packages</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Sections */}
          <Tabs defaultValue="revenue-breakdown" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="revenue-breakdown">Revenue Breakdown</TabsTrigger>
              <TabsTrigger value="revenue-trend">Revenue Trend</TabsTrigger>
              <TabsTrigger value="profit-commission">Profit vs Commission</TabsTrigger>
              <TabsTrigger value="latest-bookings">Latest Bookings</TabsTrigger>
            </TabsList>

            {/* Revenue Breakdown Tab */}
            <TabsContent value="revenue-breakdown" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown by Package</CardTitle>
                  <CardDescription>Detailed revenue analysis for each package</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Package ID</TableHead>
                          <TableHead>Package Name</TableHead>
                          <TableHead>Bookings</TableHead>
                          <TableHead>Total Revenue</TableHead>
                          <TableHead>Vendor Share</TableHead>
                          <TableHead>Admin Commission</TableHead>
                          <TableHead>Refunds</TableHead>
                          <TableHead>Travellers</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {report.revenueBreakdown.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                              No revenue data available
                            </TableCell>
                          </TableRow>
                        ) : (
                          report.revenueBreakdown.map((item) => (
                            <TableRow key={item.packageId}>
                              <TableCell className="font-mono text-xs">{item.packageId}</TableCell>
                              <TableCell className="font-medium">{item.packageName}</TableCell>
                              <TableCell>{item.totalBookings}</TableCell>
                              <TableCell>{formatCurrency(item.totalRevenue)}</TableCell>
                              <TableCell className="text-green-600">{formatCurrency(item.vendorShare)}</TableCell>
                              <TableCell>{formatCurrency(item.adminCommission)}</TableCell>
                              <TableCell className="text-red-600">{formatCurrency(item.totalRefunds)}</TableCell>
                              <TableCell>{item.travellersCount}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Revenue Trend Tab */}
            <TabsContent value="revenue-trend" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Revenue growth over the selected period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Total Revenue</TableHead>
                          <TableHead>Vendor Share</TableHead>
                          <TableHead>Admin Commission</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {report.revenueTrend.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                              No trend data available
                            </TableCell>
                          </TableRow>
                        ) : (
                          report.revenueTrend.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.date}</TableCell>
                              <TableCell>{formatCurrency(item.totalRevenue)}</TableCell>
                              <TableCell className="text-green-600">{formatCurrency(item.vendorShare)}</TableCell>
                              <TableCell>{formatCurrency(item.adminCommission)}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profit vs Commission Tab */}
            <TabsContent value="profit-commission" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profit vs Commission by Trip</CardTitle>
                  <CardDescription>Compare vendor profit and admin commission per trip</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Trip ID</TableHead>
                          <TableHead>Trip Name</TableHead>
                          <TableHead>Vendor Share</TableHead>
                          <TableHead>Admin Commission</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {report.profitVsCommission.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                              No profit data available
                            </TableCell>
                          </TableRow>
                        ) : (
                          report.profitVsCommission.map((item) => (
                            <TableRow key={item.tripId}>
                              <TableCell className="font-mono text-xs">{item.tripId}</TableCell>
                              <TableCell className="font-medium">{item.tripName}</TableCell>
                              <TableCell className="text-green-600">{formatCurrency(item.vendorShare)}</TableCell>
                              <TableCell>{formatCurrency(item.adminCommission)}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Latest Bookings Tab */}
            <TabsContent value="latest-bookings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Latest Bookings</CardTitle>
                  <CardDescription>Recent bookings made during the report period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Booking ID</TableHead>
                          <TableHead>Trip Name</TableHead>
                          <TableHead>Traveler Name</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {report.latestBookings.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              No bookings found
                            </TableCell>
                          </TableRow>
                        ) : (
                          report.latestBookings.map((item) => (
                            <TableRow key={item.bookingId}>
                              <TableCell className="font-mono text-xs">{item.bookingId}</TableCell>
                              <TableCell className="font-medium">{item.tripName}</TableCell>
                              <TableCell>{item.travelerName}</TableCell>
                              <TableCell>{formatCurrency(item.amount)}</TableCell>
                              <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  item.status === "completed" ? "bg-green-100 text-green-800" :
                                  item.status === "cancelled" ? "bg-red-100 text-red-800" :
                                  "bg-yellow-100 text-yellow-800"
                                }`}>
                                  {item.status.toUpperCase()}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.main>
    </div>
  );
}

