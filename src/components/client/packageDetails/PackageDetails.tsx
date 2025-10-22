"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import type {  TravelPackage, UnifiedPackage } from "@/types/packageType";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPackageDetailsQuery } from "@/hooks/client/useClientPackage";
import { Spinner } from "@/components/Spinner";
import {
  useApplyPackageMutation,
  useGetBookingDetails,
} from "@/hooks/client/useBooking";
import toast from "react-hot-toast";
import PackageContent from "./PackageContent";
import type { ClientBookingDetailDto } from "@/types/bookingType";
import BookingConfirmationModal from "./BookingConfirmationModal";
import CelebrationAnimation from "./CelebrationAnimation";
import { useAddToWishlistMutation, useGetWishlistQuery, useRemoveFromWishlistMutation } from "@/hooks/wishlist/useWishlist";
import type { WishlistDto } from "../wishlist/WishlistPage";
import { useClientAuth } from "@/hooks/auth/useAuth";
import { showToast } from "@/components/CustomToast";
import { KnowMoreButton } from "./KnowMoreButton";
export default function PackageDetails() {
  const { packageId } = useParams<{ packageId: string }>();
  if (!packageId) return <div>No PackageId</div>;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openDays, setOpenDays] = useState<{ [key: string]: boolean }>({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [packageData, setPackageData] = useState<UnifiedPackage>();
  const [wishlistDetails, setWishlistDetails] = useState<WishlistDto>();
  const [bookingDetails, setBookingDetails] =
    useState<ClientBookingDetailDto>();
  const [bookingStatus, setBookingStatus] = useState<
    | "applied"
    | "confirmed"
    | "completed"
    | "waitlisted"
    | "cancelled"
    | "expired"
    | "advance_pending"
    | "fully_paid"
    | "cancellation_requested"
    | "none"
  >("none");
  const [mutationMessage, setMutationMessage] = useState<{
    type: "success" | "error" | null;
    content: string;
  }>({ type: null, content: "" });
  const navigate = useNavigate();
  const {isLoggedIn} = useClientAuth();
  const { data, isLoading } = useGetPackageDetailsQuery(packageId);
  const { data: bookingData } = useGetBookingDetails(packageId,isLoggedIn);
  const { mutate: applyToPackage } = useApplyPackageMutation();
  const {data : wishlistData,isLoading : wishlistDataLoading} = useGetWishlistQuery(isLoggedIn);
  const {mutate : addToWishlist,isPending} = useAddToWishlistMutation();
  const {mutate : removeFromWishlist,isPending : removePending} = useRemoveFromWishlistMutation();

  useEffect(() => {
    if (!packageId) return;
    if (!data) return;
    setPackageData(data.packages);
  }, [packageId, data]);

  useEffect(() => {
    if (bookingData) {
      setBookingDetails(bookingData.bookingDetails);
       if (bookingData.bookingDetails?.isWaitlisted) {
        setBookingStatus("waitlisted")
      } else {
        setBookingStatus(bookingData.bookingDetails?.status ?? "none")
      }
      console.log(bookingData);
    }
  }, [bookingData]);

    useEffect(() => {
    if (wishlistData) {
      setWishlistDetails(wishlistData.data);
    }
  }, [wishlistData]);


  useEffect(() => {
    const imageCount = packageData?.images?.length || 0;
    if (imageCount > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === imageCount - 1 ? 0 : prev + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [packageData?.images?.length]);

  const isInWishlist = wishlistDetails?.packages?.some((pkg : any) => pkg?.packageId === packageId);


  const handleWishlistClick = () => {
  if (!isLoggedIn) {
  showToast.custom(
    {type : "info",
     title : "Please Login to continue",
     description : " You need to be signed in to access this feature",
     duration:3000}
    )
    navigate("/login");
    return;
  }
  if (isInWishlist) {
    handleRemoveFromWishlist();
  } else {
    handleAddToWishlist();
  }
};

const handleBookingClick = () => {
  if (!isLoggedIn) {
    showToast.custom(
    {type : "info",
     title : "Please Login to continue",
     description : " You need to be signed in to access this feature",
     duration:3000}
    )
    navigate("/login");
    return;
  }
  handleBooking();
};
  

  //add to wishlist
  const handleAddToWishlist = () => {
    addToWishlist(packageId,{
      onSuccess :(response) =>{
        showToast.success(response.message);
      },
      onError :(error : any) => {
        toast.error(error?.response?.data.message);
      }
    })
  }

 const handleRemoveFromWishlist = () => {
  removeFromWishlist(packageId, {
    onSuccess: (response) => {
      showToast.success(response.message);
    },
    onError: (error: any) => {
      console.error("Error object:", error); 

      const errorMsg =
        error?.response?.data?.message || 
        error?.message || 
        "Something went wrong";

      if (errorMsg.includes("Invalid token")) {
        toast.error("Please Login");
      } else {
        toast.error(errorMsg);
      }
    },
  });
};


  const handleBooking = () => {
    setShowConfirmationModal(true);
  };

  const handleNavigationToCheckout = () => {
     navigate(`/packages/checkout/${bookingDetails?._id}/${packageId}`);
  }

  const handleConfirmBooking = () => {
    setIsBookingLoading(true);
    applyToPackage(packageId, {
      onSuccess: (response) => {
        toast.success(response.message);
        setMutationMessage({ type: "success", content: response.message });
        setBookingStatus("applied");
        setIsBookingLoading(false);
        setShowConfirmationModal(false);
        setShowCelebration(true);
        setTimeout(() => {
          setShowCelebration(false);
        }, 3000);
      },
      onError: (error: any) => {
        const errorMsg = error?.response?.data?.message || "An error occurred";
        setMutationMessage({ type: "error", content: errorMsg });
        toast.error(error?.response.data.message);
        setIsBookingLoading(false);
        setShowConfirmationModal(false);
      },
    });
  };

  const nextImage = () => {
    const imageCount = packageData?.images?.length || 0;
    if (imageCount === 0) return;
    setCurrentImageIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    const imageCount = packageData?.images?.length || 0;
    if (imageCount === 0) return;
    setCurrentImageIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1));
  };

  const imageCount = packageData?.images?.length || 0;

  const toggleDay = (dayId: string | undefined) => {
    if (!dayId) return;
    setOpenDays((prev) => ({
      ...prev,
      [dayId]: !prev[dayId],
    }));
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Date not specified";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderBookingStatus = () => {
    switch (bookingStatus) {
      case "applied":
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">
                  Application Submitted
                </h4>
              </div>
              <p className="text-blue-700 text-sm">
                Your application has been submitted successfully. Please wait
                for the agency to verify your details and send you a payment
                alert.
              </p>
            </div>
            <Button
              disabled
              className="w-full bg-gray-400 text-white cursor-not-allowed"
              size="lg"
            >
              <Clock className="w-4 h-4 mr-2" />
              Waiting for Verification
            </Button>
          </div>
        );

      case "advance_pending":
        return (
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold text-orange-900">
                  Payment Required
                </h4>
              </div>
              <p className="text-orange-700 text-sm">
                Your application has been approved! Pay the advance amount to
                confirm your seat for this amazing trip.
              </p>
            </div>
            <Button
              onClick={handleNavigationToCheckout}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              size="lg"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Pay Advance Amount
            </Button>
          </div>
        );

      case "confirmed":
        return (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-900">
                  Booking Confirmed
                </h4>
              </div>
              <p className="text-green-700 text-sm">
                Great! Your seat is confirmed. Please pay the full amount before
                7 days of the trip start date to join the trip.
              </p>
            </div>
            <Button
              onClick={handleNavigationToCheckout}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Pay Full Amount
            </Button>
          </div>
        );

        case "fully_paid":
  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <h4 className="font-semibold text-green-900">
            Booking Completed!
          </h4>
        </div>
        <p className="text-green-700 text-sm">
          🎉 Congratulations! You’ve successfully completed your booking and paid the full amount.  
          Get ready for an amazing trip — we’ll see you soon!
        </p>
      </div>
      <Button
        disabled
        className="w-full bg-green-600 text-white cursor-not-allowed"
        size="lg"
      >
        Trip Confirmed ✔
      </Button>
    </div>
  );


        case "waitlisted":
        return (
          <div className="space-y-4">
            {/* Waitlist Information Card */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-amber-800 mb-2">Your booking is waitlisted!</h4>
                  <p className="text-sm text-amber-700 leading-relaxed mb-3">
                    Don't worry! If anyone cancels their booking, we will inform you immediately. You'll be the first to
                    know when a spot becomes available.
                  </p>

                  {/* Waitlist Status Indicator */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-amber-700">Waitlist Active</span>
                    </div>
                    <span className="text-xs text-amber-600 font-medium">Notifications Enabled</span>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-amber-100/50 rounded-lg p-3 mt-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-amber-800 mb-1">What happens next?</p>
                    <ul className="text-xs text-amber-700 space-y-1">
                      <li>• We'll monitor for cancellations</li>
                      <li>• You'll get instant notification if a spot opens</li>
                      <li>• Your waitlist position is secured</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button disabled className="w-full bg-amber-500 text-white cursor-not-allowed opacity-75" size="lg">
                <Clock className="w-4 h-4 mr-2" />
                On Waitlist - We'll Notify You
              </Button>

              {/* Wishlist functionality still available */}
              {wishlistDataLoading ? (
                <Button disabled className="w-full">
                  Checking Wishlist...
                </Button>
              ) : isInWishlist ? (
                <Button
                  onClick={handleRemoveFromWishlist}
                  variant="destructive"
                  className="w-full"
                  size="lg"
                  disabled={removePending}
                >
                  {removePending ? "Removing..." : "Remove from Wishlist"}
                </Button>
              ) : (
                <Button
                  onClick={handleAddToWishlist}
                  variant="outline"
                  className="w-full border-[#2CA4BC] text-[#2CA4BC] hover:bg-[#2CA4BC] hover:text-white bg-transparent"
                  size="lg"
                  disabled={isPending}
                >
                  {isPending ? "Adding..." : "Add To Wishlist"}
                </Button>
              )}
            </div>
          </div>
        )

default:
  return (
    <div className="space-y-3">
      <Button
        onClick={handleBookingClick}
        className="w-full bg-[#2CA4BC] hover:bg-[#2CA4BC]/90 text-white"
        size="lg"
      >
        Book Now
      </Button>

      {wishlistDataLoading ? (
        <Button disabled className="w-full">Checking Wishlist...</Button>
      ) : isInWishlist ? (
        <Button
          onClick={handleWishlistClick}
          variant="destructive"
          className="w-full"
          size="lg"
          disabled={removePending}
        >
           {removePending ? 'Removing' : "Remove from Wishlist"}
        </Button>
      ) : (
        <Button
          onClick={handleWishlistClick}
          variant="outline"
          className="w-full border-[#2CA4BC] text-[#2CA4BC] hover:bg-[#2CA4BC] hover:text-white bg-transparent"
          size="lg"
          disabled={isPending}
        >
          {isPending ? 'Adding' : "Add To Wishlist"}
        </Button>
      )}
    </div>
  );

    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          {packageData?.packageName}
        </h1>
        <h2 className="text-xl md:text-2xl text-gray-600 font-medium">
          {packageData?.title}
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary" className="bg-[#2CA4BC] text-white">
            {packageData?.category}
          </Badge>
          {packageData?.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="border-[#2CA4BC] text-[#2CA4BC]"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Image Gallery */}
      <Card className="overflow-hidden shadow-lg">
        <div className="relative h-96 md:h-[500px]">
          <img
            src={packageData?.images?.[currentImageIndex] || "/placeholder.svg"}
            alt={`${packageData?.packageName || "Package"} - Image ${
              currentImageIndex + 1
            }`}
            className="w-full h-full object-cover"
          />

          {/* Image Navigation */}
          {imageCount > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {packageData?.images?.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentImageIndex
                        ? "bg-[#2CA4BC]"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <PackageContent
            packageData={packageData as TravelPackage}
            openDays={openDays}
            toggleDay={toggleDay}
            formatDate={formatDate}
          />
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-[#2CA4BC] mb-2">
                  ₹{packageData?.price.toLocaleString()}
                </div>
                <p className="text-gray-600">per person</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">
                    {packageData?.duration.days}D/{packageData?.duration.nights}
                    N
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Group Size:</span>
                  <span className="font-semibold">
                    Max {packageData?.maxGroupSize}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <Badge
                    variant={
                      packageData?.status === "active" ? "default" : "secondary"
                    }
                    className={
                      packageData?.status === "active" ? "bg-green-600" : ""
                    }
                  >
                    {packageData?.status}
                  </Badge>
                </div>
              </div>

              {renderBookingStatus()}

              <Separator className="my-6" />

              <KnowMoreButton
                vendorId={packageData?.agencyId} 
                packageId={packageId}
                className="mb-6"
              />

              <div className="space-y-3">
                <h4 className="font-bold text-gray-900">Need Help?</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>support@travel.com</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <BookingConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        packageData={packageData as TravelPackage}
        onConfirmBooking={handleConfirmBooking}
        isLoading={isBookingLoading}
        mutationMessage={mutationMessage}
      />
      {showCelebration && <CelebrationAnimation />}
    </div>
  );
}
