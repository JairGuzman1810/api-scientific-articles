import { Auth } from "@/src/helpers/type"; // Import the Auth type
import {
  useMutation,
  useQueryClient,
  useQueryErrorResetBoundary,
} from "@tanstack/react-query";
import { Alert } from "react-native";
import { login } from "../api/users/api"; // Import the login function
import useAuth from "./useAuth"; // Use your auth context or provider

export const useLogin = () => {
  const { reset } = useQueryErrorResetBoundary(); // Reset error boundary
  const { handleLogin } = useAuth(); // Use your auth context
  const queryClient = useQueryClient(); // Initialize query client

  return useMutation<Auth, any, { username: string; password: string }>({
    mutationFn: async ({ username, password }) => {
      try {
        const result = await login(username, password); // Call the login function with username and password
        return result; // Return the result from the login function
      } catch (error) {
        throw error; // Rethrow the error for handling
      }
    },
    onSuccess: async (data) => {
      // Upon successful login
      await queryClient.invalidateQueries({ queryKey: ["user"] }); // Invalidate user data
      handleLogin(data); // Handle login (e.g., set user context)
    },
    onError: async (error: any) => {
      // Resetting error handling state
      reset();

      // Handling various error scenarios
      if (error.response) {
        if (error.response.status === 401) {
          Alert.alert(
            "Login Failed",
            "The user does not exist or the password is incorrect."
          );
        } else if (error.response.status === 500) {
          Alert.alert(
            "Error",
            "An unexpected error occurred. Please try again later."
          );
        } else {
          Alert.alert("Error", "An error occurred. Please try again.");
        }
      } else if (error.request) {
        Alert.alert("Network Error", "Please check your internet connection.");
      } else {
        Alert.alert("Unexpected Error", "An unexpected error occurred.");
      }
    },
  });
};
