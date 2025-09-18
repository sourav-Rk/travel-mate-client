"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export interface Review {
  _id : string;
  rating : number;
  comment : string;
  createdAt : Date;
  userId: {
    _id : string;
    firstName : string;
    lastName : string;
  }
  userAvatar?: string
}

interface PackageReviewSectionProps {
  packageId: string
  bookingStatus: string
  existingReviews?: Review[]
  averageRating?: number
  totalReviews?: number
  onSubmitReview?: (rating: number, comment: string) => void
  isSubmitting?: boolean
}

export default function PackageReviewSection({
  bookingStatus,
  existingReviews = [],
  averageRating = 0,
  totalReviews = 0,
  onSubmitReview,
  isSubmitting = false,
}: PackageReviewSectionProps) {
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")

  const canReview = bookingStatus === "completed"

  const handleStarClick = (rating: number) => {
    setUserRating(rating)
  }

  const handleStarHover = (rating: number) => {
    setHoverRating(rating)
  }

  const handleSubmit = () => {
    if (userRating === 0) return
    onSubmitReview?.(userRating, comment)
    setUserRating(0)
    setComment("")
    setShowReviewModal(false)
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hours ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`

    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`

    return date.toLocaleDateString()
  }

  const renderStars = (rating: number, interactive = false, size = "w-5 h-5") => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1
      const isActive = interactive ? (hoverRating || userRating) >= starValue : rating >= starValue

      return (
        <button
          key={index}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && handleStarClick(starValue)}
          onMouseEnter={() => interactive && handleStarHover(starValue)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`${size} transition-all duration-200 ${
            interactive ? "hover:scale-110 cursor-pointer" : "cursor-default"
          } ${isActive ? "text-yellow-400 fill-current" : "text-gray-300"}`}
        >
          <Star className="w-full h-full" />
        </button>
      )
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white border border-gray-200 shadow-xl rounded-2xl overflow-hidden"
    >
      <div className="p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Overall Rating</h2>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">{renderStars(averageRating)}</div>
                <span className="text-gray-500">({totalReviews.toLocaleString()})</span>
              </div>
            </div>
          </div>

          {/* Write Review Button */}
          {canReview ? (
            <Button
              onClick={() => setShowReviewModal(true)}
              className="bg-[#2CA4BC] hover:bg-[#2CA4BC]/90 text-white px-6 py-3 rounded-lg font-medium"
            >
              Write a review
            </Button>
          ) : (
            <div className="text-center">
              <Button
                disabled
                className="bg-gray-300 text-gray-500 px-6 py-3 rounded-lg font-medium cursor-not-allowed"
              >
                Write a review
              </Button>
              <p className="text-xs text-gray-500 mt-1">Complete your trip to review</p>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {existingReviews.length > 0 ? (
            existingReviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0"
              >
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarImage src={review.userAvatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-[#2CA4BC] text-white font-medium">
                      {review.userId.firstName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Review Content */}
                   <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900">
                      {review.userId.firstName} {review.userId.lastName}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(review.createdAt.toString())}
                    </span>
                  </div>
                  
                    {/* Rating */}
                    <div className="flex gap-1 mb-3">{renderStars(review.rating)}</div>

                    {/* Comment */}
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
              <p className="text-gray-600">Be the first to share your experience with this package!</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Write a Review</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Rating Section */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate your experience</h3>
              <div className="flex justify-center gap-2 mb-4">{renderStars(userRating, true, "w-10 h-10")}</div>
              <p className="text-[#2CA4BC] font-medium">
                {userRating === 0 && "Select a rating"}
                {userRating === 1 && "Poor"}
                {userRating === 2 && "Fair"}
                {userRating === 3 && "Good"}
                {userRating === 4 && "Very Good"}
                {userRating === 5 && "Excellent"}
              </p>
            </div>

            {/* Comment Section */}
            <div>
              <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">
                Share your experience
              </label>
              <Textarea
                id="review-comment"
                placeholder="Tell others about your experience with this package..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-32 resize-none focus:ring-2 focus:ring-[#2CA4BC] focus:border-transparent"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">{comment.length}/500 characters</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setShowReviewModal(false)}
                variant="outline"
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={userRating === 0 || isSubmitting}
                className="flex-1 bg-[#2CA4BC] hover:bg-[#2CA4BC]/90"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Posting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Post Review
                  </div>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
