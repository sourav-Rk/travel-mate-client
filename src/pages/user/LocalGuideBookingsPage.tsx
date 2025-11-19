import { useEffect, useMemo, useState } from "react";
import { CalendarRange, Filter, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LocalGuideBookingSection } from "@/components/client/local-guide-bookings/LocalGuideBookingSection";
import { useLocalGuideBookings } from "@/hooks/local-guide-booking/useLocalGuideBooking";
import type {
  LocalGuideBookingStatus,
  LocalGuidePaymentFilter,
  LocalGuideBookingListResponse,
} from "@/types/local-guide-booking";

const STATUS_OPTIONS: { value: LocalGuideBookingStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "QUOTE_ACCEPTED", label: "Quote accepted" },
  { value: "ADVANCE_PENDING", label: "Advance pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "FULLY_PAID", label: "Fully paid" },
  { value: "CANCELLED", label: "Cancelled" },
];

const PAYMENT_OPTIONS: { value: LocalGuidePaymentFilter | "all"; label: string }[] = [
  { value: "all", label: "All payment states" },
  { value: "advance_due", label: "Advance due" },
  { value: "advance_overdue", label: "Advance overdue" },
  { value: "full_due", label: "Full payment due" },
  { value: "full_paid", label: "Fully paid" },
];

export default function LocalGuideBookingsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LocalGuideBookingStatus | "all">("all");
  const [paymentFilter, setPaymentFilter] = useState<LocalGuidePaymentFilter | "all">("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [pendingPage, setPendingPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchValue.trim());
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchValue]);

  useEffect(() => {
    setPendingPage(1);
    setCompletedPage(1);
  }, [debouncedSearch, statusFilter, paymentFilter, fromDate, toDate]);

  const sharedFilters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      paymentStatus: paymentFilter === "all" ? undefined : paymentFilter,
      from: fromDate || undefined,
      to: toDate || undefined,
      limit: 5,
    }),
    [debouncedSearch, statusFilter, paymentFilter, fromDate, toDate]
  );

  const pendingQuery = useLocalGuideBookings({
    category: "pending",
    page: pendingPage,
    ...sharedFilters,
  });

  const completedQuery = useLocalGuideBookings({
    category: "completed",
    page: completedPage,
    ...sharedFilters,
  });

  const pendingData = pendingQuery.data as LocalGuideBookingListResponse | undefined;
  const completedData = completedQuery.data as LocalGuideBookingListResponse | undefined;

  const summary = pendingData?.summary ?? completedData?.summary ?? {
    pendingCount: 0,
    completedCount: 0,
  };

  const resetFilters = () => {
    setSearchValue("");
    setStatusFilter("all");
    setPaymentFilter("all");
    setFromDate("");
    setToDate("");
  };

  const pendingHasMore =
    (pendingData?.pagination.page || 1) <
    (pendingData?.pagination.totalPages || 1);

  const completedHasMore =
    (completedData?.pagination.page || 1) <
    (completedData?.pagination.totalPages || 1);

  return (
    <div className="space-y-8">
      <header className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
            Local Guide Service
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Your Local Guide Bookings
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Track every booking, stay ahead of payments, and jump back into chats when needed.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Pending bookings
            </p>
            <p className="mt-2 text-3xl font-bold text-amber-600">
              {summary.pendingCount}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Completed
            </p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {summary.completedCount}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Filters active
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {[
                statusFilter !== "all" && "Status",
                paymentFilter !== "all" && "Payment",
                (fromDate || toDate) && "Date range",
                debouncedSearch && "Search",
              ]
                .filter(Boolean)
                .join(", ") || "None"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Quick Actions
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="outline">
                <CalendarRange className="mr-1 h-3 w-3" />
                Upcoming
              </Badge>
              <Badge variant="outline">
                <Filter className="mr-1 h-3 w-3" />
                Filtered
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-inner">
              <Search className="h-4 w-4 text-slate-400" />
              <Input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search by booking ID or guide name"
                className="border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as LocalGuideBookingStatus | "all")}>
            <SelectTrigger className="rounded-2xl border-slate-200 bg-white text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={paymentFilter} onValueChange={(value) => setPaymentFilter(value as LocalGuidePaymentFilter | "all")}>
            <SelectTrigger className="rounded-2xl border-slate-200 bg-white text-sm">
              <SelectValue placeholder="Payment status" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              From date
            </p>
            <Input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              className="rounded-2xl border-slate-200 text-sm"
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              To date
            </p>
            <Input
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              className="rounded-2xl border-slate-200 text-sm"
            />
          </div>
          <div className="flex items-end">
            <Button variant="outline" className="w-full rounded-2xl" onClick={resetFilters}>
              Reset filters
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "pending" | "completed")}>
            <TabsList className="mb-6 grid w-full grid-cols-2 gap-1 bg-slate-100/80 p-1.5 h-auto rounded-2xl">
            <TabsTrigger
              value="pending"
              className="flex-1 sm:flex-initial px-6 py-3 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md rounded-xl"
            >
              Pending & Upcoming
              {summary.pendingCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-amber-100 text-amber-700 border-amber-200"
                >
                  {summary.pendingCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="flex-1 sm:flex-initial px-6 py-3 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md rounded-xl"
            >
              Completed
              {summary.completedCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-emerald-100 text-emerald-700 border-emerald-200"
                >
                  {summary.completedCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-0">
            <LocalGuideBookingSection
              title="Pending & Upcoming"
              description="Advance payments, confirmations, and upcoming sessions."
              bookings={pendingData?.bookings}
              isLoading={pendingQuery.isLoading}
              isFetching={pendingQuery.isFetching}
              isError={pendingQuery.isError}
              onRetry={pendingQuery.refetch}
              onLoadMore={pendingHasMore ? () => setPendingPage((prev) => prev + 1) : undefined}
              hasMore={pendingHasMore}
              loadingMore={pendingQuery.isFetching && pendingQuery.isFetched}
              emptyMessage="No pending local guide bookings match your filters."
            />
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            <LocalGuideBookingSection
              title="Completed Journeys"
              description="Finished services ready for wrap-up and full payments."
              bookings={completedData?.bookings}
              isLoading={completedQuery.isLoading}
              isFetching={completedQuery.isFetching}
              isError={completedQuery.isError}
              onRetry={completedQuery.refetch}
              onLoadMore={
                completedHasMore ? () => setCompletedPage((prev) => prev + 1) : undefined
              }
              hasMore={completedHasMore}
              loadingMore={completedQuery.isFetching && completedQuery.isFetched}
              emptyMessage="No completed bookings yet. Finish a session to see it here."
            />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

