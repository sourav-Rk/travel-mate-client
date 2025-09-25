import {
  applyPackage,
  getBookingDetails,
  getBookingDetailsClient,
  getBookingsBasedOnStatus,
} from "@/services/client/client.service";
import type { BookingDetailsDto } from "@/types/bookingType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type BookingDetailsResponse = {
  bookingDetails : BookingDetailsDto,
}


//apply for a package mutation
export const useApplyPackageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applyPackage,
    onSuccess : () => {
        queryClient.invalidateQueries({queryKey : ["notifications-client"]})
    }
  });
};

//get booking details query
export const useGetBookingDetails = (packageId: string,isLoggedIn : boolean) => {
  return useQuery({
    queryKey: ["client-package-booking", packageId],
    queryFn: () => getBookingDetails(packageId),
    enabled : isLoggedIn
  });
};

// get bookings
export const useGetBookingsQuery = (
  status: string[]
) => {
  return useQuery({
    queryKey: ["bookings-client", status],
    queryFn: () => getBookingsBasedOnStatus(status),
    placeholderData: (prevData) => prevData
  });
};

//get booking details
export const useGetBookingDetailsClient = (bookingId: string) => {
  return useQuery<BookingDetailsResponse, Error>({
    queryKey: ["booking-details-client", bookingId], 
    queryFn: () => getBookingDetailsClient(bookingId), 
    enabled: !!bookingId, 
  });
};
