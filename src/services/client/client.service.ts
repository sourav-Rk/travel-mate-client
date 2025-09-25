import { travelMateBackend } from "@/api/instance";
import type { PasswordChangeFormType } from "@/types/authTypes";
import type { AxiosResponse } from "@/services/auth/authService";
import qs from "qs";
import { server } from "../server";
import type { IResponse } from "@/types/Response";
import type {  IGetGuideDetailsClient } from "@/types/api/client";


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
export const getClientDetails = async() => server.get<ClientResponse>("/client/details");


//------------Update client profile details------------
export const updateClientDetails = async(data: Partial<Client>) => server.put("/client/details",data);


//------------Update client password-------------
export const updateClientPassword = async(data: PasswordChangeFormType) =>server.put<IResponse, PasswordChangeFormType>("/client/update-password",data);


// ================== PACKAGES ==================

//------------- Get available packages list with filters & pagination-------------
export const getAvailablePackages = async({
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
  server.get("/client/packages", {
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
  });


//-------------Get details of a single package-------------
export const getPackageDetails = async (packageId: string) =>server.get(`/client/packages/${packageId}`);


//-------------Get related packages for a given package-------------
export const getRelatedPackages = async (packageId: string) =>server.get(`/client/packages/related/`, { params: { packageId } });


//-------------Get trending packages-------------
export const getTrendingPackages = async () =>server.get("/client/packages/trending");



//================== BOOKINGS ==================

//-------------Apply for a package booking-------------
export const applyPackage = async (packageId: string) =>server.post("/client/booking/apply", { packageId });


//-------------Get booking details by packageId (for client view)-------------
export const getBookingDetails = async (packageId: string) =>server.get(`/client/booking/package/${packageId}`);


//-------------Get booking details by bookingId (for vendor view)-------------
export const getBookingDetailsVendor = async (bookingId: string) =>server.get(`/client/booking/${bookingId}`);

//-------------Get all bookings filtered by status-------------
export const getBookingsBasedOnStatus = async (status: string[]) =>server.get("/client/bookings", { params: { status: status.join(",") } });


//-------------Get booking details by bookingId (for client view)-------------
export const getBookingDetailsClient = async (bookingId: string) =>server.get(`/client/booking/${bookingId}`);



// ================== NOTIFICATIONS ==================


//-------------Get all notifications for the client-------------
export const getNotificationsClient = async () =>server.get("/client/notifications");


//-------------Mark a single notification as read----------------
export const markNotificationReadClient = async (notificationId: string) =>server.patch(`/client/notifications/${notificationId}`, {});

//-------------Mark all notifications as read-------------------
export const markAllNotificationReadClient = async () => server.patch("/client/notifications", {});


// ================== PAYMENTS ==================

//--------------Pay advance amount for a booking------------------
export const payAdvanceAmount = async (bookingId: string, amount: number) =>server.post("/client/payment/advance", { bookingId, amount });

//----------------Pay full amount for a booking------------------
export const payFullAmount = async (bookingId: string, amount: number) =>server.post("/client/payment/full", { bookingId, amount });


// ================== WISHLIST ==================

//-----------------Get client wishlist-----------------
export const getWishlist = async() => server.get("/client/wishlist");


//----------------Add a package to wishlist-----------------
export const addToWishlist = async (packageId: string): Promise<AxiosResponse> =>server.put("/client/wishlist", { packageId });


//-----------------Remove a package from wishlist-----------------
export const removeFromWishlist = async (packageId: string): Promise<AxiosResponse> =>server.patch("/client/wishlist/remove", { packageId });


// ================== REVIEWS ==================


//-----------------Add a review (for package/guide)---------------
export const addReview = async(data: {
  targetType: string;
  rating: number;
  comment: string;
  packageId?: string;
  guideId?: string;
}): Promise<AxiosResponse> => server.post("/client/review", data);


//-------------Get reviews for a package-----------------
export const getPackageReviews = async(packageId: string) =>server.get(`/client/reviews/packages/${packageId}`);


//-------------Get reviews for a guide------------------
export const getGuideReviews = async(packageId : string,guideId : string) => server.get(`/client/reviews/guides/${guideId}/${packageId}`);

//-----------------Guide Routes--------------------
export const getGuideDetailsClient = async(guideId : string) => server.get<IGetGuideDetailsClient>(`/client/guide/${guideId}`);

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
      "/client/images/upload",
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data.data as { url: string; public_id: string }[];
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
