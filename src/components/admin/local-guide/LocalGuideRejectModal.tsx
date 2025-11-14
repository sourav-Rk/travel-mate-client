"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { XCircle, AlertTriangle, X } from "lucide-react";

interface LocalGuideRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
  guideName?: string;
}

const commonReasons = [
  "Incomplete or unclear documentation",
  "Invalid or expired ID proof",
  "Address proof does not match location",
  "Poor document quality/readability",
  "Missing required documents",
  "Failed background verification",
  "Non-compliance with platform policies",
  "Insufficient experience or qualifications",
  "Location not supported",
  "Other (please specify)",
];

export function LocalGuideRejectModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  guideName,
}: LocalGuideRejectModalProps) {
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<{ reason?: string }>({});

  const handleSubmit = () => {
    const newErrors: { reason?: string } = {};

    if (!reason.trim()) {
      newErrors.reason = "Please provide a reason for rejection";
    } else if (reason.trim().length < 10) {
      newErrors.reason = "Reason must be at least 10 characters long";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onConfirm(reason.trim());
      handleClose();
    }
  };

  const handleClose = () => {
    setReason("");
    setErrors({});
    onClose();
  };

  const handleQuickReason = (quickReason: string) => {
    setReason(quickReason);
    setErrors((prev) => ({ ...prev, reason: undefined }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
     <DialogContent className="max-w-2xl max-h-[90vh] p-0 bg-white rounded-xl overflow-hidden flex flex-col">
        <DialogHeader className="px-4 sm:px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-red-50 to-red-100 shrink-0">
          <DialogTitle className="flex items-start justify-between gap-3 text-lg sm:text-xl font-bold text-slate-900">
            <div className="flex items-start gap-3 min-w-0">
              <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-red-600 rounded-lg shrink-0 mt-0.5">
                <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="min-w-0">
                <span className="block">Reject Local Guide Request</span>
                {guideName && (
                  <p className="text-xs sm:text-sm font-normal text-slate-600 mt-1 break-words">
                    Rejecting application for: <span className="font-semibold">{guideName}</span>
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 hover:bg-red-200 shrink-0"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-4 sm:py-6 space-y-5">
          {/* Quick Reasons */}
          <div className="space-y-2.5">
            <Label className="text-sm font-semibold text-slate-700">
              Quick Reasons
            </Label>
            <div className="flex flex-wrap gap-2">
              {commonReasons.map((quickReason, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-slate-100 transition-colors px-2.5 py-1 text-xs"
                  onClick={() => handleQuickReason(quickReason)}
                >
                  {quickReason}
                </Badge>
              ))}
            </div>
          </div>

          {/* Detailed Reason */}
          <div className="space-y-2.5">
            <Label htmlFor="reason" className="text-sm font-semibold text-slate-700">
              Detailed Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Please provide a detailed explanation for rejecting this local guide application. This will help the guide understand what needs to be improved."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setErrors((prev) => ({ ...prev, reason: undefined }));
              }}
              className={`min-h-[100px] resize-none ${
                errors.reason ? "border-red-500 focus:border-red-500" : ""
              }`}
              disabled={isLoading}
            />
            <div className="flex justify-between items-center gap-2 flex-wrap">
              {errors.reason ? (
                <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 shrink-0" />
                  <span>{errors.reason}</span>
                </p>
              ) : (
                <p className="text-xs text-slate-500">Minimum 10 characters required</p>
              )}
              <p className="text-xs text-slate-500">{reason.length}/500</p>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mt-0.5 shrink-0" />
              <div className="space-y-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-amber-800">Important Notice</p>
                <p className="text-xs sm:text-sm text-amber-700">
                  This action will permanently reject the local guide application. The guide will be
                  notified via email with the reason provided above. They can reapply after
                  addressing the issues.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2.5 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-200 bg-slate-50 shrink-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 sm:px-6 bg-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">Rejecting...</span>
              </div>
            ) : (
              <>
                <XCircle className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Reject Application</span>
                <span className="sm:hidden">Reject</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}



