import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GuideLocalGuideBookingCard } from "./GuideLocalGuideBookingCard";
import type { LocalGuideBooking } from "@/types/local-guide-booking";

interface GuideLocalGuideBookingSectionProps {
  title: string;
  description: string;
  bookings?: LocalGuideBooking[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
  onLoadMore?: () => void;
  hasMore: boolean;
  loadingMore: boolean;
  emptyMessage: string;
}

export function GuideLocalGuideBookingSection({
  title,
  description,
  bookings,
  isLoading,
  isError,
  onRetry,
  onLoadMore,
  hasMore,
  loadingMore,
  emptyMessage,
}: GuideLocalGuideBookingSectionProps) {
  if (isLoading) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-3xl border border-red-200 bg-red-50/80 p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <AlertCircle className="h-10 w-10 text-red-600" />
          <div className="text-center">
            <p className="font-semibold text-red-900">
              Failed to load bookings
            </p>
            <p className="mt-1 text-sm text-red-700">Please try again</p>
          </div>
          <Button
            variant="outline"
            onClick={onRetry}
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </section>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-slate-500">{emptyMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <GuideLocalGuideBookingCard key={booking._id} booking={booking} />
        ))}
      </div>

      {hasMore && onLoadMore && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="rounded-xl"
          >
            {loadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </section>
  );
}
