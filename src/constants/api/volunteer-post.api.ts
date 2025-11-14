export const VOLUNTEER_POST_API = {
  // ================== CLIENT ROUTES (Authenticated) ==================
  CREATE_POST: "/client/local-guide/posts",
  UPDATE_POST: (postId: string) => `/client/local-guide/posts/${postId}`,
  DELETE_POST: (postId: string) => `/client/local-guide/posts/${postId}`,

  // ================== PUBLIC ROUTES ==================
  GET_POSTS: "/client/local-guide/posts",
  GET_POST: (postId: string) => `/client/local-guide/posts/${postId}`,
  GET_POSTS_BY_LOCATION: "/client/local-guide/posts/location",
  SEARCH_POSTS: "/client/local-guide/posts/search",

  // ================== LIKE ROUTES (Authenticated) ==================
  LIKE_POST: (postId: string) => `/client/local-guide/posts/${postId}/like`,
  UNLIKE_POST: (postId: string) => `/client/local-guide/posts/${postId}/like`,
};


