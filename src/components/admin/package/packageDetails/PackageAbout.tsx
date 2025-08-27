"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

interface PackageAboutProps {
  description: string
}

export function PackageAbout({ description }: PackageAboutProps) {
  return (
    <Card className="border-black shadow-2xl bg-white backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 via-blue-25 to-gray-50 border-b border-black">
        <CardTitle className="text-gray-900 flex items-center gap-2 text-xl">
          <FileText className="h-5 w-5 text-blue-600" />
          About The Trip
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="prose prose-slate max-w-none">
          <p className="text-gray-700 leading-relaxed text-base md:text-lg">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
