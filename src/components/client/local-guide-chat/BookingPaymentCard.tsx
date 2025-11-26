import { CreditCard, Calendar, Clock, DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LocalGuideBooking } from "@/types/local-guide-booking";
import { usePayAdvanceAmount, usePayFullAmount } from "@/hooks/local-guide-booking/useLocalGuideBooking";
import { formatLocalDate, formatLocalTime } from "@/utils/dateUtils";
import { MarkServiceCompleteButton } from "@/components/client/local-guide-bookings/MarkServiceCompleteButton";

interface BookingPaymentCardProps {
  booking: LocalGuideBooking;
  isTraveller: boolean;
}

export function BookingPaymentCard({ booking, isTraveller }: BookingPaymentCardProps) {
  const { mutateAsync: payAdvance, isPending: isPayingAdvance } = usePayAdvanceAmount();
  const { mutateAsync: payFull, isPending: isPayingFull } = usePayFullAmount();

  const handlePayAdvance = async () => {
    if (!booking.advancePayment.paid && booking.advancePayment.amount > 0) {
      await payAdvance({
        bookingId: booking.bookingId,
        amount: booking.advancePayment.amount,
      });
    }
  };

  const handlePayFull = async () => {
    if (!booking.fullPayment.paid && booking.fullPayment.amount > 0) {
      await payFull({
        bookingId: booking.bookingId,
        amount: booking.fullPayment.amount,
      });
    }
  };

  // Only show payment card to traveller
  if (!isTraveller) {
    return null;
  }
  
  const formattedDate = formatLocalDate(booking.sessionDate);
  const formattedTime = formatLocalTime(booking.sessionDate);

  const showAdvanceButton =
    !booking.advancePayment.paid &&
    booking.status !== "CANCELLED" &&
    (booking.status === "QUOTE_ACCEPTED" || booking.status === "ADVANCE_PENDING" || booking.status === "CONFIRMED");

  const showFullButton =
    booking.advancePayment.paid &&
    !booking.fullPayment.paid &&
    booking.status === "COMPLETED";

  const isAdvanceOverdue =
    !booking.advancePayment.paid &&
    booking.advancePayment.dueDate &&
    new Date(booking.advancePayment.dueDate) < new Date();

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-4 mb-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#8C6A3B]" />
          <h3 className="font-semibold text-slate-900">Booking Payment</h3>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
          {booking.bookingId}
        </span>
      </div>

      {/* Session Info */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar className="w-4 h-4" />
          <span>
            {formattedDate} at {formattedTime}
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="w-4 h-4" />
          <span>{booking.hours} hour{booking.hours !== 1 ? "s" : ""}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <DollarSign className="w-4 h-4" />
          <span className="font-semibold text-slate-900">
            Total: ₹{booking.totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Payment Status */}
      <div className="space-y-3 mb-4">
        {/* Advance Payment */}
        <div
          className={cn(
            "p-3 rounded-lg border",
            booking.advancePayment.paid
              ? "bg-green-50 border-green-200"
              : isAdvanceOverdue
              ? "bg-red-50 border-red-200"
              : "bg-amber-50 border-amber-200"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {booking.advancePayment.paid ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600" />
              )}
              <span className="text-sm font-medium text-slate-900">
                Advance Payment (30%)
              </span>
            </div>
            <span
              className={cn(
                "text-sm font-semibold",
                booking.advancePayment.paid ? "text-green-700" : "text-amber-700"
              )}
            >
              ₹{booking.advancePayment.amount.toFixed(2)}
            </span>
          </div>
          {booking.advancePayment.paid && booking.advancePayment.paidAt && (
            <p className="text-xs text-slate-600">
              Paid on {new Date(booking.advancePayment.paidAt).toLocaleDateString()}
            </p>
          )}
          {!booking.advancePayment.paid && booking.advancePayment.dueDate && (
            <p
              className={cn(
                "text-xs",
                isAdvanceOverdue ? "text-red-600 font-medium" : "text-slate-600"
              )}
            >
              Due: {new Date(booking.advancePayment.dueDate).toLocaleDateString()}
              {isAdvanceOverdue && " (Overdue)"}
            </p>
          )}
        </div>

        {/* Full Payment */}
        {booking.advancePayment.paid && (
          <div
            className={cn(
              "p-3 rounded-lg border",
              booking.fullPayment.paid
                ? "bg-green-50 border-green-200"
                : booking.status === "COMPLETED"
                ? "bg-blue-50 border-blue-200"
                : "bg-slate-50 border-slate-200"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {booking.fullPayment.paid ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                )}
                <span className="text-sm font-medium text-slate-900">
                  Full Payment (70%)
                </span>
              </div>
              <span
                className={cn(
                  "text-sm font-semibold",
                  booking.fullPayment.paid ? "text-green-700" : "text-blue-700"
                )}
              >
                ₹{booking.fullPayment.amount.toFixed(2)}
              </span>
            </div>
            {booking.fullPayment.paid && booking.fullPayment.paidAt && (
              <p className="text-xs text-slate-600">
                Paid on {new Date(booking.fullPayment.paidAt).toLocaleDateString()}
              </p>
            )}
            {!booking.fullPayment.paid && booking.status === "COMPLETED" && (
              <p className="text-xs text-blue-600 font-medium">
                Service completed - Payment due
              </p>
            )}
          </div>
        )}
      </div>

      {/* Payment Buttons */}
      <div className="flex gap-2">
        {showAdvanceButton && (
          <button
            onClick={handlePayAdvance}
            disabled={isPayingAdvance || isPayingFull}
            className={cn(
              "flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors",
              isAdvanceOverdue
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gradient-to-br from-[#C49A6C] to-[#8C6A3B] hover:from-[#b08256] hover:to-[#7a5a2b] text-white",
              (isPayingAdvance || isPayingFull) && "opacity-50 cursor-not-allowed"
            )}
          >
            {isPayingAdvance ? "Processing..." : "Pay Advance"}
          </button>
        )}
        {showFullButton && (
          <button
            onClick={handlePayFull}
            disabled={isPayingAdvance || isPayingFull}
            className={cn(
              "flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors",
              "bg-gradient-to-br from-[#C49A6C] to-[#8C6A3B] hover:from-[#b08256] hover:to-[#7a5a2b] text-white",
              (isPayingAdvance || isPayingFull) && "opacity-50 cursor-not-allowed"
            )}
          >
            {isPayingFull ? "Processing..." : "Pay Full Amount"}
          </button>
        )}
      </div>

      {/* Mark Service Complete Button - Only for traveller */}
      {isTraveller && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <MarkServiceCompleteButton
            bookingId={booking.bookingId}
            bookingStatus={booking.status}
            advancePaymentPaid={booking.advancePayment.paid}
          />
        </div>
      )}
    </div>
  );
}



