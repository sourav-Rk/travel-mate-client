"use client"

import type React from "react"
import { Package, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PackageItem {
  packageId?: string
  packageName: string
  price: number
  reviewCount?: number
}

interface PackagesListProps {
  packages: PackageItem[]
  selectedPackageId: string | null
  onSelectPackage: (packageId: string) => void
  isLoading?: boolean
}

const PackagesList: React.FC<PackagesListProps> = ({
  packages,
  selectedPackageId,
  onSelectPackage,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2CA4BC]"></div>
      </div>
    )
  }

  if (!packages || packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 bg-gray-50 rounded-lg border border-gray-200">
        <Package size={32} className="text-gray-300 mb-2" />
        <p className="text-gray-600 font-medium text-sm">No packages available</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Sidebar View */}
      <div className="hidden lg:block w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Package size={18} className="text-[#2CA4BC]" />
            Packages
          </h3>
        </div>
        <div className="p-2 space-y-2">
          {packages.map((pkg) => (
            <button
              key={pkg?.packageId!}
              onClick={() => onSelectPackage(pkg?.packageId!)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-lg transition-all duration-200 group flex items-center justify-between",
                selectedPackageId === pkg?.packageId!
                  ? "bg-[#2CA4BC] text-white shadow-md"
                  : "text-gray-700 hover:bg-[#2CA4BC]/10 hover:text-[#2CA4BC]",
              )}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{pkg.packageName}</p>
                <p className={cn("text-xs", selectedPackageId === pkg?.packageId! ? "text-[#2CA4BC]/80" : "text-gray-500")}>
                  ₹{pkg.price}
                </p>
              </div>
              <ChevronRight
                size={18}
                className={cn(
                  "flex-shrink-0 ml-2 transition-transform",
                  selectedPackageId === pkg?.packageId! ? "text-white" : "text-gray-400 group-hover:text-[#2CA4BC]",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Horizontal Scroll View */}
      <div className="lg:hidden mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Package size={18} className="text-[#2CA4BC]" />
          <h3 className="text-sm font-semibold text-gray-900">Select Package</h3>
        </div>
        <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="flex gap-3 px-4 md:px-0">
            {packages.map((pkg) => (
              <button
                key={pkg?.packageId!}
                onClick={() => onSelectPackage(pkg?.packageId!)}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap text-sm font-medium",
                  selectedPackageId === pkg?.packageId!
                    ? "bg-[#2CA4BC] text-white shadow-md"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-[#2CA4BC] hover:text-[#2CA4BC]",
                )}
              >
                {pkg.packageName}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default PackagesList
