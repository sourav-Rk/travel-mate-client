"use client";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BookingHeader } from "@/components/vendor/booking/bookingDetails/BookingHeader";
import { PaymentSummary } from "@/components/vendor/booking/bookingDetails/PaymentSummary";
import { PaymentInformation } from "@/components/vendor/booking/bookingDetails/PaymentInformation";
import { BookingInformation } from "@/components/vendor/booking/bookingDetails/BookingInformation";
import { useGetBookingDetailsGuide } from "@/hooks/guide/useGuideBookings";
import { MessageCircle } from "lucide-react";

function LoadingCard() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="animate-pulse space-y-6">
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function GuideBookingDetails() {
  const navigate = useNavigate();
  const params = useParams();
  const bookingIdentifier =
    (params as any)?.bookingId ??
    (params as any)?.id ??
    (params as any)?.booking_id ??
    "";

  const hasId = Boolean(bookingIdentifier);

  const {
    data: booking,
    error,
    isLoading,
  } = useGetBookingDetailsGuide(bookingIdentifier);

  const handleChat = () =>{
      navigate(`/guide/chat/${user._id}/${booking?.bookingDetails.bookingId}`)
  }

  if (!hasId) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="p-6 bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-100">
                Missing Booking ID
              </h3>
              <p className="text-rose-700 dark:text-rose-300 mt-1">
                No booking ID found in URL
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-rose-100 text-rose-700 border-rose-200"
            >
              Error
            </Badge>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingCard />;
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="p-6 bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-100">
                Error Loading Booking
              </h3>
              <p className="text-rose-700 dark:text-rose-300 mt-1">
                {(error as Error)?.message ??
                  "Something went wrong while fetching the booking."}
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-rose-100 text-rose-700 border-rose-200"
            >
              Error
            </Badge>
          </div>
        </Card>
      </div>
    );
  }

  if (!booking) {
    return <LoadingCard />;
  }

  const currency = "INR";
  const {
    user,
    packageId,
    status,
    advancePayment,
    fullPayment,
    isWaitlisted,
    appliedAt,
    cancelledAt,
    bookingId,
  } = booking.bookingDetails || {};

  const advanceAmount = advancePayment?.amount || 0;
  const fullAmount = fullPayment?.amount || 0;
  const totalAmount = advanceAmount + fullAmount;

  const advancePaid = advancePayment?.paid ? advanceAmount : 0;
  const fullPaid = fullPayment?.paid ? fullAmount : 0;
  const paidAmount = advancePaid + fullPaid;
  const pendingAmount = totalAmount - paidAmount;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                Booking Details
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                View and manage your booking information
              </p>
            </div>
            
            {/* Modern Message Button */}
            <button
              onClick={handleChat}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
            >
              {/* Animated background shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* Button content */}
              <MessageCircle className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative z-10 text-sm sm:text-base">Message User</span>
              
              {/* Pulse effect on hover */}
              <span className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 group-hover:animate-ping"></span>
            </button>
          </div>
          <BookingHeader
            bookingId={bookingId!}
            status={status || "Unknown"}
            appliedAt={appliedAt}
          />

          <PaymentSummary
            totalAmount={totalAmount}
            paidAmount={paidAmount}
            pendingAmount={pendingAmount}
            packageId={packageId || ""}
            currency={currency}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PaymentInformation
              advancePayment={advancePayment!}
              fullPayment={fullPayment!}
              currency={currency}
            />

            <BookingInformation
              user={user._id || ""}
              name={`${user.firstName} ${user.lastName}`.toUpperCase()}
              email={user.email}
              phone={user.phone}
              gender={user.gender}
              bookingStatus={status || "Unknown"}
              waitlistStatus={!!isWaitlisted}
              appliedAt={appliedAt}
              cancelledAt={cancelledAt}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuideBookingDetails;