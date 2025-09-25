import type { UserRole } from "./UserRole";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  gender?: string;
  role?: UserRole;
}

export interface IClient {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  gender: string;
  role: "client";
}

export interface IVendor {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  gender: string;
  role: "vendor";
  agencyName: string;
  description: string;
}

export interface IGuide {
  _id ?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone: string;
  gender: string;
  dob: Date;
  yearOfExperience: string;
  languageSpoken: string[];
  role: "guide";
  documents: string[];
  isAvailable ?: boolean;
  profileImage ?: string
}

export type UserDto = IClient | IVendor | IGuide;

export interface VendorData {
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
