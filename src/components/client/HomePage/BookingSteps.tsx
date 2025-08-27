import { MapPin, ChefHat, Wallet, CheckCircle } from "lucide-react"

export default function BookingSteps() {
  const steps = [
    {
      number: 1,
      icon: MapPin,
      title: "Explore & Select tour",
      description: "Lorem ipsum dolor sit amet consectetur. Pellentesque urna tortor bibendum.",
    },
    {
      number: 2,
      icon: ChefHat,
      title: "Fill information",
      description: "Lorem ipsum dolor sit amet consectetur. Pellentesque urna tortor bibendum.",
    },
    {
      number: 3,
      icon: Wallet,
      title: "Make payment",
      description: "Lorem ipsum dolor sit amet consectetur. Pellentesque urna tortor bibendum.",
    },
    {
      number: 4,
      icon: CheckCircle,
      title: "Get confirm & Finish",
      description: "Lorem ipsum dolor sit amet consectetur. Pellentesque urna tortor bibendum.",
    },
  ]

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">How to book your adventure?</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Booking your dream camping tour has never been easier!
            <br />
            Follow these four super simple steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div key={index} className="text-left">
                {/* Icon and Number Container */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Icon */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#2CA4BC" }}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Large Step Number */}
                  <div className="text-6xl md:text-7xl font-bold text-gray-200 leading-none">{step.number}</div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-base">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
