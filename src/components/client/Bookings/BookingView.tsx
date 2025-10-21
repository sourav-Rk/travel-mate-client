import  { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  Loader,
  QrCode,
  IndianRupee,
} from "lucide-react";
import UpcomingBookingsTabs from "./bookingView/UpcomingBookingTabs";
import type { BookingListDTO } from "@/types/bookingType";
import { useGetBookingsQuery } from "@/hooks/client/useBooking";

const BookingsView = () => {
  const [activeTab, setActiveTab] = useState<string>("applied");
  const [bookingData, setBookingData] = useState<BookingListDTO[]>([]);

    // Define status categories for each main tab
  const statusCategories = {
    upcoming: ["applied", "pending", "confirmed", "advance_pending", "fully_paid", "waitlisted"],
    completed: ["completed"],
    cancelled: ["cancelled", "expired","cancellation_requested"]
  };

const { data } = useGetBookingsQuery(
  statusCategories[activeTab as keyof typeof statusCategories]
);


  useEffect(() => {
    if (!data) return;
    setBookingData(data?.bookings || []);
  }, [data,activeTab]);

  const tabs = [
    { id: "upcoming", label: "Upcoming"},
    { id: "completed", label: "Completed"},
    { id: "cancelled", label: "Cancelled"},
  ];

 const getStatusIcon = (status: string) => {
  switch (status) {
    case "confirmed":
    case "completed":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "pending":
    case "advance_pending":
      return <Loader className="w-4 h-4 text-orange-500 animate-spin" />;
    case "applied":
      return <Clock className="w-4 h-4 text-blue-500" />;
    case "advance_paid":
      return <CheckCircle className="w-4 h-4 text-blue-500" />;
    case "cancelled":
    case "expired":
    case "cancellation_requested" : 
      return <XCircle className="w-4 h-4 text-red-500" />;
    case "waitlisted":
      return <Clock className="w-4 h-4 text-gray-500" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-700 border-green-200";
    case "pending":
    case "advance_pending":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "applied":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "advance_paid":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelled":
    case "expired":
    case "cancellation_requested":
      return "bg-red-100 text-red-700 border-red-200";
    case "waitlisted":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};
  const BookingCard = ({ booking, index }: { booking: BookingListDTO; index: any }) => (
    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden border border-white/20 hover:border-[#2CA4BC]/20 group"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-36 h-32 md:h-auto relative overflow-hidden">
          <img
            src={booking.package?.images}
            alt={booking.package?.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#2CA4BC]/20 via-transparent to-black/40" />
          <div
            className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 backdrop-blur-md ${getStatusColor(
              booking.status
            )}`}
          >
            {getStatusIcon(booking.status)}
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Left Content */}
            <div className="flex-1 space-y-3">
              {/* Header */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-[#2CA4BC] transition-colors">
                  {booking.package?.name}
                </h3>
                <div className="flex items-center text-gray-500 text-xs">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>{booking.package?.meetingPoint}</span>
                </div>
              </div>

              {/* Trip Details */}
              {/* <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1 text-[#2CA4BC]" />
                  <span className="truncate">{new Date(booking.package?.startDate)}</span>
                </div>
              </div> */}

              {booking.package?.duration && (
                <div className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-[#2CA4BC]/10 to-blue-50 text-[#2CA4BC] rounded-full text-xs font-medium">
                  {booking.package.duration.days}D/{booking.package.duration.nights}N
                </div>
              )}
            </div>

            {/* Right Content - Compact Booking Details */}
            <div className="md:min-w-[200px] space-y-3">
              {/* QR Code and Booking ID */}
              <div className="flex items-center justify-between md:justify-end gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl shadow-inner">
                  <QrCode className="w-6 h-6 text-gray-400" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-0.5">ID</p>
                  <p className="font-mono text-sm font-semibold text-gray-700">
                    {booking.bookingId}
                  </p>
                </div>
              </div>

              {/* Price and Actions */}
              <div className="space-y-2">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-xl p-3">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">
                      {booking.status === "cancelled" ? "Refunded" : "Paid"}
                    </p>
                    <p className="text-lg font-bold text-[#2CA4BC] flex items-center justify-end">
                      <IndianRupee className="w-4 h-4" />
                      {booking.status === "cancelled"
                        ? booking.advancePayment?.paid
                        : booking.package?.price}
                    </p>
                  </div>
                </div>

                {/* Compact Action Buttons */}
                <Link to={`/pvt/bookings/${booking.id}/${booking.package?.packageId?.packageId}`}>
                <div className="flex gap-2">
                  <button className="flex-1 bg-gradient-to-r from-[#2CA4BC] to-[#2CA4BC]/80 text-white px-3 py-2 rounded-xl hover:shadow-lg hover:shadow-[#2CA4BC]/25 transition-all duration-300 flex items-center justify-center gap-1 text-xs font-medium group-hover:scale-105">
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 md:ml-80">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage and track your travel bookings</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200 bg-white rounded-t-2xl shadow-sm">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors relative ${
                    activeTab === tab.id
                      ? "border-[#2CA4BC] text-[#2CA4BC]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[#2CA4BC]/5 rounded-t-lg"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "upcoming" ? (
              <UpcomingBookingsTabs bookings={bookingData} />
            ) : bookingData.length > 0 ? (
              <div className="space-y-6">
                {bookingData.map((booking, index) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="bg-white rounded-2xl shadow-sm p-12 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No {activeTab} bookings
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You don't have any {activeTab} bookings at the moment.
                  </p>
                  <button className="bg-[#2CA4BC] text-white px-6 py-3 rounded-lg hover:bg-[#2CA4BC]/90 transition-colors font-medium">
                    Explore Trips
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BookingsView;
