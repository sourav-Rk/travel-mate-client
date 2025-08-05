"use client"

import { useGetSignedUrlsMutation } from "@/hooks/common/useSignedUrls";
import { useVendorDetailsQuery } from "@/hooks/vendor/useVendorProfile";
import type { Vendor } from "@/services/vendor/vendorService";
import {
  User,
  Mail,
  Phone,
  Edit3,
  Building2,
  FileText,
  KeyRound,
  CheckCircle,
  Clock,
  XCircle,
  Camera,
  AlertCircle,
  MapPin,
  CreditCard,
  FileCheck,
  Eye,
  Search,
  X,
  Badge,
} from "lucide-react"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { Spinner } from "../Spinner";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Progress } from "@radix-ui/react-progress";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-select";


export function VendorProfile() {
  const navigate = useNavigate();
  const {mutate : getSignedUrls} = useGetSignedUrlsMutation("vendor");
  const {data,isLoading} = useVendorDetailsQuery();
  const [vendor,setVendor] = useState<Vendor>();
  const [docUrls, setDocUrls] = useState<string[]>([]);
  const [viewingDocument, setViewingDocument] = useState<{url: string, name: string} | null>(null);
  
  useEffect(() => {
    const fetchUrlsAndSetVendor = async () => {
      if(!data?.vendor) return;
      setVendor(data.vendor);

      if(data?.vendor?.kycDetails.documents?.length > 0){
         getUrls(data?.vendor?.kycDetails?.documents)
      }


    };
    fetchUrlsAndSetVendor()
  }, [data]);

    const getUrls = async (documents : string[]) => {
    if(!documents || documents.length === 0){
      console.log("no documents to fetch urls for");
      return;
    }
    console.log("fetching signed urls",documents)
   
      getSignedUrls(documents, {
        onSuccess: (data) => {
          setDocUrls(data || []);
        },
        onError :(error) =>{
          console.log("error fetching urls",error)
          
        }
      });

  };

  
const getProfileImageUrl = async (key: string) => {
  if (!key) return;
  console.log("fetching profile image signed url", key);

  getSignedUrls([key], {
    onSuccess: (data) => {
      if (data && data.length > 0) {
        setVendor((prev) =>
          prev ? { ...prev, profileImage: data[0] } : prev
        );
      }
    },
    onError: (err) => {
      console.error("error fetching profile image url", err);
    },
  });
};

  // Calculate profile completion
  const calculateCompletion = () => {
    const basicFields = [
      vendor?.firstName,
      vendor?.lastName,
      vendor?.email,
      vendor?.phone,
      vendor?.agencyName,
      vendor?.description,
      vendor?.profileImage,
    ]

    const addressFields = [
      vendor?.address.street,
      vendor?.address.city,
      vendor?.address.state,
      vendor?.address.pincode,
      vendor?.address.country,
    ]

    const kycFields = [vendor?.kycDetails.pan, vendor?.kycDetails.gstin, vendor?.kycDetails.registrationNumber]

    const allFields = [...basicFields, ...addressFields, ...kycFields]
    const documentsCount = vendor?.kycDetails.documents.length

    const filledFields = allFields.filter((field) => field && field.trim() !== "").length
    const totalFields = allFields.length + 3 
     
    if(documentsCount){
        return Math.round(((filledFields + documentsCount) / totalFields) * 100)
    }

  }

  const completionPercentage = calculateCompletion()
  const isProfileComplete = completionPercentage === 100

  const handleEditProfile = () => {
    navigate("/vendor/profile/edit")
  }

  const handleResetPassword = () => {
     navigate("/vendor/change-password")
  }

  const handleViewDocument = (documentUrl: string, documentName: string) => {
    if (documentUrl) {
      setViewingDocument({ url: documentUrl, name: documentName });
    } else {
      console.error('Document URL not available');
    }
  }

  const handleCloseDocumentViewer = () => {
    setViewingDocument(null);
  }


  const getStatusConfig = (status: string) => {
    switch (status) {
      case "verified":
        return {
          label: "Verified",
          icon: CheckCircle,
          className: "bg-green-100 text-green-800 border-green-200",
        }
      case "pending":
        return {
          label: "Pending",
          icon: Clock,
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        }
      case "reviewing":
        return {
          label: "Under Review",
          icon: Search,
          className: "bg-blue-100 text-blue-800 border-blue-200",
        }
      case "rejected":
        return {
          label: "Rejected",
          icon: XCircle,
          className: "bg-red-100 text-red-800 border-red-200",
        }
      default:
        return {
          label: "Unknown",
          icon: XCircle,
          className: "bg-gray-100 text-gray-800 border-gray-200",
        }
    }
  }

  const statusConfig = getStatusConfig(vendor?.status ? vendor.status : "verified");
  const StatusIcon = statusConfig.icon

   if(isLoading) return <Spinner/>

  // Document Viewer Modal
  if (viewingDocument) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 truncate">
              {viewingDocument.name}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseDocumentViewer}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Document Content */}
          <div className="flex-1 p-4 overflow-auto">
            <div className="w-full h-full flex items-center justify-center">
              <iframe
                src={viewingDocument.url}
                className="w-full h-[70vh] border border-slate-200 rounded-lg"
                title={viewingDocument.name}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
          </div>
          
          {/* Modal Footer */}
          <div className="flex items-center justify-between p-4 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={handleCloseDocumentViewer}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:ml-64">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-6 lg:p-8 pt-16 lg:pt-4">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Vendor Profile
            </h1>
            <p className="text-slate-600 text-sm md:text-base">Complete vendor information and business details</p>
          </div>

          {/* Profile Completion Card */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {isProfileComplete ? (
                    <CheckCircle className="h-6 w-6 text-green-300" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-yellow-300" />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">
                      {isProfileComplete ? "Profile Complete!" : "Complete Your Vendor Profile"}
                    </h3>
                    <p className="text-blue-100 text-sm">
                      {isProfileComplete
                        ? "All information and documents have been provided"
                        : "Complete all sections including KYC details and documents"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{completionPercentage}%</div>
                  <div className="text-blue-100 text-xs">Complete</div>
                </div>
              </div>
              <Progress value={completionPercentage} className="h-2 bg-blue-400" />
            </CardContent>
          </Card>

          {/* Main Profile Card */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* Profile Image */}
               <div className="relative">
              <div className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-white shadow-lg rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                {vendor?.profileImage ? (
                  <img 
                    src={vendor.profileImage} 
                    alt="Vendor Profile" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-white text-xl md:text-2xl font-bold">
                    {vendor?.firstName?.[0]}
                    {vendor?.lastName?.[0]}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-slate-100 rounded-full p-2 shadow-md">
                {/* <Camera className="h-4 w-4 text-slate-600" /> */}
              </div>
            </div>

                {/* Basic Info */}
                <div className="text-center lg:text-left flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                    {vendor?.firstName} {vendor?.lastName}
                  </h2>
                  <p className="text-lg text-slate-700 font-medium mb-3">{vendor?.agencyName}</p>
                  <p className="text-slate-600 mb-4">{vendor?.email}</p>
                  <Badge fontVariant="secondary" className={statusConfig.className}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig.label}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Contact Person</p>
                        <p className="text-slate-900 font-medium">
                          {vendor?.firstName} {vendor?.lastName}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Email</p>
                        <p className="text-slate-900 font-medium">{vendor?.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Phone</p>
                        <p className="text-slate-900 font-medium">{vendor?.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Business Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Business Information
                </h3>
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Agency Name</p>
                        <p className="text-slate-900 font-medium">{vendor?.agencyName}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-start gap-3">
                      <FileText className="h-4 w-4 text-slate-500 mt-1" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Description</p>
                        <p className="text-slate-700 leading-relaxed">{vendor?.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-slate-500 mt-1" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Street Address</p>
                        <p className="text-slate-900 font-medium">{vendor?.address.street}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">City</p>
                        <p className="text-slate-900 font-medium">{vendor?.address.city}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">State</p>
                        <p className="text-slate-900 font-medium">{vendor?.address.state}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Pincode & Country</p>
                        <p className="text-slate-900 font-medium">
                          {vendor?.address.pincode}, {vendor?.address.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* KYC Details */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  KYC Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">PAN Number</p>
                        <p className="text-slate-900 font-medium font-mono">{vendor?.kycDetails.pan}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <FileCheck className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">GSTIN</p>
                        <p className="text-slate-900 font-medium font-mono">{vendor?.kycDetails.gstin}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 md:col-span-2 lg:col-span-1">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Registration Number</p>
                        <p className="text-slate-900 font-medium font-mono">{vendor?.kycDetails.registrationNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Documents */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-blue-600" />
                  KYC Documents
                </h3>
                <div className="space-y-3">
                  {docUrls?.map((documentUrl, index) => {
                    const originalDocumentName = vendor?.kycDetails.documents[index] || `Document ${index + 1}`;
                    return (
                      <div key={index} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <FileCheck className="h-4 w-4 text-slate-500" />
                            <div>
                              <p className="font-medium text-slate-900">{originalDocumentName}</p>
                              <p className="text-sm text-slate-600">Uploaded and verified</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDocument(documentUrl, originalDocumentName)}
                              className="h-8 px-3"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={handleEditProfile}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  onClick={handleResetPassword}
                  variant="outline"
                  className="flex-1 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 bg-transparent"
                  size="lg"
                >
                  <KeyRound className="h-4 w-4 mr-2" />
                  Reset Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-slate-500">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
