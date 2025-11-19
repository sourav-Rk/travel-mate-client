import { useState } from "react";
import { CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useMarkServiceComplete } from "@/hooks/local-guide-booking/useLocalGuideBooking";
import type { LocalGuideBookingStatus } from "@/types/local-guide-booking";

interface MarkServiceCompleteButtonProps {
  bookingId: string;
  bookingStatus: LocalGuideBookingStatus;
  advancePaymentPaid: boolean;
  onComplete?: () => void;
}

export function MarkServiceCompleteButton({
  bookingId,
  bookingStatus,
  advancePaymentPaid,
  onComplete,
}: MarkServiceCompleteButtonProps) {
  const [showInputs, setShowInputs] = useState(false);
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState<number | undefined>(undefined);
  const { mutateAsync: markComplete, isPending } = useMarkServiceComplete();

  // Only show button if booking is CONFIRMED or IN_PROGRESS and advance is paid
  const canComplete =
    (bookingStatus === "CONFIRMED" || bookingStatus === "IN_PROGRESS") &&
    advancePaymentPaid &&
    bookingStatus !== "COMPLETED" &&
    bookingStatus !== "FULLY_PAID" &&
    bookingStatus !== "CANCELLED";

  if (!canComplete) {
    return null;
  }

  const handleComplete = async () => {
    if (!showInputs) {
      setShowInputs(true);
      return;
    }

    try {
      await markComplete({
        bookingId,
        notes: notes.trim() || undefined,
        rating: rating,
      });
      setShowInputs(false);
      setNotes("");
      setRating(undefined);
      onComplete?.();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleCancel = () => {
    setShowInputs(false);
    setNotes("");
    setRating(undefined);
  };

  return (
    <div className="space-y-3">
      {showInputs && (
        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/60 p-3">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700">
              Rating (Optional)
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={cn(
                    "transition-colors",
                    rating && rating >= star
                      ? "text-amber-500"
                      : "text-slate-300 hover:text-amber-400"
                  )}
                >
                  <Star
                    className={cn(
                      "h-5 w-5",
                      rating && rating >= star ? "fill-current" : ""
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700">
              Notes (Optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Share your experience or feedback..."
              className="min-h-[80px] resize-none text-sm"
              maxLength={500}
            />
            <p className="text-xs text-slate-500">
              {notes.length}/500 characters
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleComplete}
              disabled={isPending}
              className="flex-1 bg-gradient-to-br from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800"
            >
              {isPending ? "Completing..." : "Complete Service"}
            </Button>
          </div>
        </div>
      )}

      {!showInputs && (
        <Button
          onClick={handleComplete}
          disabled={isPending}
          className={cn(
            "w-full bg-gradient-to-br from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white",
            isPending && "opacity-50 cursor-not-allowed"
          )}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          {isPending ? "Processing..." : "Mark as Complete"}
        </Button>
      )}
    </div>
  );
}




