import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowRight } from "lucide-react"

export default function TravelFeatured() {
  const featuredTrips = [
    {
      id: 1,
      title: "Santorini, Greece",
      image: "/santorini-white-buildings.png",
      price: "$1,200",
      duration: "7 days",
      rating: 4.8,
    },
    {
      id: 2,
      title: "Bali, Indonesia",
      image: "/bali-rice-terraces.png",
      price: "$890",
      duration: "5 days",
      rating: 4.9,
    },
    {
      id: 3,
      title: "Paris, France",
      image: "/eiffel-tower-paris.png",
      price: "$1,450",
      duration: "6 days",
      rating: 4.7,
    },
    {
      id: 4,
      title: "Tokyo, Japan",
      image: "/tokyo-cherry-blossoms.png",
      price: "$1,680",
      duration: "8 days",
      rating: 4.9,
    },
    {
      id: 5,
      title: "Maldives",
      image: "/maldives-overwater-bungalows.png",
      price: "$2,200",
      duration: "5 days",
      rating: 5.0,
    },
  ]

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {featuredTrips.map((trip) => (
            <Card key={trip.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <img src={trip.image || "/placeholder.svg"} alt={trip.title} className="w-full h-48 object-cover" />
                <Badge className="absolute top-3 right-3 bg-[#2CA4BC] hover:bg-[#2CA4BC]/90">{trip.duration}</Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{trip.title}</h3>
                <div className="flex items-center mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{trip.rating}</span>
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
    </section>
  )
}
