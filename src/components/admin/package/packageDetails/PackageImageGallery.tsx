"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PackageImageGalleryProps {
  images: string[]
}

export function PackageImageGallery({ images }: PackageImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="relative rounded-xl overflow-hidden shadow-2xl group bg-slate-800 border border-slate-700">
      <img
        src={images[currentImageIndex] || "/placeholder.svg"}
        alt={"package images"}
        className="w-full h-64 md:h-80 lg:h-96 object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-900/60 hover:bg-slate-900/80 text-slate-200 border-0 opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900/60 hover:bg-slate-900/80 text-slate-200 border-0 opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Image Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-200",
              currentImageIndex === index ? "bg-purple-400 w-6" : "bg-slate-400/50 hover:bg-slate-400/75",
            )}
          />
        ))}
      </div>

      {/* Image Counter */}
      <div className="absolute top-4 right-4 bg-slate-900/70 text-slate-200 px-3 py-1 rounded-full text-sm font-medium border border-slate-700">
        {currentImageIndex + 1} / {images.length}
      </div>
    </div>
  )
}
