import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createVolunteerPost,
  updateVolunteerPost,
  deleteVolunteerPost,
  getVolunteerPosts,
  getVolunteerPost,
  getVolunteerPostsByLocation,
  searchVolunteerPosts,
  likeVolunteerPost,
  unlikeVolunteerPost,
} from "@/services/volunteer-post/volunteer-post.service";
import type {
  CreateVolunteerPostRequest,
  UpdateVolunteerPostRequest,
  GetVolunteerPostsParams,
  GetVolunteerPostsByLocationParams,
  SearchVolunteerPostsParams,
} from "@/types/volunteer-post";

// ================== MUTATIONS ==================

export const useCreateVolunteerPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateVolunteerPostRequest) =>
      createVolunteerPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteer-posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
    },
  });
};

export const useUpdateVolunteerPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      data,
    }: {
      postId: string;
      data: UpdateVolunteerPostRequest;
    }) => updateVolunteerPost(postId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["volunteer-posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      queryClient.invalidateQueries({
        queryKey: ["volunteer-post", variables.postId],
      });
    },
  });
};

export const useDeleteVolunteerPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => deleteVolunteerPost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteer-posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
    },
  });
};

// ================== QUERIES ==================

export const useVolunteerPosts = (
  params?: GetVolunteerPostsParams,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["volunteer-posts", params],
    queryFn: () => getVolunteerPosts(params),
    enabled,
  });
};

export const useVolunteerPost = (
  postId: string,
  incrementViews: boolean = true,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["volunteer-post", postId, incrementViews],
    queryFn: () => getVolunteerPost(postId, incrementViews),
    enabled: enabled && !!postId,
  });
};

export const useVolunteerPostsByLocation = (
  params: GetVolunteerPostsByLocationParams,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["volunteer-posts-location", params],
    queryFn: () => getVolunteerPostsByLocation(params),
    enabled: enabled && !!params.longitude && !!params.latitude,
  });
};

export const useSearchVolunteerPosts = (
  params: SearchVolunteerPostsParams,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["volunteer-posts-search", params],
    queryFn: () => searchVolunteerPosts(params),
    enabled: enabled && !!params.searchTerm && params.searchTerm.trim().length > 0,
  });
};

// ================== MY POSTS (Local Guide's Posts) ==================

export const useMyPosts = (
  localGuideProfileId: string,
  params?: Omit<GetVolunteerPostsParams, "localGuideProfileId">,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["my-posts", localGuideProfileId, params],
    queryFn: () =>
      getVolunteerPosts({
        ...params,
        localGuideProfileId,
      }),
    enabled: enabled && !!localGuideProfileId,
  });
};

// ================== LIKE MUTATIONS ==================

export const useLikeVolunteerPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => likeVolunteerPost(postId),
    onSuccess: (_, postId) => {
      // Invalidate all queries that might contain this post
      queryClient.invalidateQueries({ queryKey: ["volunteer-posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      queryClient.invalidateQueries({
        queryKey: ["volunteer-post", postId],
      });
      queryClient.invalidateQueries({ queryKey: ["volunteer-posts-location"] });
      queryClient.invalidateQueries({ queryKey: ["volunteer-posts-search"] });
    },
  });
};

export const useUnlikeVolunteerPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => unlikeVolunteerPost(postId),
    onSuccess: (_, postId) => {
      // Invalidate all queries that might contain this post
      queryClient.invalidateQueries({ queryKey: ["volunteer-posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      queryClient.invalidateQueries({
        queryKey: ["volunteer-post", postId],
      });
      queryClient.invalidateQueries({ queryKey: ["volunteer-posts-location"] });
      queryClient.invalidateQueries({ queryKey: ["volunteer-posts-search"] });
    },
  });
};

