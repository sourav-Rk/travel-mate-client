"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowRight } from "lucide-react"
import type { PackageDetails } from "@/hooks/vendor/usePackage"

interface TravelFeaturedPros {
   featuredTrips : PackageDetails[]
}

export default function TravelFeatured({featuredTrips} : TravelFeaturedPros) {
  
  const duplicatedTrips = [...featuredTrips, ...featuredTrips]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Trips</h2>
            <p className="text-gray-600">Discover our most popular destinations</p>
          </div>
          <Button
            variant="outline"
            className="hidden sm:flex border-[#2CA4BC] text-[#2CA4BC] hover:bg-[#2CA4BC] hover:text-white bg-transparent"
          >
            View All
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex gap-6 animate-scroll"
            style={{
              width: "fit-content",
            }}
          >
            {duplicatedTrips.map((trip, index) => (
              <Card
                key={`${trip._id}-${index}`}
                className="flex-shrink-0 w-64 sm:w-72 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer hover-pause-card"
              >
                <div className="relative">
                  <img src={trip.images[0] || "/placeholder.svg"} alt={trip.title} className="w-full h-48 object-cover" />
                  <Badge className="absolute top-3 right-3 bg-[#2CA4BC] hover:bg-[#2CA4BC]/90">{trip.duration.days}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{trip.title}</h3>
                  <div className="flex items-center mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{5}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-[#2CA4BC]">{trip.price}</span>
                    <span className="text-sm text-gray-500">per person</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        /* Updated hover selector to pause animation when hovering individual cards */
        .hover-pause-card:hover ~ .animate-scroll,
        .hover-pause-card:hover {
          animation-play-state: paused;
        }
        
        .animate-scroll:has(.hover-pause-card:hover) {
          animation-play-state: paused;
        }
        
        @media (max-width: 640px) {
          .animate-scroll {
            animation-duration: 25s;
          }
        }
        
        @media (max-width: 480px) {
          .animate-scroll {
            animation-duration: 20s;
          }
        }
      `}</style>
    </section>
  )
}
