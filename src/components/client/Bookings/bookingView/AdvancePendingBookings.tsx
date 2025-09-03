// PendingBookings Component
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Download,
  Eye,
  Loader,
  IndianRupee,
  QrCode,
  Clock,
  AlertTriangle,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';
import type { BookingListDTO } from '@/types/bookingType';
import { useNavigate } from 'react-router-dom';

interface TimeLeft {
  hours: number;
  minutes: number;
  expired?: boolean;
}

interface AdvancePendingBookingsProps {
  bookings: BookingListDTO[];
  searchQuery: string;
}

const Advance_Pending_Booking: React.FC<AdvancePendingBookingsProps> = ({ bookings = [], searchQuery = '' }:{bookings : BookingListDTO[];searchQuery : string}) => {
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<Record<string, TimeLeft>>({});

  // Simulate refresh status
  const handleRefreshStatus = async (bookingId: string): Promise<void> => {
    setRefreshing(prev => ({ ...prev, [bookingId]: true }));
    
    // Simulate API call
    setTimeout(() => {
      setRefreshing(prev => ({ ...prev, [bookingId]: false }));
    }, 2000);
  };

  // Calculate time left for pending bookings
  useEffect(() => {
    const calculateTimeLeft = (): void => {
      const newTimeLeft: Record<string, TimeLeft> = {};
      
      bookings.forEach(booking => {
        if (booking.advancePayment?.dueDate) {
          const deadline = new Date(booking.advancePayment.dueDate);
          const now = new Date();
          const difference = deadline.getTime() - now.getTime();
          
          if (difference > 0) {
            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            newTimeLeft[booking.id] = { hours, minutes };
          } else {
            newTimeLeft[booking.id] = { hours: 0, minutes: 0, expired: true };
          }
        }
      });
      
      setTimeLeft(newTimeLeft);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [bookings]);

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

  const getUrgencyLevel = (booking: BookingListDTO): 'expired' | 'urgent' | 'moderate' | 'normal' => {
    const timeData = timeLeft[booking.id];
    if (!timeData || timeData.expired) return 'expired';
    if (timeData.hours < 6) return 'urgent';
    if (timeData.hours < 24) return 'moderate';
    return 'normal';
  };

  const getUrgencyColor = (urgency: string): string => {
    switch (urgency) {
      case 'expired':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'urgent':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200 rounded-2xl p-4 lg:p-6"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
            <Loader className="w-6 h-6 text-white animate-spin" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
              Processing Your Bookings
            </h3>
            <p className="text-orange-700 text-sm leading-relaxed">
              Your bookings are currently being processed by our travel partners. Please wait while we confirm availability 
              and finalize the details. You'll be notified as soon as there's an update.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 bg-orange-500/20 text-orange-700 rounded-full text-xs font-medium">
                <Clock className="w-3 h-3 mr-1" />
                Processing in progress
              </span>
              <span className="inline-flex items-center px-3 py-1 bg-orange-500/20 text-orange-700 rounded-full text-xs font-medium">
                Automatic updates
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bookings Grid */}
      <div className="grid gap-4 lg:gap-6">
        {bookings.map((booking, index) => {
          const urgency = getUrgencyLevel(booking);
          const urgencyColors = getUrgencyColor(urgency);
          const timeData = timeLeft[booking.id];
          const isRefreshing = refreshing[booking.id];

          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden border border-white/20 hover:border-orange-500/20 group relative"
            >
              {/* Processing Animation Overlay */}
              <AnimatePresence>
                {isRefreshing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-orange-500/5 backdrop-blur-[1px] z-10 flex items-center justify-center"
                  >
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3">
                      <Loader className="w-5 h-5 text-orange-500 animate-spin" />
                      <span className="text-orange-700 font-medium">Checking status...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="lg:w-72 h-48 lg:h-auto relative overflow-hidden">
                  <img
                    src={booking.package?.images}
                    alt={booking.package?.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-black/40" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 px-3 py-2 rounded-full bg-orange-500/90 backdrop-blur-md border border-white/20">
                    <div className="flex items-center gap-2">
                      <Loader className="w-4 h-4 text-white animate-spin" />
                      <span className="text-white text-sm font-medium">Processing</span>
                    </div>
                  </div>

                  {/* Urgency Indicator */}
                  {timeData && (
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full border backdrop-blur-md ${urgencyColors}`}>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs font-medium">
                          {timeData.expired ? 'Expired' : `${timeData.hours}h ${timeData.minutes}m left`}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Processing Progress */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/20 backdrop-blur-md rounded-full p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-xs">Processing...</span>
                        <span className="text-white text-xs">65%</span>
                      </div>
                      <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-orange-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '65%' }}
                          transition={{ duration: 2, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6">
                  <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2">
                          {booking.package?.name}
                        </h3>
                        <button 
                          onClick={() => handleRefreshStatus(booking.id)}
                          className="ml-4 flex-shrink-0 w-8 h-8 bg-orange-100 hover:bg-orange-200 rounded-full flex items-center justify-center transition-all duration-300"
                          disabled={isRefreshing}
                        >
                          <RefreshCw className={`w-4 h-4 text-orange-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-orange-500" />
                        <span className="text-sm">{booking.package?.meetingPoint}</span>
                      </div>

                      {/* Trip Details Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-orange-500 flex-shrink-0" />
                          <div>
                            <p className="text-gray-500 text-xs">Travel Date</p>
                            <p className="font-medium text-gray-800">{formatDate(booking.package?.startDate + "")}</p>
                          </div>
                        </div>
                      
                        {booking.package?.duration && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                            <div>
                              <p className="text-gray-500 text-xs">Duration</p>
                              <p className="font-medium text-gray-800">{booking.package.duration.days}D/{booking.package.duration.nights}N</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Processing Status Section */}
                    <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-orange-800 mb-1">Awaiting Confirmation</h4>
                          <p className="text-xs text-orange-700 leading-relaxed">
                            We're working with our travel partners to confirm your booking. This process may take up to 
                            {timeData && !timeData.expired ? ` ${timeData.hours + Math.ceil(timeData.minutes/60)} hours` : ' 48 hours'}.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Booking Info Section */}
                    <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6">
                      {/* Left Section - QR and ID */}
                      <div className="lg:min-w-48">
                        <div className="bg-gradient-to-br from-gray-50 to-orange-50/30 rounded-2xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-200 to-orange-100 rounded-xl flex items-center justify-center shadow-inner">
                              <QrCode className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">Booking ID</p>
                              <p className="font-mono text-sm font-bold text-gray-800">{booking.id}</p>
                            </div>
                          </div>
                          
                          {/* Price Section */}
                          <div className="border-t border-gray-200 pt-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Estimated Total</span>
                              <div className="flex items-center text-lg font-bold text-orange-600">
                                <IndianRupee className="w-4 h-4" />
                                <span>{booking.package?.price}</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Subject to partner confirmation</p>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Actions */}
                      <div className="flex-1 flex flex-col justify-end">
                        <div className="grid grid-cols-2 gap-3">
                          <button 
                            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
                            disabled={isRefreshing}
                          >
                            <Clock className="w-4 h-4" />
                            Please Wait
                          </button>
                          
                          <button 
                            className="bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <button className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-100 hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium border border-gray-200">
                            <MessageSquare className="w-4 h-4" />
                            Contact
                          </button>
                          
                          <button onClick={() => handleViewDetails(booking.id)}  className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 px-4 py-3 rounded-xl hover:bg-blue-100 hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium border border-blue-200">
                            <Eye className="w-4 h-4" />
                            Details
                          </button>
                        </div>

                        {/* Status Timeline */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                            <span>Application sent</span>
                            <span>Processing</span>
                            <span>Confirmation</span>
                          </div>
                          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-orange-500 rounded-full"
                              initial={{ width: "33%" }}
                              animate={{ width: "66%" }}
                              transition={{ duration: 1, ease: "easeInOut" }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>✓</span>
                            <span>⏳</span>
                            <span>⏸</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Advance_Pending_Booking;