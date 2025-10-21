import { travelMateBackend } from "@/api/instance";
import type { 
  CancellationRequestDto, 
  CancellationRequestResponse,
  ProcessCancellationRequestPayload,
  ICancellationRequestStats 
} from "@/types/cancellationType";
import type { ResponseWith } from "@/types/common";

// Get all cancellation requests for vendor
export const getCancellationRequests = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
  search?: string
): Promise<CancellationRequestResponse> => {
  const response = await travelMateBackend.get<CancellationRequestResponse>(
    `/vendor/cancellation-requests`,
    {
      params: {
        page,
        limit,
        ...(status && { status }),
        ...(search && { search }),
      },
    }
  );
  return response.data;
};

// Get single cancellation request details
export const getCancellationRequestDetails = async (
  requestId: string
): Promise<ResponseWith<"cancellationRequest", CancellationRequestDto>> => {
  const response = await travelMateBackend.get<ResponseWith<"cancellationRequest", CancellationRequestDto>>(
    `/vendor/cancellation-requests/${requestId}`
  );
  return response.data;
};

// Process cancellation request (approve/reject)
export const processCancellationRequest = async (
  requestId: string,
  payload: ProcessCancellationRequestPayload
): Promise<ResponseWith<"cancellationRequest", CancellationRequestDto>> => {
  const response = await travelMateBackend.put<ResponseWith<"cancellationRequest", CancellationRequestDto>>(
    `/vendor/cancellation-requests/${requestId}/process`,
    payload
  );
  return response.data;
};

// Get cancellation request statistics
export const getCancellationRequestStats = async (): Promise<ResponseWith<"stats", ICancellationRequestStats>> => {
  const response = await travelMateBackend.get<ResponseWith<"stats", ICancellationRequestStats>>(
    `/vendor/cancellation-requests/stats`
  );
  return response.data;
};

// Bulk process cancellation requests
export const bulkProcessCancellationRequests = async (
  requestIds: string[],
  payload: ProcessCancellationRequestPayload
): Promise<ResponseWith<"cancellationRequests", CancellationRequestDto[]>> => {
  const response = await travelMateBackend.put<ResponseWith<"cancellationRequests", CancellationRequestDto[]>>(
    `/vendor/cancellation-requests/bulk-process`,
    {
      requestIds,
      ...payload,
    }
  );
  return response.data;
};
