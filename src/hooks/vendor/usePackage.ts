import {
  addPackage,
  createActivity,
  deleteActivity,
  getPackageDetails,
  updateActivity,
  updateItinerary,
  updatePackageBasicDetails,
  updatePackageStatus,
} from "@/services/vendor/vendorService";
import type { IGetAllPackagesVendorResponse } from "@/types/api/vendor";
import type { BasicDetails, DayDto } from "@/types/packageType";
import type { IResponse } from "@/types/Response";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface PackageDetails {
  _id: string;
  packageId ?: string;
  packageName: string;
  title: string;
  description: string;
  category: string;
  maxGroupSize: number;
  price: number;
  tags: string[];
  startDate: Date | null;
  endDate: Date | null;
  duration: { days: number; nights: number };
  meetingPoint: string;
  images: string[];
  inclusions: string[];
  exclusions: string[];
  cancellationPolicy: string;
  termsAndConditions: string;
  status: string;
  isBlocked: boolean;
  guideId ?: string;
}

interface FetchPackagesParams {
  page: number;
  limit: number;
  searchTerm: string;
  status: string;
  category: string;
  userType: string;
}

// type PackagesResponse = {
//   packages: PackageDetails[];
//   totalPages: number;
//   currentPage: number;
// };

//add package
export const useAddPackageMutation = () => {
  return useMutation({
    mutationFn: addPackage,
  });
};

//get packages
export const useGetPackagesQuery = <T extends { packages: any[] }>(
  queryFunc: (params: FetchPackagesParams) => Promise<T>,
  page: number,
  limit: number,
  searchTerm: string,
  status: string,
  category: string,
  userType: string
) => {
  return useQuery({
    queryKey: ["packages", page, limit, searchTerm, status, category],
    queryFn: () =>
      queryFunc({ page, limit, status, searchTerm, category, userType }),
    placeholderData: (prevData) => prevData,
  });
};

//get package details
export const useGetPackageDetailsQuery = (
  packageId: string,
  userType: string
) => {
  return useQuery({
    queryFn: () => getPackageDetails(packageId, userType),
    queryKey: ["package-details", packageId, userType],
    enabled: !!packageId,
  });
};

//update package basice details
export const useUpdatePackageBasiceDetailsMutations = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      packageId,
      basicData,
    }: {
      packageId: string;
      basicData: BasicDetails;
    }) => updatePackageBasicDetails(packageId, basicData),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["package-details"] }),
  });
};

//update itinerary
export const useUpdateItineraryDetailsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      itineraryId,
      itineraryData,
    }: {
      itineraryId: string;
      itineraryData: DayDto[];
    }) => updateItinerary(itineraryId, itineraryData),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["package-details"] }),
  });
};

//update activity
export const useUpdateActivityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      activityId,
      activityData,
    }: {
      activityId: string;
      activityData: any;
    }) => updateActivity(activityId, activityData),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["package-details"] }),
  });
};

//create an activity
export const useCreateActivityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createActivity,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["package-details"] }),
  });
};

//delete an activity
export const useDeleteActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteActivity,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["package-details"] }),
  });
};

//update package status
export const useUpdatePackageStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<IResponse, Error, { packageId: string; status: string }>({
    mutationFn: ({ packageId, status }) =>
      updatePackageStatus(packageId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["packages"] }),
  });
};
