"use client"

import { motion } from "framer-motion"
import { Heart, Calendar, Clock, IndianRupee, Eye, Share2, AlertCircle, Tag } from "lucide-react"
import { useState } from "react"
import type { PackageDetailsWishlistDto } from "@/types/wishlistType"
import { useNavigate } from "react-router-dom"
import { useRemoveFromWishlistMutation } from "@/hooks/wishlist/useWishlist"
import toast from "react-hot-toast"

interface WishlistCardProps {
  package: PackageDetailsWishlistDto
  index: number
}

export function WishlistCard({ package: pkg, index }: WishlistCardProps) {
  const navigate = useNavigate();
  const [isRemoving, setIsRemoving] = useState(false);
  const {mutate : removeFromWishlist} = useRemoveFromWishlistMutation();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatCurrency = (amount: string): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number.parseInt(amount))
  }

  const isDeadlineNear = () => {
    const deadline = new Date(pkg.applicationDeadline)
    const now = new Date()
    const diffTime = deadline.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays > 0
  }

  const isDeadlinePassed = () => {
    return new Date(pkg.applicationDeadline) < new Date()
  }

  const handleRemoveFromWishlist = () => {
    setIsRemoving(true)
    removeFromWishlist(pkg._id,{
      onSuccess : (response) => {
        toast.success(response.message);
      },
      onError :(error :any) => {
        toast.error(error?.response.data.message || "Failed to remove")
      }
    })
  }

  const handleViewDetails = () => {
     navigate(`/packages/${pkg.packageId!}`)
  }

  const handleShare = () => {
    console.log(`Sharing ${pkg._id}`)
    // Share functionality
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isRemoving ? 0 : 1, y: 0, scale: isRemoving ? 0.95 : 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 hover:border-pink-300 group"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={pkg.images[0] || "/placeholder.svg"}
          alt={pkg.packageName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Status Badge */}
        <div
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pkg.status)}`}
        >
          {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
        </div>

        {/* Wishlist Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleShare}
            className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRemoveFromWishlist}
            className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500/80 transition-all duration-300"
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Deadline Warning */}
        {isDeadlineNear() && (
          <div className="absolute bottom-4 left-4 px-3 py-1 bg-amber-500/90 backdrop-blur-md rounded-full flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-white" />
            <span className="text-white text-xs font-medium">Deadline Soon</span>
          </div>
        )}

        {isDeadlinePassed() && (
          <div className="absolute bottom-4 left-4 px-3 py-1 bg-red-500/90 backdrop-blur-md rounded-full flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-white" />
            <span className="text-white text-xs font-medium">Deadline Passed</span>
          </div>
        )}

        {/* Price Tag */}
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/20 backdrop-blur-md rounded-full">
          <div className="flex items-center text-white text-sm font-bold">
            <IndianRupee className="w-3 h-3" />
            <span>{formatCurrency(pkg.price).replace("₹", "")}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
            {pkg.packageName}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-1">{pkg.title}</p>

          {/* Category and Tags */}
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">{pkg.category}</span>
            {pkg.tags && (
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500 truncate">{pkg.tags}</span>
              </div>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-pink-500" />
              <span>Start Date</span>
            </div>
            <span className="font-medium text-gray-900">{formatDate(pkg.startDate)}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4 text-pink-500" />
              <span>Duration</span>
            </div>
            <span className="font-medium text-gray-900">
              {pkg.duration.days}D / {pkg.duration.nights}N
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <AlertCircle className="w-4 h-4 text-pink-500" />
              <span>Deadline</span>
            </div>
            <span
              className={`font-medium ${
                isDeadlinePassed() ? "text-red-600" : isDeadlineNear() ? "text-amber-600" : "text-gray-900"
              }`}
            >
              {formatDate(pkg.applicationDeadline)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleViewDetails}
            className="flex-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
          <button
            onClick={handleRemoveFromWishlist}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
          >
            <Heart className="w-4 h-4 fill-current text-pink-500" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
