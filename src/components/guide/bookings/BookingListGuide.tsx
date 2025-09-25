"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { BookingListGuideDto } from "@/types/api/guide";
import { useGetBookingsGuideQuery } from "@/hooks/guide/useGuideBookings";
import { getBookingsGuide } from "@/services/guide/guide.service";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Pagination from "@/components/Pagination";
import _ from "lodash"


const statusConfig = {
  fully_paid: { label: "Fully Paid", color: "bg-green-500", icon: CheckCircle },
  advance_pending: { label: "Advance Pending", color: "bg-yellow-500", icon: Clock },
  cancelled: { label: "Cancelled", color: "bg-red-500", icon: XCircle },
  confirmed: { label: "Confirmed", color: "bg-blue-500", icon: CheckCircle },
  waitlisted: {
    label: "Waitlisted",
    color: "bg-orange-500",
    icon: AlertCircle,
  },
};

export function BookingListGuide() {
  const navigate = useNavigate();
  const { packageId } = useParams<{ packageId: string }>();
  if (!packageId) return <div>No packageId</div>;
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [bookings, setBookings] = useState<BookingListGuideDto[]>();
  const limit = 5;
  const location = useLocation();
  const packageName = location?.state?.packageName ?? "Package Booking List";

  const {data,isLoading} = useGetBookingsGuideQuery(
    getBookingsGuide,
    packageId,
    page,
    limit,
    debouncedSearchTerm,
    statusFilter
  );

    const debouncedSearch = useCallback(
      _.debounce((query) => {
        setDebouncedSearchTerm(query)
      }, 500),
      [],
    )

  useEffect(() => {
    if(data){
        setBookings(data.bookings);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages)
    }
  },[data,page,packageId,statusFilter,debouncedSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value)
      debouncedSearch(e.target.value)
    }

    const handleViewDetails = (bookingId : string) => {
         navigate(`/guide/bookings/users/${bookingId}`);
    }
  

  const getStatusInfo = (booking: BookingListGuideDto) => {
    if (booking.isWaitlisted) {
      return statusConfig.waitlisted;
    }
    return (
      statusConfig[booking.status as keyof typeof statusConfig] ||
      statusConfig.advance_pending
    );
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="h-6 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-foreground">
          {  `${packageName}`}
        </CardTitle>
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, email, phone, or booking ID..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="fully_paid">Fully Paid</SelectItem>
              <SelectItem value="advance_pending">Advance Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="waitlisted">Waitlisted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          {bookings?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No bookings found
              </h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No bookings have been made for this package yet"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {bookings?.map((booking) => {
                const statusInfo = getStatusInfo(booking);
                const StatusIcon = statusInfo.icon;

                return (
                  <div
                    key={booking._id}
                    className="p-6 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {booking.user
                              ? getInitials(
                                  booking.user.firstName,
                                  booking.user.lastName
                                )
                              : "U"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-medium text-foreground truncate">
                              {booking.user
                                ? `${booking.user.firstName} ${booking.user.lastName}`
                                : "Unknown User"}
                            </h4>
                            <Badge
                              variant="secondary"
                              className={`${statusInfo.color} text-white text-xs px-2 py-1 flex items-center gap-1`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {statusInfo.label}
                            </Badge>
                          </div>

                          {booking.bookingId && (
                            <p className="text-sm text-muted-foreground font-mono">
                              ID: {booking.bookingId}
                            </p>
                          )}

                          {booking.user && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 shrink-0" />
                                <span className="truncate">
                                  {booking.user.email}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 shrink-0" />
                                <span>{booking.user.phone}</span>
                              </div>
                            </div>
                          )}

                          {booking.cancelledAt && (
                            <div className="flex items-center gap-2 text-sm text-destructive">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Cancelled on {formatDate(booking.cancelledAt)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button onClick={() =>handleViewDetails(booking._id!)} variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>

      {bookings?.length! > 0 && (
        <div className="px-6 py-4 border-t bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Showing {bookings?.length} of {bookings?.length} bookings
          </p>
        </div>
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages}onPageChange={setPage}/>
    </Card>
  );
}
