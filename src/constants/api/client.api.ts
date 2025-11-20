export const CLIENT_API = {
  // ================== CLIENT PROFILE ==================
  GET_DETAILS: "/client/details",
  UPDATE_DETAILS: "/client/details",
  UPDATE_PASSWORD: "/client/update-password",


  // ================== PACKAGES ==================
  GET_AVAILABLE_PACKAGES: "/client/packages",
  GET_PACKAGE_DETAILS: (packageId: string) => `/client/packages/${packageId}`,
  GET_RELATED_PACKAGES: "/client/packages/related",
  GET_TRENDING_PACKAGES: "/client/packages/trending",


  // ================== BOOKINGS ==================
  APPLY_PACKAGE: "/client/booking/apply",
  GET_BOOKING_BY_PACKAGE: (packageId: string) =>
    `/client/booking/package/${packageId}`,
  GET_BOOKING_BY_ID: (bookingId: string) => `/client/booking/${bookingId}`,
  GET_BOOKINGS_BY_STATUS: "/client/bookings",
  CANCELL_BOOKING : (bookingId : string) => `/client/booking/cancel/${bookingId}`,

  // ================== NOTIFICATIONS ==================
  GET_NOTIFICATIONS: "/client/notifications",
  MARK_NOTIFICATION_READ: (notificationId: string) =>
    `/client/notifications/${notificationId}`,
  MARK_ALL_NOTIFICATIONS_READ: "/client/notifications",


  // ================== PAYMENTS ==================
  PAY_ADVANCE: "/client/payment/advance",
  PAY_FULL: "/client/payment/full",


  // ================== WISHLIST ==================
  GET_WISHLIST: "/client/wishlist",
  ADD_TO_WISHLIST: "/client/wishlist",
  REMOVE_FROM_WISHLIST: "/client/wishlist/remove",



  // ================== REVIEWS ==================
  ADD_REVIEW: "/client/review",
  GET_PACKAGE_REVIEWS: (packageId: string) =>
    `/client/reviews/packages/${packageId}`,
  GET_GUIDE_REVIEWS: (guideId: string, packageId: string) =>
    `/client/reviews/guides/${guideId}/${packageId}`,


  // ================== GUIDE ==================
  GET_GUIDE_DETAILS: (guideId: string) => `/client/guide/${guideId}`,

  
  // ================== CHAT ==================
  GET_MESSAGES_CLIENT : `/client/messages`,
  GET_CHAT_HISTORY : `/client/history`,
  GET_CHATROOM : (chatroomId : string) => `/client/chatroom/${chatroomId}`,

   // ================== WALLET ==================
   GET_WALLET_TRANSACTIONS : '/client/transactions',
   GET_WALLET : '/client/wallet',

   //===================GUIDE INSTRUCTIONS=============
   GET_INSTRUCTIONS : '/client/instructions',
   MARK_READ_INSTRUCTION : (instructionId : string) => `/client/instructions/${instructionId}`,
   MARK_ALL_INSTRUCTIONS_READ : `/client/instructions`,

   //===================VENDOR DETAILS=============
   GET_VENDOR_DETAILS : (vendorId : string) => `/client/vendor/${vendorId}`,

   //===================GROUP CHAT=================
   GET_GROUPS : '/client/groups',
   GET_GROUP_DETAILS : (groupId : string) => `/client/group-details/${groupId}`,

  // ================== IMAGES ==================
  UPLOAD_IMAGES: "/client/images/upload",

  // ================== BADGES ==================
  GET_ALL_BADGES: "/client/local-guide/badges",
  GET_GUIDE_BADGES: "/client/local-guide/my-badges",
  EVALUATE_BADGES: "/client/local-guide/evaluate-badges",
  GET_PUBLIC_LOCAL_GUIDE_PROFILE: (profileId: string) =>
    `/client/local-guide/public-profile/${profileId}`,
  LOCAL_GUIDE_SEARCH_BY_LOCATION: "/client/local-guide/search-by-location",
  VOLUNTEER_POSTS_SEARCH_BY_LOCATION: "/client/volunteer-post/search-by-location",
  
};
