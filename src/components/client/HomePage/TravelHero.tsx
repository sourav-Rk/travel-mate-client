import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function TravelHero() {
  return (
    <section className="relative h-[600px] bg-gradient-to-r from-black/50 to-black/30">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/european-town-sunset.png')`,
        }}
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="text-center w-full">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Tours and Trip packages,
            <br />
            <span className="text-[#2CA4BC]">Globally</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Discover amazing places around the world with our carefully curated travel experiences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Where do you want to go?"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2CA4BC]"
              />
            </div>
            <Button className="bg-[#2CA4BC] hover:bg-[#2CA4BC]/90 px-8 py-3 w-full sm:w-auto">Search</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
