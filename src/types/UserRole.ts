export type UserRole  = "admin" | "client" | "vendor" | "guide"

export interface BaseUser{
    id : string;
    firstName : string;
    lastName : string;
    role : string;
}

// Vendor extends BaseUser with status
export interface VendorUser extends BaseUser {
  role: "vendor";
  status?: string;
}


export type User = BaseUser | VendorUser;