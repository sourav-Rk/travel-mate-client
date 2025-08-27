"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Award } from "lucide-react"

interface PackageHighlightsProps {
  tags: string[]
}

export function PackageHighlights({ tags }: PackageHighlightsProps) {
  return (
    <Card className="border-black shadow-2xl bg-white backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gray-50 border-b border-black">
        <CardTitle className="text-gray-900 flex items-center gap-2 text-xl">
          <Award className="h-5 w-5 text-blue-600" />
          Package Highlights
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
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
