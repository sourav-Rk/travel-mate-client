import { Calendar, Clock, MapPin, User } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";
import type { LocalGuideBooking } from "@/types/local-guide-booking";
import { formatLocalDate, formatLocalTime } from "@/utils/dateUtils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface GuideLocalGuideBookingCardProps {
  booking: LocalGuideBooking;
}

const STATUS_CONFIG: Record<
  LocalGuideBooking["status"],
  { label: string; className: string }
> = {
  QUOTE_ACCEPTED: { label: "Quote Accepted", className: "bg-amber-50 text-amber-600 border-amber-200" },
  ADVANCE_PENDING: { label: "Advance Pending", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  CONFIRMED: { label: "Confirmed", className: "bg-green-50 text-green-700 border-green-200" },
  IN_PROGRESS: { label: "In Progress", className: "bg-blue-50 text-blue-700 border-blue-200" },
  COMPLETED: { label: "Completed", className: "bg-slate-100 text-slate-700 border-slate-300" },
  FULLY_PAID: { label: "Fully Paid", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  CANCELLED: { label: "Cancelled", className: "bg-rose-50 text-rose-600 border-rose-200" },
};

export function GuideLocalGuideBookingCard({ booking }: GuideLocalGuideBookingCardProps) {
  const navigate = useNavigate();
  const formattedDate = formatLocalDate(booking.sessionDate);
  const formattedTime = formatLocalTime(booking.sessionDate);
  const travellerLabel =
    booking.travellerName ||
    "Traveller";

  const paymentSummary = useMemo(() => {
    if (booking.fullPayment.paid) {
      return { label: "Fully Paid", className: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    }
    if (booking.advancePayment.paid && booking.status === "COMPLETED") {
      return { label: "Full Payment Due", className: "bg-blue-50 text-blue-700 border-blue-200" };
    }
    if (booking.advancePayment.paid) {
      return { label: "Advance Paid", className: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    }
    const isAdvanceOverdue =
      booking.advancePayment.dueDate &&
      new Date(booking.advancePayment.dueDate) < new Date();
    return {
      label: isAdvanceOverdue ? "Advance Overdue" : "Advance Pending",
      className: isAdvanceOverdue
        ? "bg-rose-50 text-rose-600 border-rose-200"
        : "bg-amber-50 text-amber-700 border-amber-200",
    };
  }, [booking]);

  const statusBadge = STATUS_CONFIG[booking.status];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-14 w-14 rounded-full border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden">
              {booking.travellerProfileImage ? (
                <img
                  src={booking.travellerProfileImage}
                  alt={travellerLabel}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-blue-700" />
              )}
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-500">Traveller</p>
            <p className="text-base font-semibold text-slate-900">
              {travellerLabel}
            </p>
            <button
              onClick={() => navigate(`/pvt/local-guide/bookings/${booking.bookingId}`)}
              className="text-xs text-[#2CA4BC] hover:text-[#238A9F] hover:underline text-left"
            >
              Booking ID: {booking.bookingId}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Badge variant="outline" className={cn(statusBadge.className, "border shadow-sm")}>
            {statusBadge.label}
          </Badge>
          <Badge variant="outline" className={cn(paymentSummary.className, "border shadow-sm")}>
            {paymentSummary.label}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/pvt/local-guide/bookings/${booking.bookingId}`)}
            className="mt-2 text-xs"
          >
            View Details
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span>{formattedDate}</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <Clock className="h-4 w-4 text-blue-600" />
            <span>{formattedTime} • {booking.hours} hr{booking.hours !== 1 ? "s" : ""}</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span>
              {booking.location?.city || booking.location?.state || booking.location?.country || "Location TBD"}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <span>Total:</span>
            <span>₹{booking.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-100 bg-white/60 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Advance Payment (30%)
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            ₹{booking.advancePayment.amount.toFixed(2)}
          </p>
          <p
            className={cn(
              "text-xs",
              booking.advancePayment.paid
                ? "text-green-600"
                : new Date(booking.advancePayment.dueDate) < new Date()
                ? "text-rose-600 font-medium"
                : "text-slate-500"
            )}
          >
            {booking.advancePayment.paid
              ? `Paid on ${booking.advancePayment.paidAt ? formatLocalDate(booking.advancePayment.paidAt) : ""}`
              : `Due ${formatLocalDate(booking.advancePayment.dueDate)}`}
          </p>
        </div>

        <div className="rounded-lg border border-slate-100 bg-white/60 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Remaining Amount
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            ₹{booking.fullPayment.amount.toFixed(2)}
          </p>
          <p
            className={cn(
              "text-xs",
              booking.fullPayment.paid
                ? "text-green-600"
                : booking.status === "COMPLETED"
                ? "text-blue-600 font-medium"
                : "text-slate-500"
            )}
          >
            {booking.fullPayment.paid
              ? `Paid on ${booking.fullPayment.paidAt ? formatLocalDate(booking.fullPayment.paidAt) : ""}`
              : booking.status === "COMPLETED"
              ? "Ready for final payment"
              : "Not due yet"}
          </p>
        </div>
      </div>
    </div>
  );
}

