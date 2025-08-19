import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

export default function TravelReviews() {
  const reviews = [
    {
      name: "Sarah Johnson",
      avatar: "/professional-woman-headshot.png",
      rating: 5,
      text: "Amazing experience! The trip was perfectly organized and the destinations were breathtaking. Highly recommend!",
    },
    {
      name: "Michael Chen",
      avatar: "/professional-man-headshot.png",
      rating: 5,
      text: "Professional service and incredible value. The local guides were knowledgeable and friendly throughout our journey.",
    },
    {
      name: "Emma Wilson",
      avatar: "/smiling-woman-headshot.png",
      rating: 5,
      text: "Best travel experience ever! Every detail was taken care of. Will definitely book again for our next adventure.",
    },
  ]

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
          <p className="text-gray-600">What our travelers say about us</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <Card key={index} className="p-6 text-center">
              <img
                src={review.avatar || "/placeholder.svg"}
                alt={review.name}
                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
              />
              <div className="flex justify-center mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">"{review.text}"</p>
              <h4 className="font-semibold text-gray-900">{review.name}</h4>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
