import { Card } from "@/components/ui/card"
import { CreditCard, CheckCircle2, CircleAlert, Clock } from "lucide-react"

interface PaymentDetails {
  amount?: number
  dueDate?: string | Date | null
  paid?: boolean
  paidAt?: string | Date | null
}

interface PaymentInformationProps {
  advancePayment?: PaymentDetails
  fullPayment?: PaymentDetails
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

function PaymentCard({
  title,
  payment,
  currency,
  isPrimary = false,
}: {
  title: string
  payment?: PaymentDetails
  currency: string
  isPrimary?: boolean
}) {
  const isPaid = !!payment?.paid
  const isOverdue = payment?.dueDate && new Date(payment.dueDate) < new Date() && !isPaid

  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
        isPaid
          ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800"
          : isOverdue
            ? "bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800"
            : "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          {title}
        </h3>
        {isPaid ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        ) : isOverdue ? (
          <CircleAlert className="h-5 w-5 text-rose-600 dark:text-rose-400" />
        ) : (
          <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600 dark:text-slate-400">Amount</span>
          <span className="font-bold text-lg text-slate-900 dark:text-slate-100">
            {formatCurrency(payment?.amount, currency)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600 dark:text-slate-400">Due Date</span>
          <span className="font-medium text-slate-900 dark:text-slate-100">{formatDate(payment?.dueDate)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
          <span
            className={`font-semibold text-sm px-2 py-1 rounded-full ${
              isPaid
                ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                : isOverdue
                  ? "bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400"
                  : "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
            }`}
          >
            {isPaid ? "Paid" : isOverdue ? "Overdue" : "Pending"}
          </span>
        </div>

        {isPaid && payment?.paidAt && (
          <div className="flex justify-between items-center pt-1 border-t border-emerald-200 dark:border-emerald-800">
            <span className="text-sm text-slate-600 dark:text-slate-400">Paid On</span>
            <span className="font-medium text-emerald-700 dark:text-emerald-400 text-sm">
              {formatDate(payment.paidAt)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export function PaymentInformation({ advancePayment, fullPayment, currency = "INR" }: PaymentInformationProps) {
  return (
    <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Payment Information</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PaymentCard title="Advance Payment" payment={advancePayment} currency={currency} />
        <PaymentCard title="Full Payment" payment={fullPayment} currency={currency} isPrimary />
      </div>
    </Card>
  )
}
