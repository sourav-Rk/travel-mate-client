"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Mail, Phone, MapPin, FileText, CheckCircle, XCircle, Eye, Download, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUserDetailsQuery } from "@/hooks/admin/useUserDetails"
import { getUserDetails } from "@/services/admin/admin.service"
import { useParams } from "react-router-dom"
import { Spinner } from "../Spinner"
import type { VendorData } from "@/types/User"
import toast from "react-hot-toast"
import { useVendorStatusUpdateMutation } from "@/hooks/admin/useVendorStatusUpdate"

const statusConfig : Record<string, { label: string; color: string }> = {
  pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Pending" },
  verified: { color: "bg-green-100 text-green-800 border-green-200", label: "Verified" },
  rejected: { color: "bg-red-100 text-red-800 border-red-200", label: "Rejected" },
  reviewing :{ color: "bg-orange-100 text-red-800 border-red-200", label: "Reviewing" },
}

export default function VendorView() {
  const [vendor,setVendor] = useState<VendorData>()
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<{ url: string; index: number } | null>(null);
  const {userId}= useParams<{userId: string}>();
  if(!userId) return <div>Invalid User Id</div>
  const {mutate : updateStatus} = useVendorStatusUpdateMutation();

  const {data,isLoading} = useUserDetailsQuery<VendorData>(
    getUserDetails,
    "vendor",
    userId
  );

  useEffect(() =>{
    if(!data) return
    setVendor(data?.user)
  })
   
  if(isLoading) return <Spinner/>

  const handleStatusUpdate = async (vendorId:any, newStatus: "verified" | "rejected") => {
    setIsUpdating(true)
    updateStatus({vendorId,status:newStatus},{
      onSuccess :(response) =>{
        toast.success(`${response.message}`);
      },
      onError :(error : any) =>{
        toast.error(error)
      }
    });
    setIsUpdating(false)
  }

  const handleDocumentView = (docUrl: string, index: number) => {
    setSelectedDocument({ url: docUrl, index })
  }

  function getStatusColor(status?: string) {
  return status && status in statusConfig
    ? statusConfig[status as keyof typeof statusConfig].color
    : "bg-gray-100 text-gray-800";
  }

  const handleDownload = (docUrl: string) => {
    const link = document.createElement("a")
    link.href = docUrl
    link.download = `document-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="ml-0 lg:ml-64 min-h-screen bg-gray-50 transition-all duration-300">
      <div className="p-4 lg:p-6 pt-16 lg:pt-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendor Details</h1>
            <p className="text-gray-600">Review and manage vendor information</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleStatusUpdate(vendor?._id,"rejected")}
              disabled={isUpdating || vendor?.status === "rejected"}
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
            <Button
              onClick={() => handleStatusUpdate(vendor?._id,"verified")}
              disabled={isUpdating || vendor?.status === "verified"}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Verify
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={vendor?.profileImage || "/placeholder.svg"} alt={vendor?.firstName} />
                  <AvatarFallback className="text-lg">
                    {vendor?.firstName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{vendor?.firstName}</h3>
                  <p className="text-gray-600">{vendor?.agencyName}</p>
                  <Badge variant="outline" className={cn("mt-2", getStatusColor(vendor?.status))}>
                    {vendor?.status && statusConfig[vendor.status]
                      ? statusConfig[vendor.status].label
                      : "Unknown"}
                  </Badge>

                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium break-all">{vendor?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{vendor?.phone}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <p className="text-gray-700 leading-relaxed text-sm">{vendor?.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Street</p>
                <p className="font-medium text-sm">{vendor?.address.street}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">City</p>
                  <p className="font-medium text-sm">{vendor?.address.city}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">State</p>
                  <p className="font-medium text-sm">{vendor?.address.state}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Pincode</p>
                  <p className="font-medium text-sm">{vendor?.address.pincode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="font-medium text-sm">{vendor?.address.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KYC Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              KYC Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">PAN Number</p>
                <p className="font-medium text-sm">{vendor?.kycDetails.pan}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">GSTIN</p>
                <p className="font-medium text-sm">{vendor?.kycDetails.gstin}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Registration Number</p>
                <p className="font-medium text-sm">{vendor?.kycDetails.registrationNumber}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-4">Documents</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {vendor?.kycDetails.documents.map((doc, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={doc || "/placeholder.svg"}
                      alt={`Document ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border cursor-pointer transition-transform hover:scale-105"
                      onClick={() => handleDocumentView(doc, index)}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleDocumentView(doc, index)}
                        className="h-8 text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleDownload(doc)} className="h-8 text-xs">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Preview Modal */}
        <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="flex items-center justify-between">
                <span>Document {selectedDocument ? selectedDocument.index + 1 : ""}</span>
                <Button variant="ghost" size="sm" onClick={() => setSelectedDocument(null)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="px-6 pb-6">
              {selectedDocument && (
                <div className="space-y-4">
                  <img
                    src={selectedDocument.url || "/placeholder.svg"}
                    alt={`Document ${selectedDocument.index + 1}`}
                    className="w-full max-h-[60vh] object-contain rounded-lg border"
                  />
                  <div className="flex justify-center">
                    <Button onClick={() => handleDownload(selectedDocument.url)} className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download Document
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
