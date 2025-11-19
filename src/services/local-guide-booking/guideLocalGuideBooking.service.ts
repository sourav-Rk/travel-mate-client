import { server } from "../server";
import { LOCAL_GUIDE_BOOKING_API } from "@/constants/api/local-guide-booking.api";
import type {
  LocalGuideBookingsQuery,
  LocalGuideBookingListResponse,
} from "@/types/local-guide-booking";

export const getLocalGuideBookingsForGuide = async (
  params: LocalGuideBookingsQuery
): Promise<LocalGuideBookingListResponse> => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();
  const response = await server.get<{
    success: boolean;
    data: LocalGuideBookingListResponse;
  }>(`${LOCAL_GUIDE_BOOKING_API.GET_GUIDE_BOOKINGS}${queryString ? `?${queryString}` : ""}`);

  return response.data;
};

