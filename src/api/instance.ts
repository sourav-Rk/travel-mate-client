import axios from "axios";
import toast from "react-hot-toast";

export const travelMateBackend = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

travelMateBackend.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log(
      "Interceptor error:",
      error.response?.status,
      error.response?.data
    );

    if (
      error.response?.status === 401 &&
      [
        "Token time out, Please loggin again",
        "Authorization token is required",
      ].includes(error.response.data.message)
    ) {
      {
        localStorage.removeItem("authSession");
        window.location.href = "/";
        toast.error("Please login again");
        return Promise.reject(error);
      }
    }

    if (
      error.response?.status === 401 &&
      (error.response.data.message === "Unauthorized access." ||
        error.response.data.message === "Access Token time out") &&
      !originalRequest._retry
    ) {
      // originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return travelMateBackend(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await travelMateBackend.post("/auth/refresh-token");
        processQueue(null);
        return travelMateBackend(originalRequest);
      } catch (error) {
        processQueue(error);
        localStorage.removeItem("authSession");
        window.location.href = "/";
        toast.error("Session expired. Please login again.");

        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    //handle 403
    if (
      error.response?.status === 403 &&
      [
        "Access denied. You do not have permission to access this resource.",
        "Token is blacklisted",
        "Access denied: Your account has been blocked",
      ].includes(error.response.data.message)
    ) {
      {
        localStorage.removeItem("authSession");
        window.location.href = "/";
        toast.error("Please login again");
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
