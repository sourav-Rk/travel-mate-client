"use client"

import type React from "react"
import { useParams } from "react-router-dom"

import { cn } from "@/lib/utils"
import { CalendarDays, CheckCircle2, CircleAlert, CreditCard, Hash, Award as IdCard, Package, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useGetBookingDetailsVendor } from "@/hooks/vendor/useBookings"



function formatCurrency(amount?: number, currency = "USD") {
  if (amount == null || Number.isNaN(amount)) return "—"
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${amount}`
  }
}

function formatDate(input?: string | Date | null) {
  if (!input) return "—"
  const d = typeof input === "string" ? new Date(input) : input
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function statusBadgeClasses(status: string) {
  const s = status?.toLowerCase()
  if (s === "applied" || s === "confirmed" || s === "approved") {
    return "bg-emerald-100 text-emerald-700 border-emerald-200"
  }
  if (s === "cancelled" || s === "canceled") {
    return "bg-rose-100 text-rose-700 border-rose-200"
  }
  if (s === "waitlisted" || s === "pending") {
    return "bg-amber-100 text-amber-800 border-amber-200"
  }
  return "bg-slate-100 text-slate-700 border-slate-200"
}

function Section({
  title,
  icon,
  tone = "default",
  children,
}: {
  title: string
  icon: React.ReactNode
  tone?: "default" | "success" | "warning" | "danger"
  children: React.ReactNode
}) {
  const toneClasses =
    tone === "success"
      ? "border-l-emerald-500/70"
      : tone === "warning"
        ? "border-l-amber-500/70"
        : tone === "danger"
          ? "border-l-rose-500/70"
          : "border-l-slate-300"
  return (
    <div
      className={cn(
        "rounded-lg border bg-background p-4 shadow-sm",
        "border-slate-200 dark:border-slate-800",
        "flex flex-col gap-2",
        "pl-4 border-l-4",
        toneClasses,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-slate-600 dark:text-slate-300">{icon}</span>
        <h4 className="font-medium text-foreground text-pretty">{title}</h4>
      </div>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  )
}

function LoadingCard() {
  return (
    <Card
      className={cn(
        "w-full max-w-sm md:max-w-2xl lg:max-w-3xl xl:max-w-4xl min-h-96 lg:ml-64 mx-4 sm:mx-6 lg:mr-8 bg-background text-foreground border shadow-sm p-4 sm:p-5 rounded-xl",
        "animate-pulse",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 w-full">
          <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-56 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="mt-4 space-y-3">
        <div className="h-20 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="h-28 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
          <div className="h-28 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
        </div>
      </div>
    </Card>
  )
}


export function VendorBookingDetails() {
  const params = useParams()
  const bookingId = (params as any)?.bookingId ?? (params as any)?.id ?? (params as any)?.booking_id ?? ""

  const hasId = Boolean(bookingId)

  const {
    data: booking,
    error,
    isLoading,
  } = useGetBookingDetailsVendor(bookingId)

  if (!hasId) {
    return (
      <Card
        aria-label="Booking details error"
        className={cn(
          "w-full max-w-sm md:max-w-2xl lg:max-w-3xl xl:max-w-4xl lg:ml-64 mx-4 sm:mx-6 lg:mr-8 bg-background text-foreground border shadow-sm p-4 sm:p-5 rounded-xl",
        )}
      >
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-balance">Booking Details</h3>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground truncate">Missing booking ID in URL</p>
          </div>
          <Badge
            variant="outline"
            className="shrink-0 border text-xs sm:text-sm font-medium px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 border-rose-200"
          >
            Error
          </Badge>
        </header>
      </Card>
    )
  }

  if (isLoading) {
    return <LoadingCard />
  }

  if (error) {
    return (
      <Card
        aria-label="Booking details error"
        className={cn(
          "w-full max-w-sm md:max-w-2xl lg:max-w-3xl xl:max-w-4xl lg:ml-64 mx-4 sm:mx-6 lg:mr-8 bg-background text-foreground border shadow-sm p-4 sm:p-5 rounded-xl",
        )}
      >
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-balance">Booking Details</h3>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground truncate">Unable to load booking</p>
          </div>
          <Badge
            variant="outline"
            className="shrink-0 border text-xs sm:text-sm font-medium px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 border-rose-200"
          >
            Error
          </Badge>
        </header>
        <div className="mt-3 text-sm text-muted-foreground">
          {(error as Error)?.message ?? "Something went wrong while fetching the booking."}
        </div>
      </Card>
    )
  }

  if (!booking) {
    return <LoadingCard />
  }

  const currency = "INR"

  const { _id, userId, packageId, status, advancePayment, fullPayment, isWaitlisted, appliedAt, cancelledAt } =
    booking.bookingDetails || {}

  const advancePaid = !!advancePayment?.paid
  const fullPaid = !!fullPayment?.paid

  return (
    <Card
      aria-label="Booking details"
      className={cn(
        "w-full max-w-sm md:max-w-2xl lg:max-w-3xl xl:max-w-4xl min-h-96 lg:ml-64 mx-4 sm:mx-6 lg:mr-8 bg-background text-foreground border shadow-sm",
        "p-4 sm:p-5 rounded-xl",
        "flex flex-col gap-4",
      )}
    >
      {/* Header */}
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-balance">Booking Details</h3>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground truncate">Overview of this user’s booking</p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "shrink-0 border text-xs sm:text-sm font-medium px-2.5 py-1 rounded-full",
            statusBadgeClasses(status || ""),
          )}
        >
          {status ?? "—"}
        </Badge>
      </header>

      {/* IDs */}
      <div className="grid grid-cols-1 gap-3">
        <Section title="Identifiers" icon={<Hash className="h-4 w-4" aria-hidden="true" />}>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <IdCard className="h-4 w-4 text-slate-500" aria-hidden="true" />
              <span className="truncate">
                Booking ID: <span className="font-medium text-foreground">{_id ?? "—"}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-slate-500" aria-hidden="true" />
              <span className="truncate">
                User ID: <span className="font-medium text-foreground">{userId}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-slate-500" aria-hidden="true" />
              <span className="truncate">
                Package ID: <span className="font-medium text-foreground">{packageId}</span>
              </span>
            </div>
          </div>
        </Section>

        {/* Timeline */}
        <Section title="Timeline" icon={<CalendarDays className="h-4 w-4" aria-hidden="true" />}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <span>Applied</span>
              <span className="font-medium text-foreground">{formatDate(appliedAt ?? null)}</span>
            </div>
            {!!cancelledAt && (
              <div className="flex items-center justify-between gap-3">
                <span>Cancelled</span>
                <span className="font-medium text-foreground">{formatDate(cancelledAt)}</span>
              </div>
            )}
            {!!isWaitlisted && (
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  Waitlist
                  <CircleAlert className="h-4 w-4 text-amber-600" aria-hidden="true" />
                </span>
                <span className="font-medium text-amber-700">Active</span>
              </div>
            )}
          </div>
        </Section>

        {/* Payments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Section
            title="Advance Payment"
            icon={<CreditCard className="h-4 w-4" aria-hidden="true" />}
            tone={advancePaid ? "success" : "warning"}
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span>Amount</span>
                <span className="font-semibold">{formatCurrency(advancePayment?.amount, currency)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Due</span>
                <span className="font-medium">{formatDate(advancePayment?.dueDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Status</span>
                {advancePaid ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    Paid{advancePayment?.paidAt ? ` • ${formatDate(advancePayment.paidAt)}` : ""}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-amber-700 font-medium">
                    <CircleAlert className="h-4 w-4" aria-hidden="true" />
                    Unpaid
                  </span>
                )}
              </div>
            </div>
          </Section>

          <Section
            title="Full Payment"
            icon={<CreditCard className="h-4 w-4" aria-hidden="true" />}
            tone={fullPaid ? "success" : "warning"}
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span>Amount</span>
                <span className="font-semibold">{formatCurrency(fullPayment?.amount, currency)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Due</span>
                <span className="font-medium">{formatDate(fullPayment?.dueDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Status</span>
                {fullPaid ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    Paid{fullPayment?.paidAt ? ` • ${formatDate(fullPayment.paidAt)}` : ""}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-amber-700 font-medium">
                    <CircleAlert className="h-4 w-4" aria-hidden="true" />
                    Unpaid
                  </span>
                )}
              </div>
            </div>
          </Section>
        </div>
      </div>
    </Card>
  )
}

export default VendorBookingDetails
