// AppliedBookings Component
import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Eye,
  Clock,
  IndianRupee,
  QrCode,
  Info,
  Bookmark,
  Share2
} from 'lucide-react';
import type { BookingListDTO } from '@/types/bookingType';
import { useNavigate } from 'react-router-dom';


interface AppliedBookingsProps {
  bookings: BookingListDTO[];
  searchQuery: string;
}

const AppliedBookings: React.FC<AppliedBookingsProps> = ({ bookings = [] }:{bookings : BookingListDTO[];searchQuery : string}) => {
  const navigate = useNavigate();


  const handleViewDetails = (bookingId : string): void => {
     navigate(`/pvt/bookings/${bookingId}`)
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200 rounded-2xl p-4 lg:p-6"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <Info className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Application Status
            </h3>
            <p className="text-blue-700 text-sm leading-relaxed">
              Your booking applications are being reviewed by our team. You'll receive a confirmation email within 24-48 hours. 
              Applications are processed in the order they were received.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-700 rounded-full text-xs font-medium">
                <Clock className="w-3 h-3 mr-1" />
                Review Time: 24-48 hours
              </span>
              <span className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-700 rounded-full text-xs font-medium">
                Response via Email
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bookings Grid */}
      <div className="grid gap-4 lg:gap-6">
        {bookings.map((booking, index) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden border border-white/20 hover:border-blue-500/20 group"
          >
            <div className="flex flex-col lg:flex-row">
              {/* Image Section */}
              <div className="lg:w-72 h-48 lg:h-auto relative overflow-hidden">
                <img
                  src={booking.package?.images}
                  alt={booking.package?.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-black/40" />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4 px-3 py-2 rounded-full bg-blue-500/90 backdrop-blur-md border border-white/20">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">Application Submitted</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300">
                    <Bookmark className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Application Date */}
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/20 backdrop-blur-md rounded-full">
                  <span className="text-white text-xs">Applied on {formatDate(String(booking.createdAt))}</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-6">
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {booking.package?.name}
                      </h3>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-blue-500" />
                      <span className="text-sm">{booking.package?.meetingPoint}</span>
                    </div>

                    {/* Trip Details Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <div>
                          <p className="text-gray-500 text-xs">Travel Date</p>
                          <p className="font-medium text-gray-800">{formatDate(String(booking.package?.startDate))}</p>
                        </div>
                      </div>
                      

                      {booking.package?.duration && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <div>
                            <p className="text-gray-500 text-xs">Duration</p>
                            <p className="font-medium text-gray-800">{booking.package.duration.days}Days/{booking.package.duration.nights}nights</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Booking Info Section */}
                  <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6">
                    {/* Left Section - QR and ID */}
                    <div className="lg:min-w-48">
                      <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-100 rounded-xl flex items-center justify-center shadow-inner">
                            <QrCode className="w-6 h-6 text-gray-500" />
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Booking ID</p>
                            <p className="font-mono text-sm font-bold text-gray-800">{booking.bookingId}</p>
                          </div>
                        </div>
                        
                        {/* Price Section */}
                        <div className="border-t border-gray-200 pt-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Estimated Total</span>
                            <div className="flex items-center text-lg font-bold text-blue-600">
                              <IndianRupee className="w-4 h-4" />
                              <span>{booking.package?.price}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Final price may vary based on confirmation</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex-1 flex flex-col justify-end">
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        <button 
                          onClick={() => handleViewDetails(booking.id)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        
                      </div>

                      {/* Status Timeline */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Application received</span>
                          <span>Under review</span>
                          <span>Confirmation pending</span>
                        </div>
                        <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full w-1/3 bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AppliedBookings;