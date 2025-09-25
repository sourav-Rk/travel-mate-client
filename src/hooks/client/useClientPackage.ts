import { useQuery } from "@tanstack/react-query";
import type { PackageDetails } from "../vendor/usePackage";
import {
  getPackageDetails,
  getRelatedPackages,
  getTrendingPackages,
} from "@/services/client/client.service";

interface FetchPackagesParams {
  page: number;
  limit: number;
  search: string;
  categories: string[];
  priceRange: [number, number];
  duration: string;
  sortBy: string;
}

type PackageResponse = {
  packages: PackageDetails[];
  totalPages: number;
  currentPage: number;
};

//get all available packages query
export const useGetAvailbalePackagesQuery = (
  queryFunc: (params: FetchPackagesParams) => Promise<PackageResponse>,
  page: number,
  limit: number,
  search: string,
  categories: string[],
  priceRange: [number, number],
  duration: string,
  sortBy: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [
      "client-package-details",
      page,
      limit,
      search,
      categories,
      priceRange,
      duration,
      sortBy,
    ],
    queryFn: () =>
      queryFunc({
        page,
        limit,
        search,
        categories,
        priceRange,
        duration,
        sortBy,
      }),
    placeholderData: (prevData) => prevData,
    enabled,
  });
};

//get a specific package details
export const useGetPackageDetailsQuery = (packageId: string) => {
  return useQuery({
    queryFn: () => getPackageDetails(packageId),
    queryKey: ["package-details-client", packageId],
    enabled: !!packageId,
  });
};

//get related packages
export const useGetRelatedPackagesQuery = (packageId: string) => {
  return useQuery({
    queryFn: () => getRelatedPackages( packageId ),
    queryKey: ["related-packages", packageId],
  });
};

//get trending packages
export const useGetTrendingPackagesQuery = () => {
  return useQuery({
    queryKey : ['trending-packages'],
    queryFn : getTrendingPackages
  })
}