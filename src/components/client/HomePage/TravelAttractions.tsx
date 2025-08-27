"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Users } from "lucide-react"
import { motion } from "framer-motion"
import type { PackageDetails } from "@/hooks/vendor/usePackage"

interface PopularDestinationsProps {
  topAttractions: PackageDetails[]
}

export default function TravelAttractions({ topAttractions }: PopularDestinationsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      y: -10,
      rotateY: 5,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  }

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  }

  const priceVariants = {
    hover: {
      scale: 1.1,
      color: "#1f9cb0",
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex justify-between items-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div>
            <motion.h2
              className="text-3xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Top Attractions
            </motion.h2>
            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Must-visit landmarks around the world
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              className="hidden sm:flex border-[#2CA4BC] text-[#2CA4BC] hover:bg-[#2CA4BC] hover:text-white bg-transparent"
            >
              View All
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {topAttractions.slice(0, 4).map((attraction, index) => (
            <motion.div key={index} variants={{cardVariants}} whileHover="hover" className="cursor-pointer">
              <Card className="overflow-hidden shadow-md h-full flex flex-col">
                <div className="relative overflow-hidden">
                  <motion.img
                    src={attraction.images[0] || "/placeholder.svg"}
                    alt={attraction.title}
                    className="w-full h-48 object-cover"
                    variants={{imageVariants}}
                  />
                  <motion.div
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs font-medium">{ 4.5}</span>
                  </motion.div>

                  {attraction.category && (
                    <motion.div
                      className="absolute top-3 left-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                    >
                      <Badge variant="secondary" className="bg-[#2CA4BC]/90 text-white text-xs">
                        {attraction.category}
                      </Badge>
                    </motion.div>
                  )}
                </div>

                <CardContent className="p-4 flex-1 flex flex-col">
                  <motion.h3
                    className="font-semibold text-gray-900 mb-2 line-clamp-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
                  >
                    {attraction.packageName || attraction.title}
                  </motion.h3>

                  {attraction.description && (
                    <motion.p
                      className="text-sm text-gray-600 mb-3 line-clamp-2"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 + index * 0.1, duration: 0.4 }}
                    >
                      {attraction.description.length > 80
                        ? `${attraction.description.substring(0, 80)}...`
                        : attraction.description}
                    </motion.p>
                  )}

                  <motion.div
                    className="flex items-center gap-4 mb-3 text-sm text-gray-600"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                  >
                    {attraction.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{`${attraction.duration.days} days, ${attraction.duration.nights} nights`}</span>
                      </div>
                    )}
                    {attraction.maxGroupSize && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{attraction.maxGroupSize}</span>
                      </div>
                    )}
                  </motion.div>

                  {attraction.tags && attraction.tags.length > 0 && (
                    <motion.div
                      className="flex flex-wrap gap-1 mb-3"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3 + index * 0.1, duration: 0.4 }}
                    >
                      {attraction.tags.slice(0, 2).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs px-2 py-0.5">
                          {tag}
                        </Badge>
                      ))}
                      {attraction.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          +{attraction.tags.length - 2}
                        </Badge>
                      )}
                    </motion.div>
                  )}

                  <motion.div
                    className="flex items-center mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                  >
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{4.5}</span>
                    <span className="text-sm text-gray-500 ml-1">({4})</span>
                  </motion.div>

                  <motion.div
                    className="flex justify-between items-center mt-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 + index * 0.1, duration: 0.4 }}
                  >
                    <motion.span className="text-lg font-bold text-[#2CA4BC]" variants={priceVariants}>
                      From ₹{attraction.price}
                    </motion.span>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
