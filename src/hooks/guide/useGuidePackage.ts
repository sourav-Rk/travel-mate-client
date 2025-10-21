import {
  getPackageDetailsGuide,
  updatePackageStatusGuide,
} from "@/services/guide/guide.service";
import type { IGetAllAssignedPackagesResponse } from "@/types/api/guide";
import { useMutation, useQuery } from "@tanstack/react-query";

interface FetchPackagesParams {
  page: number;
  limit: number;
  searchTerm: string;
  status: string;
}

export const useGetAssignedPackagesQuery = (
  queryFunc: (params: FetchPackagesParams) => Promise<IGetAllAssignedPackagesResponse>,
  page: number,
  limit: number,
  searchTerm: string,
  status: string
) => {
  return useQuery({
    queryKey: ["assigned-packages", page, limit, searchTerm, status],
    queryFn: () => queryFunc({ page, limit, status, searchTerm }),
    placeholderData: (prevData) => prevData,
  });
};

//get package details
export const useGetPackageDetailsQueryGuide = (packageId: string) => {
  return useQuery({
    queryFn: () => getPackageDetailsGuide(packageId),
    queryKey: ["package-details-guide", packageId],
    enabled: !!packageId,
  });
};

//update package status to ongoin
export const useUpdatePackageStatusMutation = () => {
  return useMutation({
    mutationFn: updatePackageStatusGuide
  });
};
