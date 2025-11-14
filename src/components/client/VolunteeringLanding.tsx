"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  DollarSign,
  Heart,
  Star,
  Camera,
  Globe,
  ArrowRight,
  CheckCircle,
  Wallet,
  Clock,
  Award,
 
} from "lucide-react"
import { useClientAuth } from "@/hooks/auth/useAuth"
import { useLocalGuideProfileQuery } from "@/hooks/local-guide/useLocalGuideVerification"
import { Spinner } from "@/components/Spinner"
import { useNavigate } from "react-router-dom"
import { useMyPosts } from "@/hooks/volunteer-post/useVolunteerPost"
import { VolunteeringDashboard } from "./local-guide/VolunteeringDashboard"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const scaleOnHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
}

const floatingAnimation = {
  animate: {
    y: [-20, 20, -20],
    transition: {
      duration: 6,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}

const pulseAnimation = {
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}

export default function VolunteeringLanding() {
  const { isLoggedIn } = useClientAuth()
  const navigate = useNavigate()
  const {
    data: profile,
    isLoading: isLoadingProfile,
    isError: isProfileError,
  } = useLocalGuideProfileQuery(isLoggedIn)

  /**
   * Fetch user's posts if logged in and has profile
   */
  const { data: myPostsData, isLoading: isLoadingMyPosts } = useMyPosts(
    profile?._id || "",
    { limit: 3, sortBy: "newest" },
    isLoggedIn && !!profile?._id
  )

  if (isLoggedIn && isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  // If user is logged in and has a profile, show the dashboard view
  if (isLoggedIn && profile && !isProfileError) {
    return <VolunteeringDashboard profile={profile} myPosts={myPostsData?.posts || []} isLoadingMyPosts={isLoadingMyPosts} />
  }

  // Landing page content for non-logged-in users or users without profile
  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      {/* Hero Section with Background Image */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/vibrant-city-tour.png"
            alt="Local guide with travelers"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5F1E8]/95 via-[#F5F1E8]/80 to-transparent"></div>
        </div>

        <motion.div
          className="max-w-7xl mx-auto text-center relative z-10"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Badge className="mb-6 bg-[#2CA4BC]/10 text-[#2CA4BC] border-[#2CA4BC]/20 px-6 py-3 text-base font-semibold">
              💰 Earn ₹50-200 Per Day as a Local Guide
            </Badge>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-8xl font-serif font-black text-gray-900 mb-8 leading-tight"
            variants={fadeInUp}
          >
            Turn Your City Knowledge
            <br />
            Into{" "}
            <span className="text-[#2CA4BC] relative">
              Real Money
              <motion.div
                className="absolute -bottom-4 left-0 right-0 h-2 bg-[#2CA4BC]/30 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              />
            </span>
          </motion.h1>

          <motion.p
            className="text-xl sm:text-2xl text-gray-700 max-w-4xl mx-auto mb-10 font-sans leading-relaxed font-medium"
            variants={fadeInUp}
          >
            You know your city better than anyone. Now get paid to share its soul with curious travelers who want
            authentic, local experiences.
          </motion.p>

          {/* Earning Highlight */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto mb-10 border border-[#2CA4BC]/20"
            variants={fadeInUp}
          >
            <div className="flex items-center justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-[#2CA4BC]">₹150</div>
                <div className="text-sm text-gray-600">Average Daily Earning</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div>
                <div className="text-3xl font-bold text-[#2CA4BC]">4.9★</div>
                <div className="text-sm text-gray-600">Guide Rating</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div>
                <div className="text-3xl font-bold text-[#2CA4BC]">2-4hrs</div>
                <div className="text-sm text-gray-600">Per Tour</div>
              </div>
            </div>
          </motion.div>

          <motion.div className="flex flex-col sm:flex-row gap-6 justify-center items-center" variants={fadeInUp}>
            <motion.div {...{scaleOnHover}} {...{pulseAnimation}}>
              <Button
                size="lg"
                className="bg-[#2CA4BC] hover:bg-[#2CA4BC]/90 text-white px-12 py-6 text-xl font-bold rounded-full shadow-2xl"
                onClick={() => {
                  if (isLoggedIn) {
                    navigate("/pvt/local-guide/verification")
                  } else {
                    navigate("/signup")
                  }
                }}
              >
                {isLoggedIn ? "Create Guide Profile" : "Start Earning Today"}
                <Wallet className="ml-3 h-6 w-6" />
              </Button>
            </motion.div>
            {!isLoggedIn && (
              <motion.div {...scaleOnHover}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-[#2CA4BC] text-[#2CA4BC] hover:bg-[#2CA4BC]/10 px-10 py-6 text-xl bg-white/80 backdrop-blur-sm rounded-full"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Animated Money Icons */}
        <motion.div className="absolute top-20 left-10 text-[#2CA4BC]/30" {...{floatingAnimation}}>
          <DollarSign size={50} />
        </motion.div>
        <motion.div
          className="absolute top-32 right-16 text-[#2CA4BC]/30"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <Wallet size={40} />
        </motion.div>
        <motion.div className="absolute bottom-20 left-20 text-[#2CA4BC]/30" {...{floatingAnimation}}>
          <Award size={35} />
        </motion.div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-6">Real Guides, Real Earnings</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
              See how locals like you are turning their city knowledge into substantial income
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria Santos",
                city: "Barcelona",
                earning: "$2,400/month",
                image: "/barcelona-tour-guide.png",
                quote:
                  "I show travelers the real Barcelona - hidden tapas bars, local markets, and secret viewpoints. Now I earn more than my office job!",
              },
              {
                name: "James Chen",
                city: "Tokyo",
                earning: "$3,100/month",
                image: "/tokyo-tour-guide.png",
                quote:
                  "From anime districts to traditional temples, I help visitors experience Tokyo's soul. The money is amazing, but the connections are priceless.",
              },
              {
                name: "Priya Sharma",
                city: "Mumbai",
                earning: "$1,800/month",
                image: "/mumbai-street-food-tour.png",
                quote:
                  "Street food tours, Bollywood locations, local markets - I share my Mumbai with the world and earn great money doing what I love.",
              },
            ].map((story, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-[#F5F1E8]/30">
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <img
                        src={story.image || "/placeholder.svg"}
                        alt={story.name}
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-[#2CA4BC]/20"
                      />
                      <h3 className="text-xl font-serif font-bold text-gray-900">{story.name}</h3>
                      <p className="text-[#2CA4BC] font-semibold">{story.city}</p>
                      <div className="bg-[#2CA4BC] text-white px-4 py-2 rounded-full text-lg font-bold mt-2 inline-block">
                        {story.earning}
                      </div>
                    </div>
                    <p className="text-gray-600 font-sans italic leading-relaxed">"{story.quote}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, number: "10K+", label: "Active Guides" },
              { icon: Globe, number: "500+", label: "Cities Covered" },
              { icon: Star, number: "4.9", label: "Average Rating" },
              { icon: DollarSign, number: "$2M+", label: "Earned by Guides" },
            ].map((stat, index) => (
              <motion.div key={index} variants={fadeInUp} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-accent/10 rounded-full">
                    <stat.icon className="h-8 w-8 text-accent" />
                  </div>
                </div>
                <div className="text-3xl font-serif font-bold text-foreground mb-2">{stat.number}</div>
                <div className="text-muted-foreground font-sans">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F5F1E8]">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-6">
              Start Earning in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
              From signup to your first paid tour in less than 24 hours
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Guide Profile",
                description:
                  "Share your local expertise, favorite spots, and what makes your city special. Upload photos of hidden gems only locals know.",
                icon: Users,
                time: "5 minutes",
                image: "/online-profile-city.png",
              },
              {
                step: "02",
                title: "Set Your Rates & Availability",
                description:
                  "Choose your hourly rate ($25-75/hour), set your schedule, and list the types of tours you want to offer.",
                icon: DollarSign,
                time: "3 minutes",
                image: "/tour-guide-calendar-pricing.png",
              },
              {
                step: "03",
                title: "Welcome Your First Travelers",
                description:
                  "Get matched with travelers, start your tour, and earn money while sharing your city's authentic experiences.",
                icon: Heart,
                time: "Same day",
                image: "/tour-guide-meeting.png",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-[#2CA4BC] text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                            {item.step}
                          </div>
                          <div>
                            <h3 className="text-xl font-serif font-bold text-gray-900">{item.title}</h3>
                            <div className="flex items-center text-[#2CA4BC] text-sm font-semibold">
                              <Clock className="w-4 h-4 mr-1" />
                              {item.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 font-sans leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4">Why Become a Local Guide?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-sans">
              Turn your local knowledge into a rewarding experience for both you and travelers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: DollarSign,
                title: "Earn Extra Income",
                description: "Make money sharing what you already know about your city",
              },
              {
                icon: Heart,
                title: "Meet New People",
                description: "Connect with travelers from around the world and make lasting friendships",
              },
              {
                icon: Star,
                title: "Share Your Passion",
                description: "Show off your favorite spots and hidden gems to curious visitors",
              },
              {
                icon: Globe,
                title: "Cultural Exchange",
                description: "Learn about different cultures while sharing your own",
              },
              {
                icon: Camera,
                title: "Create Memories",
                description: "Help travelers create unforgettable experiences in your city",
              },
              {
                icon: CheckCircle,
                title: "Flexible Schedule",
                description: "Work when you want, as much or as little as you prefer",
              },
            ].map((benefit, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <motion.div
                  className="p-6 rounded-lg border border-border hover:border-accent/50 transition-colors duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-accent/10 rounded-lg mr-4">
                      <benefit.icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-serif font-semibold text-foreground">{benefit.title}</h3>
                  </div>
                  <p className="text-muted-foreground font-sans text-sm leading-relaxed">{benefit.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Sign Up / Login CTA Section for Guests */}
      {!isLoggedIn && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#2CA4BC] via-[#2CA4BC]/90 to-[#1a5f6b] relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/placeholder-422vt.png"
              alt="Successful guides"
              className="w-full h-full object-cover opacity-10"
            />
          </div>

          <motion.div
            className="max-w-4xl mx-auto text-center relative z-10"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-6 bg-white/20 text-white border-white/30 px-6 py-2 text-base font-semibold">
                🔒 Sign Up to Explore
              </Badge>
            </motion.div>

            <h2 className="text-4xl sm:text-6xl font-serif font-bold text-white mb-6">
              Ready to Explore Volunteer Posts?
            </h2>
            <p className="text-xl text-white/90 mb-8 font-sans max-w-3xl mx-auto leading-relaxed">
              Sign up or log in to discover amazing local insights, hidden gems, and authentic experiences shared by our community of local guides.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-10 max-w-2xl mx-auto border border-white/20">
              <div className="text-lg font-semibold text-white mb-4">What you'll get:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="flex items-center gap-3 text-white/90">
                  <CheckCircle className="h-5 w-5 text-white flex-shrink-0" />
                  <span>Browse volunteer posts from local guides</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <CheckCircle className="h-5 w-5 text-white flex-shrink-0" />
                  <span>Discover hidden gems in your city</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <CheckCircle className="h-5 w-5 text-white flex-shrink-0" />
                  <span>Connect with local experts</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <CheckCircle className="h-5 w-5 text-white flex-shrink-0" />
                  <span>Create your own guide profile</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div {...{scaleOnHover}} {...{pulseAnimation}}>
                <Button
                  size="lg"
                  className="bg-white hover:bg-white/90 text-[#2CA4BC] px-12 py-6 text-xl font-bold rounded-full shadow-2xl"
                  onClick={() => navigate("/signup")}
                >
                  Create Free Account
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </motion.div>
              <motion.div {...scaleOnHover}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white/10 px-10 py-6 text-xl bg-transparent backdrop-blur-sm rounded-full"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </motion.div>
            </div>

            <p className="text-white/70 mt-6 text-sm">
              ✓ Free to join ✓ No credit card required ✓ Start exploring immediately
            </p>
          </motion.div>
        </section>
      )}

      {/* CTA Section for Logged-in Users */}
      {isLoggedIn && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#2CA4BC] to-[#2CA4BC]/80 relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/placeholder-422vt.png"
              alt="Successful guides"
              className="w-full h-full object-cover opacity-20"
            />
          </div>

          <motion.div
            className="max-w-4xl mx-auto text-center relative z-10"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl sm:text-6xl font-serif font-bold text-white mb-8">
              Your City. Your Knowledge.
              <br />
              <span className="text-[#F5F1E8]">Your Income.</span>
            </h2>
            <p className="text-xl text-white/90 mb-10 font-sans max-w-3xl mx-auto leading-relaxed">
              Join 10,000+ local guides who've already earned over $2M helping travelers discover authentic city
              experiences. Your first tour could be tomorrow.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-10 max-w-2xl mx-auto">
              <div className="text-3xl font-bold text-white mb-2">Average Guide Earnings</div>
              <div className="text-5xl font-black text-[#F5F1E8] mb-2">₹1,200 - ₹3,500</div>
              <div className="text-white/80">per month (part-time)</div>
            </div>

            <motion.div {...{scaleOnHover}} {...{pulseAnimation}}>
              <Button
                size="lg"
                className="bg-[#F5F1E8] hover:bg-white text-[#2CA4BC] px-16 py-8 text-2xl font-black rounded-full shadow-2xl"
                onClick={() => navigate("/pvt/local-guide/verification")}
              >
                Create Guide Profile
                <ArrowRight className="ml-4 h-8 w-8" />
              </Button>
            </motion.div>

            <p className="text-white/70 mt-6 text-sm">
              ✓ No upfront costs ✓ Flexible schedule ✓ Keep 85% of earnings ✓ 24/7 support
            </p>
          </motion.div>
        </section>
      )}
    </div>
  )
}