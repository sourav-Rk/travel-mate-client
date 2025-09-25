"use client"

import { WishlistHeader } from "./WishlistHeader"
import { WishlistGrid } from "./WishlistGrid"
import { WishlistStats } from "./WishlistStats"
import { EmptyWishlist } from "./EmptyWishlist"

export interface PackageDetailsWishlistDto {
  _id: string
  packageName: string
  title: string
  category: string
  tags: string
  images: string[]
  price: string
  duration: { days: number; nights: number }
  applicationDeadline: string
  status: string
  startDate: string
  endDate: string
}

export interface WishlistDto {
  userId: string
  packages: PackageDetailsWishlistDto[]
}

interface WishlistPageProps {
  wishlistData: WishlistDto
}

export default function WishlistPage({ wishlistData }: WishlistPageProps) {



  if (wishlistData.packages.length === 0) {
    return (
      <div className="lg:ml-80 min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <WishlistHeader
            totalItems={0}
          />
          <EmptyWishlist />
        </div>
      </div>
    )
  }

  return (
    <div className="lg:ml-80 min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header with Search and Filters */}
          <WishlistHeader
            totalItems={wishlistData.packages.length}
          />

          {/* Stats Section */}
          <WishlistStats packages={wishlistData.packages} />

          {/* Wishlist Grid */}
          {wishlistData.packages.length > 0 ? (
            <WishlistGrid packages={wishlistData.packages} />
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
