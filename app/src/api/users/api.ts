import { ApiResponse, Auth } from "@/src/helpers/type";
import axiosInstance from "../axiosConfig";
import { USER_API_ENDPOINTS } from "./endpoints";

export const login = async (
  username: string,
  password: string
): Promise<Auth> => {
  const payload = {
    username,
    password,
  };

  // Make the API request and expect ApiResponse containing tokens and user
  const response = await axiosInstance.post<ApiResponse>(
    USER_API_ENDPOINTS.LOGIN,
    payload
  );

  // Extract tokens and user from the response data
  const { tokens, user } = response.data.data;

  // Return the Auth object containing both tokens and user
  return {
    tokens,
    user,
  };
};
