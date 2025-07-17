"use client"

import { Link } from 'react-router-dom';
import { easeOut,motion } from "framer-motion"
import { ArrowRight, Globe, MapPin, Users } from "lucide-react" // More relevant icons

import { Button } from "@/components/ui/button"
import MainNav from "./Main-nav"

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }



const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
}


  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.5 } },
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <MainNav />

      <main className="flex-1 flex flex-col items-center justify-center text-center pt-16">
        {/* Hero Section */}
        <section className="relative w-full h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="relative z-10 p-8 max-w-4xl mx-auto"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 text-gray-900 dark:text-gray-50 tracking-tight"
            >
              Your Next Journey, Simplified.
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-700 dark:text-gray-300 font-light"
            >
              Connect with a curated network of travelers, local vendors, and expert guides to craft truly unique and
              unforgettable experiences.
            </motion.p>
            <motion.div variants={buttonVariants}>
              <Button
                asChild
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
              >
                <Link to="/user/signup">
                  Start Your Adventure <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Feature Section */}
        <section className="w-full py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-12">
              Discover the World, Your Way
            </h2>
            <div className="grid md:grid-cols-3 gap-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center"
              >
                <Globe className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">Explore Destinations</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Find unique places and experiences tailored to your interests.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center"
              >
                <MapPin className="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">Connect with Guides</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Book local experts to lead you through authentic adventures.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center"
              >
                <Users className="h-12 w-12 text-purple-600 dark:text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">Join the Community</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Share your experiences and get inspired by fellow travelers.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 py-8 text-center border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <p className="mb-4">&copy; {new Date().getFullYear()} VoyageConnect. All rights reserved.</p>
          <div className="flex justify-center space-x-6 text-base">
            <Link to="#" className="hover:text-gray-900 dark:hover:text-gray-50 transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-gray-900 dark:hover:text-gray-50 transition-colors duration-200">
              Terms of Service
            </Link>
            <Link to="#" className="hover:text-gray-900 dark:hover:text-gray-50 transition-colors duration-200">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
