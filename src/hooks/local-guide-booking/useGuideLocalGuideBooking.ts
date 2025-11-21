import { useQuery } from "@tanstack/react-query";
import { getLocalGuideBookingsForGuide } from "@/services/local-guide-booking/guideLocalGuideBooking.service";
import type { LocalGuideBookingsQuery, LocalGuideBookingListResponse } from "@/types/local-guide-booking";

export const useLocalGuideBookingsForGuide = (params: LocalGuideBookingsQuery) => {
  return useQuery<LocalGuideBookingListResponse>({
    queryKey: ["local-guide-bookings-guide", params],
    queryFn: () => getLocalGuideBookingsForGuide(params),
    placeholderData:(previouseData) => previouseData,
  });
};








