"use client";

import { useEffect, useState } from "react";
import { TripPackageHeader } from "./TripPackageHeader";
import { GuidesList } from "./GuideList";
import toast from "react-hot-toast";
import {
  useAllGuidesQuery,
  useAssignGuideMutation,
} from "@/hooks/vendor/useGuide";
import { getAllGuides } from "@/services/vendor/vendorService";
import type { GuideListDto } from "@/types/api/guide";
import { filter } from "lodash";
import { useParams } from "react-router-dom";
import Pagination from "@/components/Pagination";
import {
  useGetPackageDetailsQuery,
  type PackageDetails,
} from "@/hooks/vendor/usePackage";
import AssignedGuideCard from "./AssignedGuideCard";


export default function GuideAssignmentPage() {
  const { packageId } = useParams<{ packageId: string }>();
  if (!packageId) return <div>No package id</div>;
  const [guides, setGuides] = useState<GuideListDto[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState({
    searchTerm: "",
    languages: [] as string[],
    minExperience: 1,
    maxExperience: 10,
    gender: "",
  });

  const limit = 5;
  const { data } = useAllGuidesQuery(
    getAllGuides,
    page,
    limit,
    filters.searchTerm,
    "verified",
    filters.languages.length > 0 ? filters.languages : undefined,
    filters.minExperience,
    filters.maxExperience,
    filters.gender
  );

  const [packageDetails, setPackageDetails] = useState<PackageDetails>();

  const { data: packageData, isLoading } = useGetPackageDetailsQuery(
    packageId,
    "vendor"
  );

  const { mutate: assignGuide } = useAssignGuideMutation();
  useEffect(() => {
    if (data) {
      setGuides(data.users);
      setTotalPages(data.totalPages);
    }
  }, [data, filter, page]);

  useEffect(() => {
    if (packageData) {
      setPackageDetails(packageData.packages as PackageDetails);
    }
  }, [packageData, packageId]);

  const handleAssignGuide = (guideId: string) => {
    setIsAssigning(true);

    assignGuide(
      { guideId, packageId },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          setIsAssigning(false)
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
          setIsAssigning(false);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* ✅ Shift content right when sidebar is visible */}
      <div className="md:ml-80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Trip Package Details */}
            <TripPackageHeader
              packageName={packageDetails?.packageName!}
              endDate={packageDetails?.endDate?.toString()!}
              meetingPoint={packageDetails?.meetingPoint!}
              title={packageDetails?.title!}
              status={packageDetails?.status!}
              packageId={packageDetails?.packageId!}
              startDate={packageDetails?.startDate?.toString()!}
              isLoading={isLoading}
            />

                   {/* Assigned guide card */}
            {packageDetails?.guideId && (
              <AssignedGuideCard id={packageDetails.guideId} className="" />
            )}


            {/* Guides List */}

            {!packageDetails?.guideId && (
              <GuidesList
                guides={guides}
                onAssignGuide={handleAssignGuide}
                isAssigning={isAssigning}
                filters={filters}
                onFiltersChange={setFilters}
              />
            )}

            {!packageDetails?.guideId && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
