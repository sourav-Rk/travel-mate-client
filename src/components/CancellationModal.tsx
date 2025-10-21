"use client"

import { useState } from "react"
import { ChevronDown, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CancellationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string, additionalInfo: string) => void
  bookingDetails?: {
    bookingId: string
    date: string
    amount: string
  }
}

const CANCELLATION_REASONS = [
  { id: "change-plans", label: "Change of plans" },
  { id: "found-alternative", label: "Found a better alternative" },
  { id: "financial", label: "Financial reasons" },
  { id: "schedule-conflict", label: "Schedule conflict" },
  { id: "health-issue", label: "Health or safety concern" },
  { id: "other", label: "Other reason" },
]

const CANCELLATION_POLICY = `
Cancellation Policy:
• Cancellations made 7+ days before the booking date: Full refund
• Cancellations made 3-6 days before: 75% refund
• Cancellations made 1-2 days before: 50% refund
• Cancellations made less than 24 hours before: No refund
• Special circumstances may be reviewed on a case-by-case basis
`

export function CancellationModal({ isOpen, onClose, onConfirm, bookingDetails }: CancellationModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [showPolicy, setShowPolicy] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!selectedReason) return
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    onConfirm(selectedReason, additionalInfo)
    setIsSubmitting(false)
    setSelectedReason("")
    setAdditionalInfo("")
    setShowPolicy(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-destructive/10 p-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Cancel Booking</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-muted transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 px-6 py-6">
          {/* Booking Details */}
          {bookingDetails && (
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Booking ID:</span> {bookingDetails.bookingId}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Date:</span> {bookingDetails.date}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Amount:</span> {bookingDetails.amount}
              </p>
            </div>
          )}

          {/* Cancellation Reason Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">
              Why are you cancelling? <span className="text-destructive">*</span>
            </label>
            <div className="space-y-2">
              {CANCELLATION_REASONS.map((reason) => (
                <label
                  key={reason.id}
                  className="flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <input
                    type="radio"
                    name="cancellation-reason"
                    value={reason.id}
                    checked={selectedReason === reason.id}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="h-4 w-4 cursor-pointer accent-primary"
                  />
                  <span className="text-sm font-medium text-foreground">{reason.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          {selectedReason === "other" && (
            <div className="space-y-2">
              <label htmlFor="additional-info" className="block text-sm font-semibold text-foreground">
                Please tell us more
              </label>
              <textarea
                id="additional-info"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Your feedback helps us improve..."
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                rows={3}
              />
            </div>
          )}

          {/* Cancellation Policy */}
          <div className="space-y-2">
            <button
              onClick={() => setShowPolicy(!showPolicy)}
              className="flex w-full items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
            >
              <span className="text-sm font-semibold text-foreground">View Cancellation Policy</span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${showPolicy ? "rotate-180" : ""}`}
              />
            </button>
            {showPolicy && (
              <div className="rounded-lg bg-muted/30 p-4">
                <p className="whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                  {CANCELLATION_POLICY}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent" disabled={isSubmitting}>
            Keep Booking
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedReason || isSubmitting}
            className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isSubmitting ? "Cancelling..." : "Cancel Booking"}
          </Button>
        </div>
      </div>
    </div>
  )
}
