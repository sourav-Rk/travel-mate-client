import axios from "axios";
import toast from "react-hot-toast";

export const guideAxiosInstance = axios.create({
    baseURL : import.meta.env.VITE_PRIVATE_API_URI,
    withCredentials : true
});


let isRefreshing = false;

guideAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await guideAxiosInstance.post("_gu/guide/refresh-token");
          isRefreshing = false;
          return guideAxiosInstance(originalRequest);
        } catch (rereshError) {
          isRefreshing = false;

          localStorage.removeItem("guideSession");
          window.location.href = "/guide/";
          toast.error("Please login again");
          return Promise.reject(rereshError);
        }
      }
    }

    if (
      (error.response?.status === 403 &&
        error.response.data.message ===
          "Access denied. You do not have permission to access this resource.") ||
      (error.response.status === 403 &&
        error.response.data.message === "Token is blacklisted") ||
      (error.response.status === 403 &&
        error.response.data.message ===
          "Access denied: Your account has been blocked" &&
        !originalRequest._retry)
    ) {
      localStorage.removeItem("guideSession");
      window.location.href = "/guide/";
      toast.error("Please login again");
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
