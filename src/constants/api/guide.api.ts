export const GUIDE_API = {
   // ================== PROFILE ==================
  GET_PROFILE: "/guide/details",
  UPDATE_PASSWORD: "/guide/update-password",
  RESET_PASSWORD: "/guide/reset-password",
  UPDATE_PROFILE: "/guide/profile",

  // ================== PACKAGES ==================
  GET_ASSIGNED_PACKAGES: "/guide/assigned-packages",
  GET_PACKAGE_DETAILS: (packageId: string) => `/guide/package/${packageId}`,
  UPDATE_PACKAGE_STATUS: "/guide/package/status",

  // ================== BOOKINGS ==================
  GET_BOOKINGS: (packageId: string) => `/guide/bookings/${packageId}`,
  GET_BOOKING_DETAILS: (bookingId: string) =>
    `/guide/bookings/user/${bookingId}`,

  // ================== CLIENT DETAILS ==================
  GET_CLIENT_DETAILS: (clientId: string) => `/guide/client/${clientId}`,

  //===================INSTRUCTIONS=====================
  CREATE_INSTRUCTION : `/guide/instructions`,

  // ================== CHAT ==================
  GET_MESSAGES: "/guide/messages",
  GET_CHAT_HISTORY: "/guide/history",
  GET_CHATROOM: (chatroomId: string) => `/guide/chatroom/${chatroomId}`,

   //===================GROUP CHAT=================
   GET_GROUPS : '/guide/groups',
   GET_GROUP_DETAILS : (groupId : string) => `/guide/group-details/${groupId}`,

   // ================== IMAGES ==================
   UPLOAD_IMAGES: "/guide/images/upload",

   // ================== REVIEWS ==================
   GET_MY_REVIEWS: "/guide/reviews",

   // ================== NOTIFICATIONS ==================
   GET_NOTIFICATIONS: "/guide/notifications",
   MARK_NOTIFICATION_READ: (notificationId: string) => `/guide/notifications/${notificationId}`,
   MARK_ALL_NOTIFICATIONS_READ: "/guide/notifications",
};
