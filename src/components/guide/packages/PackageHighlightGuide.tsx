"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, Coffee, Wifi, Bed, Camera, Car } from "lucide-react"

export function PackageHighlights() {
  const highlights = [
    { icon: Plane, label: "Airport pickup & drop" },
    { icon: Coffee, label: "Breakfast" },
    { icon: Wifi, label: "WiFi in hotel" },
    { icon: Bed, label: "Stay" },
    { icon: Camera, label: "Sightseeing" },
    { icon: Car, label: "Transportation" },
  ]

  return (
    <Card className="w-full border-[#2CA4BC]/30 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/10 via-[#2CA4BC]/5 to-[#1a5f6b]/10 border-b border-[#2CA4BC]/20">
        <CardTitle className="text-[#1a5f6b] flex items-center gap-2 text-xl">
          <Camera className="h-5 w-5 text-[#2CA4BC]" />
          Tour Highlights
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon
            return (
              <div
                key={index}
                className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-[#2CA4BC]/5 hover:to-[#1a5f6b]/5 transition-all duration-300 border border-transparent hover:border-[#2CA4BC]/20"
              >
                <Icon className="h-5 w-5 text-[#2CA4BC] group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                <span className="text-sm text-gray-700 group-hover:text-[#1a5f6b] transition-colors duration-300 font-medium">
                  {highlight.label}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
