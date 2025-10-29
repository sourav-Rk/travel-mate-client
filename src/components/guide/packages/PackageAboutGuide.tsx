"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

interface PackageAboutProps {
  description: string
}

export function PackageAbout({ description }: PackageAboutProps) {
  return (
    <Card className="w-full border-[#2CA4BC]/30 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/10 via-[#2CA4BC]/5 to-[#1a5f6b]/10 border-b border-[#2CA4BC]/20">
        <CardTitle className="text-[#1a5f6b] flex items-center gap-2 text-xl">
          <FileText className="h-5 w-5 text-[#2CA4BC]" />
          About The Trip
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg md:text-lg">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
