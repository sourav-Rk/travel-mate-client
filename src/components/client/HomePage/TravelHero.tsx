"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function TravelHero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Array of background images
  const backgroundImages = ["/trekking.png", "/TravelGathering.png", "/neom-eOWabmCNEdg-unsplash.jpg"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length)
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(interval)
  }, [backgroundImages.length])

  return (
    <section className="relative h-[600px] bg-gradient-to-r from-black/50 to-black/30 overflow-hidden">
      {/* Background Images with Smooth Transitions */}
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url('${image}')`,
          }}
        />
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Image Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex ? "bg-[#2CA4BC] scale-110" : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center z-10">
        <div className="text-center w-full">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Tours and Trip packages,
            <br />
            <span className="text-[#2CA4BC]">Globally</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in-delay">
            Discover amazing places around the world with our carefully curated travel experiences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto animate-fade-in-delay-2">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Where do you want to go?"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2CA4BC] backdrop-blur-sm bg-white/95"
              />
            </div>
            <Button className="bg-[#2CA4BC] hover:bg-[#2CA4BC]/90 px-8 py-3 w-full sm:w-auto transition-all duration-200 hover:scale-105">
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.2s both;
        }

        .animate-fade-in-delay-2 {
          animation: fadeIn 0.8s ease-out 0.4s both;
        }
      `}</style>
    </section>
  )
}
