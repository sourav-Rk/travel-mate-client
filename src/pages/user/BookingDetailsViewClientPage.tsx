import { useGetBookingDetailsClient } from "@/hooks/client/useBooking";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import BookingDetailsView, {
  type PackageDetails,
} from "@/components/client/Bookings/bookingDetails/BookingDetailsView";
import { useGetPackageDetailsQuery } from "@/hooks/client/useClientPackage";

interface Payment {
  amount: number;
  dueDate: Date | string | null;
  paid: boolean;
  paidAt?: string | Date | null;
}

interface BookingDetails {
  _id: string;
  bookingId ?: string;
  packageId: string;
  userId: string;
  isWaitlisted: boolean;
  status: string;
  advancePayment: Payment | null;
  fullPayment: Payment | null;
}

export default function BookingDetailsViewClientPage() {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>();
  const [packageDetails, setPackageDetails] = useState<PackageDetails>();
  const params = useParams();
  const bookingId =
    (params as any)?.bookingId ??
    (params as any)?.id ??
    (params as any)?.booking_id ??
    "";

    const packageId =   (params as any)?.packageId ??
    "";

  const { data } = useGetBookingDetailsClient(bookingId);
  const { data: packageData } = useGetPackageDetailsQuery(packageId);

  useEffect(() => {
    if (!data || !packageData) return;
    setBookingDetails({
      _id: data.bookingDetails._id!,
      bookingId : data.bookingDetails.bookingId!,
      packageId: data.bookingDetails.packageId,
      userId: data.bookingDetails.userId._id,
      status: data.bookingDetails.status,
      isWaitlisted: data.bookingDetails.isWaitlisted!,
      advancePayment : data.bookingDetails.advancePayment ?? null,
      fullPayment : data.bookingDetails.fullPayment ?? null
    });

    setPackageDetails(packageData.packages);
  }, [data, bookingId, packageData]);

return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/50">
      {/* Main Content Container - Responsive with sidebar spacing */}
      <div className="md:ml-80 transition-all duration-300">
        {/* Mobile top spacing for hamburger menu */}
        <div className="md:hidden h-16"></div>
        
        
          {/* Content Wrapper with proper padding */}
          <div className="px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mb-6"
            >
              <div className="flex items-center space-x-2 text-sm text-slate-500 mb-2">
                <span>Home</span>
                <span>/</span>
                <span>Bookings</span>
                <span>/</span>
                <span className="text-[#2CA4BC] font-medium">Details</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                Booking Details
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-[#2CA4BC] to-[#238A9F] rounded-full"></div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden"
            >
              {bookingDetails && packageDetails ? (
                <div className="relative">
                  {/* Decorative top border */}
                  <div className="h-1 bg-gradient-to-r from-[#2CA4BC] via-blue-400 to-[#238A9F]"></div>
                  
                  {/* Content */}
                  <div className="p-6 md:p-8">
                    <BookingDetailsView
                      bookingDetails={bookingDetails}
                      packages={packageDetails}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-12 md:p-16">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse" }}
                    className="flex flex-col items-center justify-center text-center"
                  >
                    {/* Loading Animation */}
                    <div className="relative mb-6">
                      <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#2CA4BC] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">
                      Loading booking details...
                    </h3>
                    <p className="text-slate-500 max-w-md">
                      Please wait while we fetch your booking information. This should only take a moment.
                    </p>
                  </motion.div>
                </div>
              )}
            </motion.div>

            {/* Footer Spacing */}
            <div className="h-8"></div>
          </div>
        </div>
      </div>
  );
}
