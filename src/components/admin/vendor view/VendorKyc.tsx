"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FileCheck, CreditCard, Building2, FileText, Eye, Download } from "lucide-react"
import type { VendorData } from "@/types/User"

interface VendorKYCProps {
  vendor?: VendorData
  urls : string[]
  onDocumentView: (docUrl: string, index: number) => void
  onDownload: (docUrl: string) => void
}

export function VendorKYC({ vendor, onDocumentView, onDownload,urls }: VendorKYCProps) {
  return (
    <Card className="border-0 shadow-lg bg-white rounded-xl overflow-hidden">
      <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-8 py-6">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
          <div className="flex items-center justify-center w-10 h-10 bg-slate-900 rounded-lg">
            <FileCheck className="h-5 w-5 text-white" />
          </div>
          KYC Details & Documentation
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4 text-yellow-600" />
              <p className="text-sm font-semibold text-slate-700">PAN Number</p>
            </div>
            <p className="font-bold text-slate-900 text-lg">{vendor?.kycDetails.pan}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-green-600" />
              <p className="text-sm font-semibold text-slate-700">GSTIN</p>
            </div>
            <p className="font-bold text-slate-900 text-lg">{vendor?.kycDetails.gstin}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-semibold text-slate-700">Registration Number</p>
            </div>
            <p className="font-bold text-slate-900 text-lg">{vendor?.kycDetails.registrationNumber}</p>
          </div>
        </div>

        <Separator className="bg-slate-200" />

        <div>
          <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-700" />
            Uploaded Documents
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {urls.map((doc, index) => (
              <div key={index} className="relative group">
                <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                  <img
                    src={doc || "/placeholder.svg"}
                    alt={`Document ${index + 1}`}
                    className="w-full h-40 object-cover cursor-pointer transition-transform group-hover:scale-105"
                    onClick={() => onDocumentView(doc, index)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end justify-center pb-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onDocumentView(doc, index)}
                        className="h-8 text-xs bg-white/90 hover:bg-white text-slate-900 shadow-md"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onDownload(doc)}
                        className="h-8 text-xs bg-white/90 hover:bg-white text-slate-900 shadow-md"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium text-slate-700">Document {index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
