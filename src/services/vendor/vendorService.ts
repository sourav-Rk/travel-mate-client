import { vendorAxiosInstance } from "@/api/vendor.axios";
import type { AddressType } from "@/types/addressType";
import type { KYCRequestPayload } from "@/types/kycType";
import type { PasswordChangeFormType, StatusPayload } from "@/types/authTypes";
import type { AxiosResponse } from "../auth/authService";
import type { IVendor, UserDto } from "@/types/User";
import type { BasicDetails } from "@/types/packageType";


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

//---------change email otp send-------------
export const vendorSendEmailOtp = async (
  email: string
): Promise<AxiosResponse> => {
  const response = await vendorAxiosInstance.post("/_ve/vendor/change-email", {
    email,
  });
  return response.data;
};

//--------resend otp----------
export const vendorResendOtp = async (
  email: string
): Promise<AxiosResponse> => {
  const response = await vendorAxiosInstance.post("/_ve/vendor/resent-otp", {
    email,
  });
  return response.data;
};

//---------vendor details api---------
export const getVendorProfile = async () => {
  try {
    const response = await vendorAxiosInstance.get("/_ve/vendor/details");
    return response.data;
  } catch (error: any) {
    return error?.response?.data.message || error;
  }
};

//--------vendor details api call for status--------------
export const getVendorDetails = async () => {
  try {
    const response = await vendorAxiosInstance.get("/_ve/vendor/profile");
    return response.data;
  } catch (error: any) {
    return error?.response.data.message || error;
  }
};

//----------update vendor details api-----------
export const updateVendorDetails = async (data: Partial<IVendor>) => {
  const response = await vendorAxiosInstance.put("/_ve/vendor/details", data);
  return response.data;
};

//--------add adress api------------
export const addVendorAddress = async (address: AddressType) => {
  try {
    const response = await vendorAxiosInstance.post(
      "/_ve/vendor/address",
      address
    );
    return response.data;
  } catch (error: any) {
    return error?.response.data.message || error;
  }
};

//-------update address api---------------
export const updateVendorAddress = async (address: AddressType) => {
  const response = await vendorAxiosInstance.put(
    "/_ve/vendor/address",
    address
  );
  return response.data;
};

//----------add kyc api----------------
export const addVendorKyc = async (kyc: KYCRequestPayload) => {
  try {
    const response = await vendorAxiosInstance.post("/_ve/vendor/kyc", kyc);
    return response.data;
  } catch (error: any) {
    return error?.response?.data.messae || error;
  }
};

//--------- add guide ---------------
export const addGuide = async (data: UserDto) => {
  const response = await vendorAxiosInstance.post("/_ve/vendor/guide", data);
  return response.data;
};

//----------guide details api-----------
export const getGuideDetails = async (id: string) => {
  const response = await vendorAxiosInstance.get("/_ve/vendor/guide", {
    params: { id }, // pass as object for query params
  });
  return response.data;
};

//----get all guides api --------
export const getAllGuides = async ({
  page = 1,
  limit = 10,
  searchTerm,
  status,
}: {
  page: number;
  limit: number;
  searchTerm: string;
  status: string;
}) => {
  try {
    const response = await vendorAxiosInstance.get("/_ve/vendor/guide", {
      params: {
        page,
        limit,
        searchTerm,
        status,
      },
    });
    return response.data;
  } catch (error: any) {
    return error?.response?.data.message || error;
  }
};

//------------udpate password api------------
export const updateVendorPassword = async (data: PasswordChangeFormType) => {
  try {
    const response = await vendorAxiosInstance.put(
      "/_ve/vendor/update-password",
      data
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

//------add package api------------
export const addPackage = async (data: any) => {
  try {
    const response = await vendorAxiosInstance.post(
      "/_ve/vendor/package",
      data
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

//-------get packages api----------
export const getAllPackages = async ({
  page = 1,
  limit = 5,
  searchTerm,
  status,
  category,
}: {
  page: number;
  limit: number;
  searchTerm: string;
  status: string;
  category: string;
}) => {
  const response = await vendorAxiosInstance.get("/_ve/vendor/package", {
    params: {
      page,
      limit,
      searchTerm,
      status,
      category,
    },
  });
  return response.data;
};

//---------get package details api---------
export const getPackageDetails = async(packageId : string) =>{
    try{
      const response = await vendorAxiosInstance.get(`/_ve/vendor/package/${packageId}`);
      return response.data;
    }catch(error: any){
       throw error;
    }
}

//-------update package basicdetails----------
export const updatePackageBasicDetails = async (packageId : string,basicData : BasicDetails) => {
  try{
     const response = await vendorAxiosInstance.put(`/_ve/vendor/package/${packageId}`,basicData);
     return response.data;
  }catch(error : any){
     throw error;
  }
}

//--------update itinerary-------
export const updateItinerary  = async(itineraryId : string,itineraryData : any) => {
  try{
    const response = await vendorAxiosInstance.put(`/_ve/vendor/itinerary/${itineraryId}`,{days : itineraryData});
    return response.data
  }catch(error : any){
    throw error;
  }
}

//update the activity
export const updateActivity = async(activityId : string,activityData : any) => {
    const response = await vendorAxiosInstance.put(`/_ve/vendor/activity/${activityId}`,activityData);
    return response.data;
}


//-------add an activity----------
export const createActivity = async(activityData : any) => {
   const response = await vendorAxiosInstance.post("/_ve/vendor/activity",activityData);
   return response.data;
}

//-----------delete an activity---------
export const deleteActivity = async ({itineraryId,dayNumber,activityId} : {itineraryId : string,dayNumber : number,activityId : string}) : Promise<AxiosResponse> => {
   const response = await vendorAxiosInstance.delete("/_ve/vendor/activity",{data : {itineraryId,dayNumber,activityId}});
   return response.data;
}

//-------update vendor status api------------
export const updateVendorStatus = async (
  data: StatusPayload
): Promise<AxiosResponse> => {
  try {
    const response = await vendorAxiosInstance.patch(
      "/_ve/vendor/status",
      data
    );
    return response.data;
  } catch (error: any) {
    return error?.response?.data.message || error;
  }
};

//view the vendor docuements
export const getVendorKycUrls = async (data: string[]): Promise<string[]> => {
  try {
    const response = await vendorAxiosInstance.post("/_ve/vendor/signed-url", {
      data,
    });
    return response.data.urls;
  } catch (error: any) {
    return error?.response?.data.message || error;
  }
};

//--------- upload images -------------

export const uploadImages = async (
  files: File[]
): Promise<{ url: string; public_id: string }[]> => {
  const form = new FormData();
  files.forEach((f) => form.append("image", f));
  try {
    const response = await vendorAxiosInstance.post(
      "/_ve/vendor/images/upload",
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data.data as { url: string; public_id: string }[];
  } catch (error: any) {
    console.log(error);
    return error.response?.data.message || error;
  }
};
