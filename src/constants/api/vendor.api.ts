export const VENDOR_API = {
  // ================== PROFILE ==================
  GET_PROFILE: "/vendor/details",
  GET_DETAILS: "/vendor/profile",
  UPDATE_PROFILE: "/vendor/details",
  ADD_ADDRESS: "/vendor/address",
  UPDATE_ADDRESS: "/vendor/address",
  ADD_KYC: "/vendor/kyc",
  GET_KYC_URLS: "/vendor/signed-url",
  UPDATE_PASSWORD: "/vendor/update-password",

  // ================== EMAIL ==================
  SEND_EMAIL_OTP: "/vendor/change-email",
  RESEND_EMAIL_OTP: "/vendor/resent-otp",

  // ================== GUIDE MANAGEMENT ==================
  ADD_GUIDE: "/vendor/guide",
  GET_GUIDE_DETAILS: "/vendor/guide-details",
  GET_ALL_GUIDES: "/vendor/guide",
  ASSIGN_GUIDE_TO_PACKAGE: (packageId: string) =>
    `/vendor/package/${packageId}/assign-guide`,

  // ================== PACKAGES ==================
  ADD_PACKAGE: "/vendor/package",
  GET_ALL_PACKAGES: "/vendor/package",
  GET_PACKAGE_DETAILS: (packageId: string) => `/vendor/package/${packageId}`,
  UPDATE_PACKAGE_BASIC: (packageId: string) => `/vendor/package/${packageId}`,
  UPDATE_ITINERARY: (itineraryId: string) => `/vendor/itinerary/${itineraryId}`,
  UPDATE_ACTIVITY: (activityId: string) => `/vendor/activity/${activityId}`,
  CREATE_ACTIVITY: "/vendor/activity",
  DELETE_ACTIVITY: "/vendor/activity",
  UPDATE_PACKAGE_STATUS: "/vendor/package/status",

  // ================== BOOKINGS ==================
  GET_BOOKINGS: (packageId: string) => `/vendor/bookings/${packageId}`,
  GET_BOOKING_DETAILS: (bookingId: string) =>
    `/vendor/bookings/users/${bookingId}`,
  SEND_PAYMENT_ALERT: (packageId: string) =>
    `/vendor/bookings/${packageId}/payment-alert`,
  GET_CANCELLATION_REQUESTS: "/vendor/cancellation-requests",
  GET_CANCELLATION_BOOKING_DETAILS: (bookingId: string) =>
    `/vendor/bookings/${bookingId}/cancelled`,
  VERIFY_CANCELLATION_REQUEST: (bookingId: string) =>
    `/vendor/bookings/verify-cancellation/${bookingId}`,

  // ================== NOTIFICATIONS ==================
  GET_NOTIFICATIONS: "/vendor/notifications",
  MARK_NOTIFICATION_READ: (notificationId: string) =>
    `/vendor/notifications/${notificationId}`,
  MARK_ALL_NOTIFICATIONS_READ: "/vendor/notifications",

  // ================== MISC / STATUS ==================
  UPDATE_VENDOR_STATUS: "/vendor/status",

  // ================== WALLET ==================
  GET_WALLET_TRANSACTIONS: "/vendor/transactions",
  GET_WALLET: "/vendor/wallet",

  //===============CHAT===================
  GET_MESSAGES: "/vendor/messages",
  GET_CHATROOM: (chatroomId: string) => `/vendor/chatroom/${chatroomId}`,
  GET_CHAT_HISTORY: "/vendor/history",

  //===============CLIENT DETAILS=============
  GET_CLIENT_DETAILS: (clientId: string) => `/vendor/client/${clientId}`,

  // ================== IMAGES ==================
  UPLOAD_IMAGES: "/vendor/images/upload",
};
