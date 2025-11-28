export const LOCAL_GUIDE_BOOKING_API = {
  // ================== CLIENT ROUTES ==================
  // Quote Management
  CREATE_QUOTE: "/client/guide-chat/quote",
  ACCEPT_QUOTE: "/client/guide-chat/quote/accept",
  DECLINE_QUOTE: "/client/guide-chat/quote/decline",

  // Booking Management
  GET_BOOKINGS: "/client/local-guide/bookings",
  GET_BOOKING: (bookingId: string) => `/client/local-guide/bookings/${bookingId}`,
  GET_BOOKING_BY_CHAT_ROOM: (guideChatRoomId: string) =>
    `/client/local-guide/bookings/chat-room/${guideChatRoomId}`,

  // Payment Routes
  PAY_ADVANCE: (bookingId: string) =>
    `/client/local-guide/bookings/${bookingId}/pay-advance`,
  PAY_FULL: (bookingId: string) =>
    `/client/local-guide/bookings/${bookingId}/pay-full`,

  // Service Completion
  MARK_SERVICE_COMPLETE: (bookingId: string) =>
    `/client/local-guide/bookings/${bookingId}/complete`,

  // Guide Routes
  GET_GUIDE_BOOKINGS: "/client/local-guide/my-service-bookings",
};












