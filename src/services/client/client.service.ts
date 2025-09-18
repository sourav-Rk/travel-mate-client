import { clientAxiosInstance } from "@/api/client.axios";
import type { PasswordChangeFormType } from "@/types/authTypes";
import type { AxiosResponse } from "@/services/auth/authService";
import qs from "qs";

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

//-----get client details api----------
export const getClientDetails = async () => {
  try {
    const response = await clientAxiosInstance.get<ClientResponse>(
      "/_cl/client/details"
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

//------update client details api--------
export const updateClientDetails = async (data: Partial<Client>) => {
  try {
    const response = await clientAxiosInstance.put("/_cl/client/details", data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

//-------update password api------------
export const updateClientPassword = async (data: PasswordChangeFormType) => {
  const response = await clientAxiosInstance.put(
    "/_cl/client/update-password",
    data
  );
  return response.data;
};

//---------get packages list----------
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
}) => {
  try {
    console.log(categories, "-->");
    const response = await clientAxiosInstance.get("_cl/client/packages", {
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
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

//--------get packages details-------
export const getPackageDetails = async (packageId: string) => {
  const response = await clientAxiosInstance.get(
    `/_cl/client/packages/${packageId}`
  );
  return response.data;
};

//------get related package details-----
export const getRelatedPackages = async ({
  packageId,
}: {
  packageId: string;
}) => {
  const response = await clientAxiosInstance.get(
    `/_cl/client/packages/related/`,
    { params: { packageId } }
  );
  return response.data;
};

//---------get trending packages----------
export const getTrendingPackages = async () => {
  const response = await clientAxiosInstance.get(
    "_cl/client/packages/trending"
  );
  return response.data;
};

//apply for a booking api
export const applyPackage = async (packageId: string) => {
  const response = await clientAxiosInstance.post("/_cl/client/booking/apply", {
    packageId,
  });
  return response.data;
};

//get single booking details api
export const getBookingDetails = async (packageId: string) => {
  const response = await clientAxiosInstance.get(
    `/_cl/client/booking/package/${packageId}`
  );
  return response.data;
};

//get booking details
export const getBookingDetailsVendor = async (bookingId: string) => {
  const response = await clientAxiosInstance.get(
    `/_cl/client/booking/${bookingId}`
  );
  return response.data;
};

//get booking list
export const getBookingsBasedOnStatus = async ({
  status,
}: {
  status: string[];
}) => {
  const response = await clientAxiosInstance.get("/_cl/client/bookings", {
    params: { status: status.join(",") },
  });
  return response.data;
};

//get booking details
export const getBookingDetailsClient = async (bookingId: string) => {
  const response = await clientAxiosInstance.get(
    `/_cl/client/booking/${bookingId}`
  );
  return response.data;
};

//get notifications
export const getNotificationsClient = async () => {
  const response = await clientAxiosInstance.get("/_cl/client/notifications");
  return response.data;
};

//set single notification as read
export const markNotificationReadClient = async (notificationId: string) => {
  const response = await clientAxiosInstance.patch(
    `/_cl/client/notifications/${notificationId}`
  );
  return response.data;
};

//set all notifications as read
export const markAllNotificationReadClient = async () => {
  const response = await clientAxiosInstance.patch("/_cl/client/notifications");
  return response.data;
};

//pay advance amount api
export const payAdvanceAmount = async (bookingId: string, amount: number) => {
  const response = await clientAxiosInstance.post(
    "/_cl/client/payment/advance",
    { bookingId, amount }
  );
  return response.data;
};

//pay full amount api
export const payFullAmount = async (bookingId: string, amount: number) => {
  const response = await clientAxiosInstance.post("/_cl/client/payment/full", {
    bookingId,
    amount,
  });
  return response.data;
};

//get wishlist api
export const getWishlist = async () => {
  const response = await clientAxiosInstance.get("/_cl/client/wishlist");
  return response.data;
};

//add to wishlist
export const addToWishlist = async (
  packageId: string
): Promise<AxiosResponse> => {
  const response = await clientAxiosInstance.put("/_cl/client/wishlist", {
    packageId,
  });
  return response.data;
};

//remove from wishlist
export const removeFromWishlist = async (
  packageId: string
): Promise<AxiosResponse> => {
  const response = await clientAxiosInstance.patch(
    "/_cl/client/wishlist/remove",
    { packageId }
  );
  return response.data;
};

//add a review api
export const addReview = async (data: {
  targetType: string;
  rating: number;
  comment: string;
  packageId?: string;
  guideId?: string;
}): Promise<AxiosResponse> => {
  const response = await clientAxiosInstance.post("/_cl/client/review", data);
  return response.data;
};

//get package reviews
export const getPackageReviews = async (packageId: string) => {
  const response = await clientAxiosInstance.get(
    `/_cl/client/reviews/packages/${packageId}`
  );
  return response.data;
};

//-------upload images api------------
export const uploadImages = async (
  files: File[]
): Promise<{ url: string; public_id: string }[]> => {
  const form = new FormData();
  files.forEach((f) => form.append("image", f));
  try {
    const response = await clientAxiosInstance.post(
      "/_cl/client/images/upload",
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data.data as { url: string; public_id: string }[];
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
