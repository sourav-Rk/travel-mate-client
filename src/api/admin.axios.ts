import axios from "axios";
import toast from "react-hot-toast";

export const adminAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_PRIVATE_API_URI,
  withCredentials: true,
});



let isRefreshing = false;

adminAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await adminAxiosInstance.post("/_ad/admin/refresh-token");
          isRefreshing = false;
          return adminAxiosInstance(originalRequest);
        } catch (rereshError) {
          console.log(rereshError)
          console.log("admin faileddddd")
          isRefreshing = false;
          localStorage.removeItem("adminSession");
          window.location.href = "/admin";
          toast.error("Please login again");
          return Promise.reject(rereshError);
        }
      }
    }

    if (
      (error.response.status === 403 &&
        error.response.data.message ===
          "Access denied. You do not have permission to access this resource.") ||
      (error.response.status === 403 &&
        error.response.data.message === "Token is blacklisted") ||
      (error.response.status === 403 &&
        error.response.data.message ===
          "Access denied: Your account has been blocked" &&
        !originalRequest._retry)
    ) {
      localStorage.removeItem("adminSession");
      window.location.href = "/admin";
      toast.error("Please login again");
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
