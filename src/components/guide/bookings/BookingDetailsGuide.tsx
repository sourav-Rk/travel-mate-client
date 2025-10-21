"use client";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BookingHeader } from "@/components/vendor/booking/bookingDetails/BookingHeader";
import { PaymentSummary } from "@/components/vendor/booking/bookingDetails/PaymentSummary";
import { PaymentInformation } from "@/components/vendor/booking/bookingDetails/PaymentInformation";
import { BookingInformation } from "@/components/vendor/booking/bookingDetails/BookingInformation";
import { useGetBookingDetailsGuide } from "@/hooks/guide/useGuideBookings";

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
        <h2
        onClick={handleChat}
        >message</h2>
        <div className="space-y-6">
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