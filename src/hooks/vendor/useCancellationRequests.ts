import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCancellationRequestDetails,
  processCancellationRequest,
  getCancellationRequestStats,
  bulkProcessCancellationRequests,
} from "@/services/vendor/cancellationService";
import type {
  ProcessCancellationRequestPayload,
  ICancellationRequestStats,
} from "@/types/cancellationType";
import type { ResponseWith } from "@/types/common";
import toast from "react-hot-toast";
import {
  getCancellationRequestsVendor,
  getCancelledBookingDetails,
  verifyCancellationRequest,
} from "@/services/vendor/vendorService";
import type { IGetCancellationRequestsResponse } from "@/types/api/vendor";

// Get single cancellation request details
export const useGetCancellationRequestDetails = (requestId: string) => {
  return useQuery({
    queryKey: ["vendor-cancellation-request", requestId],
    queryFn: () => getCancellationRequestDetails(requestId),
    enabled: !!requestId,
  });
};

// Get cancellation request statistics
export const useGetCancellationRequestStats = () => {
  return useQuery<ResponseWith<"stats", ICancellationRequestStats>>({
    queryKey: ["vendor-cancellation-stats"],
    queryFn: () => getCancellationRequestStats(),
  });
};

// Process single cancellation request
export const useProcessCancellationRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      payload,
    }: {
      requestId: string;
      payload: ProcessCancellationRequestPayload;
    }) => processCancellationRequest(requestId, payload),

    onSuccess: (_, variables) => {
      const { status } = variables.payload;

      // Invalidate and refetch queries
      queryClient.invalidateQueries({
        queryKey: ["vendor-cancellation-requests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["vendor-cancellation-request", variables.requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["vendor-cancellation-stats"],
      });

      toast.success(`Cancellation request ${status} successfully`);
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to process cancellation request"
      );
    },
  });
};

// Bulk process cancellation requests
export const useBulkProcessCancellationRequests = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestIds,
      payload,
    }: {
      requestIds: string[];
      payload: ProcessCancellationRequestPayload;
    }) => bulkProcessCancellationRequests(requestIds, payload),

    onSuccess: (_, variables) => {
      const { status } = variables.payload;

      // Invalidate and refetch queries
      queryClient.invalidateQueries({
        queryKey: ["vendor-cancellation-requests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["vendor-cancellation-stats"],
      });

      toast.success(
        `${variables.requestIds.length} cancellation requests ${status} successfully`
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to process cancellation requests"
      );
    },
  });
};

//-----

interface FetchBookingsParams {
  page: number;
  limit: number;
  searchTerm: string;
  status: string;
}

// Get cancellation requests list
export const useGetCancellationRequests = ( queryFunc: (params: FetchBookingsParams)=>Promise<IGetCancellationRequestsResponse>,
  page: number,
  limit: number,
  searchTerm: string,
  status: string) => {
  return useQuery({
    queryKey: ["vendor-cancellation-requests",page,limit,searchTerm,status],
    queryFn: () => queryFunc({page,limit
      ,searchTerm,status
    }),
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
    onSuccess : () =>{
      queryClient.invalidateQueries({queryKey : ["cancellation-booking","vendor-cancellation-requests"]})
    }
  });
};
