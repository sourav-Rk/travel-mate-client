import { server } from "../server";
import { LOCAL_GUIDE_BOOKING_API } from "@/constants/api/local-guide-booking.api";
import type {
  CreateQuoteRequest,
  Quote,
  LocalGuideBooking,
  LocalGuideBookingsQuery,
  LocalGuideBookingListResponse,
} from "@/types/local-guide-booking";

export const createQuote = async (
  payload: CreateQuoteRequest
): Promise<{ success: boolean;message:string; quote: Quote }> => {
  return server.post<{ success: boolean;message:string; quote: Quote }, CreateQuoteRequest>(
    LOCAL_GUIDE_BOOKING_API.CREATE_QUOTE,
    payload
  );
};

export const acceptQuote = async (
  quoteId: string
): Promise<{ success: boolean; message: string }> => {
  return server.post<{ success: boolean;message: string }, { quoteId: string }>(
    LOCAL_GUIDE_BOOKING_API.ACCEPT_QUOTE,
    { quoteId }
  );
};

export const declineQuote = async (
  quoteId: string,
  reason?: string
): Promise<{ success: boolean; message: string }> => {
  return server.post<{ success: boolean; message: string }, { quoteId: string; reason?: string }>(
    LOCAL_GUIDE_BOOKING_API.DECLINE_QUOTE,
    { quoteId, reason }
  );
};

export const payAdvanceAmount = async (
  bookingId: string,
  amount: number
): Promise<{ success: boolean; url: string; sessionId: string; message: string }> => {
  return server.post<{ success: boolean; url: string; sessionId: string; message: string }, { amount: number }>(
    LOCAL_GUIDE_BOOKING_API.PAY_ADVANCE(bookingId),
    { amount }
  );
};

export const payFullAmount = async (
  bookingId: string,
  amount: number
): Promise<{ success: boolean; url: string; sessionId: string; message: string }> => {
  return server.post<{ success: boolean; url: string; sessionId: string; message: string }, { amount: number }>(
    LOCAL_GUIDE_BOOKING_API.PAY_FULL(bookingId),
    { amount }
  );
};

export const getBookingByChatRoom = async (
  guideChatRoomId: string
): Promise<{ success: boolean; booking: LocalGuideBooking | null }> => {
  return server.get<{ success: boolean; booking: LocalGuideBooking | null }>(
    LOCAL_GUIDE_BOOKING_API.GET_BOOKING_BY_CHAT_ROOM(guideChatRoomId)
  );
};

export const getLocalGuideBookings = async (
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
  }>(`${LOCAL_GUIDE_BOOKING_API.GET_BOOKINGS}${queryString ? `?${queryString}` : ""}`);

  return response.data;
};

export const getLocalGuideBookingDetails = async (
  bookingId: string
): Promise<{ success: boolean; booking: LocalGuideBooking }> => {
  return server.get<{ success: boolean; booking: LocalGuideBooking }>(
    LOCAL_GUIDE_BOOKING_API.GET_BOOKING(bookingId)
  );
};

export const markServiceComplete = async (
  bookingId: string,
  notes?: string,
  rating?: number
): Promise<{ success: boolean; booking: LocalGuideBooking; message: string }> => {
  return server.post<{ success: boolean; booking: LocalGuideBooking; message: string }, { notes?: string; rating?: number }>(
    LOCAL_GUIDE_BOOKING_API.MARK_SERVICE_COMPLETE(bookingId),
    { notes, rating }
  );
};

