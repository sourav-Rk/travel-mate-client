export type MapLayerType = "volunteerPosts" | "localGuides";

export interface GeoPoint {
  longitude: number;
  latitude: number;
}

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface LocationSearchParams {
  center?: GeoPoint;
  radiusInMeters?: number;
  boundingBox?: BoundingBox;
  page?: number;
  limit?: number;
}

export interface GuideLocationStats {
  totalSessions: number;
  completedSessions: number;
  averageRating: number;
  totalRatings: number;
  totalPosts: number;
  totalEarnings: number;
}

export interface GuideLocation {
  _id: string;
  userId: string;
  profileImage?: string;
  bio?: string;
  verificationStatus?: string;
  verificationRequestedAt?: string;
  verifiedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  userDetails?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
  location: {
    coordinates: [number, number];
    city: string;
    state: string;
    country: string;
    address?: string;
    formattedAddress?: string;
  };
  hourlyRate: number;
  languages: string[];
  specialties: string[];
  isAvailable: boolean;
  stats: GuideLocationStats;
  badges: string[];
  distance?: number;
}

export interface VolunteerPostLocation {
  _id: string;
  title: string;
  description: string;
  category: string;
  images?: string[];
  location: {
    coordinates: [number, number];
    city?: string;
    state?: string;
    country?: string;
  };
  likes: number;
  views: number;
  distance?: number;
  localGuideProfileId: string;
}

export interface PaginatedLocationResponse<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
}

export interface GuideLayerFeature {
  kind: "guide";
  guide: GuideLocation;
}

export interface VolunteerPostLayerFeature {
  kind: "post";
  post: VolunteerPostLocation;
}

