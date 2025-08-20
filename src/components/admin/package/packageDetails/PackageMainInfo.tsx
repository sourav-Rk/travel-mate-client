"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Star, Clock } from "lucide-react"

interface PackageMainInfoProps {
  packageName: string
  title: string
  description: string
  category: string
  tags: string[]
  duration: { days: number; nights: number }
  maxGroupSize: number
  price: number
  meetingPoint: string
  status: string
}

export function PackageMainInfo({
  packageName,
  title,
  description,
  category,
  tags,
  duration,
  maxGroupSize,
  price,
  meetingPoint,
  status,
}: PackageMainInfoProps) {
  return (
    <Card className="border-slate-700 shadow-2xl bg-slate-900 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-3">
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
            <h1 className="text-2xl font-bold text-slate-200">{packageName}</h1>
            <p className="text-lg text-slate-300">{title}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-slate-800 border border-slate-700">
              <Clock className="h-5 w-5 text-purple-400 mx-auto mb-1" />
              <p className="text-xs text-slate-400">Duration</p>
              <p className="font-semibold text-slate-200 text-sm">
                {duration.days}D/{duration.nights}N
              </p>
            </div>

            <div className="text-center p-3 rounded-lg bg-slate-800 border border-slate-700">
              <Users className="h-5 w-5 text-purple-400 mx-auto mb-1" />
              <p className="text-xs text-slate-400">Group Size</p>
              <p className="font-semibold text-slate-200 text-sm">Max {maxGroupSize}</p>
            </div>

            <div className="text-center p-3 rounded-lg bg-slate-800 border border-slate-700">
              <MapPin className="h-5 w-5 text-purple-400 mx-auto mb-1" />
              <p className="text-xs text-slate-400">Meeting Point</p>
              <p className="font-semibold text-slate-200 text-xs truncate">{meetingPoint}</p>
            </div>

            <div className="text-center p-3 rounded-lg bg-slate-800 border border-slate-700">
              <Star className="h-5 w-5 text-purple-400 mx-auto mb-1" />
              <p className="text-xs text-slate-400">Price</p>
              <p className="font-semibold text-slate-200 text-sm">₹{price.toLocaleString()}</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-200">Description</h3>
            <p className="text-slate-400 leading-relaxed">{description}</p>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-200">Highlights</h3>
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
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
