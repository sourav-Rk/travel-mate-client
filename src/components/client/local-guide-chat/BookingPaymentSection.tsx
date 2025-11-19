import { useQuery } from "@tanstack/react-query";
import { getBookingByChatRoom } from "@/services/local-guide-booking/localGuideBooking.service";
import { BookingPaymentCard } from "./BookingPaymentCard";
import type { GuideChatRoom } from "@/types/guide-chat";

interface BookingPaymentSectionProps {
  room: GuideChatRoom;
  currentUserId: string;
}

export function BookingPaymentSection({
  room,
  currentUserId,
}: BookingPaymentSectionProps) {
  const currentUserParticipant = room.participants.find(
    (p) => p.userId === currentUserId
  );
  const isTraveller = currentUserParticipant?.role === "client";

  // Fetch booking for this chat room
  const { data: bookingData } = useQuery({
    queryKey: ["local-guide-booking", "chat-room", room._id],
    queryFn: () => getBookingByChatRoom(room._id),
    enabled: isTraveller, // Only fetch for travellers
    refetchOnWindowFocus: false,
  });

  if (!bookingData?.booking || !isTraveller) {
    return null;
  }

  return (
    <BookingPaymentCard
      key={bookingData.booking._id}
      booking={bookingData.booking}
      isTraveller={isTraveller}
    />
  );
}






