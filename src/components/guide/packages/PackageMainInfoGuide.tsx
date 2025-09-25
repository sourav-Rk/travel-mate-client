"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PackageImageGallery } from "./PackageImageGalleryGuide";
import { PackageQuickStats } from "./PackageQuickStatsGuide";
import { MapPin, Users } from "lucide-react";
import type { TravelPackage } from "@/types/packageType";
import { useNavigate } from "react-router-dom";

interface PackageMainInfoProps {
  packageData: TravelPackage;
}

export function PackageMainInfo({ packageData }: PackageMainInfoProps) {
  const navigate = useNavigate();

  const handleViewBookings = (packageId: string) => {
    navigate(`/guide/bookings/${packageId}`, {
      state: { packageName: packageData.packageName, title: packageData.title },
    });
  };

  return (
    <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm border-slate-300/60 overflow-hidden">
      <CardHeader className="pb-6">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Image Gallery */}
          <div className="xl:w-1/2">
            <PackageImageGallery
              images={packageData.images}
              title={packageData.title}
            />
          </div>

          {/* Package Info */}
          <div className="xl:w-1/2 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1a5f6b] mb-3 leading-tight">
                    {packageData.packageName}
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600 mb-4 leading-relaxed">
                    {packageData.title}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {packageData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-gradient-to-r from-[#2CA4BC]/10 to-[#1a5f6b]/10 text-[#1a5f6b] border-[#2CA4BC]/30 hover:bg-[#2CA4BC]/20 transition-colors duration-200 px-3 py-1"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => handleViewBookings(packageData.packageId!)}
                  variant="outline"
                  className="border-[#2CA4BC] text-[#2CA4BC] hover:bg-[#2CA4BC] hover:text-white bg-transparent shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Users className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">View Bookings</span>
                  <span className="sm:hidden">Bookings</span>
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <PackageQuickStats packageData={packageData} />

            {/* Meeting Point */}
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-[#2CA4BC]/5 to-[#1a5f6b]/5 rounded-lg border border-[#2CA4BC]/20">
              <MapPin className="h-5 w-5 text-[#2CA4BC] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#1a5f6b] mb-1">
                  Meeting Point
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {packageData.meetingPoint}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
