"use client"

import { Badge } from "@/components/ui/badge"
import { Calendar, Users } from "lucide-react"

interface PackageDetailsHeaderProps {
  packageName: string
  title: string
  category: string
  status: string
  duration: { days: number; nights: number }
  maxGroupSize: number
  price: number
}

export function PackageDetailsHeader({
  packageName,
  title,
  category,
  status,
  duration,
  maxGroupSize,
  price,
}: PackageDetailsHeaderProps) {
  return (
    <div className="bg-slate-900 border-b border-slate-700 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="bg-purple-400/20 text-purple-300 border-purple-400/30">
                {category}
              </Badge>
              <Badge
                variant="outline"
                className={
                  status === "active"
                    ? "bg-green-400/20 text-green-300 border-green-400/30"
                    : "bg-red-400/20 text-red-300 border-red-400/30"
                }
              >
                {status}
              </Badge>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-200">{packageName}</h1>
            <p className="text-slate-400 text-lg">{title}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 lg:text-right">
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-purple-400" />
                <span>
                  {duration.days}D/{duration.nights}N
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-purple-400" />
                <span>Max {maxGroupSize}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-200">₹{price.toLocaleString()}</p>
              <p className="text-sm text-slate-400">per person</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
