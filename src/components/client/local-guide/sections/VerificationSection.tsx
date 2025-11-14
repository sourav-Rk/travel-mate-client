"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  Clock,
  X,
  FileText,
  Eye,
  AlertCircle,
  Calendar,
  Shield,
  FileCheck,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import type { LocalGuideProfile } from "@/types/local-guide"

interface VerificationSectionProps {
  profile: LocalGuideProfile
}


export function VerificationSection({ profile }:VerificationSectionProps) {
 const [viewingDocument, setViewingDocument] = useState<string | null>(null)

 const getStatusConfig = (status: LocalGuideProfile["verificationStatus"])=> {
    switch (status) {
      case "verified":
        return {
          label: "Verified",
          icon: CheckCircle,
          className: "bg-gradient-to-r from-green-500 to-green-600 text-white border-0",
          badgeClassName: "bg-green-100 text-green-800 border-green-200",
          message: "Your profile has been verified and is active.",
          cardGradient: "from-green-50 via-[#F5F1E8]/30 to-white",
        }
      case "pending":
        return {
          label: "Pending Verification",
          icon: Clock,
          className: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0",
          badgeClassName: "bg-yellow-100 text-yellow-800 border-yellow-200",
          message: "Your verification request is pending review.",
          cardGradient: "from-yellow-50 via-[#F5F1E8]/30 to-white",
        }
      case "reviewing":
        return {
          label: "Under Review",
          icon: Clock,
          className: "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0",
          badgeClassName: "bg-blue-100 text-blue-800 border-blue-200",
          message: "Your verification request is currently under review.",
          cardGradient: "from-blue-50 via-[#F5F1E8]/30 to-white",
        }
      case "rejected":
        return {
          label: "Rejected",
          icon: X,
          className: "bg-gradient-to-r from-red-500 to-red-600 text-white border-0",
          badgeClassName: "bg-red-100 text-red-800 border-red-200",
          message: profile.rejectionReason
            ? `Rejection reason: ${profile.rejectionReason}`
            : "Your verification request was rejected.",
          cardGradient: "from-red-50 via-[#F5F1E8]/30 to-white",
        }
      default:
        return {
          label: "Unknown",
          icon: AlertCircle,
          className: "bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0",
          badgeClassName: "bg-gray-100 text-gray-800 border-gray-200",
          message: "Verification status is unknown.",
          cardGradient: "from-gray-50 via-[#F5F1E8]/30 to-white",
        }
    }
  }

  const statusConfig = getStatusConfig(profile.verificationStatus)
  const StatusIcon = statusConfig.icon

  const getFileType = (url: string): "image" | "pdf" | "other" => {
    const extension = url.split(".").pop()?.toLowerCase()
    if (extension && ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
      return "image"
    }
    if (extension === "pdf") {
      return "pdf"
    }
    return "other"
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Verification Status */}
      <Card className={`border-0 shadow-xl bg-gradient-to-br ${statusConfig.cardGradient} overflow-hidden relative group`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#2CA4BC]/10 to-transparent rounded-full blur-3xl transform translate-x-32 -translate-y-32 group-hover:scale-150 transition-transform duration-700"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold">
            <div className="p-2 bg-gradient-to-br from-[#2CA4BC] to-[#1a5f6b] rounded-xl shadow-lg">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="text-gray-800">Verification Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          <div className="flex items-center gap-3">
            <Badge
              className={`${statusConfig.className} font-bold text-sm sm:text-base px-4 py-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300`}
            >
              <StatusIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              {statusConfig.label}
            </Badge>
          </div>
          <div className="bg-gradient-to-r from-[#F5F1E8]/95 via-[#F5F1E8]/80 to-transparent rounded-lg p-4">
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              {statusConfig.message}
            </p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {profile.verificationRequestedAt && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 shadow-md hover:shadow-lg transition-all duration-300 group/date">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2 flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  Requested At
                </p>
                <p className="text-slate-900 font-bold text-sm sm:text-base group-hover/date:text-[#2CA4BC] transition-colors duration-300">
                  {new Date(profile.verificationRequestedAt).toLocaleDateString()}
                </p>
              </div>
            )}
            {profile.verifiedAt && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 shadow-md hover:shadow-lg transition-all duration-300 group/date">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2 flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  Verified At
                </p>
                <p className="text-slate-900 font-bold text-sm sm:text-base group-hover/date:text-green-600 transition-colors duration-300">
                  {new Date(profile.verifiedAt).toLocaleDateString()}
                </p>
              </div>
            )}
            {profile.rejectedAt && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 shadow-md hover:shadow-lg transition-all duration-300 group/date">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2 flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  Rejected At
                </p>
                <p className="text-slate-900 font-bold text-sm sm:text-base group-hover/date:text-red-600 transition-colors duration-300">
                  {new Date(profile.rejectedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-[#F5F1E8]/40 to-white overflow-hidden relative group">
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gradient-to-br from-[#2CA4BC]/5 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FileCheck className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="text-gray-800">Verification Documents</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 relative">
          {/* ID Proof */}
          <div className="bg-gradient-to-r from-[#F5F1E8]/95 via-[#F5F1E8]/80 to-transparent rounded-xl p-4 sm:p-5 border border-slate-200/50 shadow-md hover:shadow-xl transition-all duration-300 group/doc">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md group-hover/doc:scale-110 transition-transform duration-300">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm sm:text-base mb-1">
                    ID Proof
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600">Identity verification document</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewingDocument(profile.verificationDocuments.idProof)}
                className="w-full sm:w-auto bg-white hover:bg-[#2CA4BC] hover:text-white border-2 border-[#2CA4BC] text-[#2CA4BC] font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Document
              </Button>
            </div>
          </div>

          {/* Address Proof */}
          <div className="bg-gradient-to-r from-[#F5F1E8]/95 via-[#F5F1E8]/80 to-transparent rounded-xl p-4 sm:p-5 border border-slate-200/50 shadow-md hover:shadow-xl transition-all duration-300 group/doc">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md group-hover/doc:scale-110 transition-transform duration-300">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm sm:text-base mb-1">
                    Address Proof
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600">Address verification document</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewingDocument(profile.verificationDocuments.addressProof)}
                className="w-full sm:w-auto bg-white hover:bg-[#2CA4BC] hover:text-white border-2 border-[#2CA4BC] text-[#2CA4BC] font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Document
              </Button>
            </div>
          </div>

          {/* Additional Documents */}
          {profile.verificationDocuments.additionalDocuments &&
            profile.verificationDocuments.additionalDocuments.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                  <p className="font-bold text-slate-700 text-sm sm:text-base uppercase tracking-wide">
                    Additional Documents
                  </p>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                </div>
                {profile.verificationDocuments.additionalDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-[#F5F1E8]/95 via-[#F5F1E8]/80 to-transparent rounded-xl p-4 sm:p-5 border border-slate-200/50 shadow-md hover:shadow-xl transition-all duration-300 group/doc"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-md group-hover/doc:scale-110 transition-transform duration-300">
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm sm:text-base mb-1">
                            Document {index + 1}
                          </p>
                          <p className="text-xs sm:text-sm text-slate-600 break-all">
                            {doc.split("/").pop() || "Additional document"}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingDocument(doc)}
                        className="w-full sm:w-auto bg-white hover:bg-[#2CA4BC] hover:text-white border-2 border-[#2CA4BC] text-[#2CA4BC] font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Document
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </CardContent>
      </Card>

      {/* Document Viewer Dialog */}
      <Dialog open={!!viewingDocument} onOpenChange={() => setViewingDocument(null)}>
        <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col p-0 bg-white">
          <DialogHeader className="p-4 sm:p-6 border-b bg-gradient-to-r from-[#F5F1E8]/95 via-[#F5F1E8]/80 to-transparent">
            <DialogTitle className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#2CA4BC] to-[#1a5f6b] rounded-lg shadow-md">
                <FileText className="h-5 w-5 text-white" />
              </div>
              {viewingDocument?.split("/").pop() || "Document Preview"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 p-4 sm:p-6 flex items-center justify-center overflow-hidden bg-slate-50">
            {viewingDocument && (
              getFileType(viewingDocument) === "image" ? (
                <img
                  src={viewingDocument}
                  alt="Document preview"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
              ) : (
                <iframe
                  src={
                    getFileType(viewingDocument) === "pdf"
                      ? `${viewingDocument}#zoom=fit`
                      : viewingDocument
                  }
                  className="w-full h-full border-2 border-slate-300 rounded-lg shadow-2xl"
                  title="document"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}