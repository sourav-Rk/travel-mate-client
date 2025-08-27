import { Button } from "@/components/ui/button"
import { Check, ArrowRight } from "lucide-react"

export default function IndiaTravelPromo() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#F5F1E8" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - India Promo Image */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <img
                src="/indiaPromo.png"
                alt="Discover India - Taj Mahal and Cultural Heritage"
                className="w-full max-w-lg h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-8">
            {/* Section Header */}
            <div className="space-y-2">
              <p className="text-[#2CA4BC] font-semibold text-sm uppercase tracking-wider">ABOUT US</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Your Journey, Our
                <br />
                <span className="text-gray-800">Passion</span>
              </h2>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed">
              We believe that travel is more than just visiting new places; it's about creating memories, experiencing
              diverse cultures, and discovering the wonders of the world. With years of experience in the travel
              industry, our dedicated team is committed to providing exceptional travel experiences tailored to your
              unique desires and needs.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 font-medium">Budget-Friendly</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 font-medium">Luxurious Getaways</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 font-medium">Trusted Local Guides</span>
              </div>
            </div>

            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Learn More Button */}
              <Button className="bg-[#2CA4BC] hover:bg-[#2CA4BC]/90 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-200 hover:scale-105">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
