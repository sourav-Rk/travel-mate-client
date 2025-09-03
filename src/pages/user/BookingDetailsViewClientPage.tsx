import { BookingDetailsView } from "@/components/client/Bookings/BookingDetails";
import { useGetBookingDetailsClient } from "@/hooks/client/useBooking";
import type { BookingDetailsDto } from "@/types/bookingType";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function BookingDetailsViewClientPage() {
  const [bookingDetails, setBookingDetails] = useState<BookingDetailsDto>();
  const params = useParams();
  const bookingId =
    (params as any)?.bookingId ??
    (params as any)?.id ??
    (params as any)?.booking_id ??
    "";
  const { data, isLoading } = useGetBookingDetailsClient(bookingId);

  useEffect(() => {
    if (!data) return;
    setBookingDetails(data.bookingDetails);
  }, [bookingId, data]);
  
  return (
    <BookingDetailsView
      _id={bookingDetails?._id || ""}
      advancePayment={
        bookingDetails?.advancePayment
          ? {
              ...bookingDetails.advancePayment,
              dueDate: bookingDetails.advancePayment.dueDate.toString(),
              paidAt:
                bookingDetails.advancePayment.paidAt?.toString() ?? undefined,
            }
          : null
      }
      fullPayment={
        bookingDetails?.fullPayment
          ? {
              ...bookingDetails.fullPayment,
              dueDate: bookingDetails?.fullPayment.dueDate.toString() ?? "",
              paidAt:
                bookingDetails.fullPayment.paidAt?.toString() ?? undefined,
            }
          : null
      }
      isWaitlisted={bookingDetails?.isWaitlisted || false}
      packageId={bookingDetails?.packageId || ""}
      status={bookingDetails?.status || ""}
      userId={bookingDetails?.userId || ""}
    />
  );
}
