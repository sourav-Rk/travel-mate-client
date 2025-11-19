import { useState, useEffect } from "react";
import { Calendar, Clock, DollarSign, MapPin, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuoteMessagePayload, QuoteStatus } from "@/types/local-guide-booking";
import { formatLocalDate, formatLocalTime, getTimeRemaining, isPast } from "@/utils/dateUtils";
import ConfirmationModal from "@/components/modals/ConfirmationModal";

interface QuoteMessageBubbleProps {
  quote: QuoteMessagePayload;
  isOwn: boolean;
  onAccept?: (quoteId: string) => void | Promise<void>;
  onDecline?: (quoteId: string) => void | Promise<void>;
  isTraveller?: boolean;
}

const getStatusColor = (status: QuoteStatus): string => {
  switch (status) {
    case "pending":
      return "text-yellow-600 bg-yellow-50";
    case "accepted":
      return "text-green-600 bg-green-50";
    case "declined":
      return "text-red-600 bg-red-50";
    case "expired":
      return "text-gray-600 bg-gray-50";
    default:
      return "text-slate-600 bg-slate-50";
  }
};

const getStatusIcon = (status: QuoteStatus) => {
  switch (status) {
    case "accepted":
      return <CheckCircle className="w-4 h-4" />;
    case "declined":
      return <XCircle className="w-4 h-4" />;
    case "expired":
      return <AlertCircle className="w-4 h-4" />;
    default:
      return null;
  }
};

export function QuoteMessageBubble({
  quote,
  isOwn,
  onAccept,
  onDecline,
  isTraveller = false,
}: QuoteMessageBubbleProps) {
  // Check expiration status
  const [isExpired, setIsExpired] = useState(isPast(quote.expiresAt));
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(quote.expiresAt));
  
  // Confirmation modal states
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Prevent modal from closing during processing
  const handleCloseAccept = () => {
    if (!isProcessing) {
      setShowAcceptModal(false);
    }
  };
  
  const handleCloseDecline = () => {
    if (!isProcessing) {
      setShowDeclineModal(false);
    }
  };

  // Update expiration status and countdown every second
  useEffect(() => {
    if (isExpired || quote.status !== "pending") {
      return;
    }

    const interval = setInterval(() => {
      const remaining = getTimeRemaining(quote.expiresAt);
      setTimeRemaining(remaining);
      setIsExpired(remaining.isExpired);
    }, 1000);

    return () => clearInterval(interval);
  }, [quote.expiresAt, quote.status, isExpired]);

  // Format session date and time from UTC to local
  const formattedDate = formatLocalDate(quote.sessionDate);
  const formattedTime = formatLocalTime(quote.sessionDate);

  // Determine final status
  const status: QuoteStatus = isExpired ? "expired" : quote.status;

      return (
        <div
          className={cn("flex w-full mb-3", isOwn ? "justify-end" : "justify-start")}
          data-quote-id={quote.quoteId}
        >
          <div
            className={cn(
              "max-w-[85%] sm:max-w-[75%] rounded-2xl shadow-sm overflow-hidden transition-all",
              isOwn
                ? "bg-gradient-to-br from-[#C49A6C] to-[#8C6A3B] text-white rounded-br-sm"
                : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
            )}
          >
        {/* Header */}
        <div className={cn("px-4 py-3 border-b", isOwn ? "border-white/20" : "border-slate-200")}>
          <div className="flex items-center justify-between mb-2">
            <h3 className={cn("font-semibold text-sm", isOwn ? "text-white" : "text-slate-900")}>
              Service Quote
            </h3>
            <div className={cn("flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", getStatusColor(status))}>
              {getStatusIcon(status)}
              <span className="capitalize">{status}</span>
            </div>
          </div>
        </div>

        {/* Quote Details */}
        <div className="px-4 py-3 space-y-3">
          {/* Date & Time */}
          <div className="flex items-start gap-3">
            <Calendar className={cn("w-4 h-4 mt-0.5 flex-shrink-0", isOwn ? "text-white/80" : "text-[#8C6A3B]")} />
            <div>
              <p className={cn("text-xs font-medium mb-0.5", isOwn ? "text-white/90" : "text-slate-600")}>
                Session Date & Time
              </p>
              <p className={cn("text-sm", isOwn ? "text-white" : "text-slate-900")}>
                {formattedDate} at {formattedTime}
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-start gap-3">
            <Clock className={cn("w-4 h-4 mt-0.5 flex-shrink-0", isOwn ? "text-white/80" : "text-[#8C6A3B]")} />
            <div>
              <p className={cn("text-xs font-medium mb-0.5", isOwn ? "text-white/90" : "text-slate-600")}>
                Duration
              </p>
              <p className={cn("text-sm", isOwn ? "text-white" : "text-slate-900")}>
                {quote.hours} hour{quote.hours !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Rate & Total */}
          <div className="flex items-start gap-3">
            <DollarSign className={cn("w-4 h-4 mt-0.5 flex-shrink-0", isOwn ? "text-white/80" : "text-[#8C6A3B]")} />
            <div className="flex-1">
              <p className={cn("text-xs font-medium mb-0.5", isOwn ? "text-white/90" : "text-slate-600")}>
                Rate & Total
              </p>
              <div className="flex items-baseline gap-2">
                <p className={cn("text-sm", isOwn ? "text-white/80" : "text-slate-600")}>
                  ₹{quote.hourlyRate.toFixed(2)}/hour
                </p>
                <span className={cn("text-xs", isOwn ? "text-white/60" : "text-slate-400")}>×</span>
                <p className={cn("text-lg font-bold", isOwn ? "text-white" : "text-[#8C6A3B]")}>
                  ₹{quote.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          {quote.location?.address && (
            <div className="flex items-start gap-3">
              <MapPin className={cn("w-4 h-4 mt-0.5 flex-shrink-0", isOwn ? "text-white/80" : "text-[#8C6A3B]")} />
              <div>
                <p className={cn("text-xs font-medium mb-0.5", isOwn ? "text-white/90" : "text-slate-600")}>
                  Meeting Location
                </p>
                <p className={cn("text-sm", isOwn ? "text-white" : "text-slate-900")}>
                  {quote.location.address}
                </p>
              </div>
            </div>
          )}

          {/* Notes */}
          {quote.notes && (
            <div className="flex items-start gap-3">
              <FileText className={cn("w-4 h-4 mt-0.5 flex-shrink-0", isOwn ? "text-white/80" : "text-[#8C6A3B]")} />
              <div>
                <p className={cn("text-xs font-medium mb-0.5", isOwn ? "text-white/90" : "text-slate-600")}>
                  Notes
                </p>
                <p className={cn("text-sm", isOwn ? "text-white" : "text-slate-900")}>
                  {quote.notes}
                </p>
              </div>
            </div>
          )}

          {/* Expiration Countdown */}
          {status === "pending" && !isExpired && (
            <div className={cn("text-xs pt-2 border-t", isOwn ? "border-white/20 text-white/70" : "border-slate-200 text-slate-500")}>
              <div className="flex items-center justify-between">
                <span>Expires in:</span>
                <span className={cn("font-medium", isOwn ? "text-white" : "text-slate-700")}>
                  {timeRemaining.days > 0 && `${timeRemaining.days}d `}
                  {timeRemaining.hours > 0 && `${timeRemaining.hours}h `}
                  {timeRemaining.minutes > 0 && `${timeRemaining.minutes}m `}
                  {timeRemaining.seconds}s
                </span>
              </div>
            </div>
          )}

          {/* Expired Message */}
          {isExpired && status === "expired" && (
            <div className={cn("text-xs pt-2 border-t", isOwn ? "border-white/20 text-red-200" : "border-slate-200 text-red-600")}>
              This quote has expired
            </div>
          )}
        </div>

        {/* Actions (Only for traveller, only when pending and not expired) */}
        {isTraveller && !isOwn && status === "pending" && !isExpired && (
          <div className={cn("px-4 py-3 border-t flex gap-2", isOwn ? "border-white/20" : "border-slate-200 bg-slate-50")}>
            <button
              onClick={() => setShowDeclineModal(true)}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-white transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Decline
            </button>
            <button
              onClick={() => setShowAcceptModal(true)}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-gradient-to-br from-[#C49A6C] to-[#8C6A3B] text-white rounded-lg hover:from-[#b08256] hover:to-[#7a5a2b] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Accept Quote
            </button>
          </div>
        )}
      </div>

      {/* Accept Confirmation Modal */}
      <ConfirmationModal
        isOpen={showAcceptModal}
        onClose={handleCloseAccept}
        onConfirm={async () => {
          if (isProcessing) return;
          setIsProcessing(true);
          try {
            await onAccept?.(quote.quoteId);
            // Close modal after successful acceptance
            setIsProcessing(false);
            setShowAcceptModal(false);
          } catch (error) {
            // Error is handled by the hook
            // Keep modal open on error so user can retry
            setIsProcessing(false);
          }
        }}
        title="Accept Quote"
        message={`Are you sure you want to accept this quote for ₹${quote.totalAmount.toFixed(2)}? Once accepted, you'll need to make an advance payment of 30% (₹${(quote.totalAmount * 0.3).toFixed(2)}) within 3 days to confirm the booking.`}
        confirmText="Accept Quote"
        cancelText="Cancel"
        type="success"
        isLoading={isProcessing}
      />

      {/* Decline Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeclineModal}
        onClose={handleCloseDecline}
        onConfirm={async () => {
          if (isProcessing) return;
          setIsProcessing(true);
          try {
            await onDecline?.(quote.quoteId);
            // Close modal after successful decline
            setIsProcessing(false);
            setShowDeclineModal(false);
          } catch (error) {
            // Error is handled by the hook
            // Keep modal open on error so user can retry
            setIsProcessing(false);
          }
        }}
        title="Decline Quote"
        message={`Are you sure you want to decline this quote? This action cannot be undone. The guide will be notified that you've declined their quote.`}
        confirmText="Decline Quote"
        cancelText="Cancel"
        type="warning"
        isLoading={isProcessing}
      />
    </div>
  );
}

