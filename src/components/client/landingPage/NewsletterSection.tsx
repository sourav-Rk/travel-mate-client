"use client"


import { motion } from "framer-motion"
import { useState } from "react"
import { Mail, Send, Gift, MapPin, Bell, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const benefits = [
  {
    icon: Gift,
    title: "Exclusive Deals",
    description: "Get access to member-only discounts and early bird offers",
  },
  {
    icon: MapPin,
    title: "Travel Inspiration",
    description: "Discover hidden gems and trending destinations worldwide",
  },
  {
    icon: Bell,
    title: "Trip Updates",
    description: "Stay informed about your bookings and travel advisories",
  },
]

const recentOffers = [
  { destination: "Bali, Indonesia", discount: "30% OFF", validUntil: "Limited Time" },
  { destination: "Iceland Adventure", discount: "25% OFF", validUntil: "This Week" },
  { destination: "European Tour", discount: "$500 OFF", validUntil: "Early Bird" },
]

export default function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setIsSubscribed(true)
    setEmail("")
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



  if (isSubscribed) {
    return (
      <section className="py-20 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Travel Mate Family! 🎉</h2>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for subscribing! Check your inbox for exclusive travel deals and inspiration.
            </p>
            <Button
              onClick={() => setIsSubscribed(false)}
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50"
            >
              Subscribe Another Email
            </Button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
         
          animate="animate"
          className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-30"
        />
        <motion.div
    
          animate="animate"
          className="absolute bottom-20 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-30"
          style={{ animationDelay: "2s" }}
        />
        <motion.div
          
          animate="animate"
          className="absolute top-1/2 left-1/4 w-12 h-12 bg-pink-200 rounded-full opacity-30"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <motion.div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 px-4 py-2">Stay Connected</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Never Miss a Travel Deal
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join over 50,000 travelers who receive exclusive offers, travel tips, and destination inspiration directly
              in their inbox.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Benefits */}
            <motion.div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">What You'll Get:</h3>
                <div className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-4"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                        <p className="text-gray-600">{benefit.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recent Offers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h4 className="font-semibold text-gray-900 mb-4">Recent Exclusive Offers:</h4>
                <div className="space-y-3">
                  {recentOffers.map((offer, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/20"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{offer.destination}</div>
                        <div className="text-sm text-gray-600">{offer.validUntil}</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">{offer.discount}</Badge>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Newsletter Form */}
            <motion.div>
              <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Join Our Newsletter</h3>
                    <p className="text-gray-600">Get the best travel deals delivered to your inbox</p>
                  </div>

                  <form onSubmit={handleSubscribe} className="space-y-6">
                    <div>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 text-lg border-gray-200 focus:border-blue-500 rounded-xl"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || !email}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Subscribing...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Send className="w-5 h-5 mr-2" />
                          Subscribe Now
                        </div>
                      )}
                    </Button>

                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        By subscribing, you agree to receive marketing emails from Travel Mate. You can unsubscribe at
                        any time.
                      </p>
                    </div>
                  </form>

                  {/* Social Proof */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    viewport={{ once: true }}
                    className="mt-8 pt-6 border-t border-gray-100"
                  >
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <div className="flex -space-x-2 mr-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white"></div>
                          <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                          <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white"></div>
                        </div>
                        <span>50,000+ subscribers</span>
                      </div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <span>No spam, ever</span>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
