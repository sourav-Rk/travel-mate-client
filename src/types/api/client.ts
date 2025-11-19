import type { Badge } from "../badge";
import type { BookingDetailsClientDto, BookingListDTO, ClientBookingDetailDto, PaymentResponseDto } from "../bookingType";
import type { ChatMessage } from "../chat";
import type { PaginatedResponse, PaginatedResponseData, ResponseWith, ResponseWithData } from "../common";
import type { GroupChatDetailsDto, GroupChatDo } from "../group-chatType";
import type { IGuideInstructionDto } from "../instructionType";
import type { INotificationEntity } from "../notificationType";
import type { PackageDetails, PackageListingUserSideDto } from "../packageType";
import type { ReviewListDto } from "../reviewType";
import type { GetWalletDto, WalletTransactions } from "../wallet";

export interface GuideDetailsForClientDto{
  _id : string;
  firstName : string;
  lastName : string;
  email : string;
  phone : string;
  alternatePhone : string;
  bio : string;
  profileImage : string;
  yearOfExperience : string;
  languageSpoken : string[];
  totalTrips : number;
}


export interface VendorDetailsForClientDto {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  agencyName: string;
  description?: string;
  profileImage?: string | null;
}


//wishlist 
export interface IGetGuideDetailsClient{
  guide : GuideDetailsForClientDto
}

export interface IReviewsResponse {
  success: boolean;
  message: string;
  data: {
    reviews: ReviewListDto[];
    averageRating: number;
    totalReviews: number;
  };
}

export type IGetAvailabalePackagesResponse = PaginatedResponse<"packages",PackageListingUserSideDto>;
export type IGetPackageDetailsClient = ResponseWith<"packages",PackageDetails>;
export type IGetTrendingPackagesResponse = ResponseWith<"packages",PackageDetails[]>
export type IGetClientBookingDetailsOfPackageResponse = ResponseWith<"bookingDetails",ClientBookingDetailDto>;
export type IGetClientBookingDetailsResponse = ResponseWith<"bookingDetails",BookingDetailsClientDto>;
export type IGetBookingsClientResponse = ResponseWith<"bookings",BookingListDTO[]>;
export type IGetAllNotificationsClientResponse = ResponseWith<"notifications",INotificationEntity[]>;
export type IPaymentResponse = ResponseWith<"data",PaymentResponseDto>;
export type IGetMessagesResponse = PaginatedResponseData<ChatMessage>;
export type IGetWalletResponse =ResponseWithData<GetWalletDto>;
export type IGetWalletTransactionsResponse = PaginatedResponseData<WalletTransactions>;
export type IGetInstructionsClientResponse = ResponseWith<"data",IGuideInstructionDto>
export type IGetVendorDetailsForClientResponse = ResponseWith<"data",VendorDetailsForClientDto>;
export type IGetGroupsResponse = ResponseWithData<GroupChatDo[]>;
export type IGetGroupDetailsResponse = ResponseWithData<GroupChatDetailsDto>;
export type IGetLocalGuideBadgesResponse = ResponseWithData<{earnedBadges:string[];allBadges:Badge[]}>