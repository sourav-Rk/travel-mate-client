"use client"

import { motion } from "framer-motion"
import {
  Calendar,
  MapPin,
  Eye,
  Clock,
  IndianRupee,
  Star,
  CheckCircle,
  Camera,
  Download,
  Share2,
  MessageCircle,
  Award,
  Users,
} from "lucide-react"
import { useState } from "react"

interface CompletedTrip {
  id: string
  packageName: string
  title: string
  meetingPoint: string
  price: number
  startDate: string
  endDate: string
  duration: {
    days: number
    nights: number
  }
  images: string[]
  completedDate: string
  rating?: number
  userRating?: number
  groupSize: number
  maxGroupSize: number
  highlights: string[]
}

interface CompletedTripsProps {
  trips: CompletedTrip[]
  searchQuery?: string
}

export default function CompletedTrips({ trips = [], searchQuery = "" }: CompletedTripsProps) {
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null)

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const handleViewDetails = (tripId: string): void => {
    console.log(`Viewing details for trip: ${tripId}`)
    // Navigate to trip details
  }

  const handleDownloadCertificate = (tripId: string): void => {
    console.log(`Downloading certificate for trip: ${tripId}`)
    // Download completion certificate
  }

  const handleShareTrip = (tripId: string): void => {
    console.log(`Sharing trip: ${tripId}`)
    // Share trip experience
  }

  const handleWriteReview = (tripId: string): void => {
    console.log(`Writing review for trip: ${tripId}`)
    // Open review modal
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} className={`w-4 h-4 ${index < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  const filteredTrips = trips.filter(
    (trip) =>
      trip.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.meetingPoint.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (filteredTrips.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Completed Trips</h3>
        <p className="text-gray-600">You haven't completed any trips yet. Start exploring!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-50 to-emerald-100/50 border border-green-200 rounded-2xl p-4 lg:p-6"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Travel Achievements</h3>
            <p className="text-green-700 text-sm leading-relaxed mb-4">
              Congratulations on completing {filteredTrips.length} amazing{" "}
              {filteredTrips.length === 1 ? "journey" : "journeys"}! Your travel memories are now part of your story.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-700 rounded-full text-xs font-medium">
                <CheckCircle className="w-3 h-3" />
                {filteredTrips.length} Trips Completed
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-700 rounded-full text-xs font-medium">
                <Star className="w-3 h-3" />
                Average Rating: 4.8
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-700 rounded-full text-xs font-medium">
                <Users className="w-3 h-3" />
                Travel Community Member
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Completed Trips Grid */}
      <div className="grid gap-4 lg:gap-6">
        {filteredTrips.map((trip, index) => (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 hover:border-green-500/30 group relative"
          >
            {/* Completion Badge */}
            <div className="absolute top-4 left-4 z-10 px-3 py-2 rounded-full bg-green-500 backdrop-blur-md border border-white/20">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">Completed</span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row">
              {/* Image Section */}
              <div className="lg:w-80 h-56 lg:h-auto relative overflow-hidden">
                <img
                  src={trip.images[0] || "/placeholder.svg"}
                  alt={trip.packageName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-transparent to-black/40" />

                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    onClick={() => handleShareTrip(trip.id)}
                    className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownloadCertificate(trip.id)}
                    className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                {/* Completion Date */}
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/20 backdrop-blur-md rounded-full">
                  <span className="text-white text-xs">Completed on {formatDate(trip.completedDate)}</span>
                </div>

                {/* Photo Count */}
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/20 backdrop-blur-md rounded-full flex items-center gap-1">
                  <Camera className="w-3 h-3 text-white" />
                  <span className="text-white text-xs">{trip.images.length} Photos</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-6">
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors line-clamp-2">
                        {trip.packageName}
                      </h3>
                      <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                        {renderStars(trip.rating || 5)}
                        <span className="text-sm font-semibold text-gray-700 ml-1">{trip.rating || 5.0}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">{trip.title}</p>

                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-green-500" />
                      <span className="text-sm">{trip.meetingPoint}</span>
                    </div>

                    {/* Trip Details Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <div>
                          <p className="text-gray-500 text-xs">Travel Period</p>
                          <p className="font-medium text-gray-800">
                            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <div>
                          <p className="text-gray-500 text-xs">Duration</p>
                          <p className="font-medium text-gray-800">
                            {trip.duration.days} Days / {trip.duration.nights} Nights
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <div>
                          <p className="text-gray-500 text-xs">Group Size</p>
                          <p className="font-medium text-gray-800">
                            {trip.groupSize} / {trip.maxGroupSize} People
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Trip Highlights */}
                    {trip.highlights && trip.highlights.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">Trip Highlights</p>
                        <div className="flex flex-wrap gap-2">
                          {trip.highlights.slice(0, 3).map((highlight, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
                            >
                              {highlight}
                            </span>
                          ))}
                          {trip.highlights.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              +{trip.highlights.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Section */}
                  <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6">
                    {/* Left Section - Price and Rating */}
                    <div className="lg:min-w-48">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50/30 rounded-2xl p-4">
                        <div className="text-center mb-3">
                          <div className="flex items-center justify-center text-2xl font-bold text-green-600 mb-1">
                            <IndianRupee className="w-5 h-5" />
                            <span>{formatCurrency(trip.price).replace("₹", "")}</span>
                          </div>
                          <p className="text-xs text-gray-500">Total Trip Cost</p>
                        </div>

                        {/* User Rating Section */}
                        <div className="border-t border-green-200 pt-3">
                          <p className="text-xs text-gray-600 mb-2">Your Rating</p>
                          <div className="flex items-center justify-center gap-1">
                            {renderStars(trip.userRating || 0)}
                          </div>
                          {!trip.userRating && (
                            <button
                              onClick={() => handleWriteReview(trip.id)}
                              className="w-full mt-2 text-xs text-green-600 hover:text-green-700 font-medium"
                            >
                              Rate this trip
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex-1 flex flex-col justify-end">
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                        <button
                          onClick={() => handleViewDetails(trip.id)}
                          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>

                        <button
                          onClick={() => handleWriteReview(trip.id)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Review
                        </button>

                        <button
                          onClick={() => handleDownloadCertificate(trip.id)}
                          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
                        >
                          <Award className="w-4 h-4" />
                          Certificate
                        </button>
                      </div>

                      {/* Completion Status */}
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>Trip Status</span>
                          <span className="text-green-600 font-medium">Successfully Completed</span>
                        </div>
                        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full w-full bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
