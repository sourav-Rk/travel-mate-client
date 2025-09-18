import { Card } from "@/components/ui/card"
import { User, CheckCircle2, CircleAlert, Clock, AlertTriangle } from "lucide-react"

interface BookingInformationProps {
  userId: string
  name?: string
  email : string;
  phone : string;
  gender : string;
  bookingStatus: string
  waitlistStatus: boolean
  appliedAt?: string | Date | null
  cancelledAt?: string | Date | null
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

function getStatusIcon(status: string, waitlisted: boolean) {
  if (waitlisted) return <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />

  const s = status?.toLowerCase()
  if (s === "applied" || s === "confirmed" || s === "approved") {
    return <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
  }
  if (s === "cancelled" || s === "canceled") {
    return <CircleAlert className="h-5 w-5 text-rose-600 dark:text-rose-400" />
  }
  return <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
}

function getStatusColor(status: string, waitlisted: boolean) {
  if (waitlisted) return "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800"

  const s = status?.toLowerCase()
  if (s === "applied" || s === "confirmed" || s === "approved") {
    return "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800"
  }
  if (s === "cancelled" || s === "canceled") {
    return "bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800"
  }
  return "bg-slate-50 dark:bg-slate-900/10 border-slate-200 dark:border-slate-800"
}

export function BookingInformation({
  userId,
  name,
  phone,
  email,
  gender,
  bookingStatus,
  waitlistStatus,
  appliedAt,
  cancelledAt,
}: BookingInformationProps) {
  return (
    <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Booking Information</h2>
      </div>

      <div className="space-y-4">
        {/* User Information */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
          <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-3">User Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">User ID</span>
              <span className="font-mono text-sm font-medium text-slate-900 dark:text-slate-100">{userId || "—"}</span>
            </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Name</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Email</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Phone</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Gender</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{gender}</span>
              </div>
          </div>
        </div>

        {/* Status Information */}
        <div className={`p-4 rounded-lg border-2 ${getStatusColor(bookingStatus, waitlistStatus)}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-slate-900 dark:text-slate-100">Current Status</h3>
            {getStatusIcon(bookingStatus, waitlistStatus)}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Booking Status</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{bookingStatus || "Unknown"}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Waitlist Status</span>
              <span
                className={`font-semibold text-sm px-2 py-1 rounded-full ${
                  waitlistStatus
                    ? "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                    : "bg-slate-100 dark:bg-slate-900/20 text-slate-700 dark:text-slate-400"
                }`}
              >
                {waitlistStatus ? "Waitlisted" : "Not Waitlisted"}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
          <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-3">Timeline</h3>
          <div className="space-y-2">
            {appliedAt && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Applied At</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{formatDate(appliedAt)}</span>
              </div>
            )}
            {cancelledAt && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Cancelled At</span>
                <span className="font-medium text-rose-700 dark:text-rose-400">{formatDate(cancelledAt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
