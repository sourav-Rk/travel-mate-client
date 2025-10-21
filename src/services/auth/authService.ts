import type { OtpVerifyType, ResendOtptType, ResetFormType, SignupFormValues } from "@/types/authTypes";
import type { UserRole } from "@/types/UserRole";
import { server } from "../server";
import { AUTH_API } from "@/constants/api/auth.api";
import type { IResponse } from "@/types/Response";
import type { LoginResponse } from "@/types/api/auth";



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
export const signupApi = async (email: string) => server.post<IResponse,{email : string}>(AUTH_API.SIGNUP,{email});

//send-otp api
export const sendOtp = async (data: SignupFormValues) => server.post<IResponse,SignupFormValues>(AUTH_API.SEND_OTP,data);

//verify otp api
export const verifyOtp = async (data: OtpVerifyType) => server.post<IResponse,OtpVerifyType>(AUTH_API.VERIFY_OTP,data);


//resend otp
export const resendOtp = async (data: ResendOtptType) => server.post<IResponse,ResendOtptType>(AUTH_API.RESEND_OTP,data)

//login api
export const loginApi = async (data: LoginType) => server.post<LoginResponse,LoginType>(AUTH_API.LOGIN,data);


//logout api
export const logoutUser = async () => server.post<IResponse>(AUTH_API.LOGOUT)


//------forgot password send email api-------------
export const forgotPasswordSendMail = async(email : string) => server.post<IResponse,{email : string}>(AUTH_API.FORGOT_PASSWORD_SEND_MAIL,{email})

//------forgot password reset api----------------
export const forgotPasswordReset = async(data : ResetFormType) => server.post<IResponse,ResetFormType>(AUTH_API.FORGOT_PASSWORD_RESET,data);

