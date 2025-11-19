import { useState, useEffect } from "react";
import { Clock, DollarSign, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Quote } from "@/types/local-guide-booking";
import { getTimeRemaining, formatTimeRemaining } from "@/utils/dateUtils";

interface PendingQuotesSectionProps {
  quotes: Quote[];
  onSelectQuote: (quote: Quote) => void;
  currentUserId?: string;
}

export function PendingQuotesSection({
  quotes,
  onSelectQuote,
  currentUserId,
}: PendingQuotesSectionProps) {
  const [timeRemaining, setTimeRemaining] = useState<Record<string, string>>({});

  // Update countdown every second
  useEffect(() => {
    if (quotes.length === 0) return;

    const interval = setInterval(() => {
      const updates: Record<string, string> = {};
      quotes.forEach((quote) => {
        updates[quote.quoteId] = formatTimeRemaining(quote.expiresAt);
      });
      setTimeRemaining(updates);
    }, 1000);

    // Initial update
    const initial: Record<string, string> = {};
    quotes.forEach((quote) => {
      initial[quote.quoteId] = formatTimeRemaining(quote.expiresAt);
    });
    setTimeRemaining(initial);

    return () => clearInterval(interval);
  }, [quotes]);

  if (quotes.length === 0) {
    return null;
  }

  return (
    <div className="px-2 py-3 border-b border-slate-200/60 bg-gradient-to-br from-yellow-50/50 to-amber-50/30">
      <h3 className="text-xs font-semibold text-[#8C6A3B] uppercase tracking-wide mb-2 px-2">
        Pending Quotes ({quotes.length})
      </h3>
      <div className="space-y-2">
        {quotes.map((quote) => {
          const guideName = quote.guideName || "Local Guide";
          const countdown = timeRemaining[quote.quoteId] || formatTimeRemaining(quote.expiresAt);
          const isExpired = getTimeRemaining(quote.expiresAt).isExpired;

          return (
            <button
              key={quote.quoteId}
              onClick={() => onSelectQuote(quote)}
              className={cn(
                "w-full rounded-xl p-3 text-left transition-all border",
                isExpired
                  ? "bg-red-50/50 border-red-200/50 hover:bg-red-50"
                  : "bg-white/80 border-yellow-200/50 hover:bg-white hover:shadow-sm"
              )}
            >
              <div className="flex items-start gap-2">
                {quote.guideProfileImage ? (
                  <img
                    src={quote.guideProfileImage}
                    alt={guideName}
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C49A6C] to-[#8C6A3B] flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="font-semibold text-sm text-slate-900 truncate">
                      {guideName}
                    </div>
                    <div className={cn(
                      "text-xs font-medium flex-shrink-0",
                      isExpired ? "text-red-600" : "text-yellow-600"
                    )}>
                      {isExpired ? "Expired" : countdown}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-[#8C6A3B]" />
                      <span className="font-semibold text-[#8C6A3B]">
                        ₹{quote.totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{quote.hours} hour{quote.hours !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}






