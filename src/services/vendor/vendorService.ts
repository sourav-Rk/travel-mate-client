import type { AddressType } from "@/types/addressType";
import type { KYCRequestPayload } from "@/types/kycType";
import type { PasswordChangeFormType, StatusPayload } from "@/types/authTypes";
import type { IVendor, UserDto } from "@/types/User";
import type { BasicDetails } from "@/types/packageType";
import { travelMateBackend } from "@/api/instance";
import { server } from "../server";
import type { IResponse } from "@/types/Response";

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

// //---------change email otp send-------------
// export const vendorSendEmailOtp = async (
//   email: string
// ): Promise<AxiosResponse> => {
//   const response = await travelMateBackend.post("/vendor/change-email", {
//     email,
//   });
//   return response.data;
// };

// //--------resend otp----------
// export const vendorResendOtp = async (
//   email: string
// ): Promise<AxiosResponse> => {
//   const response = await travelMateBackend.post("/vendor/resent-otp", {
//     email,
//   });
//   return response.data;
// };

// //---------vendor details api---------
// export const getVendorProfile = async () => {
//   try {
//     const response = await travelMateBackend.get("/vendor/details");
//     return response.data;
//   } catch (error: any) {
//     return error?.response?.data.message || error;
//   }
// };

// //--------vendor details api call for status--------------
// export const getVendorDetails = async () => {
//   try {
//     const response = await travelMateBackend.get("/vendor/profile");
//     return response.data;
//   } catch (error: any) {
//     return error?.response.data.message || error;
//   }
// };

// //----------update vendor details api-----------
// export const updateVendorDetails = async (data: Partial<IVendor>) => {
//   const response = await travelMateBackend.put("/vendor/details", data);
//   return response.data;
// };

// //--------add adress api------------
// export const addVendorAddress = async (address: AddressType) => {
//   try {
//     const response = await travelMateBackend.post(
//       "/vendor/address",
//       address
//     );
//     return response.data;
//   } catch (error: any) {
//     return error?.response.data.message || error;
//   }
// };

// //-------update address api---------------
// export const updateVendorAddress = async (address: AddressType) => {
//   const response = await travelMateBackend.put(
//     "/vendor/address",
//     address
//   );
//   return response.data;
// };

// //----------add kyc api----------------
// export const addVendorKyc = async (kyc: KYCRequestPayload) => {
//   try {
//     const response = await travelMateBackend.post("/vendor/kyc", kyc);
//     return response.data;
//   } catch (error: any) {
//     return error?.response?.data.messae || error;
//   }
// };

// //--------- add guide ---------------
// export const addGuide = async (data: UserDto) => {
//   const response = await travelMateBackend.post("/vendor/guide", data);
//   return response.data;
// };

// //----------guide details api-----------
// export const getGuideDetails = async (id: string) => {
//   const response = await travelMateBackend.get("/vendor/guide-details", {
//     params: { id },
//   });
//   return response.data;
// };

// //----get all guides api --------
// export const getAllGuides = async ({
//   page = 1,
//   limit = 10,
//   searchTerm,
//   status,
// }: {
//   page: number;
//   limit: number;
//   searchTerm: string;
//   status: string;
// }) => {
//   try {
//     const response = await travelMateBackend.get("/vendor/guide", {
//       params: {
//         page,
//         limit,
//         searchTerm,
//         status,
//       },
//     });
//     return response.data;
//   } catch (error: any) {
//     return error?.response?.data.message || error;
//   }
// };

// //------------udpate password api------------
// export const updateVendorPassword = async (data: PasswordChangeFormType) => {
//   try {
//     const response = await travelMateBackend.put(
//       "/vendor/update-password",
//       data
//     );
//     return response.data;
//   } catch (error: any) {
//     throw error;
//   }
// };

// //------add package api------------
// export const addPackage = async (data: any) => {
//   try {
//     const response = await travelMateBackend.post(
//       "/vendor/package",
//       data
//     );
//     return response.data;
//   } catch (error: any) {
//     throw error;
//   }
// };

// //-------get packages api----------
// export const getAllPackages = async ({
//   page = 1,
//   limit = 5,
//   searchTerm,
//   status,
//   category,
//   userType,
// }: {
//   page: number;
//   limit: number;
//   searchTerm: string;
//   status: string;
//   category: string;
//   userType: string;
// }) => {
//   const response = await travelMateBackend.get("/vendor/package", {
//     params: {
//       page,
//       limit,
//       searchTerm,
//       status,
//       category,
//       userType,
//     },
//   });
//   return response.data;
// };

// //---------get package details api---------
// export const getPackageDetails = async (
//   packageId: string,
//   userType: string
// ) => {
//   try {
//     const response = await travelMateBackend.get(
//       `/vendor/package/${packageId}`,
//       { params: { userType } }
//     );
//     return response.data;
//   } catch (error: any) {
//     throw error;
//   }
// };

// //-------update package basicdetails----------
// export const updatePackageBasicDetails = async (
//   packageId: string,
//   basicData: BasicDetails
// ) => {
//   try {
//     const response = await travelMateBackend.put(
//       `/vendor/package/${packageId}`,
//       basicData
//     );
//     return response.data;
//   } catch (error: any) {
//     throw error;
//   }
// };

// //--------update itinerary-------
// export const updateItinerary = async (
//   itineraryId: string,
//   itineraryData: any
// ) => {
//   try {
//     const response = await travelMateBackend.put(
//       `/vendor/itinerary/${itineraryId}`,
//       { days: itineraryData }
//     );
//     return response.data;
//   } catch (error: any) {
//     throw error;
//   }
// };

// //update the activity
// export const updateActivity = async (activityId: string, activityData: any) => {
//   const response = await travelMateBackend.put(
//     `/vendor/activity/${activityId}`,
//     activityData
//   );
//   return response.data;
// };

// //-------add an activity----------
// export const createActivity = async (activityData: any) => {
//   const response = await travelMateBackend.post(
//     "/vendor/activity",
//     activityData
//   );
//   return response.data;
// };

// //-----------delete an activity---------
// export const deleteActivity = async ({
//   itineraryId,
//   dayNumber,
//   activityId,
// }: {
//   itineraryId: string;
//   dayNumber: number;
//   activityId: string;
// }): Promise<AxiosResponse> => {
//   const response = await travelMateBackend.delete("/vendor/activity", {
//     data: { itineraryId, dayNumber, activityId },
//   });
//   return response.data;
// };

// //---------update package status-------
// export const updatePackageStatus = async (
//   packageId: string,
//   status: string
// ) => {
//   const response = await travelMateBackend.put("/vendor/package/status", {
//     packageId,
//     status,
//   });
//   return response.data;
// };

// //----------bookings-----------

// //get bookings for a package
// export const getBookingsVendor = async ({
//   packageId,
//   page = 1,
//   limit = 5,
//   searchTerm,
//   status,
// }: {
//   packageId: string;
//   page: number;
//   limit: number;
//   searchTerm: string;
//   status: string;
// }) => {
//   const response = await travelMateBackend.get(
//     `/vendor/bookings/${packageId}`,
//     {
//       params: {
//         page,
//         limit,
//         searchTerm,
//         status,
//       },
//     }
//   );
//   return response.data;
// };

// //get booking details
// export const getBookingDetailsVendor = async(bookingId : string) => {
//    const response = await travelMateBackend.get(`/vendor/bookings/users/${bookingId}`);
//    return response.data;
// }

// //send-payment alert
// export const sendPaymentAlert = async(packageId : string) => {
//   const response = await travelMateBackend.put(`/vendor/bookings/${packageId}/payment-alert`);
//   return response.data;
// }

// //get notifications
// export const getNotificationsVendor = async() => {
//   const response = await travelMateBackend.get("/vendor/notifications");
//   return response.data;
// }

// //set single notification as read
// export const markNotificationReadVendor = async(notificationId : string) => {
//    const response = await travelMateBackend.patch(`/vendor/notifications/${notificationId}`);
//    return response.data;
// }

// //set all notifications as read
// export const markAllNotificationReadVendor = async() => {
//   const response = await travelMateBackend.patch("/vendor/notifications");
//   return response.data;
// }


// //-------update vendor status api------------
// export const updateVendorStatus = async (
//   data: StatusPayload
// ): Promise<AxiosResponse> => {
//   try {
//     const response = await travelMateBackend.patch(
//       "/vendor/status",
//       data
//     );
//     return response.data;
//   } catch (error: any) {
//     return error?.response?.data.message || error;
//   }
// };

// //view the vendor docuements
// export const getVendorKycUrls = async (data: string[]): Promise<string[]> => {
//   try {
//     const response = await travelMateBackend.post("/vendor/signed-url", {
//       data,
//     });
//     return response.data.urls;
//   } catch (error: any) {
//     return error?.response?.data.message || error;
//   }
// };

// //--------- upload images -------------

// export const uploadImages = async (
//   files: File[]
// ): Promise<{ url: string; public_id: string }[]> => {
//   const form = new FormData();
//   files.forEach((f) => form.append("image", f));
//   try {
//     const response = await travelMateBackend.post(
//       "/vendor/images/upload",
//       form,
//       { headers: { "Content-Type": "multipart/form-data" } }
//     );
//     return response.data.data as { url: string; public_id: string }[];
//   } catch (error: any) {
//     console.log(error);
//     return error.response?.data.message || error;
//   }
// };

// ================== VENDOR PROFILE ==================

// --------- Vendor Profile ----------

//-------------Get vendor details ----------------
export const getVendorProfile = async() => server.get("/vendor/details");


//------------Get vendor details api for status
export const getVendorDetails = async () => server.get("/vendor/profile");


//-------------Update Vendor Profile---------------
export const updateVendorDetails = async(data: Partial<IVendor>) =>server.put("/vendor/details", data);


//-------------Add Address-----------------
export const addVendorAddress = async(address: AddressType) => server.post("/vendor/address", address);


//-------------Update Address---------------
export const updateVendorAddress = async(address: AddressType) =>server.put("/vendor/address", address);


// ------------Add KYC-----------------
export const addVendorKyc = async(kyc: KYCRequestPayload) => server.post("/vendor/kyc", kyc);


// --------- KYC URLs ----------
export const getVendorKycUrls = async(data: string[]) =>server.post<{ urls: string[] }>("/vendor/signed-url", { data }).then((res) => res.urls);


// ---------Update  Password ----------
export const updateVendorPassword = async (data: PasswordChangeFormType) =>server.put("/vendor/update-password", data);



// ================== EMAIL ==================


//-------------change email otp send-------------
export const vendorSendEmailOtp = async (email: string) => server.post("/vendor/change-email", { email });


//-------------resend otp-------------
export const vendorResendOtp = async (email: string) =>server.post("/vendor/resent-otp", { email });


// ================== GUIDE MANAGEMENT ==================


// --------------Add Guide -----------------
export const addGuide = async(data: UserDto) =>server.post("/vendor/guide", data);


//--------------Get Guide Details-----------
export const getGuideDetails = async(id: string) =>server.get(`/vendor/guide-details`, { params: { id } });


//--------------Get all Guides--------------
export const getAllGuides = async(params: {
  page: number;
  limit: number;
  searchTerm: string;
  status: string;
  languages?: string[],
  minExperience ?: number,
  maxEperience ?: number,
  gender ?: string
}) => server.get("/vendor/guide", { params });


//--------------Assign a guide to the package-----------------
export const assignGuide = async (guideId : string,packageId : string) => server.put<IResponse>(`/vendor/package/${packageId}/assign-guide`,{guideId});


// ================== PACKAGES ==================


// --------------Add a Package---------------
export const addPackage = async (data: any) => server.post("/vendor/package", data);


//---------------Get all Packages-------------
export const getAllPackages = (params: {
  page: number;
  limit: number;
  searchTerm: string;
  status: string;
  category: string;
  userType: string;
}) => server.get("/vendor/package", { params });


//--------------Get PackageDetails--------------
export const getPackageDetails = async (packageId: string, userType: string) => server.get(`/vendor/package/${packageId}`, { params: { userType } });


//--------------Update Package Basic Details-------------
export const updatePackageBasicDetails = async (packageId: string,basicData: BasicDetails) => server.put(`/vendor/package/${packageId}`, basicData);


//--------------Update Itinerary------------------
export const updateItinerary = async (itineraryId: string, itineraryData: any) => server.put(`/vendor/itinerary/${itineraryId}`, { days: itineraryData });


//--------------Update Activity------------------
export const updateActivity = async (activityId: string, activityData: any) => server.put(`/vendor/activity/${activityId}`, activityData);


//--------------Create an Activity-------------
export const createActivity = async (activityData: any) => server.post("/vendor/activity", activityData);


//--------------Delete an activity------------
export const deleteActivity =async (payload: {itineraryId: string;dayNumber: number;activityId: string;}) => server.delete("/vendor/activity", { data: payload });


//--------------Update Package status------------------
export const updatePackageStatus = async (packageId: string, status: string) => server.put("/vendor/package/status", { packageId, status });



// ================== BOOKINGS ==================


// --------------- Get Bookings -----------------
export const getBookingsVendor = async(params: {
  packageId: string;
  page: number;
  limit: number;
  searchTerm: string;
  status: string;
}) => server.get(`/vendor/bookings/${params.packageId}`, { params });


//-------------Get Booking Details--------------
export const getBookingDetailsVendor = async(bookingId: string) =>server.get(`/vendor/bookings/users/${bookingId}`);


//-------------Send Payment Alert-------------------
export const sendPaymentAlert = async(packageId: string) =>server.put(`/vendor/bookings/${packageId}/payment-alert`);



// ================== NOTIFICATIONS ==================


// ---------------Get All Notifications-----------------
export const getNotificationsVendor = async() =>server.get("/vendor/notifications");


//----------------Mark a single notification as read----------------
export const markNotificationReadVendor = async(notificationId: string) =>server.patch(`/vendor/notifications/${notificationId}`);


//----------------Mark all notifications as read------------------
export const markAllNotificationReadVendor =async () =>server.patch("/vendor/notifications");



//-----------------Update vendor status----------------
export const updateVendorStatus = async (data: StatusPayload) => server.patch("/vendor/status", data);


//--------- upload images -------------

export const uploadImages = async (
  files: File[]
): Promise<{ url: string; public_id: string }[]> => {
  const form = new FormData();
  files.forEach((f) => form.append("image", f));
  try {
    const response = await travelMateBackend.post(
      "/vendor/images/upload",
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data.data as { url: string; public_id: string }[];
  } catch (error: any) {
    console.log(error);
    return error.response?.data.message || error;
  }
};

