"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Send, Award, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { GuideDetailsForClientDto } from "@/types/api/client"

export interface GuideReview {
  _id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
  }
  userAvatar?: string;
}


interface GuideReviewSectionProps {
  guideInfo: GuideDetailsForClientDto;
  bookingStatus: string;
  existingReviews?: GuideReview[];
  onSubmitReview?: (rating: number, comment: string) => void;
  isSubmitting?: boolean;
  canReviewGuide : boolean
}

export default function GuideReviewSection({
  guideInfo,
  bookingStatus,
  existingReviews = [],
  onSubmitReview,
  isSubmitting = false,
  canReviewGuide = true
}: GuideReviewSectionProps) {
  console.log(existingReviews,"-->guide reviews")
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
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white border border-gray-200 shadow-xl rounded-2xl overflow-hidden"
    >
      <div className="p-6">
        {/* Guide Info Header */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Guide Avatar with Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative"
            >
              <div className="w-24 h-24 relative">
                <Avatar className="w-full h-full border-4 border-white shadow-lg">
                  <AvatarImage 
                    src={guideInfo.profileImage || "/placeholder.svg"} 
                    alt={`${guideInfo.firstName} ${guideInfo.lastName}`}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white text-2xl font-bold">
                    {guideInfo.firstName.charAt(0)}{guideInfo.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                {/* Animated Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                  className="absolute -bottom-2 -right-2"
                >
                  <Badge className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs font-semibold">
                    <Award className="w-3 h-3 mr-1" />
                    Guide
                  </Badge>
                </motion.div>
              </div>
            </motion.div>

            {/* Guide Details */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {guideInfo.firstName} {guideInfo.lastName}
                  </h3>
                </div>

                {/* Write Review Button */}
                {canReview && canReviewGuide? (
                  <Button
                    onClick={() => setShowReviewModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Review Guide
                  </Button>
                ) : (
                  <div className="text-center">
                    <Button
                      disabled
                      className="bg-gray-300 text-gray-500 px-6 py-3 rounded-lg font-medium cursor-not-allowed"
                    >
                      Review Guide
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">Complete your trip to review</p>
                  </div>
                )}
              </div>

              {/* Guide Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center justify-center mb-1">
                    <Award className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm font-semibold text-gray-900">{guideInfo.yearOfExperience}+ Years</span>
                  </div>
                  <p className="text-xs text-gray-600">Experience</p>
                </div>
                
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="w-4 h-4 text-blue-600 mr-1" />
                    <span className="text-sm font-semibold text-gray-900">{guideInfo.totalTrips}+</span>
                  </div>
                  <p className="text-xs text-gray-600">Trips Led</p>
                </div>
                
                
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center justify-center mb-1">
                    <span className="text-sm font-semibold text-gray-900">{guideInfo.languageSpoken.length}</span>
                  </div>
                  <p className="text-xs text-gray-600">Languages</p>
                </div>
              </div>

              {/* Specialties and Languages */}
              <div className="flex flex-wrap gap-2">
                {guideInfo.languageSpoken.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{guideInfo.languageSpoken.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          <h4 className="text-xl font-bold text-gray-900 mb-4">Guide Reviews</h4>
          
          {existingReviews.length > 0 ? (
            <div className="space-y-6">
              {existingReviews.map((review, index) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    {/* User Avatar */}
                    <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 self-center sm:self-start">
                      <AvatarImage src={review.userAvatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-green-600 text-white font-medium text-sm">
                        {review.userId.firstName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Review Content */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-2">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">
                          {review.userId.firstName} {review.userId.lastName}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(review.createdAt.toString())}
                        </span>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex gap-1 mb-3">{renderStars(review.rating, false, "w-4 h-4 sm:w-5 sm:h-5")}</div>

                      {/* Comment */}
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base break-words">{review.comment}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Guide Reviews Yet</h3>
              <p className="text-gray-600 text-sm sm:text-base px-4">Be the first to share your experience with this guide!</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Review Your Guide</DialogTitle>
            <p className="text-sm text-gray-600">
              Share your experience with {guideInfo.firstName} {guideInfo.lastName}
            </p>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Rating Section */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate your guide</h3>
              <div className="flex justify-center gap-2 mb-4">{renderStars(userRating, true, "w-10 h-10")}</div>
              <p className="text-green-600 font-medium">
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
              <label htmlFor="guide-review-comment" className="block text-sm font-medium text-gray-700 mb-2">
                Share your experience with the guide
              </label>
              <Textarea
                id="guide-review-comment"
                placeholder="Tell others about your guide's knowledge, communication, and overall service..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-32 resize-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
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
                className="flex-1 bg-green-600 hover:bg-green-700"
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