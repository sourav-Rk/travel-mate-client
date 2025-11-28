"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Languages,
  Award,
  FileText,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Mail,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { usePendingVerifications } from "@/hooks/local-guide/useLocalGuideVerification";
import {
  useVerifyLocalGuide,
  useRejectLocalGuide,
} from "@/hooks/local-guide/useLocalGuideVerification";
import { Spinner } from "@/components/Spinner";
import toast from "react-hot-toast";
import { LocalGuideRejectModal } from "./LocalGuideRejectModal";
import { DocumentModal } from "../vendor view/DocumentModal";
import type { LocalGuideProfile } from "@/types/local-guide";
import { cn } from "@/lib/utils";
import { ApiError } from "@/types/api/api";

export function LocalGuideVerificationDetail() {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<LocalGuideProfile | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    url: string;
    type: string;
  } | null>(null);

  const pendingQuery = usePendingVerifications(1, 100, "pending", true, undefined);
  const reviewingQuery = usePendingVerifications(1, 100, "reviewing", true, undefined);
  const verifiedQuery = usePendingVerifications(1, 100, "verified", true, undefined);
  const rejectedQuery = usePendingVerifications(1, 100, "rejected", true, undefined);

  const { mutate: verifyGuide } = useVerifyLocalGuide();
  const { mutate: rejectGuide } = useRejectLocalGuide();

  const isLoading =
    pendingQuery.isLoading ||
    reviewingQuery.isLoading ||
    verifiedQuery.isLoading ||
    rejectedQuery.isLoading;

  useEffect(() => {
    if (profileId) {
      const allProfiles = [
        ...(pendingQuery.data?.profiles || []),
        ...(reviewingQuery.data?.profiles || []),
        ...(verifiedQuery.data?.profiles || []),
        ...(rejectedQuery.data?.profiles || []),
      ];

      const foundProfile = allProfiles.find((p) => p._id === profileId);
      if (foundProfile) {
        setProfile(foundProfile);
      }
    }
  }, [
    profileId,
    pendingQuery.data,
    reviewingQuery.data,
    verifiedQuery.data,
    rejectedQuery.data,
  ]);

  const handleVerify = () => {
    if (!profileId) return;
    setIsVerifying(true);
    verifyGuide(profileId, {
      onSuccess: (response) => {
        toast.success(response.message || "Local guide verified successfully!");
        setIsVerifying(false);
        navigate("/admin/ad_pvt/local-guides");
      },
      onError: (error: ApiError) => {
        toast.error(
          error?.response?.data?.message || "Failed to verify local guide"
        );
        setIsVerifying(false);
      },
    });
  };

  const handleReject = (reason: string) => {
    if (!profileId) return;
    rejectGuide(
      {
        profileId,
        data: { rejectionReason: reason },
      },
      {
        onSuccess: (response) => {
          toast.success(response.message || "Local guide rejected successfully!");
          setIsRejectModalOpen(false);
          navigate("/admin/ad_pvt/local-guides");
        },
        onError: (error: ApiError) => {
          toast.error(
            error?.response?.data?.message || "Failed to reject local guide"
          );
        },
      }
    );
  };

  const handleDocumentView = (url: string, type: string) => {
    setSelectedDocument({ url, type });
  };

  const handleDocumentDownload = (url: string) => {
    window.open(url, "_blank");
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertTriangle className="h-12 w-12 text-gray-400" />
        <p className="text-gray-600 font-medium">Profile not found</p>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/ad_pvt/local-guides")}
          className="border-gray-300 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
      </div>
    );
  }

  const canVerify = profile.verificationStatus === "pending" || profile.verificationStatus === "reviewing";
  const canReject = profile.verificationStatus === "pending" || profile.verificationStatus === "reviewing";

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/ad_pvt/local-guides")}
              className="hover:bg-gray-100 text-gray-700 shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Verification Review
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Review verification request and documents
              </p>
            </div>
          </div>
          {canVerify && (
            <div className="flex items-center gap-3 sm:shrink-0">
              {canReject && (
                <Button
                  variant="outline"
                  onClick={() => setIsRejectModalOpen(true)}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                  disabled={isVerifying}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              )}
              <Button
                onClick={handleVerify}
                disabled={isVerifying}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify Guide
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Status Banner */}
        <Card className={cn(
          "border",
          profile.verificationStatus === "pending" && "bg-amber-50 border-amber-200",
          profile.verificationStatus === "reviewing" && "bg-blue-50 border-blue-200",
          profile.verificationStatus === "verified" && "bg-emerald-50 border-emerald-200",
          profile.verificationStatus === "rejected" && "bg-red-50 border-red-200"
        )}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                {profile.verificationStatus === "pending" && (
                  <Clock className="h-5 w-5 text-amber-600 shrink-0" />
                )}
                {profile.verificationStatus === "reviewing" && (
                  <Clock className="h-5 w-5 text-blue-600 shrink-0" />
                )}
                {profile.verificationStatus === "verified" && (
                  <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                )}
                {profile.verificationStatus === "rejected" && (
                  <XCircle className="h-5 w-5 text-red-600 shrink-0" />
                )}
                <div>
                  <p className="font-semibold text-gray-900 capitalize">
                    Status: {profile.verificationStatus}
                  </p>
                  <p className="text-sm text-gray-600">
                    Requested {formatDate(profile.verificationRequestedAt)}
                  </p>
                </div>
              </div>
              {profile.verificationStatus === "verified" && profile.verifiedAt && (
                <div className="text-left sm:text-right">
                  <p className="text-sm font-medium text-gray-900">Verified</p>
                  <p className="text-sm text-gray-600">{formatDate(profile.verifiedAt)}</p>
                </div>
              )}
              {profile.verificationStatus === "rejected" && profile.rejectedAt && (
                <div className="text-left sm:text-right">
                  <p className="text-sm font-medium text-gray-900">Rejected</p>
                  <p className="text-sm text-gray-600">{formatDate(profile.rejectedAt)}</p>
                </div>
              )}
            </div>
            {profile.rejectionReason && (
              <div className="mt-4 p-3 bg-white rounded-lg border border-red-200">
                <p className="text-sm font-semibold text-red-900 mb-1">Rejection Reason:</p>
                <p className="text-sm text-red-700">{profile.rejectionReason}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Information */}
            <Card className="border border-gray-200 bg-white">
              <CardHeader className="border-b border-gray-100 px-4 sm:px-6 py-4">
                <CardTitle className="flex items-center gap-2 text-gray-900 text-lg font-semibold">
                  <User className="h-5 w-5" />
                  Guide Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-gray-200">
                    <AvatarImage
                      src={profile.userDetails?.profileImage || profile.profileImage}
                      alt={`${profile.userDetails?.firstName} ${profile.userDetails?.lastName}`}
                    />
                    <AvatarFallback className="bg-gray-900 text-white text-xl font-semibold">
                      {profile.userDetails?.firstName?.[0] || "G"}
                      {profile.userDetails?.lastName?.[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      {profile.userDetails?.firstName && profile.userDetails?.lastName
                        ? `${profile.userDetails.firstName} ${profile.userDetails.lastName}`
                        : profile.userDetails?.firstName || profile.userDetails?.lastName || "Guide Name Not Available"}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm sm:text-base break-all">
                        {profile.userDetails?.email || "Email not available"}
                      </span>
                    </div>
                  </div>
                </div>

                {profile.bio && (
                  <>
                    <Separator className="bg-gray-100" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Bio</h4>
                      <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                    </div>
                  </>
                )}

                <Separator className="bg-gray-100" />

                {/* Location */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">City</p>
                        <p className="font-medium text-gray-900">{profile.location.city}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">State</p>
                        <p className="font-medium text-gray-900">{profile.location.state}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Country</p>
                        <p className="font-medium text-gray-900">{profile.location.country}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Coordinates</p>
                        <p className="font-medium text-gray-900 text-xs">
                          {profile.location.coordinates[1].toFixed(6)}, {profile.location.coordinates[0].toFixed(6)}
                        </p>
                      </div>
                    </div>
                    {profile.location.address && (
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Address</p>
                        <p className="text-sm text-gray-700">{profile.location.address}</p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="bg-gray-100" />

                {/* Languages */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    Languages
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((lang, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="px-3 py-1 bg-gray-50 text-gray-700 border-gray-200"
                      >
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Specialties */}
                {profile.specialties && profile.specialties.length > 0 && (
                  <>
                    <Separator className="bg-gray-100" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Specialties
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.specialties.map((specialty, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="px-3 py-1 bg-gray-900 text-white border-gray-900"
                          >
                            {specialty.replace("-", " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator className="bg-gray-100" />

                {/* Hourly Rate */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Hourly Rate
                  </h4>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{profile.hourlyRate} <span className="text-base font-normal text-gray-600">per hour</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Verification Documents */}
            <Card className="border border-gray-200 bg-white">
              <CardHeader className="border-b border-gray-100 px-4 sm:px-6 py-4">
                <CardTitle className="flex items-center gap-2 text-gray-900 text-lg font-semibold">
                  <FileText className="h-5 w-5" />
                  Verification Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-6">
                {/* ID Proof */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">ID Proof</h4>
                  <div className="relative group">
                    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors">
                      <img
                        src={profile.verificationDocuments.idProof}
                        alt="ID Proof"
                        className="w-full h-48 object-cover cursor-pointer"
                        onClick={() =>
                          handleDocumentView(
                            profile.verificationDocuments.idProof,
                            "ID Proof"
                          )
                        }
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            handleDocumentView(
                              profile.verificationDocuments.idProof,
                              "ID Proof"
                            )
                          }
                          className="bg-white hover:bg-gray-100 text-gray-900"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            handleDocumentDownload(
                              profile.verificationDocuments.idProof
                            )
                          }
                          className="bg-white hover:bg-gray-100 text-gray-900"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-100" />

                {/* Address Proof */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Address Proof</h4>
                  <div className="relative group">
                    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors">
                      <img
                        src={profile.verificationDocuments.addressProof}
                        alt="Address Proof"
                        className="w-full h-48 object-cover cursor-pointer"
                        onClick={() =>
                          handleDocumentView(
                            profile.verificationDocuments.addressProof,
                            "Address Proof"
                          )
                        }
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            handleDocumentView(
                              profile.verificationDocuments.addressProof,
                              "Address Proof"
                            )
                          }
                          className="bg-white hover:bg-gray-100 text-gray-900"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            handleDocumentDownload(
                              profile.verificationDocuments.addressProof
                            )
                          }
                          className="bg-white hover:bg-gray-100 text-gray-900"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Documents */}
                {profile.verificationDocuments.additionalDocuments &&
                  profile.verificationDocuments.additionalDocuments.length > 0 && (
                    <>
                      <Separator className="bg-gray-100" />
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                          Additional Documents
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {profile.verificationDocuments.additionalDocuments.map(
                            (doc, index) => (
                              <div key={index} className="space-y-2">
                                <div className="relative group">
                                  <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors">
                                    <img
                                      src={doc}
                                      alt={`Additional Document ${index + 1}`}
                                      className="w-full h-40 object-cover cursor-pointer"
                                      onClick={() =>
                                        handleDocumentView(
                                          doc,
                                          `Additional Document ${index + 1}`
                                        )
                                      }
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() =>
                                          handleDocumentView(
                                            doc,
                                            `Additional Document ${index + 1}`
                                          )
                                        }
                                        className="bg-white hover:bg-gray-100 text-gray-900"
                                      >
                                        <Eye className="h-3 w-3 mr-1" />
                                        View
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => handleDocumentDownload(doc)}
                                        className="bg-white hover:bg-gray-100 text-gray-900"
                                      >
                                        <Download className="h-3 w-3 mr-1" />
                                        Download
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-sm font-medium text-gray-700 text-center">
                                  Document {index + 1}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </>
                  )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Actions */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="border border-gray-200 bg-white">
              <CardHeader className="border-b border-gray-100 px-4 sm:px-6 py-4">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium mb-1">Total Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {profile.stats.totalSessions}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium mb-1">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {profile.stats.completedSessions}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium mb-1">Avg Rating</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {profile.stats.averageRating.toFixed(1)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium mb-1">Total Ratings</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {profile.stats.totalRatings}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card className="border border-gray-200 bg-white">
              <CardHeader className="border-b border-gray-100 px-4 sm:px-6 py-4">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Status</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "px-3 py-1",
                      profile.isAvailable
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    )}
                  >
                    {profile.isAvailable ? "Available" : "Not Available"}
                  </Badge>
                </div>
                {profile.availabilityNote && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">{profile.availabilityNote}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Document Modal */}
      {selectedDocument && (
        <DocumentModal
          selectedDocument={{ url: selectedDocument.url, index: 0 }}
          onClose={() => setSelectedDocument(null)}
          onDownload={(url) => handleDocumentDownload(url)}
        />
      )}

      {/* Reject Modal */}
      <LocalGuideRejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleReject}
        isLoading={false}
        guideName={`${profile.userDetails?.firstName} ${profile.userDetails?.lastName}`}
      />
    </div>
  );
}