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
    case "weekly": {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
    }
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
  const tableWidth = 170; // Fixed width for all tables
  const tableStartX = (pageWidth - tableWidth) / 2; // Center alignment
  let yPosition = 20;

  // Colors
  const primaryColor: [number, number, number] = [41, 128, 185];
  const secondaryColor: [number, number, number] = [52, 73, 94];
  const lightGray: [number, number, number] = [248, 249, 250];
  const borderColor: [number, number, number] = [222, 226, 230];

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 45, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("VENDOR SALES REPORT", pageWidth / 2, 18, { align: "center" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Period: ${period.charAt(0).toUpperCase() + period.slice(1)}`, pageWidth / 2, 28, { align: "center" });
  doc.text(`Date Range: ${getDateRangeString(period, startDate, endDate)}`, pageWidth / 2, 35, { align: "center" });
  
  doc.setTextColor(0, 0, 0);
  yPosition = 55;

  // Summary Section Header
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...secondaryColor);
  doc.text("SUMMARY OVERVIEW", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 8;

  // Summary Table - Centered with fixed width
  autoTable(doc, {
    startY: yPosition,
    head: [["Metric", "Value"]],
    body: [
      ["Total Revenue", formatCurrencyForPDF(report.summary.totalRevenue)],
      ["Vendor Revenue (90%)", formatCurrencyForPDF(report.summary.totalVendorRevenue)],
      ["Admin Commission (10%)", formatCurrencyForPDF(report.summary.totalAdminCommission)],
      ["Total Refunds", formatCurrencyForPDF(report.summary.totalRefundAmount)],
      ["", ""], // Spacer row
      ["Total Bookings", report.summary.totalBookings.toString()],
      ["Confirmed Bookings", report.summary.confirmedBookings.toString()],
      ["Cancelled Bookings", report.summary.cancelledBookings.toString()],
      ["Refunded Bookings", report.summary.refundedBookings.toString()],
      ["", ""], // Spacer row
      ["Total Travellers", report.summary.totalTravellers.toString()],
      ["Total Packages", report.summary.totalPackages.toString()],
    ],
    theme: "grid",
    headStyles: {
      fillColor: primaryColor,
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 5,
      halign: "left",
    },
    alternateRowStyles: {
      fillColor: lightGray,
    },
    styles: {
      lineColor: borderColor,
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { 
        cellWidth: tableWidth * 0.6, 
        fontStyle: "bold", 
        halign: "left",
        fillColor: [245, 245, 245],
      },
      1: { 
        cellWidth: tableWidth * 0.4, 
        halign: "right",
        fontStyle: "bold",
      },
    },
    margin: { left: tableStartX, right: tableStartX },
    tableWidth: tableWidth,
  });

  yPosition = (doc as any).lastAutoTable.finalY + 20;

  // Revenue Breakdown Section
  if (report.revenueBreakdown.length > 0) {
    // Check if we need a new page
    if (yPosition > pageHeight - 100) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...secondaryColor);
    doc.text("REVENUE BREAKDOWN BY PACKAGE", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 8;

    autoTable(doc, {
      startY: yPosition,
      head: [
        [
          "Package ID", 
          "Package Name", 
          "Bookings", 
          "Revenue", 
          "Vendor Share", 
          "Admin Commission", 
          "Refunds", 
          "Travellers"
        ]
      ],
      body: report.revenueBreakdown.map((item) => [
        item.packageId.substring(0, 8) + "...",
        item.packageName.length > 20 ? item.packageName.substring(0, 20) + "..." : item.packageName,
        item.totalBookings.toString(),
        formatCurrencyForPDF(item.totalRevenue),
        formatCurrencyForPDF(item.vendorShare),
        formatCurrencyForPDF(item.adminCommission),
        formatCurrencyForPDF(item.totalRefunds),
        item.travellersCount.toString(),
      ]),
      theme: "grid",
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 7,
        cellPadding: 3,
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: lightGray,
      },
      styles: {
        lineColor: borderColor,
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: tableWidth * 0.12, halign: "center", fontStyle: "normal" },
        1: { cellWidth: tableWidth * 0.22, halign: "left" },
        2: { cellWidth: tableWidth * 0.10, halign: "center" },
        3: { cellWidth: tableWidth * 0.14, halign: "right" },
        4: { cellWidth: tableWidth * 0.14, halign: "right" },
        5: { cellWidth: tableWidth * 0.14, halign: "right" },
        6: { cellWidth: tableWidth * 0.10, halign: "right" },
        7: { cellWidth: tableWidth * 0.10, halign: "center" },
      },
      margin: { left: tableStartX, right: tableStartX },
      tableWidth: tableWidth,
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }

  // Revenue Trend Section
  if (report.revenueTrend.length > 0) {
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...secondaryColor);
    doc.text("REVENUE TREND", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 8;

    autoTable(doc, {
      startY: yPosition,
      head: [["Date", "Total Revenue", "Vendor Share", "Admin Commission"]],
      body: report.revenueTrend.map((item) => [
        item.date,
        formatCurrencyForPDF(item.totalRevenue),
        formatCurrencyForPDF(item.vendorShare),
        formatCurrencyForPDF(item.adminCommission),
      ]),
      theme: "grid",
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 4,
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: lightGray,
      },
      styles: {
        lineColor: borderColor,
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: tableWidth * 0.25, halign: "center" },
        1: { cellWidth: tableWidth * 0.25, halign: "right" },
        2: { cellWidth: tableWidth * 0.25, halign: "right" },
        3: { cellWidth: tableWidth * 0.25, halign: "right" },
      },
      margin: { left: tableStartX, right: tableStartX },
      tableWidth: tableWidth,
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }

  // Profit vs Commission Section
  if (report.profitVsCommission.length > 0) {
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...secondaryColor);
    doc.text("PROFIT VS COMMISSION BY TRIP", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 8;

    autoTable(doc, {
      startY: yPosition,
      head: [["Trip ID", "Trip Name", "Vendor Share", "Admin Commission"]],
      body: report.profitVsCommission.map((item) => [
        item.tripId.substring(0, 10) + "...",
        item.tripName.length > 35 ? item.tripName.substring(0, 35) + "..." : item.tripName,
        formatCurrencyForPDF(item.vendorShare),
        formatCurrencyForPDF(item.adminCommission),
      ]),
      theme: "grid",
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 4,
        halign: "left",
      },
      alternateRowStyles: {
        fillColor: lightGray,
      },
      styles: {
        lineColor: borderColor,
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: tableWidth * 0.15, halign: "center" },
        1: { cellWidth: tableWidth * 0.45, halign: "left" },
        2: { cellWidth: tableWidth * 0.20, halign: "right" },
        3: { cellWidth: tableWidth * 0.20, halign: "right" },
      },
      margin: { left: tableStartX, right: tableStartX },
      tableWidth: tableWidth,
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }

  // Latest Bookings Section
  if (report.latestBookings.length > 0) {
    if (yPosition > pageHeight - 100) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...secondaryColor);
    doc.text("LATEST BOOKINGS", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 8;

    autoTable(doc, {
      startY: yPosition,
      head: [["Booking ID", "Trip Name", "Traveler", "Amount", "Date", "Status"]],
      body: report.latestBookings.map((item) => [
        item.bookingId.substring(0, 10) + "...",
        item.tripName.length > 18 ? item.tripName.substring(0, 18) + "..." : item.tripName,
        item.travelerName.length > 15 ? item.travelerName.substring(0, 15) + "..." : item.travelerName,
        formatCurrencyForPDF(item.amount),
        new Date(item.date).toLocaleDateString(),
        item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase(),
      ]),
      theme: "grid",
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 7,
        cellPadding: 3,
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: lightGray,
      },
      styles: {
        lineColor: borderColor,
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: tableWidth * 0.14, halign: "center" },
        1: { cellWidth: tableWidth * 0.22, halign: "left" },
        2: { cellWidth: tableWidth * 0.18, halign: "left" },
        3: { cellWidth: tableWidth * 0.16, halign: "right" },
        4: { cellWidth: tableWidth * 0.16, halign: "center" },
        5: { cellWidth: tableWidth * 0.14, halign: "center" },
      },
      margin: { left: tableStartX, right: tableStartX },
      tableWidth: tableWidth,
    });
  }

  // Footer on all pages
  const totalPages = (doc as any).getNumberOfPages?.() || 1;

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.setFont("helvetica", "normal");
    
    // Page number
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 15,
      { align: "center" }
    );
    
    // Generation timestamp
    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
    
    // Confidential notice
    doc.text(
      "Confidential - For Internal Use Only",
      pageWidth / 2,
      pageHeight - 5,
      { align: "center" }
    );
  }

  // Save PDF
  const fileName = `vendor-sales-report-${period}-${new Date().toISOString().split("T")[0]}.pdf`;
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
    ["SUMMARY OVERVIEW"],
    ["Metric", "Value"],
    ["Total Revenue", formatCurrency(report.summary.totalRevenue)],
    ["Vendor Revenue (90%)", formatCurrency(report.summary.totalVendorRevenue)],
    ["Admin Commission (10%)", formatCurrency(report.summary.totalAdminCommission)],
    ["Total Refunds", formatCurrency(report.summary.totalRefundAmount)],
    ["", ""], // Spacer
    ["Total Bookings", report.summary.totalBookings],
    ["Confirmed Bookings", report.summary.confirmedBookings],
    ["Cancelled Bookings", report.summary.cancelledBookings],
    ["Refunded Bookings", report.summary.refundedBookings],
    ["", ""], // Spacer
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
        item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase(),
      ]),
    ];
    createWorksheet(latestBookingsData, "Latest Bookings");
  }

  // Save Excel file
  const fileName = `vendor-sales-report-${period}-${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};