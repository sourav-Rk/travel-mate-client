import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import type { AdminSalesReport, DashboardPeriod } from "@/types/api/salesReport";

interface ExportOptions {
  report: AdminSalesReport;
  period: DashboardPeriod;
  startDate?: string;
  endDate?: string;
}

// Format currency for display
const formatCurrencyForExport = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format currency for PDF (compatible format for jsPDF)
const formatCurrencyForPDF = (amount: number): string => {
  // Ensure amount is a valid number
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "Rs. 0";
  }
  
  // Format number with Indian number system (lakhs, crores)
  // en-IN locale automatically uses Indian numbering: 1,00,000 (lakh) and 1,00,00,000 (crore)
  const numAmount = Math.round(Number(amount));
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
  
  return `Rs. ${formatted}`;
};

// Get date range string
const getDateRangeString = (period: DashboardPeriod, startDate?: string, endDate?: string): string => {
  if (period === "custom" && startDate && endDate) {
    return `${new Date(startDate).toLocaleDateString("en-IN")} - ${new Date(endDate).toLocaleDateString("en-IN")}`;
  }
  const now = new Date();
  switch (period) {
    case "daily":
      return now.toLocaleDateString("en-IN");
    case "weekly":
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return `${weekStart.toLocaleDateString("en-IN")} - ${weekEnd.toLocaleDateString("en-IN")}`;
    case "monthly":
      return now.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
    case "yearly":
      return now.getFullYear().toString();
    default:
      return "All Time";
  }
};

// Export to PDF
export const exportAdminSalesReportToPDF = ({ report, period, startDate, endDate }: ExportOptions) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Standard margins and table width for consistency
  const marginLeft = 14;
  const marginRight = 14;
  const tableWidth = pageWidth - marginLeft - marginRight;
  
  let yPosition = 20;

  // Colors - Professional blue theme
  const primaryColor: [number, number, number] = [37, 99, 235]; // Blue-600
  const darkGray: [number, number, number] = [31, 41, 55]; // Gray-800

  // Header with gradient effect
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 45, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.text("Admin Sales Report", pageWidth / 2, 22, { align: "center" });
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Period: ${period.charAt(0).toUpperCase() + period.slice(1)}`, pageWidth / 2, 32, { align: "center" });
  doc.text(`Date Range: ${getDateRangeString(period, startDate, endDate)}`, pageWidth / 2, 38, { align: "center" });
  
  doc.setTextColor(0, 0, 0);
  yPosition = 55;

  // Summary Section
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...darkGray);
  doc.text("Summary Overview", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 12;

  // Summary Table - Key Metrics with consistent width
  autoTable(doc, {
    startY: yPosition,
    head: [["Metric", "Value"]],
    body: [
      ["Total Revenue", formatCurrencyForPDF(report.summary.totalRevenue)],
      ["Admin Revenue", formatCurrencyForPDF(report.summary.adminRevenue)],
      ["Vendor Revenue", formatCurrencyForPDF(report.summary.vendorRevenue)],
      ["Total Bookings", report.summary.totalBookings.toString()],
      ["Confirmed Bookings", report.summary.confirmedBookings.toString()],
      ["Completed Bookings", report.summary.completedBookings.toString()],
      ["Cancelled Bookings", report.summary.cancelledBookings.toString()],
      ["Total Travellers", report.summary.totalTravellers.toString()],
      ["Total Vendors", report.summary.totalVendors.toString()],
      ["Total Packages", report.summary.totalPackages.toString()],
      ["Total Refunds", formatCurrencyForPDF(report.summary.totalRefunds)],
      ["Average Booking Value", formatCurrencyForPDF(report.summary.avgBookingValue)],
      ["Conversion Rate", `${report.summary.conversionRate.toFixed(2)}%`],
    ],
    theme: "striped",
    headStyles: {
      fillColor: primaryColor,
      textColor: 255,
      fontStyle: "bold",
      fontSize: 11,
      halign: "center",
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      0: { fontStyle: "bold", halign: "left" },
      1: { halign: "right" },
    },
    margin: { left: marginLeft, right: marginRight },
    tableWidth: tableWidth,
  } as any);

  yPosition = (doc as any).lastAutoTable.finalY + 20;

  // Revenue Breakdown by Vendor Section
  if (report.vendorBreakdown.length > 0) {
    // Check if we need a new page
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkGray);
    doc.text("Revenue Breakdown by Vendor", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 12;

    autoTable(doc, {
      startY: yPosition,
      head: [["Vendor Name", "Total Revenue", "Admin Commission", "Vendor Share", "Bookings", "Refunds"]],
      body: report.vendorBreakdown.map((item) => [
        item.vendorName.length > 30 ? item.vendorName.substring(0, 30) + "..." : item.vendorName,
        formatCurrencyForPDF(item.totalRevenue),
        formatCurrencyForPDF(item.adminCommission),
        formatCurrencyForPDF(item.vendorShare),
        item.totalBookings.toString(),
        formatCurrencyForPDF(item.refundsIssued),
      ]),
      theme: "striped",
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontStyle: "bold",
        fontSize: 10,
        halign: "center",
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "right" },
        2: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "center" },
        5: { halign: "right" },
      },
      margin: { left: marginLeft, right: marginRight },
      tableWidth: tableWidth,
    } as any);

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }

  // Revenue Breakdown by Package Section
  if (report.packageBreakdown.length > 0) {
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkGray);
    doc.text("Revenue Breakdown by Package", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 12;

    autoTable(doc, {
      startY: yPosition,
      head: [["Package Name", "Vendor", "Total Revenue", "Admin Commission", "Vendor Share", "Bookings", "Refunds"]],
      body: report.packageBreakdown.map((item) => [
        item.packageName.length > 25 ? item.packageName.substring(0, 25) + "..." : item.packageName,
        item.vendorName.length > 20 ? item.vendorName.substring(0, 20) + "..." : item.vendorName,
        formatCurrencyForPDF(item.totalRevenue),
        formatCurrencyForPDF(item.adminCommission),
        formatCurrencyForPDF(item.vendorShare),
        item.totalBookings.toString(),
        formatCurrencyForPDF(item.refunds),
      ]),
      theme: "striped",
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontStyle: "bold",
        fontSize: 9,
        halign: "center",
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "left" },
        2: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "center" },
        6: { halign: "right" },
      },
      margin: { left: marginLeft, right: marginRight },
      tableWidth: tableWidth,
    } as any);

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }

  // Revenue Trend Section
  if (report.revenueTrend.length > 0) {
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkGray);
    doc.text("Revenue Trend Over Time", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 12;

    autoTable(doc, {
      startY: yPosition,
      head: [["Date", "Total Revenue", "Admin Revenue", "Vendor Revenue", "Bookings"]],
      body: report.revenueTrend.map((item) => [
        item.date,
        formatCurrencyForPDF(item.totalRevenue),
        formatCurrencyForPDF(item.adminRevenue),
        formatCurrencyForPDF(item.vendorRevenue),
        item.totalBookings?.toString() || "0",
      ]),
      theme: "striped",
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontStyle: "bold",
        fontSize: 10,
        halign: "center",
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { halign: "center" },
        1: { halign: "right" },
        2: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "center" },
      },
      margin: { left: marginLeft, right: marginRight },
      tableWidth: tableWidth,
    } as any);

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }

  // Profit vs Commission Section
  if (report.profitVsCommission.length > 0) {
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkGray);
    doc.text("Profit vs Commission Analysis", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 12;

    autoTable(doc, {
      startY: yPosition,
      head: [["Vendor Name", "Admin Commission", "Vendor Earnings", "Profit Ratio (%)"]],
      body: report.profitVsCommission.map((item) => [
        item.vendorName.length > 35 ? item.vendorName.substring(0, 35) + "..." : item.vendorName,
        formatCurrencyForPDF(item.adminCommission),
        formatCurrencyForPDF(item.vendorEarnings),
        `${item.profitRatio.toFixed(2)}%`,
      ]),
      theme: "striped",
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontStyle: "bold",
        fontSize: 10,
        halign: "center",
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "right" },
        2: { halign: "right" },
        3: { halign: "right" },
      },
      margin: { left: marginLeft, right: marginRight },
      tableWidth: tableWidth,
    } as any);

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }

  // Recent Transactions Section
  if (report.recentTransactions.length > 0) {
    if (yPosition > pageHeight - 100) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkGray);
    doc.text("Recent Transactions", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 12;

    autoTable(doc, {
      startY: yPosition,
      head: [["Booking ID", "Package", "Vendor", "Traveler", "Amount", "Admin Share", "Vendor Share", "Status", "Date"]],
      body: report.recentTransactions.map((item) => [
        item.bookingId.substring(0, 10) + "...",
        item.packageName.length > 20 ? item.packageName.substring(0, 20) + "..." : item.packageName,
        item.vendorName.length > 15 ? item.vendorName.substring(0, 15) + "..." : item.vendorName,
        item.travelerName.length > 15 ? item.travelerName.substring(0, 15) + "..." : item.travelerName,
        formatCurrencyForPDF(item.amount),
        formatCurrencyForPDF(item.adminShare),
        formatCurrencyForPDF(item.vendorShare),
        item.bookingStatus.toUpperCase(),
        new Date(item.date).toLocaleDateString("en-IN"),
      ]),
      theme: "striped",
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontStyle: "bold",
        fontSize: 8,
        halign: "center",
      },
      styles: {
        fontSize: 7,
        cellPadding: 2,
      },
      columnStyles: {
        0: { halign: "center" },
        1: { halign: "left" },
        2: { halign: "left" },
        3: { halign: "left" },
        4: { halign: "right" },
        5: { halign: "right" },
        6: { halign: "right" },
        7: { halign: "center" },
        8: { halign: "center" },
      },
      margin: { left: marginLeft, right: marginRight },
      tableWidth: tableWidth,
    } as any);
  }

  // Footer on all pages
  const totalPages = (doc as unknown as { getNumberOfPages: () => number }).getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
    doc.text(
      `Generated on: ${new Date().toLocaleString("en-IN")}`,
      pageWidth / 2,
      pageHeight - 5,
      { align: "center" }
    );
  }

  // Save PDF
  const fileName = `admin-sales-report-${period}-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
};

// Export to Excel
export const exportAdminSalesReportToExcel = ({ report, period, startDate, endDate }: ExportOptions) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Helper function to create worksheet from data with styling
  const createWorksheet = (data: any[][], sheetName: string) => {
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Set column widths
    const colWidths = data[0].map((_, colIndex) => {
      const maxLength = Math.max(
        ...data.map((row) => {
          const cellValue = row[colIndex];
          return cellValue ? String(cellValue).length : 10;
        })
      );
      return { wch: Math.min(Math.max(maxLength + 2, 12), 60) };
    });
    ws["!cols"] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, ws, sheetName);
  };

  // Summary Sheet
  const summaryData = [
    ["ADMIN SALES REPORT"],
    [`Period: ${period.charAt(0).toUpperCase() + period.slice(1)}`],
    [`Date Range: ${getDateRangeString(period, startDate, endDate)}`],
    [`Generated on: ${new Date().toLocaleString("en-IN")}`],
    [""],
    ["SUMMARY OVERVIEW"],
    ["Metric", "Value"],
    ["Total Revenue", formatCurrencyForExport(report.summary.totalRevenue)],
    ["Admin Revenue", formatCurrencyForExport(report.summary.adminRevenue)],
    ["Vendor Revenue", formatCurrencyForExport(report.summary.vendorRevenue)],
    ["Total Bookings", report.summary.totalBookings],
    ["Confirmed Bookings", report.summary.confirmedBookings],
    ["Completed Bookings", report.summary.completedBookings],
    ["Cancelled Bookings", report.summary.cancelledBookings],
    ["Total Travellers", report.summary.totalTravellers],
    ["Total Vendors", report.summary.totalVendors],
    ["Total Packages", report.summary.totalPackages],
    ["Total Refunds", formatCurrencyForExport(report.summary.totalRefunds)],
    ["Average Booking Value", formatCurrencyForExport(report.summary.avgBookingValue)],
    ["Conversion Rate", `${report.summary.conversionRate.toFixed(2)}%`],
  ];
  createWorksheet(summaryData, "Summary");

  // Revenue Breakdown by Vendor Sheet
  if (report.vendorBreakdown.length > 0) {
    const vendorBreakdownData = [
      ["Vendor Name", "Total Revenue", "Admin Commission", "Vendor Share", "Total Bookings", "Refunds Issued"],
      ...report.vendorBreakdown.map((item) => [
        item.vendorName,
        formatCurrencyForExport(item.totalRevenue),
        formatCurrencyForExport(item.adminCommission),
        formatCurrencyForExport(item.vendorShare),
        item.totalBookings,
        formatCurrencyForExport(item.refundsIssued),
      ]),
    ];
    createWorksheet(vendorBreakdownData, "Vendor Breakdown");
  }

  // Revenue Breakdown by Package Sheet
  if (report.packageBreakdown.length > 0) {
    const packageBreakdownData = [
      ["Package Name", "Vendor Name", "Total Revenue", "Admin Commission", "Vendor Share", "Total Bookings", "Refunds"],
      ...report.packageBreakdown.map((item) => [
        item.packageName,
        item.vendorName,
        formatCurrencyForExport(item.totalRevenue),
        formatCurrencyForExport(item.adminCommission),
        formatCurrencyForExport(item.vendorShare),
        item.totalBookings,
        formatCurrencyForExport(item.refunds),
      ]),
    ];
    createWorksheet(packageBreakdownData, "Package Breakdown");
  }

  // Revenue Trend Sheet
  if (report.revenueTrend.length > 0) {
    const revenueTrendData = [
      ["Date", "Total Revenue", "Admin Revenue", "Vendor Revenue", "Total Bookings"],
      ...report.revenueTrend.map((item) => [
        item.date,
        formatCurrencyForExport(item.totalRevenue),
        formatCurrencyForExport(item.adminRevenue),
        formatCurrencyForExport(item.vendorRevenue),
        item.totalBookings || 0,
      ]),
    ];
    createWorksheet(revenueTrendData, "Revenue Trend");
  }

  // Profit vs Commission Sheet
  if (report.profitVsCommission.length > 0) {
    const profitVsCommissionData = [
      ["Vendor Name", "Admin Commission", "Vendor Earnings", "Profit Ratio (%)"],
      ...report.profitVsCommission.map((item) => [
        item.vendorName,
        formatCurrencyForExport(item.adminCommission),
        formatCurrencyForExport(item.vendorEarnings),
        `${item.profitRatio.toFixed(2)}%`,
      ]),
    ];
    createWorksheet(profitVsCommissionData, "Profit Analysis");
  }

  // Recent Transactions Sheet
  if (report.recentTransactions.length > 0) {
    const recentTransactionsData = [
      ["Booking ID", "Package Name", "Vendor Name", "Traveler Name", "Amount", "Admin Share", "Vendor Share", "Booking Status", "Payment Mode", "Date"],
      ...report.recentTransactions.map((item) => [
        item.bookingId,
        item.packageName,
        item.vendorName,
        item.travelerName,
        formatCurrencyForExport(item.amount),
        formatCurrencyForExport(item.adminShare),
        formatCurrencyForExport(item.vendorShare),
        item.bookingStatus,
        item.paymentMode,
        new Date(item.date).toLocaleDateString("en-IN"),
      ]),
    ];
    createWorksheet(recentTransactionsData, "Recent Transactions");
  }

  // Save Excel file
  const fileName = `admin-sales-report-${period}-${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};