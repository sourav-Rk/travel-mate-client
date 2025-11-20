export type VerificationStatus =
  | "pending"
  | "reviewing"
  | "verified"
  | "rejected";

export interface Location {
  coordinates: [number, number]; // [longitude, latitude]
  city: string;
  state: string;
  country: string;
  address?: string;
  formattedAddress?: string;
}

export interface VerificationDocuments {
  idProof: string;
  addressProof: string;
  additionalDocuments?: string[];
}

export interface GuideStats {
  totalSessions: number;
  completedSessions: number;
  averageRating: number;
  totalRatings: number;
  totalPosts: number;
  totalEarnings: number;
}

export interface LocalGuideProfile {
  _id: string;
  userId: string;
  userDetails?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    gender?: string;
    profileImage?: string;
  };
  verificationStatus: VerificationStatus;
  verificationRequestedAt: Date;
  verifiedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  verificationDocuments: VerificationDocuments;
  location: Location;
  hourlyRate: number;
  languages: string[];
  specialties: string[];
  bio?: string;
  profileImage?: string;
  isAvailable: boolean;
  availabilityNote?: string;
  stats: GuideStats;
  badges: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RequestVerificationRequest {
  idProof: string;
  addressProof: string;
  additionalDocuments?: string[];
  location: Location;
  hourlyRate?: number;
  languages: string[];
  specialties?: string[];
  bio?: string;
  profileImage?: string;
  isAvailable?: boolean;
  availabilityNote?: string;
}

export interface RequestVerificationResponse {
  success: boolean;
  message: string;
  data: LocalGuideProfile;
}

export interface PendingVerificationsResponse {
  success: boolean;
  message?: string;
  profiles: LocalGuideProfile[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface VerifyGuideResponse {
  success: boolean;
  message: string;
  data: LocalGuideProfile;
}

export interface RejectGuideRequest {
  rejectionReason: string;
}

export interface RejectGuideResponse {
  success: boolean;
  message: string;
  data: LocalGuideProfile;
}

export interface UpdateProfileRequest {
  location?: Location;
  hourlyRate?: number;
  languages?: string[];
  specialties?: string[];
  bio?: string;
  profileImage?: string;
  isAvailable?: boolean;
  availabilityNote?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
}

export interface LocalGuidePublicProfileDto {
  _id: string;
  userId: string;
  userDetails?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    gender?: string;
    profileImage?: string;
  };
  location: Location;
  hourlyRate: number;
  languages: string[];
  specialties: string[];
  bio?: string;
  profileImage?: string;
  isAvailable: boolean;
  availabilityNote?: string;
  stats: {
    totalSessions: number;
    completedSessions: number;
    averageRating: number;
    totalRatings: number;
    totalPosts: number;
    totalEarnings: number;
    completionRate: number;
    maxPostLikes: number;
    maxPostViews: number;
    totalLikes: number;
    totalViews: number;
  };
  badges: string[];
}
