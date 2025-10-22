import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Eye,
  CheckCircle,
  IndianRupee,
  QrCode,
  Clock,
  Camera,
  Share2,
  MapIcon,
  FileText,
  CreditCard,
  Shield,
  XCircle
} from 'lucide-react';
import type { BookingListDTO } from '@/types/bookingType';
import { useNavigate } from 'react-router-dom';
import { CancellationModal } from '@/components/CancellationModal';
import { useCancelBookingMutation } from '@/hooks/client/useBooking';


interface ConfirmedBookingsProps {
  bookings: BookingListDTO[];
  searchQuery: string;
}

const ConfirmedBookings: React.FC<ConfirmedBookingsProps> = ({ bookings = [], searchQuery = '' }:{bookings : BookingListDTO[];searchQuery : string}) => {
  const navigate = useNavigate()
  const [expandedBooking] = useState<string | null>(null);
  const [isCancellationModalOpen, setIsCancellationModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingListDTO | null>(null);
  const cancelBookingMutation = useCancelBookingMutation();

  const handleViewDetails = (bookingId : string,packageId : string): void => {
     navigate(`/pvt/bookings/${bookingId}/${packageId}`)
  };



  const handleShare = (booking: BookingListDTO): void => {
    console.log('Sharing booking:', booking.id);
    if (navigator.share) {
      navigator.share({
        title: booking.package?.name,
        text: `Check out my confirmed travel booking: ${booking.package?.name}`,
        url: window.location.href
      });
    }
  };

  const handleCancelBooking = (booking: BookingListDTO): void => {
    setSelectedBooking(booking);
    setIsCancellationModalOpen(true);
  };

  const handleConfirmCancellation = async (reason: string, additionalInfo: string): Promise<void> => {
    if (!selectedBooking) return;
    
    try {
      await cancelBookingMutation.mutateAsync({
        bookingId: selectedBooking.bookingId,
        cancellationReason: additionalInfo ? `${reason}: ${additionalInfo}` : reason
      });
      setIsCancellationModalOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  const handleCloseCancellationModal = (): void => {
    setIsCancellationModalOpen(false);
    setSelectedBooking(null);
  };



  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
;

  const getDaysUntilTrip = (dateString: string): number => {
    const tripDate = new Date(dateString);
    const today = new Date();
    const diffTime = tripDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const filteredBookings = bookings.filter(booking =>
    booking.package?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredBookings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Calendar className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Confirmed Bookings</h3>
        <p className="text-gray-600">
          {searchQuery ? 'No bookings match your search criteria.' : 'You haven\'t confirmed any bookings yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-50 to-emerald-100/50 border border-green-200 rounded-2xl p-4 lg:p-6"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Bookings Confirmed! 🎉
            </h3>
            <p className="text-green-700 text-sm leading-relaxed">
              Congratulations! Your travel bookings have been confirmed. All details have been verified and you're all set for your journey. 
              Check your email for detailed itinerary and important travel information.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-700 rounded-full text-xs font-medium">
                <Shield className="w-3 h-3 mr-1" />
                100% Confirmed
              </span>
              <span className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-700 rounded-full text-xs font-medium">
                Travel Ready
              </span>
              <span className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-700 rounded-full text-xs font-medium">
                Support Available 24/7
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bookings Grid */}
      <div className="grid gap-4 lg:gap-6">
        {filteredBookings.map((booking, index) => {
          const daysLeft = getDaysUntilTrip(booking.advancePayment?.dueDate + "");
          const isExpanded = expandedBooking === booking.id;

          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden border border-white/20 hover:border-green-500/20 group"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="lg:w-72 h-48 lg:h-auto relative overflow-hidden">
                  <img
                    src={booking.package?.images}
                    alt={booking.package?.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-transparent to-black/40" />
                  
                  {/* Confirmed Badge */}
                  <div className="absolute top-4 left-4 px-3 py-2 rounded-full bg-green-500 backdrop-blur-md border border-white/20 shadow-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-medium">Confirmed</span>
                    </div>
                  </div>

                  {/* Countdown */}
                  {daysLeft > 0 && (
                    <div className="absolute top-4 right-4 px-3 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/20">
                      <div className="text-center">
                        <div className="text-white text-lg font-bold">{daysLeft}</div>
                        <div className="text-white text-xs">days left</div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleShare(booking)}
                        className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 border border-white/20"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6">
                  <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors line-clamp-2">
                          {booking.package?.name}
                        </h3>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-green-500" />
                        <span className="text-sm">{booking.package?.meetingPoint}</span>
                      </div>

                      {/* Trip Details Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <div>
                            <p className="text-gray-500 text-xs">Travel Date</p>
                            <p className="font-medium text-gray-800">{new Date(booking.package?.startDate + "").toLocaleDateString('en-US', { month: 'short', day: 'numeric' ,year : 'numeric'})}</p>
                          </div>
                        </div>
                        

                        {booking.package?.duration && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <div>
                              <p className="text-gray-500 text-xs">Duration</p>
                              <p className="font-medium text-gray-800">{booking.package.duration.days}D/{booking.package.duration.nights}N</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Confirmation Details */}
                    {booking.fullPayment?.dueDate && (
                      <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-800">Confirmed on {formatDate(booking.fullPayment?.dueDate + "")}</span>
                        </div>
                        <p className="text-xs text-green-700">All arrangements have been finalized and confirmed by our travel partners.</p>
                      </div>
                    )}

                    {/* Booking Info Section */}
                    <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6">
                      {/* Left Section - QR and ID */}
                      <div className="lg:min-w-48">
                        <div className="bg-gradient-to-br from-gray-50 to-green-50/30 rounded-2xl p-4 border border-green-100">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-200 to-green-100 rounded-xl flex items-center justify-center shadow-inner">
                              <QrCode className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">Booking ID</p>
                              <p className="font-mono text-sm font-bold text-gray-800">{booking.bookingId}</p>
                            </div>
                          </div>
                          
                          {/* Price Section */}
                          <div className="border-t border-green-100 pt-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Total Amount</span>
                              <div className="flex items-center text-lg font-bold text-green-600">
                                <IndianRupee className="w-4 h-4" />
                                <span>{booking.package?.price}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-green-600">✓ Payment Confirmed</span>
                              <CreditCard className="w-3 h-3 text-green-600" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Actions */}
                      <div className="flex-1 flex flex-col justify-end">
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                          <button 
                            onClick={() => handleViewDetails(booking.id,booking.package?.packageId?.packageId!)}
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          
                          <button 
                            onClick={() => handleCancelBooking(booking)}
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
                          >
                            <XCircle className="w-4 h-4" />
                            Cancel Booking
                          </button>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                          <span>Booking Date: {formatDate(booking.createdAt+ "")}</span>
                          <span className="flex items-center gap-1">
                            <MapIcon className="w-3 h-3" />
                            Get Directions
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t border-gray-200"
                      >
                       
                           <div>
                          {/* Itinerary */}
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-green-500" />
                              Trip Itinerary
                            </h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between py-2 px-3 bg-white/50 rounded-lg">
                                <span className="text-sm text-gray-600">Full Travel Date:</span>
                                <span className="text-sm font-medium text-gray-800">{formatDate(booking.package?.startDate + "")}</span>
                              </div>

                              {booking.package?.duration && (
                                <div className="flex items-center justify-between py-2 px-3 bg-white/50 rounded-lg">
                                  <span className="text-sm text-gray-600">Trip Duration:</span>
                                  <span className="text-sm font-medium text-gray-800">{booking.package.duration.days}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Important Notes */}
                          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                              <Shield className="w-4 h-4 text-amber-500" />
                              Important Notes
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-700">
                              <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                                Please arrive at the meeting point 30 minutes before departure time
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                                Carry a valid photo ID and booking confirmation
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                                Weather conditions may affect the itinerary
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                                24/7 customer support available for any assistance
                              </li>
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Footer */}
      {filteredBookings.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 lg:p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">All Set for Your Adventures!</h3>
                <p className="text-sm text-green-700">
                  {filteredBookings.length} confirmed booking{filteredBookings.length !== 1 ? 's' : ''} • Total value: ₹{filteredBookings.reduce((sum, booking) => sum + 1, 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Ready to explore!</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Cancellation Modal */}
      <CancellationModal
        isOpen={isCancellationModalOpen}
        onClose={handleCloseCancellationModal}
        onConfirm={handleConfirmCancellation}
        bookingDetails={selectedBooking ? {
          bookingId: selectedBooking.bookingId,
          date: formatDate(selectedBooking.package?.startDate + ""),
          amount: `₹${selectedBooking.package?.price}`
        } : undefined}
      />
    </div>
  );
};

export default ConfirmedBookings;