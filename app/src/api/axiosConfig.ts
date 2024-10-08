import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useUserStore } from "../store/auth"; // Import Zustand store
import { USER_API_ENDPOINTS } from "./users/endpoints";

interface ErrorResponse {
  message?: string; // Define the shape of your error response
}
let isRefreshing = false; // Flag to prevent multiple refresh requests
let pendingRequests: Array<(token: string) => void> = []; // Queue of pending requests

// Create the Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to refresh the access token using the refresh token
const refreshAccessToken = async (refreshToken: string) => {
  const response = await axiosInstance.post(USER_API_ENDPOINTS.TOKEN, {
    refresh_token: refreshToken,
  });
  return response.data.tokens; // Expect tokens to be returned in response
};

// Set up Axios interceptors immediately
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the auth state directly from Zustand store
    const auth = useUserStore.getState().auth;

    if (auth?.tokens?.access_token) {
      // Attach the access token to the Authorization header if available
      config.headers["Authorization"] = `Bearer ${auth.tokens.access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error: AxiosError<ErrorResponse>) => {
    const { config, response } = error;
    const originalRequest: AxiosRequestConfig | undefined = config; // The original request that failed
    const auth = useUserStore.getState().auth; // Access auth state directly

    console.log(error.response?.data.message);

    // Check if the error is due to an expired token (401 Unauthorized)
    if (
      response?.status === 401 &&
      originalRequest?.url !== USER_API_ENDPOINTS.LOGIN && // Use optional chaining
      error.response?.data.message !==
        "401 Unauthorized: Old password is incorrect" // Check the specific error message
    ) {
      try {
        // Try to refresh the access token using the refresh token
        const newTokens = await refreshAccessToken(
          auth?.tokens?.refresh_token || ""
        );

        console.log("New tokens received:", newTokens);

        // Update the tokens in the Zustand store
        useUserStore.getState().login({
          tokens: newTokens, // Replace old tokens with new ones
          user: auth?.user!, // Pass the existing user object
        });

        // Retry the original request with the new access token
        if (originalRequest) {
          // Ensure headers are defined
          if (!originalRequest.headers) {
            originalRequest.headers = {}; // Initialize headers if undefined
          }
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${newTokens.access_token}`;

          console.log("Retrying request with new token:", originalRequest);
          return axiosInstance(originalRequest); // Retry the failed request with new token
        }
      } catch (refreshError) {
        console.error("Error refreshing access token:", refreshError);
        // If the refresh token fails, log out the user
        useUserStore.getState().logout();
        return Promise.reject(refreshError); // Reject the original request
      }
    } else if (response?.status === 404) {
      // Handle 404 errors specifically if needed
      console.error("Resource not found:", originalRequest?.url);
      return Promise.reject(new Error("Resource not found"));
    }

    // If error is not a 401 or 404, reject the error
    console.error("Error occurred:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
