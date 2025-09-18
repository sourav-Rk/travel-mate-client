import { Badge } from "@/components/ui/badge"
import { Hash, Calendar } from "lucide-react"

interface BookingHeaderProps {
  bookingId: string
  status: string
  appliedAt?: string | Date | null
}

function statusBadgeClasses(status: string) {
  const s = status?.toLowerCase()
  if (s === "applied" || s === "confirmed" || s === "approved") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
  }
  if (s === "cancelled" || s === "canceled") {
    return "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
  }
  if (s === "waitlisted" || s === "pending") {
    return "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
  }
  return "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
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

export function BookingHeader({ bookingId, status, appliedAt }: BookingHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Hash className="h-4 w-4" />
            <span className="text-sm font-medium">Booking ID</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">{bookingId || "—"}</h1>
          {appliedAt && (
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Calendar className="h-4 w-4" />
              <span>Applied on {formatDate(appliedAt)}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Status</span>
          <Badge
            variant="outline"
            className={`text-sm font-semibold px-4 py-2 rounded-full transition-colors ${statusBadgeClasses(status || "")}`}
          >
            {status || "Unknown"}
          </Badge>
        </div>
      </div>
    </div>
  )
}
