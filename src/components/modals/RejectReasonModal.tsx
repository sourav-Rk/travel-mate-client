"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { XCircle, AlertTriangle, X } from "lucide-react"

interface RejectReasonModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  isLoading?: boolean
  vendorName?: string
}

const commonReasons = [
  "Incomplete or unclear documentation",
  "Invalid or expired documents",
  "Information mismatch between documents",
  "Poor document quality/readability",
  "Missing required certificates",
  "Failed background verification",
  "Non-compliance with platform policies",
]

export function RejectReasonModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  vendorName,
}: RejectReasonModalProps) {
  const [reason, setReason] = useState("")
  const [errors, setErrors] = useState<{ category?: string; reason?: string }>({})

  const handleSubmit = () => {
    const newErrors: { category?: string; reason?: string } = {}

    if (!reason.trim()) {
      newErrors.reason = "Please provide a reason for rejection"
    } else if (reason.trim().length < 10) {
      newErrors.reason = "Reason must be at least 10 characters long"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onConfirm(reason.trim())
      handleClose()
    }
  }

  const handleClose = () => {
    setReason("")
    setErrors({})
    onClose()
  }

  const handleQuickReason = (quickReason: string) => {
    setReason(quickReason)
    setErrors((prev) => ({ ...prev, reason: undefined }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl p-0 bg-white rounded-xl overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-slate-200 bg-gradient-to-r from-red-50 to-red-100">
          <DialogTitle className="flex items-center justify-between text-xl font-bold text-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-red-600 rounded-lg">
                <XCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <span>Reject Vendor Request</span>
                {vendorName && (
                  <p className="text-sm font-normal text-slate-600 mt-1">
                    Rejecting application for: <span className="font-semibold">{vendorName}</span>
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 hover:bg-red-200"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Category Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700">
              Rejection Category <span className="text-red-500">*</span>
            </Label>
         
            {errors.category && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Quick Reasons */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700">Quick Reasons</Label>
            <div className="flex flex-wrap gap-2">
              {commonReasons.map((quickReason, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-slate-100 transition-colors px-3 py-1 text-xs"
                  onClick={() => handleQuickReason(quickReason)}
                >
                  {quickReason}
                </Badge>
              ))}
            </div>
          </div>

          {/* Detailed Reason */}
          <div className="space-y-3">
            <Label htmlFor="reason" className="text-sm font-semibold text-slate-700">
              Detailed Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Please provide a detailed explanation for rejecting this vendor application. This will help the vendor understand what needs to be improved."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                setErrors((prev) => ({ ...prev, reason: undefined }))
              }}
              className={`min-h-[120px] resize-none ${errors.reason ? "border-red-500 focus:border-red-500" : ""}`}
              disabled={isLoading}
            />
            <div className="flex justify-between items-center">
              {errors.reason ? (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.reason}
                </p>
              ) : (
                <p className="text-xs text-slate-500">Minimum 10 characters required</p>
              )}
              <p className="text-xs text-slate-500">{reason.length}/500</p>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-800">Important Notice</p>
                <p className="text-sm text-amber-700">
                  This action will permanently reject the vendor application. The vendor will be notified via email with
                  the reason provided above. They can reapply after addressing the issues.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 p-6 pt-0">
          <Button variant="outline" onClick={handleClose} disabled={isLoading} className="px-6 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading} className="bg-red-600 hover:bg-red-700 text-white px-6">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Rejecting...
              </div>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Reject Application
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
