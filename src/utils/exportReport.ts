import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import type { VendorSalesReport, VendorSalesReportPeriod } from "@/types/api/vendor-sales-report";
import { formatCurrency } from "@/lib/utils";

interface ExportOptions {
  report: VendorSalesReport;
  period: VendorSalesReportPeriod;
  startDate?: string;
  endDate?: string;
}


const formatCurrencyForPDF = (amount: number): string => {
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
  return `Rs. ${formatted}`;
};

const getDateRangeString = (period: VendorSalesReportPeriod, startDate?: string, endDate?: string): string => {
  if (period === "custom" && startDate && endDate) {
    return `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`;
  }
  const now = new Date();
  switch (period) {
    case "daily":
      return now.toLocaleDateString();
    case "weekly":
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
    case "monthly":
      return now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    case "yearly":
      return now.getFullYear().toString();
    default:
      return "All Time";
  }
};

export const exportToPDF = ({ report, period, startDate, endDate }: ExportOptions) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Colors
  const primaryColor: [number, number, number] = [41, 128, 185];
const secondaryColor: [number, number, number] = [52, 73, 94];
const successColor: [number, number, number] = [39, 174, 96];
const dangerColor: [number, number, number] = [231, 76, 60];


  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Vendor Sales Report", pageWidth / 2, 20, { align: "center" });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Period: ${period.charAt(0).toUpperCase() + period.slice(1)}`, pageWidth / 2, 30, { align: "center" });
  doc.text(`Date Range: ${getDateRangeString(period, startDate, endDate)}`, pageWidth / 2, 36, { align: "center" });
  
  doc.setTextColor(0, 0, 0);
  yPosition = 50;

  // Summary Section
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...secondaryColor);
  doc.text("Summary", 14, yPosition);
  yPosition += 10;

  // Summary Table
  autoTable(doc, {
    startY: yPosition,
    head: [["Metric", "Value"]],
    body: [
      ["Total Revenue", formatCurrencyForPDF(report.summary.totalRevenue)],
      ["Vendor Revenue (90%)", formatCurrencyForPDF(report.summary.totalVendorRevenue)],
      ["Admin Commission (10%)", formatCurrencyForPDF(report.summary.totalAdminCommission)],
      ["Total Refunds", formatCurrencyForPDF(report.summary.totalRefundAmount)],
      ["Total Bookings", report.summary.totalBookings.toString()],
      ["Confirmed Bookings", report.summary.confirmedBookings.toString()],
      ["Cancelled Bookings", report.summary.cancelledBookings.toString()],
      ["Refunded Bookings", report.summary.refundedBookings.toString()],
      ["Total Travellers", report.summary.totalTravellers.toString()],
      ["Total Packages", report.summary.totalPackages.toString()],
    ],
    theme: "striped",
    headStyles: {
      fillColor: primaryColor as [number, number, number],
      textColor: 255,
      fontStyle: "bold",
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 120, fontStyle: "bold" },
      1: { cellWidth: 70, halign: "right" },
    },
  } as any);

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Revenue Breakdown Section
  if (report.revenueBreakdown.length > 0) {
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...secondaryColor);
    doc.text("Revenue Breakdown by Package", 14, yPosition);
    yPosition += 10;

    autoTable(doc, {
      startY: yPosition,
      head: [["Package ID", "Package Name", "Bookings", "Revenue", "Vendor Share", "Admin Commission", "Refunds", "Travellers"]],
      body: report.revenueBreakdown.map((item) => [
        item.packageId.substring(0, 12) + "...",
        item.packageName.length > 25 ? item.packageName.substring(0, 25) + "..." : item.packageName,
        item.totalBookings.toString(),
        formatCurrencyForPDF(item.totalRevenue),
        formatCurrencyForPDF(item.vendorShare),
        formatCurrencyForPDF(item.adminCommission),
        formatCurrencyForPDF(item.totalRefunds),
        item.travellersCount.toString(),
      ]),
      theme: "striped",
      headStyles: {
        fillColor: primaryColor as [number, number, number],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      columnStyles: {
        0: { cellWidth: 28 },
        1: { cellWidth: 40 },
        2: { cellWidth: 18, halign: "center" },
        3: { cellWidth: 28, halign: "right", fontStyle: "normal" },
        4: { cellWidth: 28, halign: "right", fontStyle: "normal" },
        5: { cellWidth: 28, halign: "right", fontStyle: "normal" },
        6: { cellWidth: 28, halign: "right", fontStyle: "normal" },
        7: { cellWidth: 18, halign: "center" },
      },
      margin: { left: 14, right: 14 },
    } as any);

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // Revenue Trend Section
  if (report.revenueTrend.length > 0) {
    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...secondaryColor);
    doc.text("Revenue Trend", 14, yPosition);
    yPosition += 10;

    autoTable(doc, {
      startY: yPosition,
      head: [["Date", "Total Revenue", "Vendor Share", "Admin Commission"]],
      body: report.revenueTrend.map((item) => [
        item.date,
        formatCurrencyForPDF(item.totalRevenue),
        formatCurrencyForPDF(item.vendorShare),
        formatCurrencyForPDF(item.adminCommission),
      ]),
      theme: "striped",
      headStyles: {
        fillColor: primaryColor as [number, number, number],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: 50, halign: "right" },
        2: { cellWidth: 50, halign: "right" },
        3: { cellWidth: 50, halign: "right" },
      },
      margin: { left: 14, right: 14 },
    } as any);

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // Profit vs Commission Section
  if (report.profitVsCommission.length > 0) {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...secondaryColor);
    doc.text("Profit vs Commission by Trip", 14, yPosition);
    yPosition += 10;

    autoTable(doc, {
      startY: yPosition,
      head: [["Trip ID", "Trip Name", "Vendor Share", "Admin Commission"]],
      body: report.profitVsCommission.map((item) => [
        item.tripId.substring(0, 12) + "...",
        item.tripName.length > 30 ? item.tripName.substring(0, 30) + "..." : item.tripName,
        formatCurrencyForPDF(item.vendorShare),
        formatCurrencyForPDF(item.adminCommission),
      ]),
      theme: "striped",
      headStyles: {
        fillColor: primaryColor as [number, number, number],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 70 },
        2: { cellWidth: 40, halign: "right" },
        3: { cellWidth: 40, halign: "right" },
      },
      margin: { left: 14, right: 14 },
    } as any);

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // Latest Bookings Section
  if (report.latestBookings.length > 0) {
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...secondaryColor);
    doc.text("Latest Bookings", 14, yPosition);
    yPosition += 10;

    autoTable(doc, {
      startY: yPosition,
      head: [["Booking ID", "Trip Name", "Traveler", "Amount", "Date", "Status"]],
      body: report.latestBookings.map((item) => [
        item.bookingId.substring(0, 12) + "...",
        item.tripName.length > 25 ? item.tripName.substring(0, 25) + "..." : item.tripName,
        item.travelerName.length > 20 ? item.travelerName.substring(0, 20) + "..." : item.travelerName,
        formatCurrencyForPDF(item.amount),
        new Date(item.date).toLocaleDateString(),
        item.status.toUpperCase(),
      ]),
      theme: "striped",
      headStyles: {
        fillColor: primaryColor as [number, number, number],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      columnStyles: {
        0: { cellWidth: 28 },
        1: { cellWidth: 42 },
        2: { cellWidth: 32 },
        3: { cellWidth: 35, halign: "right" },
        4: { cellWidth: 28 },
        5: { cellWidth: 22, halign: "center" },
      },
      margin: { left: 14, right: 14 },
    } as any);
  }

  // Footer
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
      `Generated on: ${new Date().toLocaleString()}`,
      pageWidth / 2,
      pageHeight - 5,
      { align: "center" }
    );
  }

  // Save PDF
  const fileName = `sales-report-${period}-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
};

export const exportToExcel = ({ report, period, startDate, endDate }: ExportOptions) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Helper function to create worksheet from data
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
      return { wch: Math.min(Math.max(maxLength, 10), 50) };
    });
    ws["!cols"] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, ws, sheetName);
  };

  // Summary Sheet
  const summaryData = [
    ["VENDOR SALES REPORT"],
    [`Period: ${period.charAt(0).toUpperCase() + period.slice(1)}`],
    [`Date Range: ${getDateRangeString(period, startDate, endDate)}`],
    [`Generated on: ${new Date().toLocaleString()}`],
    [""],
    ["SUMMARY"],
    ["Metric", "Value"],
    ["Total Revenue", formatCurrency(report.summary.totalRevenue)],
    ["Vendor Revenue (90%)", formatCurrency(report.summary.totalVendorRevenue)],
    ["Admin Commission (10%)", formatCurrency(report.summary.totalAdminCommission)],
    ["Total Refunds", formatCurrency(report.summary.totalRefundAmount)],
    ["Total Bookings", report.summary.totalBookings],
    ["Confirmed Bookings", report.summary.confirmedBookings],
    ["Cancelled Bookings", report.summary.cancelledBookings],
    ["Refunded Bookings", report.summary.refundedBookings],
    ["Total Travellers", report.summary.totalTravellers],
    ["Total Packages", report.summary.totalPackages],
  ];
  createWorksheet(summaryData, "Summary");

  // Revenue Breakdown Sheet
  if (report.revenueBreakdown.length > 0) {
    const revenueBreakdownData = [
      ["Package ID", "Package Name", "Bookings", "Total Revenue", "Vendor Share", "Admin Commission", "Refunds", "Travellers"],
      ...report.revenueBreakdown.map((item) => [
        item.packageId,
        item.packageName,
        item.totalBookings,
        formatCurrency(item.totalRevenue),
        formatCurrency(item.vendorShare),
        formatCurrency(item.adminCommission),
        formatCurrency(item.totalRefunds),
        item.travellersCount,
      ]),
    ];
    createWorksheet(revenueBreakdownData, "Revenue Breakdown");
  }

  // Revenue Trend Sheet
  if (report.revenueTrend.length > 0) {
    const revenueTrendData = [
      ["Date", "Total Revenue", "Vendor Share", "Admin Commission"],
      ...report.revenueTrend.map((item) => [
        item.date,
        formatCurrency(item.totalRevenue),
        formatCurrency(item.vendorShare),
        formatCurrency(item.adminCommission),
      ]),
    ];
    createWorksheet(revenueTrendData, "Revenue Trend");
  }

  // Profit vs Commission Sheet
  if (report.profitVsCommission.length > 0) {
    const profitVsCommissionData = [
      ["Trip ID", "Trip Name", "Vendor Share", "Admin Commission"],
      ...report.profitVsCommission.map((item) => [
        item.tripId,
        item.tripName,
        formatCurrency(item.vendorShare),
        formatCurrency(item.adminCommission),
      ]),
    ];
    createWorksheet(profitVsCommissionData, "Profit vs Commission");
  }

  // Latest Bookings Sheet
  if (report.latestBookings.length > 0) {
    const latestBookingsData = [
      ["Booking ID", "Trip Name", "Traveler Name", "Amount", "Date", "Status"],
      ...report.latestBookings.map((item) => [
        item.bookingId,
        item.tripName,
        item.travelerName,
        formatCurrency(item.amount),
        new Date(item.date).toLocaleDateString(),
        item.status.toUpperCase(),
      ]),
    ];
    createWorksheet(latestBookingsData, "Latest Bookings");
  }

  // Save Excel file
  const fileName = `sales-report-${period}-${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

