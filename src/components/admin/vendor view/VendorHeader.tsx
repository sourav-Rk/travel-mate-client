"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"

interface VendorHeaderProps {
  isUpdating: boolean
  vendorStatus?: string
  vendorId?: string
  vendorName ?: string;
  onStatusUpdate: (vendorId: string, status: "verified" | "rejected", reason ?: string) => void
  onReject: () => void
}

export function VendorHeader({ isUpdating, vendorStatus, vendorId, onStatusUpdate, onReject,vendorName }: VendorHeaderProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Vendor Details</h1>
          <p className="text-slate-600 text-lg">Review and manage vendor information</p>
             {vendorName && (
            <p className="text-slate-500">
              Currently viewing: <span className="font-medium text-slate-700">{vendorName}</span>
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {vendorStatus !=="verified" && 
          <Button
            variant="outline"
            onClick={onReject}
            disabled={isUpdating || vendorStatus === "rejected"}
            className="flex items-center gap-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all"
          >
            <XCircle className="h-4 w-4" />
            Reject Vendor
          </Button>}
          
          {vendorStatus !=="verified" && 
          <Button
            onClick={() => onStatusUpdate(vendorId, "verified")}
            disabled={isUpdating || vendorStatus === "verified"}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
          >
            <CheckCircle className="h-4 w-4" />
            Verify Vendor
          </Button>
          }
          
        </div>
      </div>
    </div>
  )
}
