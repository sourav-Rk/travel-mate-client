"use client"

import { useState } from "react"
import PackageFilters from "./PackageFilters"
import PackageListing from "./PackageListing"

export default function PackagesListing() {
  const [filters, setFilters] = useState({})

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
    console.log("[v0] Filters applied:", newFilters)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:sticky lg:top-7 lg:self-start">
            <PackageFilters onFiltersChange={handleFiltersChange} />
          </div>

          {/* Package Listing */}
          <PackageListing filters={filters} />
        </div>
      </div>
    </div>
  )
}
