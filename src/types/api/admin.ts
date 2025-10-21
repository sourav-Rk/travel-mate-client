import type { PaginatedResponse, ResponseWith } from "../common"
import type { PackageDetails, TravelPackage } from "../packageType"
import type { VendorData } from "../User"



export type IGetAllPackagesListAdminResponse = PaginatedResponse<"packages",PackageDetails>
export type IGetUserDetailsAdminResponse = ResponseWith<"user",VendorData>;
export type IGetPackageDetailsAdminResponse = ResponseWith<"packages",TravelPackage>;
export interface IGetAllUsersResponse<T> {
  success: boolean
  users: T[]
  totalPages: number
  currentPage: number
}