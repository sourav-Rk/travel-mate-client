"use client"

import { motion } from "framer-motion"
import { DollarSign, CheckCircle, Clock, Package } from "lucide-react"

interface PaymentSummaryProps {
  totalAmount: number
  paidAmount: number
  pendingAmount: number
  packageId: string
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

export function PaymentSummary({ totalAmount, paidAmount, pendingAmount, packageId }: PaymentSummaryProps) {
  const summaryCards = [
    {
      title: "Total Amount",
      value: formatCurrency(totalAmount),
      icon: DollarSign,
      color: "bg-blue-100 text-blue-600",
      delay: 0.1,
    },
    {
      title: "Paid Amount",
      value: formatCurrency(paidAmount),
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
      delay: 0.2,
    },
    {
      title: "Pending Amount",
      value: formatCurrency(pendingAmount),
      icon: Clock,
      color: "bg-amber-100 text-amber-600",
      delay: 0.3,
    },
    {
      title: "Package ID",
      value: packageId,
      icon: Package,
      color: "bg-purple-100 text-purple-600",
      delay: 0.4,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {summaryCards.map((card, index) => {
        const Icon = card.icon
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: card.delay, duration: 0.4 }}
            className="bg-white border border-gray-200 shadow-lg rounded-xl p-4 sm:p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className={`p-2 sm:p-3 rounded-lg ${card.color} flex-shrink-0`}>
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 mb-1 font-medium">{card.title}</p>
                <p className="text-sm sm:text-base font-bold text-gray-900 break-words leading-tight">
                  {card.value}
                </p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}