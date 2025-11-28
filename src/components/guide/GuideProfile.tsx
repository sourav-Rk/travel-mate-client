"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Mail,
  Phone,
  Users,
  FileText,
  Briefcase,
  Languages,
  CalendarDays,
  FileCheck,
  Eye,
  X,
  ArrowLeft,
  CheckCircle,
  Clock,
  Edit3,
  KeyRound,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useGuideProfileQuery } from "@/hooks/guide/useGuideProfile"

// Define the Guide interface based on your provided structure
interface Guide {
  firstName: string
  lastName: string
  email: string
  phone: string
  alternatePhone?: string
  status: "verified" | "pending"
  bio: string
  gender: "male" | "female" | "other"
  dob: string // YYYY-MM-DD format
  profileImage?: string
  yearOfExperience: string
  languageSpoken: string[]
  documents: string[]
}

// Helper to determine file type from URL extension
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

export function GuideProfile() {
  const navigate = useNavigate()
  const [guide, setGuide] = useState<Guide | null>(null)
  const [viewingDocument, setViewingDocument] = useState<{ url: string } | null>(null)
  const { data, isLoading, isError } = useGuideProfileQuery() ;

  useEffect(() => {
    if (data && data.guide) {
      setGuide(data.guide)
    }
  }, [data])

  // Handle loading and error states
  if (isLoading) return <div className="lg:ml-64 p-8 text-center">Loading guide profile...</div>
  if (isError) return <div className="lg:ml-64 p-8 text-center text-red-600">Error loading guide details.</div>
  if (!guide) return <div className="lg:ml-64 p-8 text-center">Guide profile not found.</div>

  const handleGoBack = () => {
    navigate(-1) // Navigates back to the previous page
  }

  const handleEditProfile = () => {
    navigate(`/guide/profile/edit`) // Navigate to an edit profile page
  }

  const handleResetPassword = () => {
    navigate(`/guide/change-password`) // Navigate to a change password page
  }

  const handleViewDocument = (documentUrl: string) => {
    setViewingDocument({ url: documentUrl })
  }

  const handleCloseDocumentViewer = () => {
    setViewingDocument(null)
  }

  const getStatusConfig = (status: Guide["status"]) => {
    switch (status) {
      case "verified":
        return { label: "Verified", icon: CheckCircle, className: "bg-green-100 text-green-800 border-green-200" }
      case "pending":
        return { label: "Pending", icon: Clock, className: "bg-yellow-100 text-yellow-800 border-yellow-200" }
      default:
        return { label: "Unknown", icon: X, className: "bg-gray-100 text-gray-800 border-gray-200" }
    }
  }

  const statusConfig = getStatusConfig(guide.status)
  const StatusIcon = statusConfig.icon

  return (
    <div className="lg:ml-64 p-4 md:p-6 lg:p-8 pt-16 lg:pt-4">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleGoBack} className="hover:bg-white/50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#1a5f6b] to-[#2CA4BC] bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-slate-600 text-sm md:text-base">
              Comprehensive overview of your personal and professional details
            </p>
          </div>
        </div>

        {/* Main Guide Details Card */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm  border-slate-200/60">
          <CardHeader className="pb-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Image */}
              <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-white shadow-lg">
                <AvatarImage src={guide.profileImage || "/placeholder.svg"} alt={guide.firstName} />
                <AvatarFallback className="bg-gradient-to-br from-[#2CA4BC] to-[#1a5f6b] text-white text-xl md:text-2xl font-bold">
                  {guide.firstName[0]}
                  {guide.lastName[0]}
                </AvatarFallback>
              </Avatar>

              {/* Basic Info */}
              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1a5f6b] mb-2">
                  {guide.firstName} {guide.lastName}
                </h2>
                <p className="text-slate-600 mb-4">{guide.email}</p>
                <Badge variant="secondary" className={statusConfig.className}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig.label}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-[#1a5f6b] mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-[#2CA4BC]" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50/80 rounded-lg p-4 border border-slate-200/60">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-[#2CA4BC]" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Email</p>
                      <p className="text-[#1a5f6b] font-medium">{guide.email}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50/80 rounded-lg p-4 border border-slate-200/60">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-[#2CA4BC]" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Phone</p>
                      <p className="text-[#1a5f6b] font-medium">{guide.phone}</p>
                    </div>
                  </div>
                </div>
                {guide.alternatePhone && (
                  <div className="bg-slate-50/80 rounded-lg p-4 border border-slate-200/60">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-[#2CA4BC]" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Alternate Phone</p>
                        <p className="text-[#1a5f6b] font-medium">{guide.alternatePhone}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-slate-200/60" />

            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-[#1a5f6b] mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-[#2CA4BC]" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50/80 rounded-lg p-4 border border-slate-200/60">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-[#2CA4BC]" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Gender</p>
                      <p className="text-[#1a5f6b] font-medium">{guide.gender}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50/80 rounded-lg p-4 border border-slate-200/60">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-4 w-4 text-[#2CA4BC]" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Date of Birth</p>
                      <p className="text-[#1a5f6b] font-medium">{new Date(guide.dob).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-200/60" />

            {/* Professional Information */}
            <div>
              <h3 className="text-lg font-semibold text-[#1a5f6b] mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[#2CA4BC]" />
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50/80 rounded-lg p-4 border border-slate-200/60">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 text-[#2CA4BC]" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Years of Experience</p>
                      <p className="text-[#1a5f6b] font-medium">{guide.yearOfExperience} years</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50/80 rounded-lg p-4 border border-slate-200/60">
                  <div className="flex items-start gap-3">
                    <Languages className="h-4 w-4 text-[#2CA4BC] mt-1" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Languages Spoken</p>
                      <p className="text-[#1a5f6b] font-medium">
                        {guide.languageSpoken?.join(", ") || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-200/60" />

            {/* Bio Section */}
            <div>
              <h3 className="text-lg font-semibold text-[#1a5f6b] mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#2CA4BC]" />
                About Me
              </h3>
              <div className="bg-slate-50/80 rounded-lg p-4 border border-slate-200/60">
                {guide.bio ? (
                  <p className="text-slate-700 leading-relaxed">{guide.bio}</p>
                ) : (
                  <p className="text-slate-500 italic">No bio provided. Tell others about yourself!</p>
                )}
              </div>
            </div>

            <Separator className="bg-slate-200/60" />

            {/* Documents */}
            <div>
              <h3 className="text-lg font-semibold text-[#1a5f6b] mb-4 flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-[#2CA4BC]" />
                Documents
              </h3>
              <div className="space-y-3">
                {guide.documents.length > 0 ? (
                  guide.documents.map((docUrl, index) => (
                    <div key={index} className="bg-slate-50/80 rounded-lg p-4 border border-slate-200/60">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <FileCheck className="h-4 w-4 text-[#2CA4BC]" />
                          <div>
                            <p className="font-medium text-[#1a5f6b]">
                              {docUrl.split("/").pop() || `Document ${index + 1}`}
                            </p>{" "}
                            {/* Display file name from URL */}
                            <p className="text-sm text-slate-600">Uploaded</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDocument(docUrl)}
                          className="h-8 px-3 border-[#2CA4BC]/30 text-[#1a5f6b] hover:bg-[#2CA4BC]/10 hover:border-[#2CA4BC]/50 transition-all duration-200 bg-transparent"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-slate-50/80 rounded-lg p-4 border border-slate-200/60 text-slate-500 italic">
                    No documents uploaded.
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-slate-200/60" />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleEditProfile}
                className="flex-1 bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] hover:from-[#2CA4BC]/90 hover:to-[#1a5f6b]/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                onClick={handleResetPassword}
                variant="outline"
                className="flex-1 border-[#2CA4BC]/30 hover:bg-[#2CA4BC]/10 hover:border-[#2CA4BC]/50 transition-all duration-200 bg-transparent text-[#1a5f6b]"
                size="lg"
              >
                <KeyRound className="h-4 w-4 mr-2" />
                Reset Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Viewer Modal */}
      <Dialog open={!!viewingDocument} onOpenChange={handleCloseDocumentViewer}>
        <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col p-0 bg-white rounded-lg shadow-2xl">
          <DialogHeader className="p-4 border-b border-gray-200 flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-800 truncate max-w-[calc(100%-40px)]">
              {viewingDocument?.url.split("/").pop() || "Document Preview"}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseDocumentViewer}
              className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogHeader>
          <div className="flex-1 p-4 flex items-center justify-center overflow-hidden">
            {viewingDocument?.url ? (
              getFileType(viewingDocument.url) === "image" ? (
                <img
                  src={viewingDocument.url || "/placeholder.svg"}
                  alt={"Document preview"}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              ) : (
                <iframe
                  src={
                    getFileType(viewingDocument.url) === "pdf" ? `${viewingDocument.url}#zoom=fit` : viewingDocument.url
                  }
                  className="w-full h-full border border-gray-200 rounded-lg"
                  title="document"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              )
            ) : (
              <div className="text-gray-500">No document to display.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
