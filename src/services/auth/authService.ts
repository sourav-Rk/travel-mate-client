
import { travelMateBackend } from "@/api/instance";
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
    role: "client" | "admin" | "vendor" | "guide";
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
    const response = await travelMateBackend.post("/auth/signup", { email });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    throw error?.response.data.message || error;
  }
};

//send-otp api
export const sendOtp = async (data: UserDto): Promise<AxiosResponse> => {
  try {
    const response = await travelMateBackend.post("/auth/send-otp", data);
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
    const response = await travelMateBackend.post("/auth/verify-otp", data);
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
    const response = await travelMateBackend.post("/auth/resend-otp", data);
    return response.data;
  } catch (error: any) {
    throw error?.response.data.message || error;
  }
};

//login api
export const loginApi = async (data: LoginType): Promise<AuthResponse> => {
  try {
    const response = await travelMateBackend.post("/auth/login", data);
    return response.data;
  } catch (error: any) {
    throw error?.response.data.message || error;
  }
};

//------forgot password send email api-------------
export const forgotPasswordSendMail = async(email : string) =>{
  const response = await travelMateBackend.post('/forgot-password/mail',{email});
  return response.data;
}


//------forgot password reset api----------------
export const forgotPasswordReset = async(data : ResetFormType) =>{
        const response = await travelMateBackend.post("/forgot-password/reset",data);
        return response.data;
}

//logout api
export const logoutUser = async (): Promise<AxiosResponse> => {
  try {
    const response = await travelMateBackend.post("/auth/logout");
    return response.data;
  } catch (error: any) {
    return error?.response?.data.message || error;
  }
};
