"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import type { IReviewsResponse, ReviewListDto } from "@/types/reviewType";
import type { PackageItem } from "@/components/vendor/review/PackagesList";
import PackagesList from "@/components/vendor/review/PackagesList";
import ReviewsTable from "@/components/vendor/review/ReviewsTable";
import { useGetPackagesQuery } from "@/hooks/vendor/usePackage";
import { getAllPackages } from "@/services/vendor/vendorService";
import { useGetPackageReviewsVendorQuery } from "@/hooks/review/useReview";

export default function ReviewsPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null
  );
  const [reviews, setReviews] = useState<ReviewListDto[]>([]);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
  });

  const { data, isLoading } = useGetPackagesQuery(
    getAllPackages,
    1,
    10,
    "",
    "all",
    "",
    "vendor"
  );

  const { data: reviewData,refetch } = useGetPackageReviewsVendorQuery(
    selectedPackageId!,
  );

  useEffect(() => {
  if (selectedPackageId) {
    refetch(); 
  }
}, [selectedPackageId, refetch]);

  useEffect(() => {
    if (data) {
      setPackages(data.packages);
    }
  }, [data]);

  useEffect(() => {
    if (packages.length > 0 && !selectedPackageId) {
      setSelectedPackageId(packages[0]?.packageId!);
    }
  }, [packages]);

  useEffect(() => {
    if (!reviewData) return;

    const response = reviewData as IReviewsResponse;
    setReviews(response.data.reviews || []);
    setStats({
      totalReviews: response.data.totalReviews || 0,
      averageRating: Number(response.data.averageRating?.toFixed(1)) || 0,
    });
  }, [reviewData]);
  const selectedPackage = packages.find(
    (p) => p.packageId === selectedPackageId
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 lg:ml-64 overflow-auto">
        <div className="flex h-full">
          <PackagesList
            packages={packages}
            selectedPackageId={selectedPackageId}
            onSelectPackage={setSelectedPackageId}
            isLoading={isLoading}
          />

          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Reviews
                </h1>
                <p className="text-gray-600">
                  {selectedPackage
                    ? `Reviews for ${selectedPackage.packageName}`
                    : "Select a package to view reviews"}
                </p>
              </div>

              <div className="lg:hidden mb-6">
                <PackagesList
                  packages={packages}
                  selectedPackageId={selectedPackageId}
                  onSelectPackage={setSelectedPackageId}
                  isLoading={isLoading}
                />
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Total Reviews Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">
                        Total Reviews
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.totalReviews}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-[#2CA4BC]/10 rounded-lg flex items-center justify-center">
                      <Star size={24} className="text-[#2CA4BC]" />
                    </div>
                  </div>
                </div>

                {/* Average Rating Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">
                        Average Rating
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.averageRating}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-[#2CA4BC]/10 rounded-lg flex items-center justify-center">
                      <Star
                        size={24}
                        className="fill-[#2CA4BC] text-[#2CA4BC]"
                      />
                    </div>
                  </div>
                </div>

                {/* 5-Star Reviews Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-[#2CA4BC]/10 rounded-lg flex items-center justify-center">
                      <Star
                        size={24}
                        className="fill-[#2CA4BC] text-[#2CA4BC]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Table */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedPackage
                      ? `${selectedPackage.packageName} Reviews`
                      : "All Reviews"}
                  </h2>
                </div>
                <ReviewsTable reviews={reviews} isLoading={isLoading} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
