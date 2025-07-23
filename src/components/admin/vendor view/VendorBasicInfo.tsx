"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import type { VendorData } from "@/types/User"

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Pending" },
  verified: { color: "bg-emerald-100 text-emerald-800 border-emerald-200", label: "Verified" },
  rejected: { color: "bg-red-100 text-red-800 border-red-200", label: "Rejected" },
  reviewing: { color: "bg-purple-100 text-purple-800 border-purple-200", label: "Reviewing" },
}

interface VendorBasicInfoProps {
  vendor?: VendorData
}

export function VendorBasicInfo({ vendor }: VendorBasicInfoProps) {
  const getStatusColor = (status?: string) => {
    return status && status in statusConfig
      ? statusConfig[status as keyof typeof statusConfig].color
      : "bg-gray-100 text-gray-800"
  }

  return (
    <Card className="xl:col-span-2 border-0 shadow-lg bg-white rounded-xl overflow-hidden">
      <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-8 py-6">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
          <div className="flex items-center justify-center w-10 h-10 bg-slate-900 rounded-lg">
            <User className="h-5 w-5 text-white" />
          </div>
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <div className="flex items-start gap-6">
          <Avatar className="h-20 w-20 ring-4 ring-slate-100">
            <AvatarImage src={vendor?.profileImage || "/placeholder.svg"} alt={vendor?.firstName} />
            <AvatarFallback className="text-xl font-semibold bg-slate-900 text-white">
              {vendor?.firstName
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{vendor?.firstName}</h3>
              <p className="text-slate-600 text-lg font-medium">{vendor?.agencyName}</p>
            </div>
            <Badge
              variant="outline"
              className={cn("font-medium text-sm px-3 py-1 border-0", getStatusColor(vendor?.status))}
            >
              {vendor?.status && statusConfig[vendor.status] ? statusConfig[vendor.status].label : "Unknown"}
            </Badge>
          </div>
        </div>

        <Separator className="bg-slate-200" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-lg">
                <Mail className="h-4 w-4 text-white" />
              </div>
              <p className="text-sm font-medium text-slate-600">Email Address</p>
            </div>
            <p className="font-semibold text-slate-900 break-all">{vendor?.email}</p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-lg">
                <Phone className="h-4 w-4 text-white" />
              </div>
              <p className="text-sm font-medium text-slate-600">Phone Number</p>
            </div>
            <p className="font-semibold text-slate-900">{vendor?.phone}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            Description
          </h4>
          <p className="text-slate-700 leading-relaxed">{vendor?.description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
