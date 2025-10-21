"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  AlertCircle,
  IndianRupee,
  Calendar,
  Search,
  Clock,
  Mail,
  Hash,
  FileX,
  XCircle,
} from "lucide-react";
import _ from "lodash"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { CancellationRequestsListDto } from "@/types/cancellationType";
import { useGetCancellationRequests } from "@/hooks/vendor/useCancellationRequests";
import { useNavigate } from "react-router-dom";
import { getCancellationRequestsVendor } from "@/services/vendor/vendorService";
import Pagination from "../Pagination";

type TabType = "pending" | "cancelled";

export function CancellationRequestsTable() {
  const [page, setPage] = useState(1);
  const [totalPages,setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const navigate = useNavigate();
  const limit = 10;

  const [cancellationRequests, setCancellationRequests] = useState<
    CancellationRequestsListDto[]
  >([]);

  const { data, isLoading, error } = useGetCancellationRequests(
    getCancellationRequestsVendor,
    page,
    limit,
    debouncedSearchTerm,
    activeTab
  );

   const debouncedSearch = useCallback(
      _.debounce((query) => {
        setDebouncedSearchTerm(query)
      }, 500),
      [],
    )
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value)
      debouncedSearch(e.target.value)
    }

  useEffect(() => {
    if (!data) return;
    setCancellationRequests(data.data);
    setPage(data.currentPage);
    setTotalPages(data.totalPages);
  }, [data]);

  const onViewDetails = (bookingId: string) => {
    navigate(`/vendor/bookings/cancellations/${bookingId}`);
  };

  const formatDate = (dateInput: string | Date): string => {
    if (!dateInput) return "N/A";

    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

    // handle invalid dates gracefully
    if (isNaN(date.getTime())) return "Invalid Date";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      approved: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };

    return (
      <Badge
        className={cn(
          "px-2 py-1 rounded-full text-xs font-semibold border",
          variants[status as keyof typeof variants]
        )}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };





  if (error) {
    return (
      <div className="lg:ml-64 p-4 sm:p-6 lg:p-8 min-h-screen">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Requests
            </h3>
            <p className="text-red-600">
              Failed to load cancellation requests. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="lg:ml-64 p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50">
      <div className="space-y-6 max-w-full">
        {/* Header */}
        <Card className="border-[#2CA4BC]/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/10 to-[#2CA4BC]/5">
            <CardTitle className="flex items-center gap-3 text-[#1a5f6b] flex-wrap">
              <AlertCircle className="w-6 h-6" />
              <span>Cancellation Management</span>
              {data && (
                <Badge variant="secondary" className="ml-auto sm:ml-2">
                  {cancellationRequests.length} Total
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {/* Tabs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    setActiveTab("pending");
                    setPage(1);
                  }}
                  variant={activeTab === "pending" ? "default" : "outline"}
                  className={cn(
                    "flex items-center gap-2 transition-all",
                    activeTab === "pending"
                      ? "bg-[#2CA4BC] hover:bg-[#1a5f6b] text-white shadow-md"
                      : "border-[#2CA4BC]/20 hover:bg-[#2CA4BC]/10 text-gray-700"
                  )}
                >
                  <FileX className="w-4 h-4" />
                  <span>Cancellation Requests</span>

                </Button>

                <Button
                  onClick={() => {
                    setActiveTab("cancelled");
                    setPage(1);
                  }}
                  variant={activeTab === "cancelled" ? "default" : "outline"}
                  className={cn(
                    "flex items-center gap-2 transition-all",
                    activeTab === "cancelled"
                      ? "bg-[#2CA4BC] hover:bg-[#1a5f6b] text-white shadow-md"
                      : "border-[#2CA4BC]/20 hover:bg-[#2CA4BC]/10 text-gray-700"
                  )}
                >
                  <XCircle className="w-4 h-4" />
                  <span>Cancelled Bookings</span>
      
                </Button>
              </div>

              {/* Search */}
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by customer name, booking ID..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-10 border-[#2CA4BC]/20 focus:border-[#2CA4BC] focus:ring-[#2CA4BC]/20"
                  />
                </div>
              </div>
            </div>

            {/* Card Grid Layout - No Scroll */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2CA4BC]"></div>
                    <span className="text-gray-600">
                      Loading cancellation requests...
                    </span>
                  </div>
                </div>
              ) : cancellationRequests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    {activeTab === "pending" ? (
                      <FileX className="w-12 h-12 text-gray-400" />
                    ) : (
                      <XCircle className="w-12 h-12 text-gray-400" />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {activeTab === "pending"
                          ? "No Pending Cancellation Requests"
                          : "No Cancelled Bookings"}
                      </h3>
                      <p className="text-gray-600">
                        {searchQuery
                          ? "No requests match your search criteria."
                          : activeTab === "pending"
                          ? "You don't have any pending cancellation requests."
                          : "You don't have any cancelled bookings yet."}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                cancellationRequests.map((request, index) => (
                  <motion.div
                    key={request.bookingId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card
                      className="border-[#2CA4BC]/20 hover:shadow-lg transition-all cursor-pointer hover:border-[#2CA4BC]/40"
                      onClick={() => onViewDetails(request.bookingId)}
                    >
                      <CardContent className="p-4 sm:p-6">
                        {/* Header Row */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                          {/* Customer Info */}
                          <div className="flex items-center gap-3 flex-1">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={request.user?.email}
                                alt={request.user?.name}
                              />
                              <AvatarFallback className="bg-[#2CA4BC] text-white">
                                {request.user?.name?.[0]}
                                {request.user?.name?.[1]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">
                                {request.user?.name}
                              </p>
                              <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {request.user?.email}
                              </p>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="flex items-center gap-2 sm:justify-end">
                            {getStatusBadge(request.status)}
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          {/* Booking ID */}
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1">
                              <Hash className="w-3 h-3" />
                              Booking ID
                            </p>
                            <p className="font-mono text-sm font-semibold text-[#1a5f6b]">
                              {request.bookingId}
                            </p>
                            <p className="text-xs text-gray-400">
                              User: {request.user.userId}
                            </p>
                          </div>

                          {/* Package Name */}
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Package
                            </p>
                            <p className="font-medium text-gray-900 line-clamp-2">
                              {request.package?.packageName}
                            </p>
                          </div>

                          {/* Refund Amount */}
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Refund Amount
                            </p>
                            <div className="flex items-center gap-1 text-green-600 font-bold text-lg">
                              <IndianRupee className="w-5 h-5" />
                              <span>
                                {request.refundAmount.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Package Start Date */}
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Package Date
                            </p>
                            <p className="text-sm text-gray-700">
                              {formatDate(request.package?.startDate || "")}
                            </p>
                          </div>

                          {/* Requested At */}
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {activeTab === "pending"
                                ? "Requested"
                                : "Cancelled"}
                            </p>
                            <p className="text-sm text-gray-700">
                              {formatDate(request.requestedAt)}
                            </p>
                          </div>

                          {/* View Button */}
                          <div className="flex items-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewDetails(request.bookingId);
                              }}
                              className="w-full sm:w-auto text-[#2CA4BC] border-[#2CA4BC]/30 hover:bg-[#2CA4BC] hover:text-white transition-colors"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage}/>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}