"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, MapPin, Calendar, Users, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

const heroImages = [
  "public/15984870-goa-beach-goa.jpg",
  "public/ai-generated-travelling-to-thailand-advertisment-background-with-copy-space-free-photo.jpg",
  "public/15984870-goa-beach-goa.jpg",
  "public/ai-generated-travelling-to-thailand-advertisment-background-with-copy-space-free-photo.jpg",
]

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [searchData, setSearchData] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = () => {
    console.log("Searching with:", searchData)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  }


  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{
              opacity: index === currentImageIndex ? 1 : 0,
              scale: index === currentImageIndex ? 1 : 1.1,
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`Travel destination ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        ))}
      </div>

      {/* Floating Elements */}
      <motion.div
        animate="animate"
        className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm hidden lg:block"
      />
      <motion.div
        animate="animate"
        className="absolute top-40 right-20 w-16 h-16 bg-blue-500/20 rounded-full backdrop-blur-sm hidden lg:block"
        style={{ animationDelay: "1s" }}
      />

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto"
      >
        <motion.div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Travel Mate
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-gray-200">Discover Amazing Places Around The World</p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Create unforgettable memories with our curated travel experiences. From exotic beaches to mountain
            adventures, we've got your perfect getaway covered.
          </p>
        </motion.div>

        {/* Search Card */}
        <motion.div >
          <Card className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Destination
                </label>
                <Input
                  placeholder="Where to?"
                  value={searchData.destination}
                  onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                  className="border-gray-200 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Check In
                </label>
                <Input
                  type="date"
                  value={searchData.checkIn}
                  onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
                  className="border-gray-200 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Check Out
                </label>
                <Input
                  type="date"
                  value={searchData.checkOut}
                  onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
                  className="border-gray-200 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Guests
                </label>
                <select
                  value={searchData.guests}
                  onChange={(e) => setSearchData({ ...searchData, guests: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4+ Guests</option>
                </select>
              </div>
            </div>

            <Button
              onClick={handleSearch}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02]"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Adventures
            </Button>
          </Card>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div  className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Explore Destinations
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 bg-transparent"
          >
            <Play className="w-5 h-5 mr-2" />
            Watch Video
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="flex flex-col items-center"
        >
          <span className="text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="w-1 h-3 bg-white rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
