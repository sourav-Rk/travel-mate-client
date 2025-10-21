"use client"

import { PinContainer } from "@/components/ui/3d-pin";
import type { UnifiedPackage } from "@/types/packageType";
import { useNavigate } from "react-router-dom";

interface PopularDestinationsProps {
   destinations : UnifiedPackage[]
}

export default function PopularDestinations({destinations} : PopularDestinationsProps) {
  const navigate = useNavigate();
  const handleNavigateToPackages = () => {
    navigate("/packages");
  }


  return (
    <section className="py-16 bg-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
          <h2 className="text-3xl font-bold text-gray-900">Popular destinations</h2>
          <button onClick={handleNavigateToPackages} className="  text-[#2CA4BC] hover:text-[#2CA4BC]/80 font-medium transition-colors duration-200 underline decoration-2 underline-offset-4">
            View all destinations
          </button>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {destinations?.slice(0,4).map((destination) => (
            <PinContainer
              key={destination._id}
              title={destination.packageName}
              href={`localhost:5173/packages/${destination._id}`}
              containerClassName="w-full"
            >
              <DestinationCard
                name={destination.packageName}
                trips={""}
                image={destination.images[0]}
              />
            </PinContainer>
          ))}
        </div>
      </div>
    </section>
  )
}

const DestinationCard = ({
  name,
  trips,
  image,
}: {
  name: string
  trips: string
  image: string
}) => {
  return (
    <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3 p-2 w-full">
      {/* Circular Image */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden">
        <img
          src={image || "/placeholder.svg?height=128&width=128&query=travel destination"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Destination Info */}
      <div className="space-y-1">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base md:text-lg group-hover:text-[#2CA4BC] transition-colors duration-200">
          {name}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm">{trips}</p>
      </div>
    </div>
  )
}
