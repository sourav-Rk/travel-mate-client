"use client"

import { MapPin, Users, DollarSign, Clock, Tag } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { GuidePackageListingTableDto } from "@/types/api/guide"
import { useNavigate } from "react-router-dom"


interface TripCardProps {
  trip: GuidePackageListingTableDto
}

export function TripCard({ trip }: TripCardProps) {
 
  const navigate = useNavigate();
  const handleNavigateToDetails = () => {
     navigate(`/guide/package/${trip.packageId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="group overflow-hidden border border-gray-200 hover:border-[#2CA4BC]/30 hover:shadow-lg transition-all duration-300 bg-white">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={trip.images[0] || "/placeholder.svg?height=200&width=400&text=Trip+Image"}
          alt={trip.packageName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge className={`${getStatusColor(trip.status)} font-medium`}>{trip.status}</Badge>
        </div>
        {trip.isBlocked && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-red-500 text-white">Blocked</Badge>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[#1a5f6b] line-clamp-1 group-hover:text-[#2CA4BC] transition-colors">
            {trip.packageName}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">{trip.title}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {/* Duration */}
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4 text-[#2CA4BC]" />
            <span>
              {trip.duration.days}D/{trip.duration.nights}N
            </span>
          </div>

          {/* Group Size */}
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-4 w-4 text-[#2CA4BC]" />
            <span>Max {trip.maxGroupSize}</span>
          </div>

          {/* Category */}
          <div className="flex items-center gap-2 text-gray-600">
            <Tag className="h-4 w-4 text-[#2CA4BC]" />
            <span className="capitalize">{trip.category}</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign className="h-4 w-4 text-[#2CA4BC]" />
            <span className="font-medium">${trip.price}</span>
          </div>
        </div>

        {/* Meeting Point */}
        <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <MapPin className="h-4 w-4 text-[#2CA4BC] mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{trip.meetingPoint}</span>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleNavigateToDetails}
          className="w-full bg-[#2CA4BC] hover:bg-[#1a5f6b] text-white transition-colors duration-200"
        >
          View Details
        </Button>
      </div>
    </Card>
  )
}
