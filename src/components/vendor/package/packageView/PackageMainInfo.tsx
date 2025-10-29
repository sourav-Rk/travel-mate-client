"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PackageImageGallery } from "./PackageImageGallery";
import { PackageQuickStats } from "./PackageQuickStats";
import { MapPin, Edit, Users, UserPlus } from "lucide-react";
import type { TravelPackage } from "@/types/packageType";
import { useNavigate } from "react-router-dom";

interface PackageMainInfoProps {
  packageData: TravelPackage;
}

export function PackageMainInfo({ packageData }: PackageMainInfoProps) {
  const navigate = useNavigate();

  const canEdit = packageData.status === "draft";
  const editMessage = canEdit
    ? "Edit this package"
    : `Cannot edit package with status: ${packageData.status}. Only draft packages can be edited.`;

  const handleEditPackage = (packageId: string) => {
    if (packageData.status === "draft") {
      navigate(`/vendor/packages/edit/${packageId}`);
    }
  };

  const handleViewBookings = (packageId: string) => {
    console.log("triggeredddd");
    navigate(`/vendor/bookings/${packageId}`);
  };

  const handleNavigateToAssignGuide = (
    packageId: string,
    packageName: string,
    title: string,
    startDate: string,
    endDate: string,
    meetingPoint: string,
    status: string
  ) => {
    navigate(`/vendor/packages/${packageId}/assign-guide`, {
      state: { packageName, title, startDate, endDate, meetingPoint, status },
    });
  };

  return (
    <Card className="w-full border-0 shadow-2xl bg-white/95 backdrop-blur-sm border-slate-300/60 overflow-hidden">
      <CardHeader className="pb-6">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Image Gallery */}
          <div className="xl:w-1/2 w-full">
            <PackageImageGallery
              images={packageData.images}
              title={packageData.title}
            />
          </div>

          {/* Package Info */}
          <div className="xl:w-1/2 w-full space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 flex-wrap">
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

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:flex-wrap">
                <div className="flex flex-col items-stretch sm:items-end gap-1 w-full sm:w-auto">
                  <Button
                    onClick={() => handleEditPackage(packageData.packageId!)}
                    disabled={!canEdit}
                    variant={canEdit ? "default" : "outline"}
                    className={
                      canEdit
                        ? "w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                        : "w-full sm:w-auto opacity-50 cursor-not-allowed"
                    }
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Package
                  </Button>
                  {!canEdit && (
                    <p className="text-xs text-red-600 max-w-48 text-right">
                      {editMessage}
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => handleViewBookings(packageData.packageId!)}
                  variant="outline"
                  className="w-full sm:w-auto border-[#2CA4BC] text-[#2CA4BC] hover:bg-[#2CA4BC] hover:text-white bg-transparent shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Users className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">View Bookings</span>
                  <span className="sm:hidden">Bookings</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleNavigateToAssignGuide(
                      packageData.packageId!,
                      packageData.packageName,
                      packageData.title,
                      packageData.startDate!.toString(),
                      packageData.endDate!.toString(),
                      packageData.meetingPoint,
                      packageData.status
                    )
                  }
                  className="w-full sm:w-auto border-green-600 text-green-600 hover:bg-green-600 hover:text-white bg-transparent shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Assign Guide</span>
                  <span className="sm:hidden">Assign</span>
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
