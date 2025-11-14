import { server } from "../server";
import { VOLUNTEER_POST_API } from "@/constants/api/volunteer-post.api";
import type {
  CreateVolunteerPostRequest,
  UpdateVolunteerPostRequest,
  GetVolunteerPostsParams,
  GetVolunteerPostsByLocationParams,
  SearchVolunteerPostsParams,
  VolunteerPostListResponse,
  VolunteerPostDetailResponse,
  CreateVolunteerPostResponse,
  UpdateVolunteerPostResponse,
  DeleteVolunteerPostResponse,
} from "@/types/volunteer-post";
import qs from "qs";

// ================== CLIENT ROUTES ==================

export const createVolunteerPost = async (
  data: CreateVolunteerPostRequest
): Promise<CreateVolunteerPostResponse> => {
  return server.post<CreateVolunteerPostResponse, CreateVolunteerPostRequest>(
    VOLUNTEER_POST_API.CREATE_POST,
    data
  );
};

export const updateVolunteerPost = async (
  postId: string,
  data: UpdateVolunteerPostRequest
): Promise<UpdateVolunteerPostResponse> => {
  return server.put<UpdateVolunteerPostResponse, UpdateVolunteerPostRequest>(
    VOLUNTEER_POST_API.UPDATE_POST(postId),
    data
  );
};

export const deleteVolunteerPost = async (
  postId: string
): Promise<DeleteVolunteerPostResponse> => {
  return server.delete<DeleteVolunteerPostResponse>(
    VOLUNTEER_POST_API.DELETE_POST(postId)
  );
};


export const getVolunteerPosts = async (
  params?: GetVolunteerPostsParams
): Promise<VolunteerPostListResponse> => {
  return server.get<VolunteerPostListResponse>(
    VOLUNTEER_POST_API.GET_POSTS,
    {
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "repeat" });
      },
    }
  );
};

export const getVolunteerPost = async (
  postId: string,
  incrementViews: boolean = true
): Promise<VolunteerPostDetailResponse> => {
  return server.get<VolunteerPostDetailResponse>(
    VOLUNTEER_POST_API.GET_POST(postId),
    {
      params: {
        incrementViews: incrementViews.toString(),
      },
    }
  );
};

export const getVolunteerPostsByLocation = async (
  params: GetVolunteerPostsByLocationParams
): Promise<VolunteerPostListResponse> => {
  return server.get<VolunteerPostListResponse>(
    VOLUNTEER_POST_API.GET_POSTS_BY_LOCATION,
    {
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "repeat" });
      },
    }
  );
};

export const searchVolunteerPosts = async (
  params: SearchVolunteerPostsParams
): Promise<VolunteerPostListResponse> => {
  return server.get<VolunteerPostListResponse>(
    VOLUNTEER_POST_API.SEARCH_POSTS,
    {
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "repeat" });
      },
    }
  );
};

export const likeVolunteerPost = async (
  postId: string
): Promise<{ success: boolean; message: string }> => {
  return server.post<{ success: boolean; message: string }>(
    VOLUNTEER_POST_API.LIKE_POST(postId)
  );
};

export const unlikeVolunteerPost = async (
  postId: string
): Promise<{ success: boolean; message: string }> => {
  return server.delete<{ success: boolean; message: string }>(
    VOLUNTEER_POST_API.UNLIKE_POST(postId)
  );
};

