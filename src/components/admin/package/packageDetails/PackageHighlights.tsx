"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Award } from "lucide-react"

interface PackageHighlightsProps {
  tags: string[]
}

export function PackageHighlights({ tags }: PackageHighlightsProps) {
  return (
    <Card className="border-slate-700 shadow-2xl bg-slate-900 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-400/10 via-purple-400/5 to-slate-800/50 border-b border-slate-700">
        <CardTitle className="text-slate-200 flex items-center gap-2 text-xl">
          <Award className="h-5 w-5 text-purple-400" />
          Package Highlights
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-400/20 text-purple-300 border border-purple-400/30"
            >
              <Star className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
