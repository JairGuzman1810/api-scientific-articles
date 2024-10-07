import axios from "axios";
import { useUserStore } from "../store/auth"; // Import Zustand store
import { USER_API_ENDPOINTS } from "./users/endpoints";

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
  async (error) => {
    const { config, response } = error;
    const originalRequest = config; // The original request that failed
    const auth = useUserStore.getState().auth; // Access auth state directly

    if (
      response?.status === 401 &&
      originalRequest.url !== USER_API_ENDPOINTS.LOGIN
    ) {
      try {
        // Try to refresh the access token using the refresh token
        const newTokens = await refreshAccessToken(
          auth?.tokens?.refresh_token || ""
        );

        // Update the tokens in the Zustand store
        useUserStore.getState().login({
          tokens: newTokens, // Replace old tokens with new ones
          user: auth?.user!, // Pass the existing user object, ensure it exists
        });

        // Retry the original request with the new access token
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${newTokens.access_token}`;

        return axiosInstance(originalRequest); // Retry the failed request with new token
      } catch (refreshError) {
        // If refresh token fails, log out the user
        useUserStore.getState().logout();
        return Promise.reject(refreshError); // Reject the original request
      }
    }

    // If error is not a 401 or it's a login error, reject the error
    return Promise.reject(error);
  }
);

export default axiosInstance;
