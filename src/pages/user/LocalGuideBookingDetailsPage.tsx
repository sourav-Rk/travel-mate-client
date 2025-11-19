import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  CreditCard,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Star,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LoaderFive } from "@/components/ui/loader";
import { useLocalGuideBookingDetails } from "@/hooks/local-guide-booking/useLocalGuideBooking";
import { usePayAdvanceAmount, usePayFullAmount } from "@/hooks/local-guide-booking/useLocalGuideBooking";
import { MarkServiceCompleteButton } from "@/components/client/local-guide-bookings/MarkServiceCompleteButton";
import { formatLocalDate, formatLocalTime } from "@/utils/dateUtils";
import { cn } from "@/lib/utils";
import type { LocalGuideBookingStatus } from "@/types/local-guide-booking";
import { useClientAuth } from "@/hooks/auth/useAuth";

const STATUS_CONFIG: Record<
  LocalGuideBookingStatus,
  { label: string; className: string; icon: typeof CheckCircle }
> = {
  QUOTE_ACCEPTED: {
    label: "Quote Accepted",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    icon: CheckCircle,
  },
  ADVANCE_PENDING: {
    label: "Advance Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: AlertCircle,
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: Clock,
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-teal-50 text-teal-700 border-teal-200",
    icon: CheckCircle,
  },
  FULLY_PAID: {
    label: "Fully Paid",
    className: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: AlertCircle,
  },
};

export default function LocalGuideBookingDetailsPage() {
  const {clientInfo}= useClientAuth()
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { data: booking, isLoading, isError, error } = useLocalGuideBookingDetails(bookingId);
  const { mutateAsync: payAdvance, isPending: isPayingAdvance } = usePayAdvanceAmount();
  const { mutateAsync: payFull, isPending: isPayingFull } = usePayFullAmount();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoaderFive text="Loading booking details..." />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="space-y-8">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Booking Not Found</h2>
          <p className="text-slate-600 mb-6">
            {error instanceof Error ? error.message : "Unable to load booking details"}
          </p>
          <Button onClick={() => navigate("/pvt/local-guide/bookings")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Button>
        </Card>
      </div>
    );
  }

  const statusBadge = STATUS_CONFIG[booking.status];
  const StatusIcon = statusBadge.icon;

  const isAdvanceOverdue =
    !booking.advancePayment.paid &&
    booking.advancePayment.dueDate &&
    new Date(booking.advancePayment.dueDate) < new Date();

  const showAdvanceButton =
    !booking.advancePayment.paid &&
    booking.status !== "CANCELLED" &&
    ["QUOTE_ACCEPTED", "ADVANCE_PENDING", "CONFIRMED"].includes(booking.status) && booking.travellerId === clientInfo.id;

  const showFullButton =
    booking.advancePayment.paid &&
    !booking.fullPayment.paid &&
    booking.status === "COMPLETED" && booking.travellerId === clientInfo.id;

  const handleAdvancePayment = async () => {
    await payAdvance({
      bookingId: booking.bookingId,
      amount: booking.advancePayment.amount,
    });
  };

  const handleFullPayment = async () => {
    await payFull({
      bookingId: booking.bookingId,
      amount: booking.fullPayment.amount,
    });
  };

  const handleOpenChat = () => {
    navigate("/volunteering/guide-chat", {
      state: {
        guideChatRoomId: booking.guideChatRoomId,
        guideId: booking.guideId,
        guideProfileId: booking.guideProfileId,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm"
      >
        <Button
          variant="ghost"
          onClick={() => navigate("/pvt/local-guide/bookings")}
          className="mb-2 hover:bg-slate-100 -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bookings
        </Button>

        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <span>Home</span>
          <span>/</span>
          <span>Local Guide Bookings</span>
          <span>/</span>
          <span className="text-[#2CA4BC] font-medium">Details</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
              Booking Details
            </p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
              {booking.bookingId}
            </h1>
          </div>
          <Badge
            variant="outline"
            className={cn(
              statusBadge.className,
              "border shadow-sm px-4 py-2 text-sm font-semibold flex items-center gap-2"
            )}
          >
            <StatusIcon className="h-4 w-4" />
            {statusBadge.label}
          </Badge>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="p-6 shadow-lg border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#2CA4BC]" />
                Booking Information
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Booking ID</p>
                    <p className="text-base font-semibold text-slate-900 font-mono">
                      {booking.bookingId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Session Date</p>
                    <p className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#2CA4BC]" />
                      {formatLocalDate(booking.sessionDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Session Time</p>
                    <p className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#2CA4BC]" />
                      {formatLocalTime(booking.sessionDate)} ({booking.hours} hour{booking.hours !== 1 ? "s" : ""})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Total Amount</p>
                    <p className="text-base font-semibold text-slate-900">
                      ₹{booking.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {booking.location && (
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-500 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Meeting Location
                    </p>
                    <div className="bg-slate-50 rounded-lg p-3">
                      {booking.location.address && (
                        <p className="text-sm font-medium text-slate-900">{booking.location.address}</p>
                      )}
                      {(booking.location.city || booking.location.state || booking.location.country) && (
                        <p className="text-sm text-slate-600">
                          {[booking.location.city, booking.location.state, booking.location.country]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {booking.notes && (
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-500 mb-2">Additional Notes</p>
                    <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3">{booking.notes}</p>
                  </div>
                )}

                {booking.completionNotes && (
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-500 mb-2 flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Completion Feedback
                    </p>
                    <div className="bg-emerald-50 rounded-lg p-3">
                      {booking.completionRating && (
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "h-4 w-4",
                                booking.completionRating && booking.completionRating >= star
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-300"
                              )}
                            />
                          ))}
                          <span className="ml-2 text-sm font-medium text-slate-700">
                            {booking.completionRating}/5
                          </span>
                        </div>
                      )}
                      {booking.completionNotes && (
                        <p className="text-sm text-slate-700">{booking.completionNotes}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
        </motion.div>

        {/* Payment Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="p-6 shadow-lg border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#2CA4BC]" />
              Payment Details
            </h2>

            <div className="space-y-4">
              {/* Advance Payment */}
              <div
                className={cn(
                  "p-4 rounded-xl border-2 transition-all",
                  booking.advancePayment.paid
                    ? "bg-emerald-50 border-emerald-200"
                    : isAdvanceOverdue
                    ? "bg-rose-50 border-rose-200"
                    : "bg-amber-50 border-amber-200"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {booking.advancePayment.paid ? (
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                    )}
                    <span className="font-semibold text-slate-900">Advance Payment (30%)</span>
                  </div>
                  <span
                    className={cn(
                      "text-lg font-bold",
                      booking.advancePayment.paid ? "text-emerald-700" : "text-amber-700"
                    )}
                  >
                    ₹{booking.advancePayment.amount.toFixed(2)}
                  </span>
                </div>
                {booking.advancePayment.paid && booking.advancePayment.paidAt && (
                  <p className="text-xs text-slate-600">
                    Paid on {formatLocalDate(booking.advancePayment.paidAt)}
                  </p>
                )}
                {!booking.advancePayment.paid && booking.advancePayment.dueDate && (
                  <p
                    className={cn(
                      "text-xs font-medium",
                      isAdvanceOverdue ? "text-rose-600" : "text-slate-600"
                    )}
                  >
                    Due: {formatLocalDate(booking.advancePayment.dueDate)}
                    {isAdvanceOverdue && " (Overdue)"}
                  </p>
                )}
              </div>

              {/* Full Payment */}
              {booking.advancePayment.paid && (
                <div
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all",
                    booking.fullPayment.paid
                      ? "bg-emerald-50 border-emerald-200"
                      : booking.status === "COMPLETED"
                      ? "bg-blue-50 border-blue-200"
                      : "bg-slate-50 border-slate-200"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {booking.fullPayment.paid ? (
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-blue-600" />
                      )}
                      <span className="font-semibold text-slate-900">Full Payment (70%)</span>
                    </div>
                    <span
                      className={cn(
                        "text-lg font-bold",
                        booking.fullPayment.paid ? "text-emerald-700" : "text-blue-700"
                      )}
                    >
                      ₹{booking.fullPayment.amount.toFixed(2)}
                    </span>
                  </div>
                  {booking.fullPayment.paid && booking.fullPayment.paidAt && (
                    <p className="text-xs text-slate-600">
                      Paid on {formatLocalDate(booking.fullPayment.paidAt)}
                    </p>
                  )}
                  {!booking.fullPayment.paid && booking.fullPayment.dueDate && (
                    <p className="text-xs text-blue-600 font-medium">
                      Due: {formatLocalDate(booking.fullPayment.dueDate)}
                    </p>
                  )}
                  {!booking.fullPayment.paid && booking.status === "COMPLETED" && (
                    <p className="text-xs text-blue-600 font-medium mt-1">
                      Service completed - Payment due
                    </p>
                  )}
                </div>
              )}

              {/* Payment Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {showAdvanceButton && (
                  <Button
                    onClick={handleAdvancePayment}
                    disabled={isPayingAdvance || isPayingFull}
                    className={cn(
                      "flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md",
                      isAdvanceOverdue && "!from-rose-500 !to-rose-600",
                      (isPayingAdvance || isPayingFull) && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    {isPayingAdvance ? "Processing..." : "Pay Advance"}
                  </Button>
                )}
                {showFullButton && (
                  <Button
                    onClick={handleFullPayment}
                    disabled={isPayingAdvance || isPayingFull}
                    className={cn(
                      "flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md",
                      (isPayingAdvance || isPayingFull) && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    {isPayingFull ? "Processing..." : "Pay Full Amount"}
                  </Button>
                )}
              </div>
            </div>
          </Card>
    </motion.div>

        {/* Service Completion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="p-6 shadow-lg border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-[#2CA4BC]" />
              Service Completion
            </h2>
            {booking.serviceCompletedAt ? (
              <div className="space-y-2">
                <p className="text-sm text-slate-500">Completed on</p>
                <p className="text-base font-semibold text-slate-900">
                  {formatLocalDate(booking.serviceCompletedAt)}
                </p>
                {booking.completionRating && (
                  <div className="flex items-center gap-1 mt-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "h-5 w-5",
                          booking.completionRating && booking.completionRating >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        )}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium text-slate-700">
                      {booking.completionRating}/5
                    </span>
                  </div>
                )}
              </div>
            ) : booking.travellerId === clientInfo.id && (
              <MarkServiceCompleteButton
                bookingId={booking.bookingId}
                bookingStatus={booking.status}
                advancePaymentPaid={booking.advancePayment.paid}
              />
            )}
          </Card>
        </motion.div>
      </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Guide/Traveller Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="p-6 shadow-lg border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-[#2CA4BC]" />
                Guide Information
              </h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-2 border-slate-200 bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center overflow-hidden">
                    {booking.guideProfileImage ? (
                      <img
                        src={booking.guideProfileImage}
                        alt={booking.guideName || "Guide"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-amber-700" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-slate-900">
                    {booking.guideName || "Local Guide"}
                  </p>
                  <p className="text-sm text-slate-500">Hourly Rate: ₹{booking.hourlyRate.toFixed(2)}</p>
                </div>
              </div>
              <Button
                onClick={handleOpenChat}
                variant="outline"
                className="w-full mt-4 hover:bg-slate-50"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Open Chat
              </Button>
            </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="p-6 shadow-lg border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button
                onClick={handleOpenChat}
                variant="outline"
                className="w-full justify-start hover:bg-slate-50"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                View Chat
              </Button>
              <Button
                onClick={() => navigate("/pvt/local-guide/bookings")}
                variant="outline"
                className="w-full justify-start hover:bg-slate-50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Bookings
              </Button>
            </div>
          </Card>
    </motion.div>

    {/* Booking Timeline */}
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card className="p-6 shadow-lg border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Timeline</h2>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
              <div className="w-0.5 h-full bg-slate-200 mt-1"></div>
            </div>
            <div className="flex-1 pb-4">
              <p className="text-sm font-medium text-slate-900">Booking Created</p>
              <p className="text-xs text-slate-500">{formatLocalDate(booking.createdAt)}</p>
            </div>
          </div>
          {booking.advancePayment.paidAt && (
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                <div className="w-0.5 h-full bg-slate-200 mt-1"></div>
              </div>
              <div className="flex-1 pb-4">
                <p className="text-sm font-medium text-slate-900">Advance Paid</p>
                <p className="text-xs text-slate-500">
                  {formatLocalDate(booking.advancePayment.paidAt)}
                </p>
              </div>
            </div>
          )}
          {booking.serviceCompletedAt && (
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-teal-500"></div>
                <div className="w-0.5 h-full bg-slate-200 mt-1"></div>
              </div>
              <div className="flex-1 pb-4">
                <p className="text-sm font-medium text-slate-900">Service Completed</p>
                <p className="text-xs text-slate-500">
                  {formatLocalDate(booking.serviceCompletedAt)}
                </p>
              </div>
            </div>
          )}
          {booking.fullPayment.paidAt && (
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Fully Paid</p>
                <p className="text-xs text-slate-500">
                  {formatLocalDate(booking.fullPayment.paidAt)}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
    </div>
    </div>
  </div>
);
}

