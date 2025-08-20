"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { TravelPackage } from "@/types/packageType";
import { Spinner } from "@/components/Spinner";
import { PackageDetailsHeader } from "@/components/admin/package/packageDetails/PackageDetailsHeader";
import { PackageMainInfo } from "@/components/admin/package/packageDetails/PackageMainInfo";
import { PackageHighlights } from "@/components/admin/package/packageDetails/PackageHighlights";
import { PackageAbout } from "@/components/admin/package/packageDetails/PackageAbout";
import { PackageTabsSection } from "@/components/admin/package/packageDetails/PackageTabsSection";
import { useGetPackageDetailsAdminQuery } from "@/hooks/admin/usePackage";

interface PackageDetailsProps {
  className?: string;
}

export function PackageDetailsPageAdmin({ className }: PackageDetailsProps) {
  const { packageId } = useParams<{ packageId: string }>();
  if (!packageId) {
    return (
      <div className="lg:ml-64 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Package ID not found
          </h2>
          <p className="text-gray-600">Please check the URL and try again.</p>
        </div>
      </div>
    );
  }
  const [packageData, setPackageData] = useState<TravelPackage>();
  const { data, isLoading, isError, error } = useGetPackageDetailsAdminQuery(
    packageId,
    "admin"
  );

  useEffect(() => {
    if (!data) return;
    setPackageData(data.packages);
  }, [packageId, data]);

  if (isLoading) {
    return (
      <div className="lg:ml-64 min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="lg:ml-64 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Error Loading Package
          </h2>
          <p className="text-gray-600">
            {error?.message || "Something went wrong"}
          </p>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="lg:ml-64 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Package Not Found
          </h2>
          <p className="text-gray-600">
            The requested package could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "lg:ml-64 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100",
        className
      )}
    >
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        <PackageDetailsHeader
          category={packageData.category}
          duration={packageData.duration}
          maxGroupSize={packageData.maxGroupSize}
          packageName={packageData.packageName}
          price={packageData.price}
          status={packageData.status}
          title={packageData.title}
        />

        <PackageMainInfo
          category={packageData.category}
          description={packageData.description}
          duration={packageData.duration}
          maxGroupSize={packageData.maxGroupSize}
          meetingPoint={packageData.meetingPoint}
          packageName={packageData.packageName}
          price={packageData.price}
          status={packageData.status}
          tags={packageData.tags}
          title={packageData.title}
        />

        <PackageHighlights tags={packageData.tags} />

        <PackageAbout description={packageData.description} />

        <PackageTabsSection
          cancellationPolicy={packageData.cancellationPolicy}
          exclusions={packageData.exclusions}
          inclusions={packageData.inclusions}
          termsAndConditions={packageData.termsAndConditions}
        />
      </div>
    </div>
  );
}
