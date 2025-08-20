"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, MapPin, DollarSign } from "lucide-react"

interface PackageQuickStatsProps {
  duration: { days: number; nights: number }
  maxGroupSize: number
  meetingPoint: string
  price: number
}

export function PackageQuickStats({ duration, maxGroupSize, meetingPoint, price }: PackageQuickStatsProps) {
  return (
    <Card className="border-slate-700 shadow-2xl bg-slate-900 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-slate-800 border border-slate-700">
            <Calendar className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Duration</p>
            <p className="font-semibold text-slate-200">
              {duration.days}D/{duration.nights}N
            </p>
          </div>

          <div className="text-center p-4 rounded-lg bg-slate-800 border border-slate-700">
            <Users className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Group Size</p>
            <p className="font-semibold text-slate-200">Max {maxGroupSize}</p>
          </div>

          <div className="text-center p-4 rounded-lg bg-slate-800 border border-slate-700">
            <MapPin className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Meeting Point</p>
            <p className="font-semibold text-slate-200 text-xs">{meetingPoint}</p>
          </div>

          <div className="text-center p-4 rounded-lg bg-slate-800 border border-slate-700">
            <DollarSign className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Price</p>
            <p className="font-semibold text-slate-200">₹{price.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
