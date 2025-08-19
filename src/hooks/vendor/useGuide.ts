import { addGuide, getGuideDetails } from "@/services/vendor/vendorService";
import type { IResponse } from "@/types/Response";
import type { IGuide } from "@/types/User";
import { useMutation, useQuery } from "@tanstack/react-query";

interface FetchUserParams {
  page: number;
  limit: number;
  searchTerm: string;
  status: string;
}

type UsersResponse = {
  users: [];
  totalPages: number;
  currentPage: number;
};

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
  status: string
) => {
  return useQuery({
    queryKey: ["guides", page, limit, searchTerm, status],
    queryFn: () => queryFunc({ page, limit, status, searchTerm }),
    placeholderData: (prevData: any) => prevData,
  });
};
