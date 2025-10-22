import { travelMateBackend } from "@/api/instance";

import type { PasswordChangeFormType } from "@/types/authTypes";
import type { AxiosResponse } from "@/services/auth/authService";
import qs from "qs";
import { server } from "../server";
import type { IResponse } from "@/types/Response";
import type {
  IGetAllNotificationsClientResponse,
  IGetAvailabalePackagesResponse,
  IGetBookingsClientResponse,
  IGetClientBookingDetailsOfPackageResponse,
  IGetClientBookingDetailsResponse,
  IGetGuideDetailsClient,
  IGetInstructionsClientResponse,
  IGetPackageDetailsClient,
  IGetTrendingPackagesResponse,
  IGetVendorDetailsForClientResponse,
  IGetWalletResponse,
  IGetWalletTransactionsResponse,
  IPaymentResponse,
  IReviewsResponse,
} from "@/types/api/client";
import { CLIENT_API } from "@/constants/api/client.api";
import type { IGetWishListDto } from "@/types/wishlistType";

export type Client = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  profileImage?: string;
  bio?: string;
  googleId?: string;
  isBlocked?: string;
  gender?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ClientResponse = {
  success: boolean;
  client: Client;
};

// ================== CLIENT PROFILE ==================

//------------Get client details------------
export const getClientDetails = async () =>
  server.get<ClientResponse>(CLIENT_API.GET_DETAILS);

//------------Update client profile details------------
export const updateClientDetails = async (data: Partial<Client>) =>
  server.put<IResponse, Partial<Client>>(CLIENT_API.UPDATE_DETAILS, data);

//------------Update client password-------------
export const updateClientPassword = async (data: PasswordChangeFormType) =>
  server.put<IResponse, PasswordChangeFormType>(
    CLIENT_API.UPDATE_PASSWORD,
    data
  );

// ================== PACKAGES ==================

//------------- Get available packages list with filters & pagination-------------
export const getAvailablePackages = async ({
  page = 1,
  limit = 10,
  search,
  categories,
  priceRange,
  duration,
  sortBy,
}: {
  page: number;
  limit: number;
  search: string;
  categories: string[];
  priceRange: [number, number];
  duration: string;
  sortBy: string;
}) =>
  server.get<IGetAvailabalePackagesResponse>(
    CLIENT_API.GET_AVAILABLE_PACKAGES,
    {
      params: {
        page,
        limit,
        search,
        categories,
        priceRange,
        duration,
        sortBy,
      },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    }
  );

//-------------Get details of a single package-------------
export const getPackageDetails = async (packageId: string) =>
  server.get<IGetPackageDetailsClient>(
    CLIENT_API.GET_PACKAGE_DETAILS(packageId)
  );

//-------------Get related packages for a given package-------------
export const getRelatedPackages = async (packageId: string) =>
  server.get<IGetTrendingPackagesResponse>(CLIENT_API.GET_RELATED_PACKAGES, {
    params: { packageId },
  });

//-------------Get trending packages-------------
export const getTrendingPackages = async () =>
  server.get<IGetTrendingPackagesResponse>(CLIENT_API.GET_TRENDING_PACKAGES);

//================== BOOKINGS ==================

//-------------Apply for a package booking-------------
export const applyPackage = async (packageId: string) =>
  server.post<IResponse, { packageId: string }>(CLIENT_API.APPLY_PACKAGE, {
    packageId,
  });

//-------------Get booking details by packageId (for client view)-------------
export const getBookingDetails = async (packageId: string) =>
  server.get<IGetClientBookingDetailsOfPackageResponse>(
    CLIENT_API.GET_BOOKING_BY_PACKAGE(packageId)
  );

//-------------Get booking details by bookingId (for vendor view)-------------
export const getBookingDetailsVendor = async (bookingId: string) =>
  server.get<IGetClientBookingDetailsResponse>(
    CLIENT_API.GET_BOOKING_BY_ID(bookingId)
  );

//-------------Get all bookings filtered by status-------------
export const getBookingsBasedOnStatus = async (status: string[]) =>
  server.get<IGetBookingsClientResponse>(CLIENT_API.GET_BOOKINGS_BY_STATUS, {
    params: { status: status.join(",") },
  });

//-------------Get booking details by bookingId (for client view)-------------
export const getBookingDetailsClient = async (bookingId: string) =>
  server.get<IGetClientBookingDetailsResponse>(
    CLIENT_API.GET_BOOKING_BY_ID(bookingId)
  );

//-------------Cancell a booking-----------------
export const cancelBooking = async (
  bookingId: string,
  cancellationReason: string
) =>
  server.post<IResponse, { cancellationReason: string }>(
    CLIENT_API.CANCELL_BOOKING(bookingId),
    {
      cancellationReason,
    }
  );

// ================== NOTIFICATIONS ==================

//-------------Get all notifications for the client-------------
export const getNotificationsClient = async () =>
  server.get<IGetAllNotificationsClientResponse>(CLIENT_API.GET_NOTIFICATIONS);

//-------------Mark a single notification as read----------------
export const markNotificationReadClient = async (notificationId: string) =>
  server.patch<IResponse>(
    CLIENT_API.MARK_NOTIFICATION_READ(notificationId),
    {}
  );

//-------------Mark all notifications as read-------------------
export const markAllNotificationReadClient = async () =>
  server.patch<IResponse>(CLIENT_API.MARK_ALL_NOTIFICATIONS_READ, {});

// ================== PAYMENTS ==================

//--------------Pay advance amount for a booking------------------
export const payAdvanceAmount = async (bookingId: string, amount: number) =>
  server.post<IPaymentResponse, { bookingId: string; amount: number }>(
    CLIENT_API.PAY_ADVANCE,
    { bookingId, amount }
  );

//----------------Pay full amount for a booking------------------
export const payFullAmount = async (bookingId: string, amount: number) =>
  server.post<IPaymentResponse, { bookingId: string; amount: number }>(
    CLIENT_API.PAY_FULL,
    { bookingId, amount }
  );

// ================== WISHLIST ==================

//-----------------Get client wishlist-----------------
export const getWishlist = async () =>
  server.get<IGetWishListDto>(CLIENT_API.GET_WISHLIST);

//----------------Add a package to wishlist-----------------
export const addToWishlist = async (
  packageId: string
): Promise<AxiosResponse> =>
  server.put<IResponse, { packageId: string }>(CLIENT_API.ADD_TO_WISHLIST, {
    packageId,
  });

//-----------------Remove a package from wishlist-----------------
export const removeFromWishlist = async (
  packageId: string
): Promise<AxiosResponse> =>
  server.patch<IResponse, { packageId: string }>(
    CLIENT_API.REMOVE_FROM_WISHLIST,
    { packageId }
  );

// ================== REVIEWS ==================

//-----------------Add a review (for package/guide)---------------
export const addReview = async (data: {
  targetType: string;
  rating: number;
  comment: string;
  packageId?: string;
  guideId?: string;
}): Promise<AxiosResponse> =>
  server.post<IResponse>(CLIENT_API.ADD_REVIEW, data);

//-------------Get reviews for a package-----------------
export const getPackageReviews = async (packageId: string) =>
  server.get<IReviewsResponse>(CLIENT_API.GET_PACKAGE_REVIEWS(packageId));

//-------------Get reviews for a guide------------------
export const getGuideReviews = async (packageId: string, guideId: string) =>
  server.get<IReviewsResponse>(
    CLIENT_API.GET_GUIDE_REVIEWS(guideId, packageId)
  );

//-----------------Guide Routes--------------------
export const getGuideDetailsClient = async (guideId: string) =>
  server.get<IGetGuideDetailsClient>(CLIENT_API.GET_GUIDE_DETAILS(guideId));

// ================== Wallet ==================

//------------ get wallet transactions-------------------
export const getWalletTransactionsClient = async ({
  walletId,
  page = 1,
  limit = 10,
  type,
  searchTerm,
  sortBy,
}: {
  walletId: string;
  page: number;
  limit: number;
  type: string;
  sortBy: string;
  searchTerm: string;
}) =>
  server.get<IGetWalletTransactionsResponse>(
    CLIENT_API.GET_WALLET_TRANSACTIONS,
    {
      params: {
        walletId,
        page,
        limit,
        type,
        searchTerm,
        sortBy,
      },
    }
  );

//-------------get wallet-------------------
export const getWalletClient = async () =>
  server.get<IGetWalletResponse>(CLIENT_API.GET_WALLET);



//===============Guide instructions====================

//-------------get all instructions----------------
export const getInstructionsClient = async () => 
  server.get<IGetInstructionsClientResponse>(CLIENT_API.GET_INSTRUCTIONS)

//------------mark a single instruction read-------------
export const markSingleInstructionRead = async (instructionId : string) => server.put<IResponse>(CLIENT_API.MARK_READ_INSTRUCTION(instructionId))

//-----------mark all instructions read---------------
export const markAllInstructionsRead = async () => server.put<IResponse>(CLIENT_API.MARK_ALL_INSTRUCTIONS_READ);

//==================Vendor details======================
export const getVendorDetailsClient = async (vendorId : string) => server.get<IGetVendorDetailsForClientResponse>(CLIENT_API.GET_VENDOR_DETAILS(vendorId));


// ================== IMAGES ==================
/**
 * Upload images to server
 */
export const uploadImages = async (
  files: File[]
): Promise<{ url: string; public_id: string }[]> => {
  const form = new FormData();
  files.forEach((f) => form.append("image", f));
  try {
    const response = await travelMateBackend.post(
      CLIENT_API.UPLOAD_IMAGES,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data.data as { url: string; public_id: string }[];
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
