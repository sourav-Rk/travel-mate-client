"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Star,
  ChevronDown,
  ChevronUp,
  Plane,
  Coffee,
  Wifi,
  Bed,
  Camera,
  Car,
  Utensils,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  CalendarDays,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { TravelPackage } from "@/types/packageType"
import { useNavigate, useParams } from "react-router-dom"
import { Spinner } from "@/components/Spinner"
import { useGetPackageDetailsQueryGuide, useUpdatePackageStatusMutation } from "@/hooks/guide/useGuidePackage"
import toast from "react-hot-toast"

interface PackageDetailsProps {
  packageId?: string
  className?: string
}

export function PackageDetailsGuide({className }: PackageDetailsProps) {
  const {packageId} = useParams<{packageId : string}>();
  const [activeTab, setActiveTab] = useState("itinerary")
  const [expandedDays, setExpandedDays] = useState<number[]>([1])
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [packageData,setPackageData] = useState<TravelPackage>();
  const [updating,setIsUpdating] = useState(false);
  const navigate = useNavigate();
  
  if(!packageId){
     return <div>Package Id not found</div>
  }

  const {mutate : updateToComplete} = useUpdatePackageStatusMutation()
  const {data,isLoading,isError,error} = useGetPackageDetailsQueryGuide(packageId);

  useEffect(() =>{
    if(!data) return ;
    setPackageData(data.packages);
  },[packageId,data]);
  
  console.log(data)
  if(isLoading) return <Spinner/>
  if (isError) return <div>Error: {error.message}</div>;

  const handleViewBookings = (e : React.MouseEvent) => {
    e.preventDefault()
    console.log("triggeredddd")
    navigate(`/guide/bookings/${packageId}`)
  }
  
  
  const handleUpdateStatus = () =>{
    setIsUpdating(true);
    updateToComplete({status : "completed",packageId},{
      onSuccess : (response) =>{
        toast.success(response.message);
        setIsUpdating(false);
      },
      onError : (error : any) =>{
        toast.error(error?.response.data.message);
        setIsUpdating(false);
      }
    })
  }

  
  const toggleDay = (dayNumber: number) => {
    setExpandedDays((prev) => (prev.includes(dayNumber) ? prev.filter((d) => d !== dayNumber) : [...prev, dayNumber]))
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      nature: "bg-green-50 text-green-700 border-green-200",
      cultural: "bg-purple-50 text-purple-700 border-purple-200",
      sightseeing: "bg-blue-50 text-blue-700 border-blue-200",
      adventure: "bg-orange-50 text-orange-700 border-orange-200",
      food: "bg-yellow-50 text-yellow-700 border-yellow-200",
      transfer: "bg-gray-50 text-gray-700 border-gray-200",
      "water-sports": "bg-cyan-50 text-cyan-700 border-cyan-200",
    }
    return colors[category as keyof typeof colors] || "bg-gray-50 text-gray-700 border-gray-200"
  }

  const getActivityIcon = (category: string) => {
    const icons = {
      nature: Camera,
      cultural: Star,
      sightseeing: Camera,
      adventure: Star,
      food: Utensils,
      transfer: Car,
      "water-sports": Star,
    }
    const Icon = icons[category as keyof typeof icons] || Star
    return <Icon className="h-4 w-4" />
  }

  return (
    <div className={cn("md:ml-64 lg:ml-64 min-h-screen bg-gradient-to-br from-slate-100 to-blue-100/80", className)}>
      <div className="max-w-7xl mx-auto p-4 sm:p-5 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6">
          <Button onClick={() => navigate("/guide/assigned-trips")} variant="ghost" size="sm" className="w-full sm:w-auto hover:bg-white/80 border border-slate-300">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Package Management
          </Button>
          <div className="flex items-center gap-2 text-sm text-slate-600 w-full sm:w-auto justify-between sm:justify-end">
            <span>Package ID: {packageId}</span>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              {packageData?.status}
            </Badge>
          </div>
        </div>

        {/* Trip Dates Card */}
        <Card className="border-[#2CA4BC]/30 shadow-xl bg-white">
          <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/10 to-[#1a5f6b]/10">
            <CardTitle className="text-[#1a5f6b] flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-[#2CA4BC]" />
              Trip Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg border border-green-200">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">Trip Start Date</p>
                  <p className="text-lg font-bold text-green-900">
                    {packageData?.startDate ? new Date(packageData.startDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }) : "Not specified"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-200">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">Trip End Date</p>
                  <p className="text-lg font-bold text-blue-900">
                    {packageData?.endDate ? new Date(packageData.endDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }) : "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Main Package Info */}
        <Card className="w-full border-0 shadow-xl bg-white border-slate-300/60">
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Image Gallery */}
              <div className="lg:w-1/2 w-full">
                <div className="relative rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={packageData?.images[currentImageIndex] || "/placeholder.svg"}
                    alt={packageData?.title}
                    className="w-full h-56 sm:h-64 md:h-80 object-cover"
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 justify-center">
                    {packageData?.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={cn(
                          "w-3 h-3 rounded-full transition-all",
                          currentImageIndex === index ? "bg-white" : "bg-white/50",
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Package Info */}
                <div className="lg:w-1/2 w-full space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1a5f6b] mb-2">{packageData?.packageName}</h1>
                    <p className="text-lg text-gray-600 mb-4">{packageData?.title}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {packageData?.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-[#2CA4BC]/10 text-[#1a5f6b] border-[#2CA4BC]/30"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap md:justify-end w-full md:w-auto">
                    <Button
                     onClick={handleViewBookings}
                      variant="outline"
                      className="border-[#2CA4BC] text-[#2CA4BC] hover:bg-[#2CA4BC] hover:text-white bg-transparent"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      View Bookings
                    </Button>
                    
                    <Button
                      onClick={handleUpdateStatus}
                      disabled={
                          updating || 
                          (packageData?.endDate ? new Date() < new Date(packageData.endDate) : true) || (packageData?.status === "completed")
                        }
                      className={cn(
                        "transition-all duration-200",
                        packageData?.endDate && new Date() >= new Date(packageData.endDate)
                          ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                          : "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
                      )}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {updating ? "Updating.." : "Mark Complete"}
                    </Button>
                  </div>
                </div>
                {/* Quick Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-[#2CA4BC]/30 p-4 rounded-lg shadow-sm">
                    <Calendar className="h-5 w-5 text-[#2CA4BC] mb-2" />
                    <p className="text-sm font-semibold text-[#1a5f6b]">
                      {packageData?.duration.days}D/{packageData?.duration.nights}N
                    </p>
                  </div>
                  <div className="bg-white border border-[#2CA4BC]/30 p-4 rounded-lg shadow-sm">
                    <Users className="h-5 w-5 text-[#2CA4BC] mb-2" />
                    <p className="text-sm font-semibold text-[#1a5f6b]">Max {packageData?.maxGroupSize}</p>
                  </div>
                  <div className="bg-white border border-[#2CA4BC]/30 p-4 rounded-lg shadow-sm">
                    <DollarSign className="h-5 w-5 text-[#2CA4BC] mb-2" />
                    <p className="text-sm font-semibold text-[#1a5f6b]">₹{packageData?.price.toLocaleString()}</p>
                  </div>
                </div>

                {/* Meeting Point */}
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-[#2CA4BC]" />
                  <span className="text-sm">{packageData?.meetingPoint}</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tour Highlights */}
        <Card className="w-full border-[#2CA4BC]/30 shadow-xl bg-white">
          <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/10 to-[#1a5f6b]/10">
            <CardTitle className="text-[#1a5f6b]">Tour Highlights</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="flex items-center gap-2">
                <Plane className="h-4 w-4 text-[#2CA4BC]" />
                <span className="text-sm text-gray-700">Airport pickup & drop</span>
              </div>
              <div className="flex items-center gap-2">
                <Coffee className="h-4 w-4 text-[#2CA4BC]" />
                <span className="text-sm text-gray-700">Breakfast</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-[#2CA4BC]" />
                <span className="text-sm text-gray-700">WiFi in hotel</span>
              </div>
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4 text-[#2CA4BC]" />
                <span className="text-sm text-gray-700">Stay</span>
              </div>
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-[#2CA4BC]" />
                <span className="text-sm text-gray-700">Sightseeing</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-[#2CA4BC]" />
                <span className="text-sm text-gray-700">Transportation</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About The Trip */}
        <Card className="w-full border-[#2CA4BC]/30 shadow-xl bg-white">
          <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/10 to-[#1a5f6b]/10">
            <CardTitle className="text-[#1a5f6b]">About The Trip</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700 leading-relaxed">{packageData?.description}</p>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Card className="w-full border-[#2CA4BC]/30 shadow-xl bg-white">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-200 border border-slate-300">
                <TabsTrigger
                  value="itinerary"
                  className="data-[state=active]:bg-[#2CA4BC] data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  Itinerary
                </TabsTrigger>
                <TabsTrigger
                  value="summary"
                  className="data-[state=active]:bg-[#2CA4BC] data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  Summary
                </TabsTrigger>
              </TabsList>

              <TabsContent value="itinerary" className="p-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#1a5f6b] mb-6">Details Day Wise</h3>

                  {packageData?.itineraryDetails.days.map((day) => (
                    <Collapsible
                      key={day.dayNumber}
                      open={expandedDays.includes(day.dayNumber)}
                      onOpenChange={() => toggleDay(day.dayNumber)}
                    >
                      <Card className="border-[#2CA4BC]/30 shadow-xl bg-white">
                        <CollapsibleTrigger asChild>
                          <CardHeader className="cursor-pointer hover:bg-[#2CA4BC]/5 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#2CA4BC] text-white rounded-full flex items-center justify-center text-sm font-bold">
                                  {day.dayNumber}
                                </div>
                                <div>
                                  <CardTitle className="text-[#1a5f6b] text-lg">{day.title}</CardTitle>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Day {day.dayNumber} of {packageData.duration.days}
                                  </p>
                                </div>
                              </div>
                              {expandedDays.includes(day.dayNumber) ? (
                                <ChevronUp className="h-5 w-5 text-[#2CA4BC]" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-[#2CA4BC]" />
                              )}
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <CardContent className="pt-0 pb-6">
                            <div className="space-y-6">
                              {/* Description */}
                              <p className="text-gray-700 leading-relaxed">{day.description}</p>

                              {/* Activities */}
                              {day.activityDetails.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-[#1a5f6b] mb-3 flex items-center gap-2">
                                    <Star className="h-4 w-4 text-[#2CA4BC]" />
                                    Activities
                                  </h4>
                                  <div className="grid gap-3">
                                    {day?.activityDetails?.map((activity, actIndex) => (
                                      <div key={actIndex} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <div className="flex items-start justify-between mb-2">
                                          <div className="flex items-center gap-2">
                                            {getActivityIcon(activity.category)}
                                            <h5 className="font-medium text-[#1a5f6b]">{activity.name}</h5>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={getCategoryColor(activity.category)}>
                                              {activity.category}
                                            </Badge>
                                            {activity.priceIncluded ? (
                                              <CheckCircle className="h-4 w-4 text-green-500" />
                                            ) : (
                                              <XCircle className="h-4 w-4 text-red-500" />
                                            )}
                                          </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                          <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {activity.duration}
                                          </div>
                                          <span className={activity.priceIncluded ? "text-green-600" : "text-red-600"}>
                                            {activity.priceIncluded ? "Included" : "Additional cost"}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Transfers */}
                              {day.transfers.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-[#1a5f6b] mb-3 flex items-center gap-2">
                                    <Car className="h-4 w-4 text-[#2CA4BC]" />
                                    Transfers
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {day.transfers.map((transfer, transferIndex) => (
                                      <Badge
                                        key={transferIndex}
                                        variant="outline"
                                        className="bg-blue-50 text-blue-700 border-blue-200"
                                      >
                                        <Car className="h-3 w-3 mr-1" />
                                        {transfer}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Meals & Accommodation */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold text-[#1a5f6b] mb-3 flex items-center gap-2">
                                    <Utensils className="h-4 w-4 text-[#2CA4BC]" />
                                    Meals
                                  </h4>
                                  <div className="flex gap-2">
                                    {day.meals.breakfast && (
                                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        Breakfast
                                      </Badge>
                                    )}
                                    {day.meals.lunch && (
                                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        Lunch
                                      </Badge>
                                    )}
                                    {day.meals.dinner && (
                                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        Dinner
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                {day.accommodation && (
                                  <div>
                                    <h4 className="font-semibold text-[#1a5f6b] mb-3 flex items-center gap-2">
                                      <Bed className="h-4 w-4 text-[#2CA4BC]" />
                                      Accommodation
                                    </h4>
                                    <p className="text-sm text-gray-600">{day.accommodation}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="summary" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Inclusions */}
                  <Card className="border-green-200 shadow-xl bg-white">
                    <CardHeader className="bg-green-50">
                      <CardTitle className="text-green-800 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        What's Included
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        {packageData?.inclusions.map((inclusion, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-800">{inclusion}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Exclusions */}
                  <Card className="border-red-200 shadow-xl bg-white">
                    <CardHeader className="bg-red-50">
                      <CardTitle className="text-red-800 flex items-center gap-2">
                        <XCircle className="h-5 w-5" />
                        What's Not Included
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        {packageData?.exclusions.map((exclusion, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-red-800">{exclusion}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Policies */}
                  <Card className="border-[#2CA4BC]/30 shadow-xl bg-white md:col-span-2">
                    <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/10 to-[#1a5f6b]/10">
                      <CardTitle className="text-[#1a5f6b]">Policies & Terms</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <h4 className="font-semibold text-[#1a5f6b] mb-2">Cancellation Policy</h4>
                        <p className="text-sm text-gray-700">{packageData?.cancellationPolicy}</p>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-semibold text-[#1a5f6b] mb-2">Terms & Conditions</h4>
                        <p className="text-sm text-gray-700">{packageData?.termsAndConditions}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

