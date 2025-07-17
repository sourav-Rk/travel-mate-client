"use client"

import { motion } from "framer-motion"
import { HeroSection } from "./HeroSection"
import { FeaturedDestinations } from "./FeaturedDestinations"
import { TripPackages } from "./TripPackages"
import { ServicesSection } from "./ServicesSection"

export default function TravelMateLanding() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Destinations */}
      <FeaturedDestinations />

      {/* Trip Packages */}
      <TripPackages />

      {/* Services Section */}
      <ServicesSection />

    </motion.div>
  )
}
