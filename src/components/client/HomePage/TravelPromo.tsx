import { Button } from "@/components/ui/button"

export default function TravelPromo() {
  return (
    <section className="py-16 bg-gradient-to-r from-[#2CA4BC]/10 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Grab up to <span className="text-[#2CA4BC]">55% off</span>
              <br />
              on your favorite Destination
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              Limited time offer! Book your dream vacation now and save big on our premium travel packages.
            </p>
            <Button className="bg-[#2CA4BC] hover:bg-[#2CA4BC]/90 px-8 py-3 text-lg">Book Now</Button>
          </div>
          <div className="relative">
            <img
              src="/placeholder-lzavv.png"
              alt="Hot air balloons"
              className="w-full h-80 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
