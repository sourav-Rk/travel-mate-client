import {
  getBookingDetailsVendor,
  sendPaymentAlert,
} from "@/services/vendor/vendorService";
import type { BookingDetailsDto, BookingListVendorDto } from "@/types/bookingType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface FetchBookingsParams {
  packageId: string;
  page: number;
  limit: number;
  searchTerm: string;
  status: string;
}

type BookingResponse = {
  bookings: BookingListVendorDto[];
  totalPages: number;
  currentPage: number;
  minTravelersCount: number;
};

type BookingDetailsResponse = {
  bookingDetails : BookingDetailsDto,
}

//get bookings for a package
export const useGetBookingsVendorQuery = (
  queryFunc: (params: FetchBookingsParams) => Promise<BookingResponse>,
  packageId: string,
  page: number,
  limit: number,
  searchTerm: string,
  status: string
) => {
  return useQuery({
    queryKey: ["bookings-vendor", page, limit, searchTerm, status],
    queryFn: () => queryFunc({ packageId, page, limit, status, searchTerm }),
    placeholderData: (prevData) => prevData,
  });
};

//get booking details
export const useGetBookingDetailsVendor = (bookingId: string) => {
  return useQuery<BookingDetailsResponse, Error>({
    queryKey: ["booking-details", bookingId], 
    queryFn: () => getBookingDetailsVendor(bookingId), 
    enabled: !!bookingId, 
  });
};

//send payment alert mutation
export const useSendPaymentAlertMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendPaymentAlert,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["bookings-vendor"] }),
  });
};
