import { Button } from "@/components/ui/button"

export default function TravelTrending() {
  const trendingDestinations = [
    "/iceland-northern-lights.png",
    "/norway-fjords-mountains.png",
    "/swiss-alps-lake.png",
    "/colosseum-rome-day.png",
    "/scottish-highlands-castle.png",
    "/croatia-dubrovnik-coast.png",
    "/phi-phi-islands-thailand.png",
    "/venice-canals.png",
  ]

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Trending Destinations</h2>
            <p className="text-gray-600">Most visited places this month</p>
          </div>
          <Button
            variant="outline"
            className="hidden sm:flex border-[#2CA4BC] text-[#2CA4BC] hover:bg-[#2CA4BC] hover:text-white bg-transparent"
          >
            View All
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trendingDestinations.map((image, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg hover:scale-105 transition-transform cursor-pointer"
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`Trending destination ${index + 1}`}
                className="w-full h-48 md:h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
