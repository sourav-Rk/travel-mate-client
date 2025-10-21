import { getBookingDetailsGuide } from "@/services/guide/guide.service";
import type { IGetBookingsGuideResponse } from "@/types/api/guide";
import { useQuery } from "@tanstack/react-query";

interface FetchBookingsParams {
  packageId: string;
  page: number;
  limit: number;
  searchTerm: string;
  status: string;
}


//get bookings for a package
export const useGetBookingsGuideQuery = (
  queryFunc: (params: FetchBookingsParams) => Promise<IGetBookingsGuideResponse>,
  packageId: string,
  page: number,
  limit: number,
  searchTerm: string,
  status: string
) => {
  return useQuery({
    queryKey: ["bookings-guide", page, limit, searchTerm, status],
    queryFn: () => queryFunc({ packageId, page, limit, status, searchTerm }),
    placeholderData: (prevData) => prevData,
  });
};


//get booking details
export const useGetBookingDetailsGuide = (bookingId: string) => {
  return useQuery({
    queryKey: ["booking-details-guide", bookingId], 
    queryFn: () => getBookingDetailsGuide(bookingId), 
    enabled: !!bookingId, 
  });
};