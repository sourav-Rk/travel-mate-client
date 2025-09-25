import {
  addGuide,
  assignGuide,
  getGuideDetails,
} from "@/services/vendor/vendorService";
import type { IResponse } from "@/types/Response";
import type { IGuide } from "@/types/User";
import { useMutation, useQuery } from "@tanstack/react-query";

interface FetchUserParams {
  page: number;
  limit: number;
  searchTerm: string;
  status: string;
  minExperience?: number;
  maxExperience?: number;
  gender?: string;
  languages?: string[];
  availability?: "free" | "inTrip";
}

type UsersResponse = {
  users: [];
  totalPages: number;
  currentPage: number;
};

interface AssignGuideParams {
  guideId: string;
  packageId: string;
}

//add guide
export const useAddGuideMutation = () => {
  return useMutation<IResponse, Error, IGuide>({
    mutationFn: (guide: IGuide) => addGuide(guide),
  });
};

//get guide details
export const useGuideDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: ["guide-details", id],
    queryFn: () => getGuideDetails(id),
    enabled: !!id,
  });
};

//get all guide
export const useAllGuidesQuery = (
  queryFunc: (params: FetchUserParams) => Promise<UsersResponse>,
  page: number,
  limit: number,
  searchTerm: string,
  status: string,
  languages?: string[],
  minExperience?: number,
  maxExperience?: number,
  gender?: string
) => {
  return useQuery({
    queryKey: [
      "guides",
      page,
      limit,
      searchTerm,
      status,
      minExperience,
      languages,
      minExperience,
      maxExperience,
      gender,
    ],
    queryFn: () =>
      queryFunc({
        page,
        limit,
        status,
        searchTerm,
        languages,
        minExperience,
        maxExperience,
        gender,
      }),
    placeholderData: (prevData: any) => prevData,
  });
};

export const useAssignGuideMutation = () => {
  return useMutation({
    mutationFn: ({ guideId, packageId }: AssignGuideParams) =>
      assignGuide(guideId, packageId),
  });
};
