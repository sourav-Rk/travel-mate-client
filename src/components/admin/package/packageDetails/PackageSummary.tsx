"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"

interface PackageSummaryProps {
  packageName: string
  title: string
  category: string
  status: string
}

export function PackageSummary({ packageName, title, category, status }: PackageSummaryProps) {
  return (
    <Card className="border-slate-700 shadow-2xl bg-slate-900 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-400/10 via-purple-400/5 to-slate-800/50 border-b border-slate-700">
        <CardTitle className="text-slate-200 flex items-center gap-2 text-xl">
          <Info className="h-5 w-5 text-purple-400" />
          Package Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-2">{packageName}</h3>
          <p className="text-slate-400">{title}</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Category:</span>
            <span className="px-2 py-1 bg-purple-400/20 text-purple-300 rounded text-sm border border-purple-400/30">
              {category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Status:</span>
            <span
              className={`px-2 py-1 rounded text-sm border ${
                status === "active"
                  ? "bg-green-400/20 text-green-300 border-green-400/30"
                  : "bg-red-400/20 text-red-300 border-red-400/30"
              }`}
            >
              {status}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
