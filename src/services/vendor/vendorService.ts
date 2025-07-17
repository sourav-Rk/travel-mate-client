import { vendorAxiosInstance } from "@/api/vendor.axios";
import type { AddressType } from "@/types/addressType";
import type { KYCRequestPayload } from "@/types/kycType";
import type { StatusPayload } from "@/types/authTypes";
import type { AxiosResponse } from "../auth/authService";
import type { UserDto } from "@/types/User";

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

