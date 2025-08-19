"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Car,
  Utensils,
  Camera,
} from "lucide-react";
import type { TravelPackage } from "@/types/packageType";
import { useParams } from "react-router-dom";
import { useGetPackageDetailsQuery } from "@/hooks/client/useClientPackage";
import { Spinner } from "@/components/Spinner";
import RelatedPackages from "./RelatedPackages";

export default function PackageDetails() {
  const { packageId } = useParams<{ packageId: string }>();
  if (!packageId) return <div>No package id </div>;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openDays, setOpenDays] = useState<{ [key: string]: boolean }>({});
  const [packageData, setPackageData] = useState<TravelPackage>();
  const { data, isLoading } = useGetPackageDetailsQuery(packageId);

  useEffect(() => {
    if (!data) return;
    setPackageData(data.packages);
  }, [packageId, data]);

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

  if(isLoading) return <Spinner/>
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
          {/* Description */}
          <Card className="shadow-md">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-[#2CA4BC] rounded"></div>
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {packageData?.description}
              </p>
            </CardContent>
          </Card>

          {/* Package Details */}
          <Card className="shadow-md">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-[#2CA4BC] rounded"></div>
                Package Details
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-6 h-6 text-[#2CA4BC]" />
                  <div>
                    <p className="font-semibold text-gray-900">Duration</p>
                    <p className="text-gray-600">
                      {packageData?.duration.days} Days,{" "}
                      {packageData?.duration.nights} Nights
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="w-6 h-6 text-[#2CA4BC]" />
                  <div>
                    <p className="font-semibold text-gray-900">Group Size</p>
                    <p className="text-gray-600">
                      Max {packageData?.maxGroupSize} people
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-[#2CA4BC]" />
                  <div>
                    <p className="font-semibold text-gray-900">Start Date</p>
                    <p className="text-gray-600">
                      {formatDate(packageData?.startDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-[#2CA4BC]" />
                  <div>
                    <p className="font-semibold text-gray-900">End Date</p>
                    <p className="text-gray-600">
                      {formatDate(packageData?.endDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                  <MapPin className="w-6 h-6 text-[#2CA4BC]" />
                  <div>
                    <p className="font-semibold text-gray-900">Meeting Point</p>
                    <p className="text-gray-600">{packageData?.meetingPoint}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Itinerary - Main Part with Accordion */}
          {packageData?.itineraryDetails && (
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-1 h-6 bg-[#2CA4BC] rounded"></div>
                  Itinerary
                </h3>
                <div className="space-y-4">
                  {packageData.itineraryDetails.days.map((day, index) => (
                    <Collapsible
                      key={day._id || index}
                      open={openDays[day?._id || ""]}
                      onOpenChange={() => toggleDay(day?._id)}
                    >
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#2CA4BC]/10 to-[#2CA4BC]/5 rounded-lg border border-[#2CA4BC]/20 hover:border-[#2CA4BC]/40 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#2CA4BC] text-white rounded-full flex items-center justify-center font-bold">
                              {day.dayNumber}
                            </div>
                            <div className="text-left">
                              <h4 className="font-bold text-lg text-gray-900">
                                Day {day.dayNumber}: {day.title}
                              </h4>
                              <p className="text-gray-600 text-sm">
                                Click to view details
                              </p>
                            </div>
                          </div>
                          {openDays[day?._id || ""] ? (
                            <ChevronUp className="w-5 h-5 text-[#2CA4BC]" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-[#2CA4BC]" />
                          )}
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-4 p-6 bg-white border border-gray-200 rounded-lg ml-6 space-y-6">
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-2 text-lg">
                              Overview
                            </h5>
                            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                              {day.description}
                            </p>
                          </div>

                          {day.accommodation && (
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#2CA4BC] rounded-full"></div>
                                Accommodation
                              </h5>
                              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                <p className="text-gray-700">
                                  {day.accommodation}
                                </p>
                              </div>
                            </div>
                          )}

                          {day.activityDetails &&
                            day.activityDetails.length > 0 && (
                              <div>
                                <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <Camera className="w-5 h-5 text-[#2CA4BC]" />
                                  Activities
                                </h5>
                                <div className="space-y-3">
                                  {day.activityDetails.map((activity) => (
                                    <div
                                      key={activity._id}
                                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                      <div className="flex items-start justify-between mb-2">
                                        <h6 className="font-semibold text-gray-900 text-lg">
                                          {activity.name}
                                        </h6>
                                        {activity.priceIncluded !==
                                          undefined && (
                                          <Badge
                                            variant={
                                              activity.priceIncluded
                                                ? "default"
                                                : "secondary"
                                            }
                                            className={
                                              activity.priceIncluded
                                                ? "bg-green-600"
                                                : "bg-gray-500"
                                            }
                                          >
                                            {activity.priceIncluded
                                              ? "Included"
                                              : "Extra Cost"}
                                          </Badge>
                                        )}
                                      </div>

                                      {activity.description && (
                                        <p className="text-gray-600 mb-3 leading-relaxed">
                                          {activity.description}
                                        </p>
                                      )}

                                      <div className="flex flex-wrap gap-4 text-sm">
                                        {activity.duration && (
                                          <div className="flex items-center gap-1 text-gray-600">
                                            <Clock className="w-4 h-4 text-[#2CA4BC]" />
                                            <span>{activity.duration}</span>
                                          </div>
                                        )}
                                        {activity.category && (
                                          <div className="flex items-center gap-1">
                                            <Badge
                                              variant="outline"
                                              className="border-[#2CA4BC] text-[#2CA4BC]"
                                            >
                                              {activity.category}
                                            </Badge>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          <div>
                            <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <Car className="w-5 h-5 text-[#2CA4BC]" />
                              Transfers
                            </h5>
                            {day.transfers && day.transfers.length > 0 ? (
                              <div className="space-y-2">
                                {day.transfers.map((transfer, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                                  >
                                    <div className="w-2 h-2 bg-[#2CA4BC] rounded-full"></div>
                                    <span className="text-gray-700">
                                      {transfer}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                                <p className="text-gray-600 text-sm">
                                  All transfers included as per itinerary
                                </p>
                              </div>
                            )}
                          </div>

                          <div>
                            <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <Utensils className="w-5 h-5 text-[#2CA4BC]" />
                              Meals
                            </h5>
                            {day.meals &&
                            Array.isArray(day.meals) &&
                            day.meals.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {day?.meals?.map((meal, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg"
                                  >
                                    <Check className="w-4 h-4 text-green-600" />
                                    <span className="text-gray-700 text-sm">
                                      {meal}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                                <p className="text-gray-600 text-sm">
                                  Breakfast, Lunch & Dinner included
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Inclusions & Exclusions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  Inclusions
                </h3>
                <ul className="space-y-3">
                  {packageData?.inclusions.map((inclusion, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-2 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{inclusion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <X className="w-5 h-5 text-red-600" />
                  Exclusions
                </h3>
                <ul className="space-y-3">
                  {packageData?.exclusions.map((exclusion, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{exclusion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Terms & Conditions */}
          <Card className="shadow-md">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-[#2CA4BC] rounded"></div>
                Terms & Conditions
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  {packageData?.termsAndConditions}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cancellation Policy */}
          <Card className="shadow-md">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-red-500 rounded"></div>
                Cancellation Policy
              </h3>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-gray-700 leading-relaxed">
                  {packageData?.cancellationPolicy}
                </p>
              </div>
            </CardContent>
          </Card>
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

              <div className="space-y-3">
                <Button
                  className="w-full bg-[#2CA4BC] hover:bg-[#2CA4BC]/90 text-white"
                  size="lg"
                >
                  Book Now
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-[#2CA4BC] text-[#2CA4BC] hover:bg-[#2CA4BC] hover:text-white bg-transparent"
                  size="lg"
                >
                  Add to Wishlist
                </Button>
              </div>

              <Separator className="my-6" />

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
    </div>
  );
}
