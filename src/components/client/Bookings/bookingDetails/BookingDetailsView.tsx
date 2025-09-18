"use client";
import { BookingHeader } from "./BookingHeader";
import { PackageInfoCard } from "./PackageInfoCard";
import { PaymentSummary } from "./PaymentSummary";
import { PaymentDetailsGrid } from "./PaymentDetailsGrid";
import { BookingProgress } from "./BookingProgress";
import type { AdvancePayment, FullPayment } from "@/types/bookingType";
import { useNavigate } from "react-router-dom";
import ReviewSection, { type Review } from "./ReviewSection";
import { useAddReviewMutation, useGetPackageReviewsQuery } from "@/hooks/review/useReview";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface PackageDetails {
  _id: string;
  packageId?: string;
  packageName: string;
  title: string;
  meetingPoint: string;
  price: number;
  startDate: string;
  endDate: string;
  duration: {
    days: number;
    nights: number;
  };
  maxGroupSize: number;
  images: string[];
  description: string;
}

export interface BookingDetailsProps {
  bookingDetails: {
    _id: string;
    bookingId?: string;
    packageId: string;
    userId: string;
    isWaitlisted: boolean;
    status: string;
    advancePayment: AdvancePayment | null;
    fullPayment: FullPayment | null;
  };
  packages: PackageDetails;
}

export default function BookingDetailsView({
  bookingDetails,
  packages,
}: BookingDetailsProps) {
  const [isSubmitting,setIsSubmitting] = useState(false);
  const [reviews,setReviews] = useState<Review[]>([]);
  const navigate = useNavigate();
  const {data : reviewData} = useGetPackageReviewsQuery(bookingDetails.packageId);
  const { mutate: addReview } = useAddReviewMutation();

  useEffect(() =>{
    console.log("triggered reviews")
     if(reviewData){
      setReviews(reviewData?.reviews)
     }
  },[reviewData])

  const {
    _id,
    packageId,
    bookingId,
    userId,
    isWaitlisted,
    status,
    advancePayment,
    fullPayment,
  } = bookingDetails;

  const totalAmount = packages.price;
  const paidAmount =
    (advancePayment?.paid ? advancePayment.amount : 0) +
    (fullPayment?.paid ? fullPayment.amount : 0);
  const pendingAmount = totalAmount - paidAmount;

  const handlePay = () => {
    navigate(`/packages/checkout/${bookingDetails._id}/${packageId}`);
  };

  const handleAddReview = (rating: number, comment: string) => {
  setIsSubmitting(true);
  addReview(
    {
      targetType: "package",
      rating,
      comment,
      packageId,
    },
    {
      onSuccess: (response) => {
        setIsSubmitting(false);
        toast.success(response.message);
      },
      onError: (error : any) => {
        setIsSubmitting(false);
        toast.error(error?.response?.data.message);
      },
    }
  );
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <BookingHeader
            bookingId={_id}
            bookingCustomId={bookingId!}
            status={status}
            isWaitlisted={isWaitlisted}
          />

          {/* Package Information */}
          <PackageInfoCard packages={packages} />

          {/* Payment Summary Cards */}
          <PaymentSummary
            totalAmount={totalAmount}
            paidAmount={paidAmount}
            pendingAmount={pendingAmount}
            packageId={packages.packageId!}
          />

          {/* Payment Details Grid */}
          <PaymentDetailsGrid
            advancePayment={advancePayment}
            fullPayment={fullPayment}
            onPayAdvance={handlePay}
            onPayRemaining={handlePay}
          />

          {/* Booking Progress */}
          <BookingProgress
            paidAmount={paidAmount}
            totalAmount={totalAmount}
            pendingAmount={pendingAmount}
            userId={userId}
            isWaitlisted={isWaitlisted}
            status={status}
          />

          {/* Review section */}
          <ReviewSection
            packageId={packageId}
            bookingStatus={status}
            onSubmitReview={handleAddReview}
            existingReviews={reviews}
            totalReviews={reviews.length}  
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
