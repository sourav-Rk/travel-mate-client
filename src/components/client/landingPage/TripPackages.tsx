"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Calendar, Users, Star, Camera, Clock, Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const packages = {
  popular: [
    {
      id: 1,
      title: "European Grand Tour",
      subtitle: "Paris • Rome • Barcelona • Amsterdam",
      image: "/placeholder.svg?height=300&width=500&text=European+Grand+Tour",
      duration: "14 days",
      groupSize: "8-12 people",
      price: 2499,
      originalPrice: 2999,
      rating: 4.9,
      reviews: 234,
      category: "Cultural",
      difficulty: "Easy",
      includes: ["Flights", "Hotels", "Meals", "Guide", "Transport"],
      highlights: [
        "Visit 4 iconic European cities",
        "Expert local guides",
        "All meals included",
        "Small group experience",
      ],
      nextDeparture: "2024-05-15",
      spotsLeft: 3,
    },
    {
      id: 2,
      title: "Himalayan Adventure",
      subtitle: "Nepal • Tibet • Bhutan",
      image: "/placeholder.svg?height=300&width=500&text=Himalayan+Adventure",
      duration: "21 days",
      groupSize: "6-10 people",
      price: 3299,
      originalPrice: 3799,
      rating: 4.8,
      reviews: 156,
      category: "Adventure",
      difficulty: "Challenging",
      includes: ["Permits", "Camping", "Meals", "Guide", "Equipment"],
      highlights: [
        "Everest Base Camp trek",
        "Cultural immersion",
        "Professional mountain guides",
        "All equipment provided",
      ],
      nextDeparture: "2024-04-20",
      spotsLeft: 2,
    },
    {
      id: 3,
      title: "African Safari Experience",
      subtitle: "Kenya • Tanzania • Uganda",
      image: "/placeholder.svg?height=300&width=500&text=African+Safari",
      duration: "12 days",
      groupSize: "4-8 people",
      price: 4199,
      originalPrice: 4699,
      rating: 4.9,
      reviews: 189,
      category: "Wildlife",
      difficulty: "Moderate",
      includes: ["Flights", "Lodges", "Meals", "Safari", "Guide"],
      highlights: [
        "Big Five wildlife viewing",
        "Luxury safari lodges",
        "Professional safari guide",
        "Cultural village visits",
      ],
      nextDeparture: "2024-06-10",
      spotsLeft: 5,
    },
  ],
  luxury: [
    {
      id: 4,
      title: "Maldives Paradise Retreat",
      subtitle: "Private Island • Overwater Villas",
      image: "/placeholder.svg?height=300&width=500&text=Maldives+Luxury",
      duration: "7 days",
      groupSize: "2-4 people",
      price: 5999,
      originalPrice: 6999,
      rating: 5.0,
      reviews: 98,
      category: "Luxury",
      difficulty: "Relaxing",
      includes: ["Seaplane", "Villa", "Meals", "Spa", "Activities"],
      highlights: [
        "Private overwater villa",
        "Personal butler service",
        "World-class spa treatments",
        "Exclusive dining experiences",
      ],
      nextDeparture: "2024-05-01",
      spotsLeft: 1,
    },
    {
      id: 5,
      title: "Japanese Luxury Experience",
      subtitle: "Tokyo • Kyoto • Mount Fuji",
      image: "/placeholder.svg?height=300&width=500&text=Japan+Luxury",
      duration: "10 days",
      groupSize: "2-6 people",
      price: 4799,
      originalPrice: 5299,
      rating: 4.9,
      reviews: 145,
      category: "Cultural",
      difficulty: "Easy",
      includes: ["Flights", "Ryokans", "Meals", "Guide", "Experiences"],
      highlights: [
        "Stay in traditional ryokans",
        "Private tea ceremonies",
        "Michelin-starred dining",
        "Exclusive cultural experiences",
      ],
      nextDeparture: "2024-04-25",
      spotsLeft: 4,
    },
  ],
  adventure: [
    {
      id: 6,
      title: "Patagonia Expedition",
      subtitle: "Chile • Argentina • Glaciers",
      image: "/placeholder.svg?height=300&width=500&text=Patagonia+Adventure",
      duration: "16 days",
      groupSize: "8-12 people",
      price: 3799,
      originalPrice: 4299,
      rating: 4.8,
      reviews: 167,
      category: "Adventure",
      difficulty: "Challenging",
      includes: ["Camping", "Meals", "Guide", "Equipment", "Transport"],
      highlights: [
        "Torres del Paine trekking",
        "Glacier exploration",
        "Wildlife photography",
        "Expert expedition guides",
      ],
      nextDeparture: "2024-03-15",
      spotsLeft: 6,
    },
  ],
}

export function TripPackages() {
  const [activeTab, setActiveTab] = useState("popular")
  const [hoveredPackage, setHoveredPackage] = useState<number | null>(null)

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      Easy: "bg-green-100 text-green-800",
      Moderate: "bg-yellow-100 text-yellow-800",
      Challenging: "bg-red-100 text-red-800",
      Relaxing: "bg-blue-100 text-blue-800",
    }
    return colors[difficulty as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-purple-100 text-purple-800 px-4 py-2">Trip Packages</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Curated Travel Experiences
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our expertly crafted group tours and create lifelong memories with fellow travelers. All packages
            include accommodation, meals, and professional guides.
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
            <TabsTrigger value="popular" className="text-sm font-medium">
              Popular
            </TabsTrigger>
            <TabsTrigger value="luxury" className="text-sm font-medium">
              Luxury
            </TabsTrigger>
            <TabsTrigger value="adventure" className="text-sm font-medium">
              Adventure
            </TabsTrigger>
          </TabsList>

          {Object.entries(packages).map(([category, categoryPackages]) => (
            <TabsContent key={category} value={category}>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
              >
                {categoryPackages.map((pkg) => (
                  <motion.div
                    key={pkg.id}
                    whileHover={{ y: -10 }}
                    onHoverStart={() => setHoveredPackage(pkg.id)}
                    onHoverEnd={() => setHoveredPackage(null)}
                    className="group cursor-pointer"
                  >
                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white h-full">
                      <div className="relative overflow-hidden">
                        <motion.img
                          src={pkg.image}
                          alt={pkg.title}
                          className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Spots Left Badge */}
                        {pkg.spotsLeft <= 3 && (
                          <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                            Only {pkg.spotsLeft} spots left!
                          </Badge>
                        )}

                        {/* Discount Badge */}
                        <Badge className="absolute top-4 right-4 bg-green-500 text-white">
                          Save ${pkg.originalPrice - pkg.price}
                        </Badge>

                        {/* Price */}
                        <div className="absolute bottom-4 left-4 text-white">
                          <div className="flex items-baseline">
                            <span className="text-2xl font-bold">${pkg.price}</span>
                            <span className="text-sm line-through ml-2 opacity-75">${pkg.originalPrice}</span>
                          </div>
                          <span className="text-sm opacity-90">per person</span>
                        </div>
                      </div>

                      <CardContent className="p-6 flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.title}</h3>
                            <p className="text-gray-600 text-sm mb-2">{pkg.subtitle}</p>
                            <div className="flex items-center text-sm text-gray-600 space-x-4">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {pkg.duration}
                              </div>
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {pkg.groupSize}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center ml-4">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="font-semibold text-gray-900">{pkg.rating}</span>
                            <span className="text-gray-600 text-sm ml-1">({pkg.reviews})</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <Badge className={getDifficultyColor(pkg.difficulty)}>{pkg.difficulty}</Badge>
                          <Badge variant="outline">{pkg.category}</Badge>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Includes:</h4>
                          <div className="flex flex-wrap gap-1">
                            {pkg.includes.map((item, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4 flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">Highlights:</h4>
                          <ul className="space-y-1">
                            {pkg.highlights.slice(0, 3).map((highlight, index) => (
                              <li key={index} className="flex items-start text-sm text-gray-600">
                                <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="border-t pt-4 mt-auto">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-4 h-4 mr-1" />
                              Next: {formatDate(pkg.nextDeparture)}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {pkg.spotsLeft} spots left
                            </Badge>
                          </div>

                          <motion.div
                            animate={{
                              x: hoveredPackage === pkg.id ? 5 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02]">
                              Book Now
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Can't find the perfect trip?</h3>
            <p className="text-gray-600 mb-6">
              Let us create a custom itinerary tailored to your preferences and budget.
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-50 border border-blue-200 px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <Camera className="w-5 h-5 mr-2" />
              Plan Custom Trip
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
