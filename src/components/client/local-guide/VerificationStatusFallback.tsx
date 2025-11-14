"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  X,
  Clock,
  AlertCircle,
  FileText,
  ArrowRight,
  RefreshCw,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { LocalGuideProfile } from "@/types/local-guide"

interface VerificationStatusFallbackProps {
  profile: LocalGuideProfile
}

export function VerificationStatusFallback({
  profile,
}: VerificationStatusFallbackProps) {
  const navigate = useNavigate()
  const status = profile.verificationStatus

  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          title: "Verification Pending",
          message:
            "Your verification request is currently pending review. Our admin team will review your submission and get back to you soon.",
          badge: {
            label: "Pending Verification",
            className: "bg-yellow-100 text-yellow-800 border-yellow-200",
          },
          showResubmit: false,
        }
      case "reviewing":
        return {
          icon: Clock,
          title: "Under Review",
          message:
            "Your verification request is currently being reviewed by our admin team. This process may take a few business days.",
          badge: {
            label: "Under Review",
            className: "bg-blue-100 text-blue-800 border-blue-200",
          },
          showResubmit: false,
        }
      case "rejected":
        return {
          icon: X,
          title: "Verification Request Rejected",
          message: profile.rejectionReason
            ? `Your verification request has been rejected. Reason: ${profile.rejectionReason}`
            : "Your verification request has been rejected by the admin. Please review your submission and try again.",
          badge: {
            label: "Rejected",
            className: "bg-red-100 text-red-800 border-red-200",
          },
          showResubmit: true,
        }
      default:
        return {
          icon: AlertCircle,
          title: "Verification Status Unknown",
          message: "Unable to determine your verification status.",
          badge: {
            label: "Unknown",
            className: "bg-gray-100 text-gray-800 border-gray-200",
          },
          showResubmit: false,
        }
    }
  }

  const config = getStatusConfig()
  const StatusIcon = config.icon

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-slate-100">
              <StatusIcon className="h-12 w-12 text-slate-600" />
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {config.title}
          </CardTitle>
          <Badge
            variant="secondary"
            className={`${config.badge.className} border font-medium text-sm sm:text-base`}
          >
            {config.badge.label}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-6">
              {config.message}
            </p>

            {/* Show rejection reason if available */}
            {status === "rejected" && profile.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-900 mb-1">
                      Rejection Reason:
                    </p>
                    <p className="text-red-800 text-sm">{profile.rejectionReason}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Show verification details */}
            <div className="bg-slate-50 rounded-lg p-4 sm:p-6 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#2CA4BC]" />
                Verification Details
              </h3>
              <div className="space-y-3 text-sm sm:text-base">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Requested At:</span>
                  <span className="font-medium text-gray-900">
                    {profile.verificationRequestedAt
                      ? new Date(profile.verificationRequestedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "N/A"}
                  </span>
                </div>
                {profile.rejectedAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Rejected At:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(profile.rejectedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {config.showResubmit && (
                <Button
                  onClick={() => navigate("/pvt/local-guide/verification")}
                  className="bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] hover:from-[#2CA4BC]/90 hover:to-[#1a5f6b]/90 text-white shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Resubmit Verification
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => navigate("/pvt/profile")}
                className="border-slate-300 hover:bg-slate-50"
                size="lg"
              >
                Go to Profile
              </Button>
            </div>
          </div>

          {/* Help Section */}
          <div className="border-t pt-6 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-blue-900 mb-1">Need Help?</p>
                  <p className="text-blue-800 text-sm">
                    If you have any questions about your verification status or need
                    assistance, please contact our support team. We're here to help!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

