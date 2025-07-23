
import type { UserRole } from "./UserRole";

export type AuthFormType = {
    firstName : string;
    lastName : string;
    email : string;
    phone : string;
    gender : string;
    password : string;
    confirmPassword : string;
}

export type OtpVerifyType = {
    email : string;
    otp : string;
}

export type ResendOtptType = {
    email : string;
}


export type LoginType = {
    email : string;
    password : string;
    role : UserRole
}


export interface SignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  gender?: string;
  agencyName?: string;
  description?: string;
}

export interface ResetFormType{
    password : string;
    confirmPassword ?:string;
    token : string;
}

export interface PasswordChangeFormType{
    currentPassword : string;
    newPassword : string;
}


//vendor

export type StatusPayload = {
    vendorId : string;
    status : Status;
}

export type Status = "pending" | "rejected" | "verified" | "reviewing";
