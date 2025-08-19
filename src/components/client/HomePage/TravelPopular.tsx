import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TravelPopular() {
  const popularTours = [
    {
      title: "Grand Canyon",
      image: "/grand-canyon-sunset.png",
      price: "$299",
      duration: "3 days",
    },
    {
      title: "Northern Lights",
      image: "/images/northern-lights.png",
      price: "$899",
      duration: "4 days",
    },
    {
      title: "Safari Adventure",
      image: "/african-safari-elephants.png",
      price: "$1299",
      duration: "7 days",
    },
    {
      title: "Greek Islands",
      image: "/greek-islands-white-buildings-blue-sea.png",
      price: "$799",
      duration: "5 days",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Popular Tours</h2>
          <p className="text-gray-600">Explore our most booked tour packages</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularTours.map((tour, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <img src={tour.image || "/placeholder.svg"} alt={tour.title} className="w-full h-48 object-cover" />
                <Badge className="absolute top-3 right-3 bg-[#2CA4BC] hover:bg-[#2CA4BC]/90">{tour.duration}</Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{tour.title}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-[#2CA4BC]">{tour.price}</span>
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
