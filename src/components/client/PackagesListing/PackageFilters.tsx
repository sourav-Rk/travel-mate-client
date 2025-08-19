"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, Filter } from "lucide-react"

interface PackageFiltersProps {
  onFiltersChange?: (filters: any) => void
}

export default function PackageFilters({ onFiltersChange }: PackageFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [duration, setDuration] = useState("")
  const [sortBy, setSortBy] = useState("")

  const categories = [
    "Adventure",
    "Cultural",
    "Nature",
    "Beach",
    "Mountain",
    "Wildlife",
    "Heritage",
  ]

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  const handleApplyFilters = () => {
    const filters = {
      search: searchTerm,
      categories: selectedCategories,
      priceRange,
      duration,
      sortBy,
    }
    onFiltersChange?.(filters)
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedCategories([])
    setPriceRange([0, 100000])
    setDuration("")
    setSortBy("")
  }

  return (
    <div className="w-full lg:w-80 bg-white border border-gray-200 rounded-lg p-6 h-fit">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-[#2CA4BC]" />
        <h2 className="text-lg font-semibold text-gray-900">Filter Packages</h2>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <Label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2 block">
          Search Destination
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="search"
            type="text"
            placeholder="Where do you want to go?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">Tour Categories</Label>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                className="data-[state=checked]:bg-[#2CA4BC] data-[state=checked]:border-[#2CA4BC]"
              />
              <Label htmlFor={category} className="text-sm text-gray-600 cursor-pointer">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">Price Range</Label>
        <div className="px-2">
          <Slider value={priceRange} onValueChange={setPriceRange} max={100000} min={0} step={100} className="w-full" />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span> ₹{priceRange[0]}</span>
            <span> ₹{priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Duration */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">Number of Days</Label>
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger className="border-gray-300 focus:border-[#2CA4BC] focus:ring-[#2CA4BC]">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-3">1-3 Days</SelectItem>
            <SelectItem value="4-7">4-7 Days</SelectItem>
            <SelectItem value="8-14">8-14 Days</SelectItem>
            <SelectItem value="15-21">15-21 Days</SelectItem>
            <SelectItem value="22+">22+ Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="border-gray-300 focus:border-[#2CA4BC] focus:ring-[#2CA4BC]">
            <SelectValue placeholder="Sort packages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="days-short">Days: Short to Long</SelectItem>
            <SelectItem value="days-long">Days: Long to Short</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button onClick={handleApplyFilters} className="w-full bg-[#2CA4BC] hover:bg-[#2CA4BC]/90 text-white">
          Apply Filters
        </Button>
        <Button
          onClick={handleClearFilters}
          variant="outline"
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
        >
          Clear All
        </Button>
      </div>
    </div>
  )
}
