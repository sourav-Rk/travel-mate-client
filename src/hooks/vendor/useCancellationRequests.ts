import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getCancelledBookingDetails,
  verifyCancellationRequest,
} from "@/services/vendor/vendorService";
import type { IGetCancellationRequestsResponse } from "@/types/api/vendor";

interface FetchBookingsParams {
  page: number;
  limit: number;
  searchTerm: string;
  status: string;
}

// Get cancellation requests list
export const useGetCancellationRequests = (
  queryFunc: (
    params: FetchBookingsParams
  ) => Promise<IGetCancellationRequestsResponse>,
  page: number,
  limit: number,
  searchTerm: string,
  status: string
) => {
  return useQuery({
    queryKey: ["vendor-cancellation-requests", page, limit, searchTerm, status],
    queryFn: () => queryFunc({ page, limit, searchTerm, status }),
    placeholderData: (prevData) => prevData,
  });
};

//get cancelled booking details
export const useGetCancellationBookingDetails = (bookingId: string) => {
  return useQuery({
    queryKey: ["cancellation-booking"],
    queryFn: () => getCancelledBookingDetails(bookingId),
  });
};

//verify cancellation request
export const useVerifyCancellationRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyCancellationRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cancellation-booking", "vendor-cancellation-requests"],
      });
    },
  });
};
