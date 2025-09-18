"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, Users } from "lucide-react";
import type { PackageDetails } from "@/hooks/vendor/usePackage";
import { useGetAvailbalePackagesQuery } from "@/hooks/client/useClientPackage";
import Pagination from "@/components/Pagination";
import { getAvailablePackages } from "@/services/client/client.service";
import { useNavigate } from "react-router-dom";

interface PackageListingProps {
  filters?: {
    search?: string;
    categories?: string[];
    priceRange?: [number, number];
    duration?: string;
    sortBy?: string;
  };
}

export default function PackageListingUpdated({
  filters,
}: PackageListingProps) {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<PackageDetails[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;
  const { data,isLoading } = useGetAvailbalePackagesQuery(
    getAvailablePackages,
    page ?? 1,
    limit,
    filters?.search ?? "",
    filters?.categories ?? [],
    filters?.priceRange ?? [0, 100000],
    filters?.duration ?? "",
    filters?.sortBy ?? "",
  );


  useEffect(() => {
  setPage(1);
}, [filters]);

  useEffect(() => {
    if (!data) return;
    console.log(data.packages);
    setPackages(data.packages);
    setCurrentPage(data.currentPage);
    setTotalPages(data.totalPages);
  }, [data, page, filters]);

  const handleViewPackage = (packageId : string) => {
     navigate(`/packages/${packageId}`)
  }

  if(isLoading) return <div>Loding packages.....</div>

  return (
    <div className="flex-1">
      {/* Results Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Explore the World
        </h1>
      </div>

      {/* Package Cards */}
      <div className="space-y-6">
        {packages?.map((pkg) => (
          <Card
            key={pkg._id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                {/* Package Image */}
                <div className="lg:w-80 h-48 lg:h-auto relative">
                  <img
                    src={
                      pkg.images[0] ||
                      "/placeholder.svg?height=200&width=320&query=travel destination"
                    }
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-[#2CA4BC] text-white">
                    {pkg.duration.days} Days
                  </Badge>
                </div>

                {/* Package Details */}
                <div className="flex-1 p-6">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="flex-1">
                       <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                        {pkg.packageName}
                      </h3>
                      {/* Location & Category */}
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{pkg.meetingPoint}</span>
                        <span>•</span>
                        <span>{pkg.category}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                        {pkg.title}
                      </h3>

                      {/* Rating - Mock rating for display */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium ml-1">4.5</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          (128 reviews)
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {pkg.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {pkg.tags.slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Group Size & Duration */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>Max {pkg.maxGroupSize} people</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {pkg.duration.days} days, {pkg.duration.nights}{" "}
                            nights
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="lg:text-right">
                      <div className="mb-4">
                        <p className="text-2xl font-bold text-[#2CA4BC]">
                          ₹{pkg.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">per person</p>
                      </div>
                      <Button onClick={() => handleViewPackage(pkg.packageId!)} className="w-full lg:w-auto bg-[#2CA4BC] hover:bg-[#2CA4BC]/90 text-white">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

