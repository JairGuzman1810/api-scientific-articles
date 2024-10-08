import { Auth } from "@/src/helpers/type"; // Import the Auth type
import {
  useMutation,
  useQueryClient,
  useQueryErrorResetBoundary,
} from "@tanstack/react-query";
import { Alert } from "react-native";
import {
  login,
  register,
  updateUser,
  updateUserPassword,
} from "../api/users/api"; // Import the login function
import useAuth from "./useAuth"; // Use your auth context or provider

export const useLogin = () => {
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

export const useRegister = () => {
  const { reset } = useQueryErrorResetBoundary(); // Reset error boundary
  const { handleLogin } = useAuth(); // Use your auth context
  const queryClient = useQueryClient(); // Initialize query client

  return useMutation<
    Auth,
    any,
    {
      first_name: string;
      last_name: string;
      username: string;
      password: string;
    }
  >({
    mutationFn: async ({ first_name, last_name, username, password }) => {
      try {
        const result = await register(
          first_name,
          last_name,
          username,
          password
        ); // Call the register function
        return result; // Return the result from the register function
      } catch (error) {
        throw error; // Rethrow the error for handling
      }
    },
    onSuccess: async (data) => {
      // Upon successful registration
      await queryClient.invalidateQueries({ queryKey: ["user"] }); // Invalidate user data
      handleLogin(data); // Handle login (e.g., set user context)
    },
    onError: async (error: any) => {
      // Resetting error handling state
      reset();

      // Handling various error scenarios
      if (error.response) {
        if (error.response.status === 409) {
          Alert.alert(
            "Registration Failed",
            "The email address is already in use. Please use a different email."
          ); // Handling email already exists
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

export const useUpdateUser = () => {
  const queryClient = useQueryClient(); // Initialize query client
  const { handleLogin, auth } = useAuth();

  return useMutation<
    void,
    any,
    {
      userId: string;
      first_name: string;
      last_name: string;
      username: string;
    }
  >({
    mutationFn: async ({ userId, first_name, last_name, username }) => {
      try {
        await updateUser(userId, first_name, last_name, username); // Call the update function
      } catch (error) {
        throw error; // Rethrow the error for handling
      }
    },
    onSuccess: async (data, { first_name, last_name, username }) => {
      // Upon successful update
      await queryClient.invalidateQueries({ queryKey: ["user"] }); // Invalidate user data
      // Update the user fields in auth context
      handleLogin({
        ...auth, // Preserve existing auth data
        user: {
          ...auth?.user, // Preserve existing user data
          first_name, // Update only the fields that have changed
          last_name,
          username,
        },
        tokens: auth?.tokens, // Ensure tokens are included
      } as Auth); // Cast to Auth to satisfy TypeScript
    },
    onError: async (error: any) => {
      // Handling various error scenarios
      if (error.response) {
        if (error.response.status === 401) {
          Alert.alert(
            "Session Expired",
            "Your session has expired. Please log in again."
          );
        } else if (error.response.status === 409) {
          Alert.alert(
            "Update Failed",
            "The username is already taken by another user. Please choose a different username."
          ); // Handling username conflict
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

export const useUpdatePassword = () => {
  const queryClient = useQueryClient(); // Initialize query client

  return useMutation<
    void,
    any,
    { id: string; new_password: string; old_password: string }
  >({
    mutationFn: async ({ id, new_password, old_password }) => {
      try {
        await updateUserPassword(id, new_password, old_password); // Call the update password function
      } catch (error) {
        throw error; // Rethrow the error for handling
      }
    },
    onSuccess: async () => {
      // Upon successful password update
      await queryClient.invalidateQueries({ queryKey: ["user"] }); // Invalidate user data
      Alert.alert("Success", "Your password has been updated successfully."); // Show success message
    },
    onError: async (error: any) => {
      // Handling various error scenarios
      if (error.response) {
        if (error.response.status === 401) {
          // Check if the error message indicates that the token is invalid or expired
          if (
            error.response.data.message ===
            "The token provided is invalid or expired."
          ) {
            Alert.alert(
              "Session Expired",
              "Your session has expired. Please log in again."
            );
          } else {
            Alert.alert(
              "Update Failed",
              "The old password is incorrect. Please try again."
            ); // Handling incorrect old password
          }
        } else if (error.response.status === 500) {
          Alert.alert(
            "Error",
            "An unexpected error occurred. Please try again later."
          ); // Handling internal server error
        } else {
          Alert.alert("Error", "An error occurred. Please try again.");
        }
      } else if (error.request) {
        Alert.alert("Network Error", "Please check your internet connection."); // Handling network error
      } else {
        Alert.alert("Unexpected Error", "An unexpected error occurred."); // Handling unexpected errors
      }
    },
  });
};
