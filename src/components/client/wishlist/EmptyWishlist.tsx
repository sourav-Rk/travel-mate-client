"use client"

import { motion } from "framer-motion"
import { Heart, Search, Plus } from "lucide-react"

export function EmptyWishlist() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-16"
    >
      <div className="max-w-md mx-auto">
        {/* Empty State Illustration */}
        <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-8">
          <Heart className="w-16 h-16 text-pink-400" />
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h3>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Start building your dream travel list! Browse our amazing packages and save the ones that catch your eye.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 flex items-center justify-center gap-2 font-medium">
            <Search className="w-5 h-5" />
            Browse Packages
          </button>
          <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 font-medium">
            <Plus className="w-5 h-5" />
            Create Custom Trip
          </button>
        </div>

        {/* Tips */}
        <div className="mt-12 p-6 bg-pink-50 rounded-2xl border border-pink-200">
          <h4 className="font-semibold text-gray-900 mb-3">💡 Pro Tips</h4>
          <ul className="text-sm text-gray-600 space-y-2 text-left">
            <li>• Save packages you're interested in for easy comparison</li>
            <li>• Get notified about price drops and deadline reminders</li>
            <li>• Share your wishlist with friends and family</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}
