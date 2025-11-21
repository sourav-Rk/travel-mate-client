import { travelMateBackend } from "@/api/instance";
import { CLIENT_API } from "@/constants/api/client.api";
import type {
  BoundingBox,
  GeoPoint,
  GuideLocation,
  PaginatedLocationResponse,
  VolunteerPostLocation,
} from "@/types/map";
import type {
  IGetGuidesByLocationResponse,
  IGetVolunteerPostsByLocationResponse,
} from "@/types/api/client";
import type { PostCategory } from "@/types/volunteer-post";

export interface GuidesLocationSearchPayload {
  center?: GeoPoint;
  radiusInMeters?: number;
  boundingBox?: BoundingBox;
  specialties?: string[];
  isAvailable?: boolean;
  minRating?: number;
  page?: number;
  limit?: number;
}

export interface PostsLocationSearchPayload {
  center?: GeoPoint;
  radiusInMeters?: number;
  boundingBox?: BoundingBox;
  category?: PostCategory;
  offersGuideService?: boolean;
  sortBy?: "newest" | "oldest" | "views" | "likes";
  page?: number;
  limit?: number;
}

const buildLocationParams = (
  payload: GuidesLocationSearchPayload | PostsLocationSearchPayload
) => {
  const params: Record<string, unknown> = {};

  if (payload.center) {
    params.longitude = payload.center.longitude;
    params.latitude = payload.center.latitude;
  }

  if (payload.radiusInMeters) {
    params.radiusInMeters = payload.radiusInMeters;
  }

  if (payload.boundingBox) {
    params.boundingBox = payload.boundingBox;
  }

  if ("specialties" in payload && payload.specialties?.length) {
    params.specialties = payload.specialties;
  }

  if ("isAvailable" in payload && payload.isAvailable !== undefined) {
    params.isAvailable = payload.isAvailable;
  }

  if ("minRating" in payload && payload.minRating !== undefined) {
    params.minRating = payload.minRating;
  }

  if ("category" in payload && payload.category) {
    params.category = payload.category;
  }

  if (
    "offersGuideService" in payload &&
    payload.offersGuideService !== undefined
  ) {
    params.offersGuideService = payload.offersGuideService;
  }

  if ("sortBy" in payload && payload.sortBy) {
    params.sortBy = payload.sortBy;
  }

  if (payload.page) {
    params.page = payload.page;
  }

  if (payload.limit) {
    params.limit = payload.limit;
  }

  return params;
};

export const fetchGuidesByLocation = async (
  payload: GuidesLocationSearchPayload
): Promise<PaginatedLocationResponse<GuideLocation>> => {
  const response =
    await travelMateBackend.get<IGetGuidesByLocationResponse>(
      CLIENT_API.LOCAL_GUIDE_SEARCH_BY_LOCATION,
      {
        params: buildLocationParams(payload),
      }
    );

  return {
    items: response.data.guides ?? [],
    currentPage: response.data.currentPage,
    totalPages: response.data.totalPages,
  };
};

export const fetchVolunteerPostsByLocation = async (
  payload: PostsLocationSearchPayload
): Promise<PaginatedLocationResponse<VolunteerPostLocation>> => {
  const response =
    await travelMateBackend.get<IGetVolunteerPostsByLocationResponse>(
      CLIENT_API.VOLUNTEER_POSTS_SEARCH_BY_LOCATION,
      {
        params: buildLocationParams(payload),
      }
    );

  return {
    items: response.data.posts ?? [],
    currentPage: response.data.currentPage,
    totalPages: response.data.totalPages,
  };
};



