"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"

interface PackageDetailsProps {
  startDate: Date | null
  endDate: Date | null
  meetingPoint: string
}

export function PackageDetails({ startDate, endDate, meetingPoint }: PackageDetailsProps) {
  return (
    <Card className="border-slate-700 shadow-2xl bg-slate-900 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-400/10 via-purple-400/5 to-slate-800/50 border-b border-slate-700">
        <CardTitle className="text-slate-200 flex items-center gap-2 text-xl">
          <Calendar className="h-5 w-5 text-purple-400" />
          Trip Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
            <h4 className="font-semibold text-slate-200 mb-2">Start Date</h4>
            <p className="text-slate-400">{startDate ? new Date(startDate).toLocaleDateString() : "Not specified"}</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
            <h4 className="font-semibold text-slate-200 mb-2">End Date</h4>
            <p className="text-slate-400">{endDate ? new Date(endDate).toLocaleDateString() : "Not specified"}</p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
          <h4 className="font-semibold text-slate-200 mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-purple-400" />
            Meeting Point
          </h4>
          <p className="text-slate-400">{meetingPoint}</p>
        </div>
      </CardContent>
    </Card>
  )
}
