"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, Shield, FileText } from "lucide-react"
import type { TravelPackage } from "@/types/packageType"

interface PackageSummaryProps {
  packageData: TravelPackage
}

export function PackageSummary({ packageData }: PackageSummaryProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-[#1a5f6b] mb-2">Package Summary</h3>
        <p className="text-gray-600">Complete overview of inclusions, exclusions, and policies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inclusions */}
        <Card className="border-green-200 shadow-xl bg-white overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
            <CardTitle className="text-green-800 flex items-center gap-2 text-lg">
              <CheckCircle className="h-6 w-6" />
              What's Included
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {packageData.inclusions.map((inclusion, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-green-50 transition-colors duration-200"
                >
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-green-800 font-medium leading-relaxed">{inclusion}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exclusions */}
        <Card className="border-red-200 shadow-xl bg-white overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
            <CardTitle className="text-red-800 flex items-center gap-2 text-lg">
              <XCircle className="h-6 w-6" />
              What's Not Included
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {packageData.exclusions.map((exclusion, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors duration-200"
                >
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-red-800 font-medium leading-relaxed">{exclusion}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Policies */}
      <Card className="border-[#2CA4BC]/30 shadow-xl bg-white overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/10 via-[#2CA4BC]/5 to-[#1a5f6b]/10 border-b border-[#2CA4BC]/20">
          <CardTitle className="text-[#1a5f6b] flex items-center gap-2 text-xl">
            <Shield className="h-6 w-6 text-[#2CA4BC]" />
            Policies & Terms
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="bg-gradient-to-r from-[#2CA4BC]/5 to-[#1a5f6b]/5 p-6 rounded-xl border border-[#2CA4BC]/20">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="h-5 w-5 text-[#2CA4BC] mt-1 flex-shrink-0" />
              <h4 className="font-bold text-[#1a5f6b] text-lg">Cancellation Policy</h4>
            </div>
            <p className="text-gray-700 leading-relaxed pl-8">{packageData.cancellationPolicy}</p>
          </div>

          <Separator className="bg-[#2CA4BC]/20" />

          <div className="bg-gradient-to-r from-[#2CA4BC]/5 to-[#1a5f6b]/5 p-6 rounded-xl border border-[#2CA4BC]/20">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="h-5 w-5 text-[#2CA4BC] mt-1 flex-shrink-0" />
              <h4 className="font-bold text-[#1a5f6b] text-lg">Terms & Conditions</h4>
            </div>
            <p className="text-gray-700 leading-relaxed pl-8">{packageData.termsAndConditions}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
