"use client";
import { BookingHeader } from "./BookingHeader";
import { PackageInfoCard } from "./PackageInfoCard";
import { PaymentSummary } from "./PaymentSummary";
import { PaymentDetailsGrid } from "./PaymentDetailsGrid";
import { BookingProgress } from "./BookingProgress";
import type { AdvancePayment, FullPayment } from "@/types/bookingType";
import { useNavigate } from "react-router-dom";
import ReviewSection, { type Review } from "./ReviewSection";
import { useAddReviewMutation, useGetGuideReviewsQuery, useGetPackageReviewsQuery } from "@/hooks/review/useReview";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import GuideReviewSection from "./GuideReviewSection";
import { useGetGuideDetailsQuery } from "@/hooks/client/useGuide";
import type { GuideDetailsForClientDto } from "@/types/api/client";

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
  guideId ?: string;
}

export interface BookingDetailsProps {
  bookingDetails: {
    _id: string;
    userId ?: string
    bookingId?: string;
    packageId: string;
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
  const [guideReviews,setGuideReviews] = useState<Review[]>([]);
  const [guide,setGuide] = useState<GuideDetailsForClientDto>();
  const navigate = useNavigate();
  const {data : reviewData} = useGetPackageReviewsQuery(bookingDetails.packageId!);
  const {data : guideReviewData} = useGetGuideReviewsQuery(bookingDetails.packageId,packages.guideId!)
  const {data : guideData} = useGetGuideDetailsQuery(packages.guideId!)
  const { mutate: addReview } = useAddReviewMutation();


  useEffect(() =>{
     if(reviewData){
      setReviews(reviewData?.reviews)
     }
  },[reviewData])

  useEffect(() => {
    if(guideReviewData){
      setGuideReviews(guideReviewData?.reviews);
    }
  },[guideReviewData]);

  useEffect(() => {
    console.log("guide triggered")
    if(guideData){
      setGuide(guideData.guide);
    }
  },[guideData]);

  const {
    _id,
    packageId,
    bookingId,
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

  const handleAddReviewPackage = (rating: number, comment: string) => {
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
  const handleAddReviewGuide = (rating: number, comment: string) => {
  setIsSubmitting(true);
  addReview(
    {
      targetType: "guide",
      rating,
      comment,
      guideId : packages.guideId,
      packageId : packages.packageId!
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

const hasReviewedPackage = reviews.some(x => x.userId._id === bookingDetails.userId);
const hasReviewedGuide = guideReviews.some(x => x.userId._id === bookingDetails.userId);

// User can review only if they haven't already
const canReviewPackage = !hasReviewedPackage;
const canReviewGuide = !hasReviewedGuide;

console.log(canReviewGuide,canReviewPackage)


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
            isWaitlisted={isWaitlisted}
            status={status}
          />

          
          {/* Guide Details Button - Show if guide exists */}
          {guide && (
            <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#2CA4BC] to-[#238A9F] rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {guide.firstName} {guide.lastName}
                    </h3>
                    <p className="text-[#2CA4BC] font-medium">Your Assigned Guide</p>
                    <p className="text-sm text-gray-600">{guide.yearOfExperience} years experience • {guide.totalTrips}+ trips</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/pvt/guide/${guide._id}`)}
                  className="bg-gradient-to-r from-[#2CA4BC] to-[#238A9F] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="hidden sm:inline">View Guide Details</span>
                  <span className="sm:hidden">View Guide</span>
                </button>
              </div>
            </div>
          )}

          {/* Review section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Package Review section */}
            {reviews &&<ReviewSection
              packageId={packageId}
              bookingStatus={status}
              onSubmitReview={handleAddReviewPackage}
              existingReviews={reviews}
              totalReviews={reviews.length}
              isSubmitting={isSubmitting}
              canReviewPackage={canReviewPackage}
            />}

            {/* Guide Review section */}
            {guide &&  <GuideReviewSection
              guideInfo={guide!}
              bookingStatus={status}
              existingReviews={guideReviews}
              onSubmitReview={handleAddReviewGuide}
              isSubmitting={false}
              canReviewGuide={canReviewGuide}
            />}
           
          </div>
        </div>
      </div>
    </div>
  );
}
