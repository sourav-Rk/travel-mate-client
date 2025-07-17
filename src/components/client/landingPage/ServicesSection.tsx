"use client"

import { motion } from "framer-motion"
import { Shield, Clock, Users, MapPin, CreditCard, Plane, Star, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const services = [
  {
    icon: Shield,
    title: "Travel Insurance",
    description: "Comprehensive coverage for medical emergencies, trip cancellations, and lost luggage",
    features: ["Medical Coverage", "Trip Cancellation", "Baggage Protection", "24/7 Emergency Support"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock assistance wherever you are in the world",
    features: ["Emergency Hotline", "Local Support", "Real-time Updates", "Multilingual Staff"],
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Users,
    title: "Expert Guides",
    description: "Professional local guides with deep knowledge of destinations",
    features: ["Certified Professionals", "Local Insights", "Cultural Expertise", "Safety Training"],
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: MapPin,
    title: "Custom Itineraries",
    description: "Personalized travel plans tailored to your interests and preferences",
    features: ["Personal Consultation", "Flexible Planning", "Local Recommendations", "Activity Booking"],
    color: "from-orange-500 to-red-500",
  },
  {
    icon: CreditCard,
    title: "Flexible Payments",
    description: "Easy payment options with secure transactions and flexible terms",
    features: ["Multiple Payment Methods", "Installment Plans", "Secure Transactions", "Refund Protection"],
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Plane,
    title: "Flight Management",
    description: "Complete flight booking and management services",
    features: ["Best Price Guarantee", "Seat Selection", "Schedule Changes", "Upgrade Options"],
    color: "from-teal-500 to-blue-500",
  },
]

const stats = [
  { icon: Users, value: "50K+", label: "Happy Travelers", color: "text-blue-600" },
  { icon: MapPin, value: "150+", label: "Destinations", color: "text-green-600" },
  { icon: Star, value: "4.9", label: "Average Rating", color: "text-yellow-600" },
  { icon: Award, value: "25+", label: "Awards Won", color: "text-purple-600" },
]

const testimonialHighlights = [
  {
    text: "Best travel experience ever!",
    author: "Sarah M.",
    rating: 5,
    location: "Santorini Trip",
  },
  {
    text: "Professional and caring service",
    author: "John D.",
    rating: 5,
    location: "Japan Adventure",
  },
  {
    text: "Exceeded all expectations",
    author: "Emma L.",
    rating: 5,
    location: "African Safari",
  },
]

export function ServicesSection() {
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
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate="animate"
          className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20"
        />
        <motion.div
          animate="animate"
          className="absolute bottom-20 right-10 w-24 h-24 bg-purple-100 rounded-full opacity-20"
          style={{ animationDelay: "2s" }}
        />
        <motion.div
          animate="animate"
          className="absolute top-1/2 right-1/4 w-16 h-16 bg-green-100 rounded-full opacity-20"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-green-100 text-green-800 px-4 py-2">Our Services</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Why Choose Travel Mate?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide comprehensive travel services to ensure your journey is seamless, safe, and unforgettable from
            start to finish.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {services.map((service, index) => (
            <motion.div key={index}  whileHover={{ y: -10, scale: 1.02 }} className="group">
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white overflow-hidden">
                <CardContent className="p-8">
                  <div className="relative mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <motion.div
                      className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r ${service.color} opacity-20`}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: index * 0.2,
                      }}
                    />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: featureIndex * 0.1 }}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.color} mr-3`} />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div
                  className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center ${stat.color}`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.5 }}
                  className="text-3xl font-bold text-gray-900 mb-2"
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonial Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">What Our Travelers Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialHighlights.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6"
              >
                <div className="flex justify-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-800 font-medium mb-3">"{testimonial.text}"</p>
                <div className="text-sm text-gray-600">
                  <div className="font-semibold">{testimonial.author}</div>
                  <div>{testimonial.location}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
