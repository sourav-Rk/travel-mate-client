"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  MapPin,
  Users,
  Calendar,
  Clock,
  Star,
  Heart,
  Share2,
  Phone,
  Mail,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"

interface PackagePreviewProps {
  packageData: any
  onExitPreview: () => void
  isEditMode?: boolean
}

export function PackagePreview({ packageData, onExitPreview, isEditMode = false }: PackagePreviewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeItineraryDay, setActiveItineraryDay] = useState(0)

  const images = packageData?.images || []
  const itinerary = packageData?.itineraryDetails?.days || []

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Preview Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onExitPreview}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 border border-white/30"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isEditMode ? "Back to Edit" : "Back"}
            </Button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold">Package Preview</h1>
              <p className="text-sm opacity-90">Customer View • Live Preview</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live Preview</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        {/* Hero Section */}
        <Card className="overflow-hidden shadow-2xl border-0">
          <div className="relative">
            {/* Image Gallery */}
            {images.length > 0 && (
              <div className="relative h-64 sm:h-80 lg:h-96">
                <img
                  src={
                    typeof images[currentImageIndex] === "string"
                      ? images[currentImageIndex]
                      : URL.createObjectURL(images[currentImageIndex])
                  }
                  alt={packageData?.title}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <Button
                      onClick={prevImage}
                      variant="ghost"
                      size="sm"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={nextImage}
                      variant="ghost"
                      size="sm"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_ : any, index : any) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={cn(
                            "w-2 h-2 rounded-full transition-all",
                            index === currentImageIndex ? "bg-white" : "bg-white/50",
                          )}
                        />
                      ))}
                    </div>
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Package Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{packageData?.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{packageData?.meetingPoint}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {packageData?.duration?.days} Days / {packageData?.duration?.nights} Nights
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Max {packageData?.maxGroupSize} people</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl sm:text-4xl font-bold">₹{packageData?.price?.toLocaleString()}</div>
                  <div className="text-sm opacity-90">per person</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="font-semibold">{packageData?.rating || 4.8}</span>
                      <span className="text-gray-600">({packageData?.totalBookings || 156} bookings)</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {packageData?.category}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">About This Package</h3>
                    <p className="text-gray-700 leading-relaxed">{packageData?.description}</p>
                  </div>

                  {packageData?.tags && packageData.tags.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {packageData.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="shadow-lg border-2 border-[#2CA4BC]/20">
              <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/10 to-[#1a5f6b]/10">
                <CardTitle className="text-[#1a5f6b]">Book This Package</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#1a5f6b]">₹{packageData?.price?.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">per person</div>
                </div>
                <Button className="w-full bg-[#2CA4BC] hover:bg-[#1a5f6b] text-white py-3">Book Now</Button>
                <Button
                  variant="outline"
                  className="w-full border-[#2CA4BC] text-[#2CA4BC] hover:bg-[#2CA4BC] hover:text-white bg-transparent"
                >
                  Enquire Now
                </Button>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>Call Support</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>Email Us</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Package Highlights */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#1a5f6b]">Package Highlights</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Professional Guide</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">All Transfers Included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Accommodation Provided</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">24/7 Support</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Itinerary */}
        {itinerary.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1a5f6b]">Detailed Itinerary</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {itinerary.map((day: any, index: number) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setActiveItineraryDay(activeItineraryDay === index ? -1 : index)}
                      className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#2CA4BC] text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {day.dayNumber}
                        </div>
                        <div>
                          <h4 className="font-semibold">Day {day.dayNumber}</h4>
                          <p className="text-sm text-gray-600">{day.title}</p>
                        </div>
                      </div>
                      <ChevronRight
                        className={cn("h-5 w-5 transition-transform", activeItineraryDay === index && "rotate-90")}
                      />
                    </button>
                    {activeItineraryDay === index && (
                      <div className="p-4 border-t bg-white">
                        <p className="text-gray-700 mb-4">{day.description}</p>
                        {day.accommodation && (
                          <div className="mb-3">
                            <span className="font-medium text-sm">Accommodation: </span>
                            <span className="text-sm text-gray-600">{day.accommodation}</span>
                          </div>
                        )}
                        {day.meals && (
                          <div className="mb-3">
                            <span className="font-medium text-sm">Meals: </span>
                            <div className="inline-flex gap-2">
                              {day.meals.breakfast && (
                                <Badge variant="outline" className="text-xs">
                                  Breakfast
                                </Badge>
                              )}
                              {day.meals.lunch && (
                                <Badge variant="outline" className="text-xs">
                                  Lunch
                                </Badge>
                              )}
                              {day.meals.dinner && (
                                <Badge variant="outline" className="text-xs">
                                  Dinner
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        {day.activityDetails && day.activityDetails.length > 0 && (
                          <div>
                            <span className="font-medium text-sm">Activities:</span>
                            <div className="mt-2 space-y-2">
                              {day.activityDetails.map((activity: any, actIndex: number) => (
                                <div key={actIndex} className="bg-gray-50 p-3 rounded">
                                  <div className="flex items-center justify-between">
                                    <h5 className="font-medium text-sm">{activity.name}</h5>
                                    {activity.duration && (
                                      <div className="flex items-center gap-1 text-xs text-gray-600">
                                        <Clock className="h-3 w-3" />
                                        {activity.duration}
                                      </div>
                                    )}
                                  </div>
                                  {activity.description && (
                                    <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                                  )}
                                  <div className="flex items-center justify-between mt-2">
                                    {activity.category && (
                                      <Badge variant="secondary" className="text-xs">
                                        {activity.category}
                                      </Badge>
                                    )}
                                    {activity.priceIncluded && (
                                      <span className="text-xs text-green-600 font-medium">Price Included</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Inclusions & Exclusions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {packageData?.inclusions && packageData.inclusions.length > 0 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-green-700">What's Included</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2">
                  {packageData.inclusions.map((inclusion: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                      <span className="text-sm">{inclusion}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {packageData?.exclusions && packageData.exclusions.length > 0 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-red-700">What's Not Included</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2">
                  {packageData.exclusions.map((exclusion: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <X className="h-4 w-4 text-red-600 shrink-0" />
                      <span className="text-sm">{exclusion}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Policies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {packageData?.cancellationPolicy && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#1a5f6b]">Cancellation Policy</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-gray-700 leading-relaxed">{packageData.cancellationPolicy}</p>
              </CardContent>
            </Card>
          )}

          {packageData?.termsAndConditions && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#1a5f6b]">Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-gray-700 leading-relaxed">{packageData.termsAndConditions}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer CTA */}
        <Card className="shadow-lg bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Ready for an Amazing Experience?</h3>
            <p className="mb-6 opacity-90">Book now and create memories that will last a lifetime!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-[#2CA4BC] hover:bg-gray-100">
                Book This Package
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#2CA4BC] bg-transparent"
              >
                Contact Us
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
