"use client"

import { motion } from "framer-motion"
import { Package, CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react"

interface BookingHeaderProps {
  bookingId: string
  bookingCustomId : string
  status: string
  isWaitlisted: boolean
}

const getStatusConfig = (status: string, isWaitlisted: boolean) => {
  if (isWaitlisted) {
    return {
      label: "Waitlisted",
      color: "bg-amber-100 text-amber-800 border-amber-200",
      icon: Clock,
      bgGradient: "from-amber-50 to-orange-50",
    }
  }

  switch (status.toLowerCase()) {
    case "confirmed":
      return {
        label: "Confirmed",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        bgGradient: "from-green-50 to-emerald-50",
      }
    case "advance_pending":
      return {
        label: "Advance Pending",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Clock,
        bgGradient: "from-blue-50 to-indigo-50",
      }
    case "cancelled":
      return {
        label: "Cancelled",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        bgGradient: "from-red-50 to-pink-50",
      }
    default:
      return {
        label: status.replace("_", " ").toUpperCase(),
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: AlertCircle,
        bgGradient: "from-gray-50 to-slate-50",
      }
  }
}

export function BookingHeader({ bookingCustomId, status, isWaitlisted }: BookingHeaderProps) {
  const statusConfig = getStatusConfig(status, isWaitlisted)
  const StatusIcon = statusConfig.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white border border-gray-200 shadow-xl rounded-2xl overflow-hidden"
    >
      <div className={`bg-gradient-to-r ${statusConfig.bgGradient} p-6 border-b border-gray-200`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="h-8 w-8 text-[#2CA4BC]" />
              Booking Details
            </h1>
            <p className="text-gray-600 mt-1 font-mono text-sm">Booking ID: {bookingCustomId}</p>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${statusConfig.color}`}>
            <StatusIcon className="w-5 h-5" />
            {statusConfig.label}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
