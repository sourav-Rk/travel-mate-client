"use client"

import type React from "react"
import { Star, User, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ReviewListDto {
  _id: string
  userId: {
    _id: string
    firstName: string
    lastName: string
  }
  rating: number
  comment: string
  createdAt: Date
}

interface ReviewsTableProps {
  reviews: ReviewListDto[]
  isLoading?: boolean
}

const ReviewsTable: React.FC<ReviewsTableProps> = ({ reviews, isLoading = false }) => {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={cn("transition-colors", i < rating ? "fill-[#2CA4BC] text-[#2CA4BC]" : "text-gray-300")}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">{rating}.0</span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2CA4BC]"></div>
      </div>
    )
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <Star size={48} className="text-gray-300 mb-4" />
        <p className="text-gray-600 font-medium">No reviews yet</p>
        <p className="text-gray-500 text-sm">Reviews will appear here</p>
      </div>
    )
  }

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-[#2CA4BC]/5 to-[#2CA4BC]/10 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Reviewer</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rating</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Comment</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <tr key={review._id} className="hover:bg-[#2CA4BC]/5 transition-colors duration-200">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#2CA4BC] to-[#2CA4BC]/70 rounded-full flex items-center justify-center flex-shrink-0">
                      <User size={20} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {review.userId.firstName} {review.userId.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">ID: {review.userId._id.slice(0, 8)}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{renderStars(review.rating)}</td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-700 line-clamp-2">{review.comment}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-[#2CA4BC]" />
                    {formatDate(review.createdAt)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 p-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            {/* Header with reviewer info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2CA4BC] to-[#2CA4BC]/70 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {review.userId.firstName} {review.userId.lastName}
                </p>
                <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-3">{renderStars(review.rating)}</div>

            {/* Comment */}
            <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReviewsTable
