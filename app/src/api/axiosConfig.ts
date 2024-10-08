import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { ApiResponse, Tokens } from "../helpers/type";
import { useUserStore } from "../store/auth"; // Import Zustand store
import { USER_API_ENDPOINTS } from "./users/endpoints";

interface ErrorResponse {
  message?: string; // Define the shape of your error response
}

// Create the Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to refresh the access token using the refresh token (no access token here)
const refreshAccessToken = async (refreshToken: string): Promise<Tokens> => {
  try {
    const response = await axios.post<ApiResponse<{ tokens: Tokens }>>(
      process.env.EXPO_PUBLIC_API_URL + USER_API_ENDPOINTS.TOKEN,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`, // Pass refresh token in Authorization header
        },
      }
    );

    // Extract tokens based on the actual structure
    const tokens = response.data?.data?.tokens;

    return tokens;
  } catch (error: any) {
    // Log the error details for debugging
    console.error(
      "Error refreshing access token:",
      error.response?.data || error.message
    );
    throw error;
  }
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

    // Check if the error is due to an expired token (401 Unauthorized)
    if (
      response?.status === 401 &&
      originalRequest?.url !== USER_API_ENDPOINTS.LOGIN &&
      error.response?.data.message !==
        "401 Unauthorized: Old password is incorrect"
    ) {
      try {
        // Try to refresh the access token using the refresh token

        const newToken = await refreshAccessToken(
          auth?.tokens?.refresh_token || ""
        );

        // Update the tokens in the Zustand store
        useUserStore.getState().login({
          tokens: newToken, // Replace old tokens with new ones
          user: auth?.user!, // Pass the existing user object
        });

        // Retry the original request with the new access token
        if (originalRequest) {
          if (!originalRequest.headers) {
            originalRequest.headers = {}; // Initialize headers if undefined
          }
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${newToken.access_token}`;

          return axiosInstance(originalRequest); // Retry the failed request with new token
        }
      } catch (refreshError) {
        // If the refresh token fails, log out the user
        useUserStore.getState().logout();
        return Promise.reject(refreshError); // Reject the original request
      }
    }

    // If error is not a 401 or 404, reject the error
    return Promise.reject(error);
  }
);

export default axiosInstance;
