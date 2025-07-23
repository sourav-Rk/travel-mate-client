import { vendorAxiosInstance } from "@/api/vendor.axios";
import type { AddressType } from "@/types/addressType";
import type { KYCRequestPayload } from "@/types/kycType";
import type { PasswordChangeFormType, StatusPayload } from "@/types/authTypes";
import type { AxiosResponse } from "../auth/authService";
import type { UserDto } from "@/types/User";



export interface Vendor {
 _id: string
  firstName: string
  lastName : string
  email: string
  phone: string
  agencyName: string
  description: string
  profileImage: string
  status: "pending" | "verified" | "rejected" |"reviewing"
  address: {
    street: string
    city: string
    state: string
    pincode: string
    country: string
  }
  kycDetails: {
    pan: string
    gstin: string
    registrationNumber: string
    documents: string[]
  }
}



//---------vendor details api---------
export const getVendorProfile = async () =>{
  try{
    const response = await vendorAxiosInstance.get("/_ve/vendor/details");
    return response.data;
  }catch(error : any){
     return error?.response?.data.message || error;
  }
}

//--------vendor details api call for status--------------
export const getVendorDetails = async () => {
  try {
    const response = await vendorAxiosInstance.get("/_ve/vendor/profile");
    return response.data;
  } catch (error: any) {
    return error?.response.data.message || error;
  }
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
  try {
    const response = await vendorAxiosInstance.post("/_ve/vendor/guide", data);
    return response.data;
  } catch (error: any) {
    return error?.response?.data.message || error;
  }
};

//------------udpate password api------------
export const updateVendorPassword = async(data : PasswordChangeFormType) =>{
  const response = await vendorAxiosInstance.put("/_ve/vendor/update-password",data);
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
export const getVendorKycUrls = async(data : string[]) : Promise<string[]> =>{
  try{
    const response = await vendorAxiosInstance.post("/_ve/vendor/signed-url",{data});
    return response.data.urls;
  }catch(error : any){
    return error?.response?.data.message || error;
  }
}

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

