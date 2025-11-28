"use client";

import { Star, Calendar, User, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GuideReviewWithPackageDto } from "@/types/api/guide";

interface ReviewCardProps {
  review: GuideReviewWithPackageDto;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={cn(
              "transition-colors",
              i < rating
                ? "fill-[#2CA4BC] text-[#2CA4BC]"
                : "text-gray-300"
            )}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">
          {rating}.0
        </span>
      </div>
    );
  };

  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header with reviewer info and package */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
        {/* User Info */}
        <div className="flex items-center gap-3 flex-1">
          {review.userDetails.profileImage ? (
            <img
              src={review.userDetails.profileImage}
              alt={`${review.userDetails.firstName} ${review.userDetails.lastName}`}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#2CA4BC] to-[#2CA4BC]/70 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm sm:text-base font-medium">
                {getInitials(
                  review.userDetails.firstName,
                  review.userDetails.lastName
                )}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
              {review.userDetails.firstName} {review.userDetails.lastName}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <Calendar size={12} className="text-[#2CA4BC]" />
              {formatDate(review.createdAt)}
            </div>
          </div>
        </div>

        {/* Package Info */}
        <div className="flex items-center gap-2 bg-[#2CA4BC]/5 rounded-lg px-3 py-2 border border-[#2CA4BC]/10">
          <Package size={16} className="text-[#2CA4BC] flex-shrink-0" />
          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
            {review.packageDetails.packageName}
          </p>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-3">{renderStars(review.rating)}</div>

      {/* Comment */}
      {review.comment && (
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          {review.comment}
        </p>
      )}
    </div>
  );
}


