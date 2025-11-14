export const LOCAL_GUIDE_API = {
  // ================== CLIENT ROUTES ==================
  REQUEST_VERIFICATION: "/client/local-guide/request-verification",
  GET_PROFILE: "/client/local-guide/profile",
  UPDATE_AVAILABILITY: "/client/local-guide/availability",
  UPDATE_PROFILE: "/client/local-guide/profile",

  // ================== ADMIN ROUTES ==================
  GET_PENDING_VERIFICATIONS: "/admin/local-guides/pending",
  VERIFY_GUIDE: (profileId: string) => `/admin/local-guides/verify/${profileId}`,
  REJECT_GUIDE: (profileId: string) => `/admin/local-guides/reject/${profileId}`,
};

