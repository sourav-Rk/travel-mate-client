"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  IndianRupee,
  Eye,
  User,
  Calendar,
  Package,
  Phone,
  Mail,
  MapPin,
  FileText,
  MessageSquare,
  Send,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { CancellationRequestDto } from "@/types/cancellationType";

// Demo data
const demoStats = {
  total: 24,
  pending: 8,
  approved: 12,
  rejected: 4,
  totalRefundAmount: 125000,
};

const demoRequests: CancellationRequestDto[] = [
  {
    _id: "1",
    bookingId: "TM-2024-001",
    userId: "user_001",
    user: {
      _id: "user_001",
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@email.com",
      phone: "+91 98765 43210",
    },
    package: {
      _id: "pkg_001",
      name: "Goa Beach Paradise - 5 Days",
      price: 25000,
      startDate: "2024-02-15",
      endDate: "2024-02-20",
      images: "/goa2.avif",
      meetingPoint: "Goa International Airport",
    },
    cancellationReason: "Due to unforeseen work commitments, I need to cancel my travel plans. I apologize for any inconvenience caused.",
    refundAmount: 22500,
    status: "pending",
    requestedAt: "2024-01-20T10:30:00Z",
    createdAt: "2024-01-20T10:30:00Z",
    updatedAt: "2024-01-20T10:30:00Z",
  },
  {
    _id: "2",
    bookingId: "TM-2024-002",
    userId: "user_002",
    user: {
      _id: "user_002",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.j@email.com",
      phone: "+91 87654 32109",
    },
    package: {
      _id: "pkg_002",
      name: "Kashmir Valley Adventure",
      price: 35000,
      startDate: "2024-02-10",
      endDate: "2024-02-17",
      images: "/kashmir.jpg",
      meetingPoint: "Srinagar Airport",
    },
    cancellationReason: "Health issues have forced me to cancel my trip. I hope to reschedule in the future.",
    refundAmount: 31500,
    status: "approved",
    requestedAt: "2024-01-18T14:20:00Z",
    processedAt: "2024-01-19T09:15:00Z",
    processedBy: "vendor_001",
    vendorNotes: "Approved due to medical emergency. Full refund processed.",
    createdAt: "2024-01-18T14:20:00Z",
    updatedAt: "2024-01-19T09:15:00Z",
  },
];

export function CancellationRequestsDemo() {
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');
  const [selectedRequest, setSelectedRequest] = useState<CancellationRequestDto | null>(null);
  const [vendorNotes, setVendorNotes] = useState("");

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      approved: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
    };

    return (
      <Badge className={cn("px-2 py-1 rounded-full text-xs font-semibold border", variants[status as keyof typeof variants])}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleViewDetails = (request: CancellationRequestDto) => {
    setSelectedRequest(request);
    setViewMode('details');
  };

  const handleBackToList = () => {
    setSelectedRequest(null);
    setViewMode('list');
    setVendorNotes("");
  };

  const handleProcessRequest = (action: 'approve' | 'reject') => {
    // Demo processing
    setTimeout(() => {
      alert(`Request ${action}d successfully!`);
      handleBackToList();
    }, 1000);
  };

  if (viewMode === 'details' && selectedRequest) {
    const canProcess = selectedRequest.status === 'pending';
    
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        {/* Header */}
        <Card className="border-[#2CA4BC]/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/10 to-[#2CA4BC]/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToList}
                  className="text-[#2CA4BC] hover:bg-[#2CA4BC]/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Requests
                </Button>
                <div>
                  <CardTitle className="text-[#1a5f6b] flex items-center gap-3">
                    <AlertCircle className="w-6 h-6" />
                    Cancellation Request Details
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Booking ID: {selectedRequest.bookingId}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(selectedRequest.status)}
                {canProcess && (
                  <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                    Action Required
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card className="border-[#2CA4BC]/20">
              <CardHeader>
                <CardTitle className="text-[#1a5f6b] flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedRequest.user?.email} alt={selectedRequest.user?.firstName} />
                    <AvatarFallback className="bg-[#2CA4BC] text-white text-lg">
                      {selectedRequest.user?.firstName?.[0]}
                      {selectedRequest.user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedRequest.user?.firstName} {selectedRequest.user?.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">User ID: {selectedRequest.userId}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-[#2CA4BC]" />
                        <span className="text-gray-700">{selectedRequest.user?.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-[#2CA4BC]" />
                        <span className="text-gray-700">{selectedRequest.user?.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking & Package Details */}
            <Card className="border-[#2CA4BC]/20">
              <CardHeader>
                <CardTitle className="text-[#1a5f6b] flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Booking & Package Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#2CA4BC]" />
                      <span className="text-sm font-medium text-gray-700">Package Name</span>
                    </div>
                    <p className="text-gray-900 font-medium">{selectedRequest.package?.name}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#2CA4BC]" />
                      <span className="text-sm font-medium text-gray-700">Travel Date</span>
                    </div>
                    <p className="text-gray-900">{formatDate(selectedRequest.package?.startDate || "")}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#2CA4BC]" />
                      <span className="text-sm font-medium text-gray-700">Meeting Point</span>
                    </div>
                    <p className="text-gray-900">{selectedRequest.package?.meetingPoint}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-[#2CA4BC]" />
                      <span className="text-sm font-medium text-gray-700">Original Amount</span>
                    </div>
                    <p className="text-gray-900 font-medium">{formatCurrency(selectedRequest.package?.price || 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cancellation Reason */}
            <Card className="border-[#2CA4BC]/20">
              <CardHeader>
                <CardTitle className="text-[#1a5f6b] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Cancellation Reason
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800 leading-relaxed">{selectedRequest.cancellationReason}</p>
                </div>
              </CardContent>
            </Card>

            {/* Vendor Notes */}
            {canProcess && (
              <Card className="border-[#2CA4BC]/20">
                <CardHeader>
                  <CardTitle className="text-[#1a5f6b] flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Vendor Notes
                  </CardTitle>
                  <p className="text-sm text-gray-600">Add notes for the customer (optional)</p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={vendorNotes}
                    onChange={(e) => setVendorNotes(e.target.value)}
                    placeholder="Add any additional notes or comments for the customer..."
                    className="min-h-24 border-[#2CA4BC]/20 focus:border-[#2CA4BC] focus:ring-[#2CA4BC]/20"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {vendorNotes.length}/500 characters
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Refund Summary */}
            <Card className="border-[#2CA4BC]/20">
              <CardHeader>
                <CardTitle className="text-[#1a5f6b] flex items-center gap-2">
                  <IndianRupee className="w-5 h-5" />
                  Refund Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatCurrency(selectedRequest.refundAmount)}
                  </div>
                  <p className="text-sm text-gray-600">Refund Amount</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Original Amount:</span>
                    <span className="font-medium">{formatCurrency(selectedRequest.package?.price || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Fee:</span>
                    <span className="font-medium">{formatCurrency((selectedRequest.package?.price || 0) - selectedRequest.refundAmount)}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between font-semibold">
                    <span>Refund Amount:</span>
                    <span className="text-green-600">{formatCurrency(selectedRequest.refundAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {canProcess && (
              <Card className="border-[#2CA4BC]/20">
                <CardHeader>
                  <CardTitle className="text-[#1a5f6b]">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => handleProcessRequest('approve')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Request
                  </Button>
                  
                  <Button
                    onClick={() => handleProcessRequest('reject')}
                    variant="destructive"
                    className="w-full"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Request
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    This action cannot be undone
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="lg:ml-64">
      <div className="min-h-screen bg-gradient-to-br from-[#2CA4BC]/5 via-[#2CA4BC]/10 to-cyan-50 p-4 md:p-6 lg:p-8 pt-16 lg:pt-4">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#1a5f6b] to-[#2CA4BC] bg-clip-text text-transparent">
              Cancellation Requests Demo
            </h1>
            <p className="text-slate-600 text-sm md:text-base">
              This is a demo showing the cancellation requests interface
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <Card className="border-[#2CA4BC]/20 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Requests</p>
                    <p className="text-2xl font-bold text-[#1a5f6b]">{demoStats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#2CA4BC]/10 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-[#2CA4BC]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{demoStats.pending}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{demoStats.approved}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Rejected</p>
                    <p className="text-2xl font-bold text-red-600">{demoStats.rejected}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Table */}
          <Card className="border-[#2CA4BC]/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/10 to-[#2CA4BC]/5">
              <CardTitle className="flex items-center gap-3 text-[#1a5f6b]">
                <AlertCircle className="w-6 h-6" />
                Cancellation Requests
                <Badge variant="secondary" className="ml-2">
                  {demoRequests.length} Demo Records
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#2CA4BC]/10">
                    <TableRow className="border-[#2CA4BC]/20 hover:bg-[#2CA4BC]/5">
                      <TableHead className="text-[#1a5f6b] font-semibold">Customer</TableHead>
                      <TableHead className="text-[#1a5f6b] font-semibold">Booking Details</TableHead>
                      <TableHead className="text-[#1a5f6b] font-semibold">Package</TableHead>
                      <TableHead className="text-[#1a5f6b] font-semibold">Refund Amount</TableHead>
                      <TableHead className="text-[#1a5f6b] font-semibold">Status</TableHead>
                      <TableHead className="text-[#1a5f6b] font-semibold">Requested</TableHead>
                      <TableHead className="w-20 text-[#1a5f6b] font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoRequests.map((request, index) => (
                      <motion.tr
                        key={request._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-[#2CA4BC]/5 hover:bg-[#2CA4BC]/5 cursor-pointer"
                        onClick={() => handleViewDetails(request)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={request.user?.email} alt={request.user?.firstName} />
                              <AvatarFallback className="bg-[#2CA4BC] text-white">
                                {request.user?.firstName?.[0]}
                                {request.user?.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">
                                {request.user?.firstName} {request.user?.lastName}
                              </p>
                              <p className="text-sm text-gray-500">{request.user?.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-mono text-sm font-medium text-[#1a5f6b]">
                              {request.bookingId}
                            </p>
                            <p className="text-xs text-gray-500">
                              User ID: {request.userId}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-gray-900 line-clamp-1">
                              {request.package?.name}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(request.package?.startDate || "")}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-green-600 font-semibold">
                            <IndianRupee className="w-4 h-4" />
                            <span>{request.refundAmount.toLocaleString()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(request.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(request.requestedAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(request)}
                            className="text-[#2CA4BC] hover:text-[#1a5f6b] hover:bg-[#2CA4BC]/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

