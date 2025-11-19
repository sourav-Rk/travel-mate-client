export type PostStatus = "draft" | "published" | "archived" | "hidden";
export type PostCategory =
  | "hidden-spots"
  | "restaurants"
  | "safety"
  | "culture"
  | "stays"
  | "transportation"
  | "shopping"
  | "entertainment"
  | "nature"
  | "history"
  | "other";

export interface PostLocation {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
  city: string;
  state: string;
  country: string;
}

export interface GuideDetails {
  _id: string;
  userId?:string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  bio?: string;
  specialties: string[];
  languages: string[];
  hourlyRate: number;
}

export interface VolunteerPost {
  _id: string;
  localGuideProfileId: string;
  title: string;
  description: string;
  content: string;
  category: PostCategory;
  location: PostLocation;
  images: string[];
  tags: string[];
  offersGuideService: boolean;
  status: PostStatus;
  views: number;
  likes: number;
  isLiked?: boolean; // Whether the current user has liked this post
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  distance?: number; // For location-based queries
  guideDetails?: GuideDetails; // Populated in detail view
}

export interface CreateVolunteerPostRequest {
  title: string;
  description: string;
  content: string;
  category: PostCategory;
  location: PostLocation;
  images?: string[];
  tags?: string[];
  offersGuideService: boolean;
  // Status is always "published" - handled by backend
}

export interface UpdateVolunteerPostRequest {
  description?: string;
  content?: string;
  tags?: string[];
  // Only description, content, and tags can be updated
}

export interface GetVolunteerPostsParams {
  page?: number;
  limit?: number;
  status?: PostStatus;
  category?: PostCategory;
  localGuideProfileId?: string;
  offersGuideService?: boolean;
  sortBy?: "newest" | "oldest" | "views" | "likes";
}

export interface GetVolunteerPostsByLocationParams {
  longitude: number;
  latitude: number;
  radius?: number; // in meters, default 10000 (10km)
  page?: number;
  limit?: number;
  category?: PostCategory;
  offersGuideService?: boolean;
}

export interface SearchVolunteerPostsParams {
  searchTerm: string;
  page?: number;
  limit?: number;
  category?: PostCategory;
  offersGuideService?: boolean;
  sortBy?:string;
}

export interface VolunteerPostListResponse {
  success: boolean;
  message?: string;
  posts: VolunteerPost[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface VolunteerPostDetailResponse {
  success: boolean;
  message?: string;
  post: VolunteerPost;
}

export interface CreateVolunteerPostResponse {
  success: boolean;
  message: string;
  post: VolunteerPost;
}

export interface UpdateVolunteerPostResponse {
  success: boolean;
  message: string;
  post: VolunteerPost;
}

export interface DeleteVolunteerPostResponse {
  success: boolean;
  message: string;
}


