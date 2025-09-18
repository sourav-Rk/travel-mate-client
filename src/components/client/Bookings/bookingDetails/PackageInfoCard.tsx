"use client"

import { motion } from "framer-motion"
import { MapPin, Calendar, Users, Clock, Tag } from "lucide-react"

interface PackageDetails {
  _id: string
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
  maxGroupSize: number
  images: string[]
  description: string
}

interface PackageInfoCardProps {
  packages: PackageDetails
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

export function PackageInfoCard({ packages }: PackageInfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.6 }}
      className="bg-white border border-gray-200 shadow-xl rounded-2xl overflow-hidden"
    >
      <div className="grid lg:grid-cols-2 gap-0">
        {/* Image Section */}
        <div className="relative h-64 lg:h-full">
          <img
            src={packages.images[0] || "/placeholder.svg"}
            alt={packages.packageName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="text-2xl font-bold mb-1">{packages.packageName}</h2>
            <p className="text-lg opacity-90">{packages.title}</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 lg:p-8">
          <div className="space-y-6">
            {/* Package Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-[#2CA4BC] flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Meeting Point</p>
                  <p className="font-semibold text-gray-900">{packages.meetingPoint}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Tag className="h-5 w-5 text-[#2CA4BC] flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Package Price</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(packages.price)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-[#2CA4BC] flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(packages.startDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-[#2CA4BC] flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(packages.endDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-[#2CA4BC] flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold text-gray-900">
                    {packages.duration.days} Days, {packages.duration.nights} Nights
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-[#2CA4BC] flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Max Group Size</p>
                  <p className="font-semibold text-gray-900">{packages.maxGroupSize} People</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Package Description</h3>
              <p className="text-gray-600 leading-relaxed line-clamp-4">{packages.description}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
