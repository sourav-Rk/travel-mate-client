import type { AddressType } from "@/types/addressType";
import type { KYCRequestPayload } from "@/types/kycType";
import type { PasswordChangeFormType, StatusPayload } from "@/types/authTypes";
import type { IVendor, UserDto } from "@/types/User";
import type { BasicDetails } from "@/types/packageType";
import { travelMateBackend } from "@/api/instance";
import { server } from "../server";
import type { IResponse } from "@/types/Response";
import { VENDOR_API } from "@/constants/api/vendor.api";
import type {
  IBookingsVendorResponse,
  IGetAllGuidesVendorResponse,
  IGetAllPackagesVendorResponse,
  IGetBookingDetailsVendorResponse,
  IGetCancellationRequestsResponse,
  IGetCancelledBookingDetailsResponse,
  IGetClientDetailsVendorResponse,
  IGetGuideDetailsVendorResponse,
  IGetNotificationsVendorResponse,
  IGetPackageDetailsVendorResponse,
  IGetVendorDetailsForStatusResponse,
  IGetVendorProfileResponse,
} from "@/types/api/vendor";
import type {
  IGetWalletResponse,
  IGetWalletTransactionsResponse,
} from "@/types/api/client";
import type { IReviewsResponse } from "@/types/reviewType";

export interface Vendor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  agencyName: string;
  description: string;
  profileImage: string;
  status: "pending" | "verified" | "rejected" | "reviewing";
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  kycDetails: {
    pan: string;
    gstin: string;
    registrationNumber: string;
    documents: string[];
  };
}

// ================== VENDOR PROFILE ==================

// --------- Vendor Profile ----------

//-------------Get vendor details ----------------
export const getVendorProfile = async () =>
  server.get<IGetVendorProfileResponse>(VENDOR_API.GET_PROFILE);

//------------Get vendor details api for status
export const getVendorDetails = async () =>
  server.get<IGetVendorDetailsForStatusResponse>(VENDOR_API.GET_DETAILS);

//-------------Update Vendor Profile---------------
export const updateVendorDetails = async (data: Partial<IVendor>) =>
  server.put<IResponse, Partial<IVendor>>(VENDOR_API.UPDATE_PROFILE, data);

//-------------Add Address-----------------
export const addVendorAddress = async (address: AddressType) =>
  server.post<IResponse, AddressType>(VENDOR_API.ADD_ADDRESS, address);

//-------------Update Address---------------
export const updateVendorAddress = async (address: AddressType) =>
  server.put<IResponse, AddressType>(VENDOR_API.UPDATE_ADDRESS, address);

// ------------Add KYC-----------------
export const addVendorKyc = async (kyc: KYCRequestPayload) =>
  server.post<IResponse, KYCRequestPayload>(VENDOR_API.ADD_KYC, kyc);

// --------- KYC URLs ----------
export const getVendorKycUrls = async (data: string[]) =>
  server
    .post<{ urls: string[] }>(VENDOR_API.GET_KYC_URLS, { data })
    .then((res) => res.urls);

// ---------Update  Password ----------
export const updateVendorPassword = async (data: PasswordChangeFormType) =>
  server.put<IResponse, PasswordChangeFormType>(
    VENDOR_API.UPDATE_PASSWORD,
    data
  );

// ================== EMAIL ==================

//-------------change email otp send-------------
export const vendorSendEmailOtp = async (email: string) =>
  server.post<IResponse, { email: string }>(VENDOR_API.SEND_EMAIL_OTP, {
    email,
  });

//-------------resend otp-------------
export const vendorResendOtp = async (email: string) =>
  server.post<IResponse, { email: string }>(VENDOR_API.RESEND_EMAIL_OTP, {
    email,
  });

// ================== GUIDE MANAGEMENT ==================

// --------------Add Guide -----------------
export const addGuide = async (data: UserDto) =>
  server.post<IResponse, UserDto>(VENDOR_API.ADD_GUIDE, data);

//--------------Get Guide Details-----------
export const getGuideDetails = async (id: string) =>
  server.get<IGetGuideDetailsVendorResponse>(VENDOR_API.GET_GUIDE_DETAILS, {
    params: { id },
  });

//--------------Get all Guides--------------
export const getAllGuides = async (params: {
  page: number;
  limit: number;
  searchTerm: string;
  status: string;
  languages?: string[];
  minExperience?: number;
  maxEperience?: number;
  gender?: string;
}) =>
  server.get<IGetAllGuidesVendorResponse>(VENDOR_API.GET_ALL_GUIDES, {
    params,
  });

//--------------Assign a guide to the package-----------------
export const assignGuide = async (guideId: string, packageId: string) =>
  server.put<IResponse>(VENDOR_API.ASSIGN_GUIDE_TO_PACKAGE(packageId), {
    guideId,
  });

// ================== PACKAGES ==================

// --------------Add a Package---------------
export const addPackage = async (data: any) =>
  server.post<IResponse, any>(VENDOR_API.ADD_PACKAGE, data);

//---------------Get all Packages-------------
export const getAllPackages = (params: {
  page: number;
  limit: number;
  searchTerm: string;
  status: string;
  category: string;
  userType: string;
}) =>
  server.get<IGetAllPackagesVendorResponse>(VENDOR_API.GET_ALL_PACKAGES, {
    params,
  });

//--------------Get PackageDetails--------------
export const getPackageDetails = async (packageId: string, userType: string) =>
  server.get<IGetPackageDetailsVendorResponse>(
    VENDOR_API.GET_PACKAGE_DETAILS(packageId),
    { params: { userType } }
  );

//--------------Update Package Basic Details-------------
export const updatePackageBasicDetails = async (
  packageId: string,
  basicData: BasicDetails
) =>
  server.put<IResponse, BasicDetails>(
    VENDOR_API.UPDATE_PACKAGE_BASIC(packageId),
    basicData
  );

//--------------Update Itinerary------------------
export const updateItinerary = async (
  itineraryId: string,
  itineraryData: any
) =>
  server.put<IResponse, any>(VENDOR_API.UPDATE_ITINERARY(itineraryId), {
    days: itineraryData,
  });

//--------------Update Activity------------------
export const updateActivity = async (activityId: string, activityData: any) =>
  server.put<IResponse, any>(
    VENDOR_API.UPDATE_ACTIVITY(activityId),
    activityData
  );

//--------------Create an Activity-------------
export const createActivity = async (activityData: any) =>
  server.post<IResponse, any>(VENDOR_API.CREATE_ACTIVITY, activityData);

//--------------Delete an activity------------
export const deleteActivity = async (payload: {
  itineraryId: string;
  dayNumber: number;
  activityId: string;
}) => server.delete<IResponse>(VENDOR_API.DELETE_ACTIVITY, { data: payload });

//--------------Update Package status------------------
export const updatePackageStatus = async (packageId: string, status: string) =>
  server.put<IResponse, { packageId: string; status: string }>(
    VENDOR_API.UPDATE_PACKAGE_STATUS,
    { packageId, status }
  );

// ================== BOOKINGS ==================

// --------------- Get Bookings -----------------
export const getBookingsVendor = async (params: {
  packageId: string;
  page: number;
  limit: number;
  searchTerm: string;
  status: string;
}) =>
  server.get<IBookingsVendorResponse>(
    VENDOR_API.GET_BOOKINGS(params.packageId),
    { params }
  );

//-------------Get Booking Details--------------
export const getBookingDetailsVendor = async (bookingId: string) =>
  server.get<IGetBookingDetailsVendorResponse>(
    VENDOR_API.GET_BOOKING_DETAILS(bookingId)
  );

//-------------Send Payment Alert-------------------
export const sendPaymentAlert = async (packageId: string) =>
  server.put<IResponse>(VENDOR_API.SEND_PAYMENT_ALERT(packageId));

//-------------Get cancellation requests---------------
export const getCancellationRequestsVendor = async(params: {
  page: number;
  limit: number;
  searchTerm: string;
  status: string;
}) => server.get<IGetCancellationRequestsResponse>(VENDOR_API.GET_CANCELLATION_REQUESTS,{params});

//-------------Get cancellation booking details---------------
export const getCancelledBookingDetails = async (bookingId : string) => server.get<IGetCancelledBookingDetailsResponse>(VENDOR_API.GET_CANCELLATION_BOOKING_DETAILS(bookingId));

//----------Approve cancellation requests-------------
export const verifyCancellationRequest = async(bookingId : string) => server.post<IResponse,{bookingId : string}>(VENDOR_API.VERIFY_CANCELLATION_REQUEST(bookingId));

// ================== NOTIFICATIONS ==================

// ---------------Get All Notifications-----------------
export const getNotificationsVendor = async () =>
  server.get<IGetNotificationsVendorResponse>(VENDOR_API.GET_NOTIFICATIONS);

//----------------Mark a single notification as read----------------
export const markNotificationReadVendor = async (notificationId: string) =>
  server.patch<IResponse>(VENDOR_API.MARK_NOTIFICATION_READ(notificationId));
``
//----------------Mark all notifications as read------------------
export const markAllNotificationReadVendor = async () =>
  server.patch<IResponse>(VENDOR_API.MARK_ALL_NOTIFICATIONS_READ);

//-----------------Update vendor status----------------
export const updateVendorStatus = async (data: StatusPayload) =>
  server.patch<IResponse>(VENDOR_API.UPDATE_VENDOR_STATUS, data);

//=================Reviews====================
export const getPackageReviewsVendor = async (packageId: string) =>
  server.get<IReviewsResponse>(VENDOR_API.GET_PACKAGE_REVIEWS(packageId));


// ================== Wallet ==================

//------------get wallet transactions----------
export const getWalletTransactionsVendor = async ({
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
    VENDOR_API.GET_WALLET_TRANSACTIONS,
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
export const getWalletVendor = async () =>
  server.get<IGetWalletResponse>(VENDOR_API.GET_WALLET);


//---------------------client deails--------------------- 
export const getClientDetailsVendor = async (clientId : string) => server.get<IGetClientDetailsVendorResponse>(VENDOR_API.GET_CLIENT_DETAILS(clientId));

//--------- upload images -------------

export const uploadImages = async (
  files: File[]
): Promise<{ url: string; public_id: string }[]> => {
  const form = new FormData();
  files.forEach((f) => form.append("image", f));
  try {
    const response = await travelMateBackend.post(
      VENDOR_API.UPLOAD_IMAGES,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data.data as { url: string; public_id: string }[];
  } catch (error: any) {
    console.log(error);
    return error.response?.data.message || error;
  }
};
