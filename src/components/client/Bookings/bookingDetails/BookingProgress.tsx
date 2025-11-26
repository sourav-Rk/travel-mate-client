"use client"

import { motion } from "framer-motion"
import { TrendingUp, AlertCircle } from "lucide-react"

interface BookingProgressProps {
  paidAmount: number
  totalAmount: number
  pendingAmount: number
  isWaitlisted: boolean
  status: string
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

export function BookingProgress({
  paidAmount,
  totalAmount,
  pendingAmount,
  isWaitlisted,
  status,
}: BookingProgressProps) {
  const progressPercentage = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-[#2CA4BC]" />
          Payment Progress
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#2CA4BC] to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
            />
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-green-600 font-medium">Paid: {formatCurrency(paidAmount)}</span>
            <span className="text-amber-600 font-medium">Remaining: {formatCurrency(pendingAmount)}</span>
          </div>
        </div>
      </motion.div>

      {/* Additional Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <AlertCircle className="h-6 w-6 text-[#2CA4BC]" />
          Booking Information
        </h2>

        <div className="space-y-4">

          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">Booking Status:</span>
            <span
              className={`font-medium px-2 py-1 rounded text-sm ${
                status === "confirmed"
                  ? "bg-green-100 text-green-800"
                  : status === "advance_pending"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {status.replace("_", " ").toUpperCase()}
            </span>
          </div>

          <div className="flex justify-between items-center py-3">
            <span className="text-gray-600">Waitlist Status:</span>
            <span
              className={`font-medium px-2 py-1 rounded text-sm ${
                isWaitlisted ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"
              }`}
            >
              {isWaitlisted ? "Waitlisted" : "Confirmed Slot"}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
