import { Card } from "@/components/ui/card"
import { TrendingUp, Package } from "lucide-react"

interface PaymentSummaryProps {
  totalAmount: number
  paidAmount: number
  pendingAmount: number
  packageId: string
  currency?: string
}

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

export function PaymentSummary({
  totalAmount,
  paidAmount,
  pendingAmount,
  packageId,
  currency = "INR",
}: PaymentSummaryProps) {
  const paymentProgress = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0

  return (
    <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Payment Summary</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="space-y-1">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Amount</p>
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {formatCurrency(totalAmount, currency)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-slate-500 dark:text-slate-400">Paid Amount</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(paidAmount, currency)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-slate-500 dark:text-slate-400">Pending Amount</p>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
            {formatCurrency(pendingAmount, currency)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Package className="h-4 w-4" />
            Package ID
          </p>
          <p className="text-lg font-mono font-semibold text-slate-900 dark:text-slate-100 truncate">
            {packageId || "—"}
          </p>
        </div>
      </div>

      {/* Payment Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Payment Progress</span>
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {paymentProgress.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(paymentProgress, 100)}%` }}
          />
        </div>
      </div>
    </Card>
  )
}
