"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Users, Calendar } from "lucide-react"
import { useGetRelatedPackagesQuery } from "@/hooks/client/useClientPackage"
import type { UnifiedPackage } from "@/types/packageType"

interface MoreOptionsProps {
  packageId?: string
  className?: string
}

export default function RelatedPackages({ packageId, className = "" }: MoreOptionsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
  const [relatedPackages,setRelatedPackages] = useState<UnifiedPackage[]>([]);

  const {data,isLoading} = useGetRelatedPackagesQuery(packageId || "");

  useEffect(() => {
    if(!data) return;
    setRelatedPackages(data.packages);
  },[packageId,data]); 

   // Auto-rotate images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const newIndex = { ...prev }
        relatedPackages.forEach((pkg) => {
          if (pkg.images && pkg.images.length > 1) {
            newIndex[pkg._id] = ((prev[pkg._id] || 0) + 1) % pkg.images.length
          }
        })
        return newIndex
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

    if(!packageId) return <div>No current package id</div>

  return (
    <section className={`py-12 bg-gradient-to-br from-slate-50 to-white ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">More Options for You</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#2CA4BC] to-teal-400 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover more amazing destinations and experiences tailored just for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedPackages.map((pkg) => (
            <Card
              key={pkg._id}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl"
            >
              <div className="relative">
                <div className="relative h-48 overflow-hidden rounded-t-2xl">
                  <img
                    src={pkg.images?.[currentImageIndex[pkg._id] || 0] || "/placeholder.svg?height=300&width=400"}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                  <Badge className="absolute top-4 left-4 bg-[#2CA4BC] hover:bg-[#2CA4BC]/90 text-white border-0 px-3 py-1">
                    {pkg.category}
                  </Badge>

                  {pkg.images && pkg.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      {pkg.images.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === (currentImageIndex[pkg._id] || 0) ? "bg-white" : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="truncate">{pkg.meetingPoint}</span>
                    </div>
                    <Badge variant="outline" className="text-[#2CA4BC] border-[#2CA4BC]/30 bg-[#2CA4BC]/5">
                      {pkg.duration.days}D/{pkg.duration.nights}N
                    </Badge>
                  </div>

                  <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 group-hover:text-[#2CA4BC] transition-colors duration-300">
                    {pkg.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.description}</p>

                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">(4.2) • 156 reviews</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {pkg.tags.slice(0, 3).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 border-0"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>Max {pkg.maxGroupSize}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{pkg.startDate?.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-[#2CA4BC]">{formatPrice(pkg.price)}</div>
                      <div className="text-sm text-gray-500">per person</div>
                    </div>
                    <Button className="bg-[#2CA4BC] hover:bg-[#2CA4BC]/90 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="border-[#2CA4BC] text-[#2CA4BC] hover:bg-[#2CA4BC] hover:text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 bg-transparent"
          >
            View All Packages
          </Button>
        </div>
      </div>
    </section>
  )
}
