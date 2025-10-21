import type { BookingDetailsDto, BookingListVendorDto } from "../bookingType";
import type { CancellationRequestsListDto, CancelledBookingDetailsWithUserAndPackageDetailsDto } from "../cancellationType";
import type { PaginatedResponse, PaginatedResponseData, ResponseWith, ResponseWithData } from "../common";
import type { GuideListVendorDto } from "../guide";
import type { INotificationEntity } from "../notificationType";
import type { PackageDetails, PackageListingVendorDto, TravelPackage } from "../packageType";
import type { IGuide } from "../User";

interface VendorProfileDto {
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
    address?: string;
  };
  kycDetails: {
    pan: string;
    gstin: string;
    registrationNumber: string;
    documents: string[];
  };
}

interface VendorDetailsForStatusDto {
  _id: string;
  status: "pending" | "rejected" | "reviewing" | "approved";
  agencyName: string;
}

export type IGetVendorProfileResponse = ResponseWith<
  "vendor",
  VendorProfileDto
>;
export type IGetVendorDetailsForStatusResponse = ResponseWith<
  "vendor",
  VendorDetailsForStatusDto
>;
export type IGetAllPackagesVendorResponse = PaginatedResponse<
  "packages",
  PackageListingVendorDto
>;
export type IGetPackageDetailsVendorResponse = ResponseWith<
  "packages",
  PackageDetails | TravelPackage
>;
export type IGetGuideDetailsVendorResponse = ResponseWith<"user", IGuide>;
export type IGetAllGuidesVendorResponse = PaginatedResponse<
  "users",
  GuideListVendorDto
>;
export type IGetBookingDetailsVendorResponse = ResponseWith<
  "bookingDetails",
  BookingDetailsDto
>;
export type IGetNotificationsVendorResponse = ResponseWith<
  "notifications",
  INotificationEntity[]
>;
export type IBookingsVendorResponse = {
  bookings: BookingListVendorDto[];
  totalPages: number;
  currentPage: number;
  minTravelersCount: number;
};


export type IGetCancellationRequestsResponse = PaginatedResponseData<CancellationRequestsListDto>;
export type IGetCancelledBookingDetailsResponse = ResponseWithData<CancelledBookingDetailsWithUserAndPackageDetailsDto>;