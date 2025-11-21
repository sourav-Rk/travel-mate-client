import { ReactNode } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import type { LocalGuideBooking } from "@/types/local-guide-booking";
import { Button } from "@/components/ui/button";
import { LocalGuideBookingCard } from "./LocalGuideBookingCard";

interface LocalGuideBookingSectionProps {
  title: string;
  description?: ReactNode;
  bookings?: LocalGuideBooking[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  emptyMessage?: string;
}

export function LocalGuideBookingSection({
  title,
  description,
  bookings,
  isLoading,
  isFetching,
  isError,
  onRetry,
  onLoadMore,
  hasMore,
  loadingMore,
  emptyMessage = "No bookings found for this section.",
}: LocalGuideBookingSectionProps) {
  const showSkeleton = isLoading;
  const showEmpty = !isLoading && !isError && (bookings?.length ?? 0) === 0;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
      <div className="flex flex-col gap-2 border-b border-slate-100 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
            {description && (
              <p className="text-sm text-slate-500">{description}</p>
            )}
          </div>
          {isFetching && !isLoading && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Refreshing...
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {showSkeleton &&
          Array.from({ length: 2 }).map((_, idx) => (
            <div
              key={idx}
              className="h-48 animate-pulse rounded-2xl bg-slate-100/70"
            />
          ))}

        {isError && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-rose-100 bg-rose-50/60 p-6 text-center text-rose-600">
            <AlertCircle className="h-6 w-6" />
            <p className="text-sm font-medium">Failed to load bookings.</p>
            <Button variant="outline" onClick={onRetry}>
              Try again
            </Button>
          </div>
        )}

        {showEmpty && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center text-sm text-slate-500">
            {emptyMessage}
          </div>
        )}

        {!showSkeleton &&
          !isError &&
          bookings?.map((booking) => (
            <LocalGuideBookingCard key={booking._id} booking={booking} />
          ))}
      </div>

      {hasMore && onLoadMore && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="min-w-[160px]"
          >
            {loadingMore ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </span>
            ) : (
              "Load more"
            )}
          </Button>
        </div>
      )}
    </section>
  );
}








