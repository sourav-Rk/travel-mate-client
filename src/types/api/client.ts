import type { BookingDetailsClientDto, BookingListDTO, ClientBookingDetailDto, PaymentResponseDto } from "../bookingType";
import type { ChatMessage } from "../chat";
import type { PaginatedResponse, PaginatedResponseData, ResponseWith, ResponseWithData } from "../common";
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


//wishlist 
export interface IGetGuideDetailsClient{
  guide : GuideDetailsForClientDto
}


export type IGetAvailabalePackagesResponse = PaginatedResponse<"packages",PackageListingUserSideDto>;
export type IGetPackageDetailsClient = ResponseWith<"packages",PackageDetails>;
export type IGetTrendingPackagesResponse = ResponseWith<"packages",PackageDetails[]>
export type IGetClientBookingDetailsOfPackageResponse = ResponseWith<"bookingDetails",ClientBookingDetailDto>;
export type IGetClientBookingDetailsResponse = ResponseWith<"bookingDetails",BookingDetailsClientDto>;
export type IGetBookingsClientResponse = ResponseWith<"bookings",BookingListDTO[]>;
export type IGetAllNotificationsClientResponse = ResponseWith<"notifications",INotificationEntity[]>;
export type IPaymentResponse = ResponseWith<"data",PaymentResponseDto>;
export type IReviewsResponse = ResponseWith<"reviews",ReviewListDto[]>;
export type IGetMessagesResponse = PaginatedResponseData<ChatMessage>;
export type IGetWalletResponse =ResponseWithData<GetWalletDto>;
export type IGetWalletTransactionsResponse = PaginatedResponseData<WalletTransactions>;