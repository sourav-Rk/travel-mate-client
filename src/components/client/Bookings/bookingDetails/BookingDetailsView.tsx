"use client";
import { BookingHeader } from "./BookingHeader";
import { PackageInfoCard } from "./PackageInfoCard";
import { PaymentSummary } from "./PaymentSummary";
import { PaymentDetailsGrid } from "./PaymentDetailsGrid";
import { BookingProgress } from "./BookingProgress";
import {
  BOOKINGSTATUS,
  type AdvancePayment,
  type CancellationRequest,
  type FullPayment,
} from "@/types/bookingType";
import { useNavigate } from "react-router-dom";
import ReviewSection, { type Review } from "./ReviewSection";
import {
  useAddReviewMutation,
  useGetGuideReviewsQuery,
  useGetPackageReviewsQuery,
} from "@/hooks/review/useReview";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import GuideReviewSection from "./GuideReviewSection";
import { useGetGuideDetailsQuery } from "@/hooks/client/useGuide";
import type { GuideDetailsForClientDto } from "@/types/api/client";
import CancellationDetails from "./CancellationDetails";
import { AlertTriangle, XCircle } from "lucide-react";
import { useCancelBookingMutation } from "@/hooks/client/useBooking";
import { CancellationModal } from "@/components/CancellationModal";
import type { ApiError } from "@/types/api/api";

export interface PackageDetails {
  _id: string;
  packageId?: string;
  packageName: string;
  title: string;
  meetingPoint: string;
  price: number;
  startDate: string | Date | null;
  endDate: string | Date | null;
  duration: {
    days: number;
    nights: number;
  };
  maxGroupSize: number;
  images: string[];
  description: string;
  guideId?: string;
}

export interface BookingDetailsProps {
  bookingDetails: {
    _id: string;
    userId?: string;
    bookingId?: string;
    packageId: string;
    isWaitlisted: boolean;
    status: string;
    advancePayment: AdvancePayment | null;
    fullPayment: FullPayment | null;
    cancelledAt?: string;
    refundAmount?: number;
    cancellationRequest?: CancellationRequest;
  };
  packages: PackageDetails;
}

export default function BookingDetailsView({
  bookingDetails,
  packages,
}: BookingDetailsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageReview,setAverageReview] = useState(0);
  const [guideReviews, setGuideReviews] = useState<Review[]>([]);
  const [guide, setGuide] = useState<GuideDetailsForClientDto>();
  const [selectedBooking, setSelectedBooking] = useState<BookingDetailsProps['bookingDetails'] | null>(null);
  const [isCancellationModalOpen, setIsCancellationModalOpen] = useState(false);
  const navigate = useNavigate();
  const { data: reviewData } = useGetPackageReviewsQuery(
    bookingDetails.packageId!
  );
  const { data: guideReviewData } = useGetGuideReviewsQuery(
    bookingDetails.packageId,
    packages.guideId!
  );
  const { data: guideData } = useGetGuideDetailsQuery(packages.guideId!);
  const { mutate: addReview } = useAddReviewMutation();
  const cancelBookingMutation = useCancelBookingMutation();
  const canCancelBooking =
    bookingDetails.status === "confirmed" ||
    bookingDetails.status === "fully_paid";

  useEffect(() => {
    if (reviewData) {
      setReviews(reviewData?.data.reviews);
      setAverageReview(reviewData?.data?.averageRating)
    }
  }, [reviewData]);

  useEffect(() => {
    if (guideReviewData) {
      setGuideReviews(guideReviewData?.data?.reviews);
      console.log(guideReviews,"-->controle")
    }
  }, [guideReviewData]);

  useEffect(() => {
    if (guideData) {
      setGuide(guideData.guide);
    }
  }, [guideData]);

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

  const handleCancelBooking = (booking: BookingDetailsProps['bookingDetails']): void => {
    setSelectedBooking(booking);
    setIsCancellationModalOpen(true);
  };

  const handleConfirmCancellation = async (
    reason: string,
    additionalInfo: string
  ): Promise<void> => {
    if (!selectedBooking) return;

    try {
      const response =await cancelBookingMutation.mutateAsync({
        bookingId: selectedBooking.bookingId!,
        cancellationReason: additionalInfo
          ? `${reason}: ${additionalInfo}`
          : reason,
      });
      toast.success(response.message)
      setIsCancellationModalOpen(false);
      setSelectedBooking(null);
    } catch (error:any) {
      toast.error(error?.data?.message )
      console.error("Failed to cancel booking:", error);
    }
  };

  const handleCloseCancellationModal = (): void => {
    setIsCancellationModalOpen(false);
    setSelectedBooking(null);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        onError: (error: ApiError) => {
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
        guideId: packages.guideId,
        packageId: packages.packageId!,
      },
      {
        onSuccess: (response) => {
          setIsSubmitting(false);
          toast.success(response.message);
        },
        onError: (error: ApiError) => {
          setIsSubmitting(false);
          toast.error(error?.response?.data?.message);
        },
      }
    );
  };

  const hasReviewedPackage = bookingDetails?.userId 
  ? reviews.some((x) => x.userId?._id === bookingDetails.userId)
  : false;
  const hasReviewedGuide = bookingDetails?.userId 
  ? guideReviews.some((x) => x.userId?._id === bookingDetails.userId)
  : false;

  // User can review only if they haven't already
  const canReviewPackage = !hasReviewedPackage;
  const canReviewGuide = !hasReviewedGuide;

  console.log(canReviewGuide, canReviewPackage);

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
            status={bookingDetails.status as BOOKINGSTATUS}
          />

          {/* Booking Progress */}
          <BookingProgress
            paidAmount={paidAmount}
            totalAmount={totalAmount}
            pendingAmount={pendingAmount}
            isWaitlisted={isWaitlisted}
            status={status}
          />

          <CancellationDetails
            status={bookingDetails.status}
            cancellationRequest={bookingDetails.cancellationRequest}
            cancelledAt={bookingDetails.cancelledAt}
            refundAmount={bookingDetails.refundAmount}
          />

          {canCancelBooking && (
            <div className="bg-gradient-to-br from-red-50 via-orange-50 to-red-50 border-2 border-red-200 shadow-xl rounded-2xl overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  {/* Left Section - Warning Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                        Cancel This Booking
                      </h3>
                      <p className="text-gray-700 mb-3 leading-relaxed">
                        Need to cancel your booking? We understand plans change.
                        Click below to initiate the cancellation process.
                      </p>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full border border-red-200 text-gray-700">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          Refund subject to policy
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200 text-gray-700">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Processing time: 5-7 days
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Cancel Button */}
                  <div className="w-full lg:w-auto flex flex-col gap-3">
                    <button
                      onClick={() => handleCancelBooking(bookingDetails)}
                      className="group relative px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                    >
                      {/* Animated background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Button content */}
                      <span className="relative flex items-center justify-center gap-3">
                        <XCircle className="w-5 h-5" />
                        <span className="text-base">Cancel Booking</span>
                      </span>
                    </button>

                    <p className="text-xs text-gray-600 text-center lg:text-right">
                      Review cancellation policy before proceeding
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom accent line */}
              <div className="h-1 bg-gradient-to-r from-red-400 via-orange-400 to-red-400"></div>
            </div>
          )}

          {/* Guide Details Button - Show if guide exists */}
          {guide &&
            bookingDetails.status !== "cancelled" &&
            bookingDetails.status !== "cancellation_requested" && (
              <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#2CA4BC] to-[#238A9F] rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {guide.firstName} {guide.lastName}
                      </h3>
                      <p className="text-[#2CA4BC] font-medium">
                        Your Assigned Guide
                      </p>
                      <p className="text-sm text-gray-600">
                        {guide.yearOfExperience} years experience •{" "}
                        {guide.totalTrips}+ trips
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      navigate(
                        `/pvt/guide/${guide._id}/${bookingDetails.bookingId}`
                      )
                    }
                    className="bg-gradient-to-r from-[#2CA4BC] to-[#238A9F] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
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
            {reviews &&
              bookingDetails.status !== "cancelled" &&
              bookingDetails.status !== "cancellation_requested" && (
                <ReviewSection
                  packageId={packageId}
                  bookingStatus={status}
                  onSubmitReview={handleAddReviewPackage}
                  existingReviews={reviews}
                  totalReviews={reviews.length}
                  isSubmitting={isSubmitting}
                  canReviewPackage={canReviewPackage}
                  averageRating={averageReview}
                />
              )}

            {/* Guide Review section */}
            {guide &&
              bookingDetails.status !== "cancelled" &&
              bookingDetails.status !== "cancellation_requested" && (
                <GuideReviewSection
                  guideInfo={guide!}
                  bookingStatus={status}
                  existingReviews={guideReviews}
                  onSubmitReview={handleAddReviewGuide}
                  isSubmitting={false}
                  canReviewGuide={canReviewGuide}
                />
              )}
          </div>
        </div>
      </div>
      <CancellationModal
        isOpen={isCancellationModalOpen}
        onClose={handleCloseCancellationModal}
        onConfirm={handleConfirmCancellation}
        bookingDetails={
          selectedBooking
            ? {
                bookingId: selectedBooking.bookingId!,
                date: formatDate(packages?.startDate + ""),
                amount: `₹${packages?.price}`,
              }
            : undefined
        }
      />
    </div>
  );
}
