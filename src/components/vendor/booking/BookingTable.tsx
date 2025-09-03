"use client"

import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Eye,
  Calendar,
  Users,
  MoreHorizontal,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Download,
  UserCheck,
  CalendarDays,
  ArrowLeft,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate, useParams } from "react-router-dom"
import Pagination from "@/components/Pagination"
import { Spinner } from "@/components/Spinner"
import _ from "lodash"
import toast from "react-hot-toast"
import type { BookingListVendorDto } from "@/types/bookingType"
import { useGetBookingsVendorQuery, useSendPaymentAlertMutation } from "@/hooks/vendor/useBookings"
import { getBookingsVendor } from "@/services/vendor/vendorService"
import ConfirmationModal from "@/components/modals/ConfirmationModal"

// Type definitions
type BOOKINGSTATUS = "pending" | "confirmed" | "completed" | "cancelled" | "advance_paid" | "advance_pending" | "all" | "applied" | "waitlisted"
type BookingStatus = "all" | BOOKINGSTATUS


export function BookingListTable() {
  const {packageId} = useParams<{packageId : string}>();
  if(!packageId) return <div>No packageId</div>
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<BookingListVendorDto[]>([])
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<BookingStatus>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 10
  
  const {mutate : sendPaymentAlert} = useSendPaymentAlertMutation()
  

  const {data,isLoading} = useGetBookingsVendorQuery(
     getBookingsVendor,
     packageId,
     page,
     limit,
     debouncedSearchTerm,
    statusFilter   
  )

  const debouncedSearch = useCallback(
    _.debounce((query) => {
      setDebouncedSearchTerm(query)
    }, 500),
    [],
  )

  useEffect(() => {
     if(!data) return;
     setBookings(data?.bookings);
     setTotalPages(data.totalPages);
     console.log(data)
  }, [debouncedSearchTerm, statusFilter,data])

  const canSendPaymentAlert = bookings.length >= (data?.minTravelersCount || 0) && 
  bookings.every(b => b.status === "applied" && !b.isWaitlisted);

  if (isLoading) return <Spinner />

  const handlePaymentAlert = () => {
    setIsUpdating(true);
    sendPaymentAlert(packageId,{
      onSuccess : (response) => {
        toast.success(response.message);
        setIsUpdating(false);
      },
      onError :(error : any) => {
        toast.error(error?.response.data.message);
        setIsUpdating(false);
      }
    })
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    debouncedSearch(e.target.value)
  }

  const handleViewBooking = (id: string) => {
    navigate(`/vendor/bookings/users/${id}`)
  }

   const confirmSendAlert = () => {
      handlePaymentAlert();
  }

  const getStatusConfig = (status: BOOKINGSTATUS) => {
    switch (status) {
      case "confirmed":
        return { 
          label: "Confirmed", 
          className: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircle className="h-3 w-3" />
        }
      case "applied":
        return { 
          label: "Applied", 
          className: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircle className="h-3 w-3" />
        }
      case "advance_pending":
        return { 
          label: "Advance_pending", 
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: <Clock className="h-3 w-3" />
        }
      case "completed":
        return { 
          label: "Completed", 
          className: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <CheckCircle className="h-3 w-3" />
        }
      case "cancelled":
        return { 
          label: "Cancelled", 
          className: "bg-red-100 text-red-800 border-red-200",
          icon: <XCircle className="h-3 w-3" />
        }
      case "waitlisted":
        return { 
          label: "waitlisted", 
          className: "bg-red-100 text-red-800 border-red-200",
          icon: <XCircle className="h-3 w-3" />
        }
      default:
        return { 
          label: "Unknown", 
          className: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <AlertCircle className="h-3 w-3" />
        }
    }
  }

  const getBookingStats = () => {
    return {
      total: bookings?.length,
      confirmed: bookings?.filter(b => b.status === "confirmed").length,
      pending: bookings?.filter(b => b.status === "pending").length,
      waitlisted: bookings?.filter(b => b.isWaitlisted).length,
      completed: bookings?.filter(b => b.status === "completed").length
    }
  }

  const stats = getBookingStats()

  return (
    <div className="lg:ml-64 p-4 md:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-[#2CA4BC]/5 to-[#1a5f6b]/5">
      <div className="max-w-7xl mx-auto space-y-6">
        <Button
          onClick={() => navigate("/vendor/packages")}
          variant="ghost"
          size="sm"
          className="hover:bg-white/80 border border-slate-300 transition-all duration-200 hover:shadow-md"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Package Management
        </Button>
        {/* Header */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] text-white">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold">Booking Management</CardTitle>
                <p className="text-white/90 mt-1">Track and manage all your travel bookings</p>
              </div>
              <div className="flex gap-2">
                {canSendPaymentAlert && (
                  <Button
                    onClick={() => setIsConfirmationModalOpen(true)}
                    size="lg"
                    className="bg-[#1a5f6b] text-white hover:bg-[#174f58] shadow-lg border border-white/20"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Send Payment Alert
                  </Button>
                )}
                <Button
                  className="bg-white/10 text-white hover:bg-white/20 shadow-lg border border-white/20"
                  size="lg"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border-[#2CA4BC]/20 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#2CA4BC]/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-[#2CA4BC]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-xl font-bold text-[#1a5f6b]">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#2CA4BC]/20 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Confirmed</p>
                  <p className="text-xl font-bold text-[#1a5f6b]">{stats.confirmed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#2CA4BC]/20 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-xl font-bold text-[#1a5f6b]">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#2CA4BC]/20 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Waitlisted</p>
                  <p className="text-xl font-bold text-[#1a5f6b]">{stats.waitlisted}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#2CA4BC]/20 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-xl font-bold text-[#1a5f6b]">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-[#2CA4BC]/20 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by booking ID, customer name, email, or phone..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={statusFilter} onValueChange={(value: BookingStatus) => setStatusFilter(value)}>
                  <SelectTrigger className="w-full sm:w-[140px] focus:border-[#2CA4BC] focus:ring-[#2CA4BC]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card className="border-[#2CA4BC]/20 shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#2CA4BC]/10">
                  <TableRow className="border-[#2CA4BC]/20 hover:bg-[#2CA4BC]/5">
                    <TableHead className="w-[180px] text-[#1a5f6b] font-semibold">Booking ID</TableHead>
                    <TableHead className="w-[280px] text-[#1a5f6b] font-semibold">Customer</TableHead>
                    <TableHead className="w-[250px] text-[#1a5f6b] font-semibold">Contact</TableHead>
                    <TableHead className="text-[#1a5f6b] font-semibold">Status</TableHead>
                    <TableHead className="text-[#1a5f6b] font-semibold">Booking Date</TableHead>
                    <TableHead className="w-[120px] text-[#1a5f6b] font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings?.slice((currentPage - 1) * limit, currentPage * limit).map((booking) => {
                    const statusConfig = getStatusConfig(booking?.status as BOOKINGSTATUS)
                    return (
                      <TableRow
                        key={booking._id}
                        className="border-[#2CA4BC]/10 hover:bg-[#2CA4BC]/5 transition-colors"
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-[#2CA4BC]/10 rounded-lg">
                              <CalendarDays className="h-4 w-4 text-[#2CA4BC]" />
                            </div>
                            <div>
                              <p className="font-mono font-semibold text-[#1a5f6b]">
                                #{booking._id.slice(-6).toUpperCase()}
                              </p>
                              <p className="text-xs text-gray-500">ID: {booking._id.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          {booking.user ? (
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src="" alt={`${booking.user.firstName} ${booking.user.lastName}`} />
                                <AvatarFallback className="bg-[#2CA4BC]/10 text-[#2CA4BC] font-semibold">
                                  {booking.user.firstName[0]}{booking.user.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-[#1a5f6b] truncate">
                                  {booking.user.firstName} {booking.user.lastName}
                                </p>
                                <p className="text-sm text-gray-600 truncate">
                                  Customer ID: {booking.user._id.slice(-6).toUpperCase()}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 text-gray-500">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-gray-100 text-gray-500">
                                  <User className="h-5 w-5" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">Guest User</p>
                                <p className="text-sm">No customer info</p>
                              </div>
                            </div>
                          )}
                        </TableCell>

                        <TableCell className="py-4">
                          {booking.user ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-3 w-3 text-[#2CA4BC]" />
                                <span className="truncate max-w-[180px] text-gray-700">
                                  {booking.user.email}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-3 w-3 text-green-600" />
                                <span className="text-gray-700">{booking.user.phone}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Contact N/A</span>
                          )}
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline" className={`${statusConfig.className} flex items-center gap-1 w-fit`}>
                            {statusConfig.icon}
                            {statusConfig.label}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium text-[#1a5f6b]">Jan 15, 2024</p>
                            <p className="text-gray-500">2:30 PM</p>
                            {booking.cancelledAt && (
                              <p className="text-red-600 text-xs">
                                Cancelled: {booking.cancelledAt.toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => handleViewBooking(booking._id)} className="cursor-pointer">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setPage} 
        />

            <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          onConfirm={() => {
            confirmSendAlert()
          }}
          title="Confirm Action"
          message="Are you sure you want to send payment alert to the travelers ?"
          confirmText="Yes, Continue"
          cancelText="Cancel"
          type="danger"
          isLoading={isUpdating}
        />
      </div>
    </div>
  )
}