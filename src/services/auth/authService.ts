import { adminAxiosInstance } from "@/api/admin.axios";
import { authAxiosInstance } from "@/api/auth.axios";
import { clientAxiosInstance } from "@/api/client.axios";
import { guideAxiosInstance } from "@/api/guide.axios";
import { vendorAxiosInstance } from "@/api/vendor.axios";
import type { OtpVerifyType, ResendOtptType, ResetFormType } from "@/types/authTypes";
import type { UserDto } from "@/types/User";
import type { UserRole } from "@/types/UserRole";

export interface AuthResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "client" | "admin" | "vendor";
  };
}

export interface AxiosResponse {
  success: boolean;
  message: string;
}

export type LoginType = {
  email: string;
  password: string;
  role: UserRole;
};

//signup api
export const signupApi = async (email: string): Promise<AxiosResponse> => {
  try {
    const response = await authAxiosInstance.post("/signup", { email });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    throw error?.response.data.message || error;
  }
};

//send-otp api
export const sendOtp = async (data: UserDto): Promise<AxiosResponse> => {
  try {
    const response = await authAxiosInstance.post("/send-otp", data);
    return response.data;
  } catch (error: any) {
    throw error?.response.data.message || error;
  }
};

//verify otp api
export const verifyOtp = async (
  data: OtpVerifyType
): Promise<AxiosResponse> => {
  try {
    const response = await authAxiosInstance.post("/verify-otp", data);
    return response.data;
  } catch (error: any) {
    throw error?.response.data.message || error;
  }
};

//resend otp
export const resendOtp = async (
  data: ResendOtptType
): Promise<AxiosResponse> => {
  try {
    const response = await authAxiosInstance.post("/resend-otp", data);
    return response.data;
  } catch (error: any) {
    throw error?.response.data.message || error;
  }
};

//login api
export const loginApi = async (data: LoginType): Promise<AuthResponse> => {
  try {
    const response = await authAxiosInstance.post("/login", data);
    return response.data;
  } catch (error: any) {
    throw error?.response.data.message || error;
  }
};

//------forgot password send email api-------------
export const forgotPasswordSendMail = async(email : string) =>{
  const response = await authAxiosInstance.post('/forgot-password/mail',{email});
  return response.data;
}


//------forgot password reset api----------------
export const forgotPasswordReset = async(data : ResetFormType) =>{
        const response = await authAxiosInstance.post("/forgot-password/reset",data);
        return response.data;
}

//logout api
export const logoutClient = async (): Promise<AxiosResponse> => {
  try {
    const response = await clientAxiosInstance.post("/_cl/client/logout");
    return response.data;
  } catch (error: any) {
    return error?.response?.data.message || error;
  }
};


export const logoutAdmin = async (): Promise<AxiosResponse> => {
  try {
    const response = await adminAxiosInstance.post("/_ad/admin/logout");
    return response.data;
  } catch (error: any) {
    return error?.response?.data.message || error;
  }
};

export const logoutVendor = async (): Promise<AxiosResponse> => {
  try {
    const response = await vendorAxiosInstance.post("/_ve/vendor/logout");
    return response.data;
  } catch (error: any) {
    return error?.response?.data.message || error;
  }
};

export const logoutGuide = async() : Promise<AxiosResponse> =>{
  try{
    const response = await guideAxiosInstance.post("/_gu/guide/logout");
    return response.data
  }catch(error : any){
    return error?.response?.data.message || error;
  }
}
