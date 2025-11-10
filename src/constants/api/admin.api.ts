export const ADMIN_API = {
  // ================== USERS ==================
  GET_ALL_USERS: "/admin/users",
  GET_USER_DETAILS: "/admin/user-details",
  UPDATE_VENDOR_STATUS: "/admin/vendor-status",
  UPDATE_USER_STATUS: "/admin/user-status",

  // ================== KYC ==================
  GET_VENDOR_KYC_URLS: "/admin/signed-url",

  // ================== PACKAGES ==================
  GET_ALL_PACKAGES: "/admin/package",
  GET_PACKAGE_DETAILS: (packageId: string) => `/admin/package/${packageId}`,
  UPDATE_PACKAGE_BLOCK_STATUS: "/admin/package/block",

  // ================== WALLET ==================
  GET_WALLET_TRANSACTIONS: "/admin/transactions",
  GET_WALLET: "/admin/wallet",

  // ================== DASHBOARD ==================
  GET_DASHBOARD_STATS: "/admin/dashboard/stats",

  // ================== SALES REPORT ==================
  GET_SALES_REPORT: "/admin/sales-report",
};
