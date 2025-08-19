import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export default function TravelAttractions() {
  const topAttractions = [
    {
      title: "Machu Picchu, Peru",
      image: "/machu-picchu-mountains.png",
      rating: 4.9,
      reviews: 2847,
      price: "$89",
    },
    {
      title: "Great Wall, China",
      image: "/great-wall-mountains.png",
      rating: 4.8,
      reviews: 1923,
      price: "$65",
    },
    {
      title: "Taj Mahal, India",
      image: "/taj-mahal-white-marble.png",
      rating: 4.9,
      reviews: 3156,
      price: "$45",
    },
    {
      title: "Petra, Jordan",
      image: "/petra-jordan-ancient-city.png",
      rating: 4.7,
      reviews: 1654,
      price: "$78",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Top Attractions</h2>
            <p className="text-gray-600">Must-visit landmarks around the world</p>
          </div>
          <Button
            variant="outline"
            className="hidden sm:flex border-[#2CA4BC] text-[#2CA4BC] hover:bg-[#2CA4BC] hover:text-white bg-transparent"
          >
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topAttractions.map((attraction, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <img
                  src={attraction.image || "/placeholder.svg"}
                  alt={attraction.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{attraction.title}</h3>
                <div className="flex items-center mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{attraction.rating}</span>
                  <span className="text-sm text-gray-500 ml-1">({attraction.reviews})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-[#2CA4BC]">From {attraction.price}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
