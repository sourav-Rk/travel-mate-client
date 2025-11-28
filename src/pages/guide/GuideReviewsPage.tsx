"use client";

import { Star } from "lucide-react";
import { useGuideReviewsQuery } from "@/hooks/guide/useGuideReviews";
import ReviewCard from "@/components/guide/reviews/ReviewCard";

export default function GuideReviewsPage() {
  const { data, isLoading, error } = useGuideReviewsQuery();

  const reviews = data?.data?.reviews || [];
  const averageRating = data?.data?.averageRating || 0;
  const totalReviews = data?.data?.totalReviews || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen md:ml-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2CA4BC]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 md:ml-64">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-lg font-semibold text-red-900 mb-2">
            Error Loading Reviews
          </h2>
          <p className="text-sm text-red-700">
            {error instanceof Error ? error.message : "Failed to load reviews"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 md:ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            My Reviews
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600">
            Reviews from clients about your services
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          {/* Total Reviews Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">
                  Total Reviews
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  {totalReviews}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-[#2CA4BC]/10 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                <Star size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#2CA4BC]" />
              </div>
            </div>
          </div>

          {/* Average Rating Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">
                  Average Rating
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-[#2CA4BC]/10 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                <Star
                  size={16}
                  className="sm:w-5 sm:h-5 lg:w-6 lg:h-6 fill-[#2CA4BC] text-[#2CA4BC]"
                />
              </div>
            </div>
          </div>

          {/* Overall Performance Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                  Overall Performance
                </p>
                <div className="flex items-center gap-1 sm:gap-2 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={`sm:w-4 sm:h-4 ${
                        i < Math.round(averageRating)
                          ? "fill-[#2CA4BC] text-[#2CA4BC]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">
              All Reviews ({totalReviews})
            </h2>
          </div>

          {reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 lg:py-16 px-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Star size={24} className="sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-gray-300" />
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                No Reviews Yet
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 text-center max-w-md px-2">
                You haven't received any reviews from clients yet. Reviews will
                appear here once clients rate your services.
              </p>
            </div>
          ) : (
            <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
              {reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

