import type { BookingDetailsDto } from "../bookingType";

export interface GuideListDto {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  gender: string;
  alternatePhone: string;
  languageSpoken: string[];
  yearOfExperience: string;
  profileImage: string;
  isAvailable: boolean;
}

interface IDuration {
  days: number;
  nights: number;
}

export interface GuidePackageListingTableDto {
  _id?: string;
  packageId: string;
  packageName: string;
  title: string;
  images: string[];
  meetingPoint: string;
  category: string;
  duration: IDuration;
  maxGroupSize: number;
  price: number;
  status: string;
  isBlocked: boolean;
  guideId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface BookingListGuideDto {
  _id: string;
  bookingId?: string;
  status: string;
  isWaitlisted: boolean;
  cancelledAt?: Date;
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  } | null;
}


//assigned packages dto
export interface IGetAllAssignedPackages {
  packages: GuidePackageListingTableDto[];
  totalPages: number;
  currentPage: number;
}


//booking list dto
export interface IGetBookingsGuide {
  bookings: BookingListGuideDto[];
  totalPages: number;
  currentPage: number;
}

//booking details response
export interface IGetBookingDetailsGuideDto{
  bookingDetails : BookingDetailsDto
}
