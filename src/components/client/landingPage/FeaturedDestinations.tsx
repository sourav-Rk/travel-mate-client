"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { MapPin, Star, Heart, ArrowRight, Camera, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const destinations = [
  {
    id: 1,
    name: "Kashmir ",
    country: "India",
    image: "/neom-eOWabmCNEdg-unsplash.jpg",
    rating: 4.9,
    reviews: 2847,
    price: "₹10000",
    duration: "5 days",
    category: "Romantic",
    description:
      "Experience the magic of white-washed buildings and stunning sunsets",
    highlights: ["Sunset Views", "Wine Tasting", "Beach Relaxation"],
    travelers: 1250,
  },
  {
    id: 2,
    name: "Rajasthan, India",
    country: "India",
    image: "/neom-eOWabmCNEdg-unsplash.jpg",
    rating: 4.8,
    reviews: 1923,
    price: "₹12450",
    duration: "7 days",
    category: "Cultural",
    description:
      "Immerse yourself in ancient temples and traditional Japanese culture",
    highlights: ["Temple Tours", "Cherry Blossoms", "Tea Ceremony"],
    travelers: 980,
  },
  {
    id: 3,
    name: "Goa, India",
    country: "India",
    image: "/15984870-goa-beach-goa.jpg",
    rating: 4.9,
    reviews: 3156,
    price: "$650",
    duration: "8 days",
    category: "Adventure",
    description: "Trek through the ancient Inca trail to the lost city",
    highlights: ["Inca Trail", "Mountain Views", "Historical Sites"],
    travelers: 756,
  },
  {
    id: 4,
    name: "Kashmir ",
    country: "India",
    image: "/ai-generated-travelling-to-thailand-advertisment-background-with-copy-space-free-photo.jpg",
    rating: 4.9,
    reviews: 2847,
    price: "₹10000",
    duration: "5 days",
    category: "Romantic",
    description:
      "Experience the magic of white-washed buildings and stunning sunsets",
    highlights: ["Sunset Views", "Wine Tasting", "Beach Relaxation"],
    travelers: 1250,
  },
  {
    id: 5,
    name: "Iceland",
    country: "Iceland",
    image: "/ai-generated-travelling-to-thailand-advertisment-background-with-copy-space-free-photo.jpg",
    rating: 4.7,
    reviews: 1678,
    price: "$550",
    duration: "9 days",
    category: "Nature",
    description: "Witness the Northern Lights and explore dramatic landscapes",
    highlights: ["Northern Lights", "Geysers", "Waterfalls"],
    travelers: 634,
  },
  {
    id: 6,
    name: "Goa, India",
    country: "India",
    image: "/15984870-goa-beach-goa.jpg",
    rating: 4.9,
    reviews: 3156,
    price: "$650",
    duration: "8 days",
    category: "Adventure",
    description: "Trek through the ancient Inca trail to the lost city",
    highlights: ["Inca Trail", "Mountain Views", "Historical Sites"],
    travelers: 756,
  },
];

export function FeaturedDestinations() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [likedDestinations, setLikedDestinations] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLikedDestinations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Romantic: "bg-pink-100 text-pink-800",
      Cultural: "bg-purple-100 text-purple-800",
      Adventure: "bg-green-100 text-green-800",
      Luxury: "bg-yellow-100 text-yellow-800",
      Nature: "bg-blue-100 text-blue-800",
      Modern: "bg-gray-100 text-gray-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-blue-100 text-blue-800 px-4 py-2">
            Popular Destinations
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Explore Amazing Destinations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover breathtaking locations around the world, each offering
            unique experiences and unforgettable memories waiting to be made.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {destinations.map((destination) => (
            <motion.div
              key={destination.id}
              whileHover={{ y: -10 }}
              onHoverStart={() => setHoveredCard(destination.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="group cursor-pointer"
            >
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
                <div className="relative overflow-hidden">
                  <motion.img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Category Badge */}
                  <Badge
                    className={`absolute top-4 left-4 ${getCategoryColor(
                      destination.category
                    )}`}
                  >
                    {destination.category}
                  </Badge>

                  {/* Like Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleLike(destination.id)}
                    className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        likedDestinations.includes(destination.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }`}
                    />
                  </motion.button>

                  {/* Price Tag */}
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="font-bold text-blue-600">
                      {destination.price}
                    </span>
                    <span className="text-sm text-gray-600">
                      /{destination.duration}
                    </span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {destination.name}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {destination.country}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-semibold text-gray-900">
                        {destination.rating}
                      </span>
                      <span className="text-gray-600 text-sm ml-1">
                        ({destination.reviews})
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {destination.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {destination.highlights.map((highlight, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {highlight}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      {destination.travelers} travelers
                    </div>

                    <motion.div
                      animate={{
                        x: hoveredCard === destination.id ? 5 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4"
                      >
                        Explore
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <Camera className="w-5 h-5 mr-2" />
            View All Destinations
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
