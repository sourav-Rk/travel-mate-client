"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import type { VendorData } from "@/types/User"

interface VendorAddressProps {
  vendor?: VendorData
}

export function VendorAddress({ vendor }: VendorAddressProps) {
  return (
    <Card className="border-0 shadow-lg bg-white rounded-xl overflow-hidden">
      <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
        <CardTitle className="flex items-center gap-3 text-lg font-bold text-slate-900">
          <div className="flex items-center justify-center w-8 h-8 bg-slate-900 rounded-lg">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          Address Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Street Address</p>
            <p className="font-semibold text-slate-900">{vendor?.address.street}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">City</p>
              <p className="font-semibold text-slate-900 text-sm">{vendor?.address.city}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">State</p>
              <p className="font-semibold text-slate-900 text-sm">{vendor?.address.state}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Pincode</p>
              <p className="font-semibold text-slate-900 text-sm">{vendor?.address.pincode}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Country</p>
              <p className="font-semibold text-slate-900 text-sm">{vendor?.address.country}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
