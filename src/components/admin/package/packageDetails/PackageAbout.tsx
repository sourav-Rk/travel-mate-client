"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

interface PackageAboutProps {
  description: string
}

export function PackageAbout({ description }: PackageAboutProps) {
  return (
    <Card className="border-slate-700 shadow-2xl bg-slate-900 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-400/10 via-purple-400/5 to-slate-800/50 border-b border-slate-700">
        <CardTitle className="text-slate-200 flex items-center gap-2 text-xl">
          <FileText className="h-5 w-5 text-purple-400" />
          About The Trip
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-400 leading-relaxed text-base md:text-lg">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
