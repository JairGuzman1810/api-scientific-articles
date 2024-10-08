import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import {
  createArticle,
  getArticleById,
  getArticlesByUserId,
  updateArticle,
} from "../api/articles/api"; // Import the createArticle function
import { Article } from "../helpers/type";

export const useCreateArticle = () => {
  const queryClient = useQueryClient(); // Initialize query client

  return useMutation<
    void,
    any,
    {
      title: string;
      authors: string;
      publication_date: string;
      keywords: string;
      abstract: string;
      journal: string;
      doi: string;
      pages: number | null;
      user_id: number;
    }
  >({
    mutationFn: async ({
      title,
      authors,
      publication_date,
      keywords,
      abstract,
      journal,
      doi,
      pages,
      user_id,
    }) => {
      await createArticle(
        title,
        authors,
        publication_date,
        keywords,
        abstract,
        journal,
        doi,
        pages,
        user_id
      );
    },
    onSuccess: async () => {
      // Upon successful creation of the article
      await queryClient.invalidateQueries({ queryKey: ["articles"] }); // Invalidate articles data
    },
    onError: async (error: any) => {
      // Handling various error scenarios
      if (error.response) {
        if (error.response.status === 401) {
          Alert.alert(
            "Session Expired",
            "Your session has expired. Please log in again." // Session expired message
          );
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

// Hook to fetch articles by user ID
export const useArticlesByUserId = (user_id: string) => {
  return useQuery<Article[], Error>({
    queryKey: ["articles", user_id], // Unique query key for articles based on user ID
    queryFn: async () => {
      const articles = await getArticlesByUserId(user_id); // Fetch articles using the API function
      return articles;
    },
    enabled: !!user_id, // Only run the query if `user_id` is provided
  });
};

export const useArticleById = (article_id: string) => {
  return useQuery<Article, Error>({
    queryKey: ["article", article_id], // Unique query key for articles based on user ID
    queryFn: async () => {
      const articles = await getArticleById(article_id); // Fetch articles using the API function
      return articles;
    },
    enabled: !!article_id, // Only run the query if `user_id` is provided
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient(); // Initialize query client

  return useMutation<
    void,
    any,
    {
      title: string;
      authors: string;
      publication_date: string;
      keywords: string;
      abstract: string;
      journal: string;
      doi: string;
      pages: number | null;
      article_id: number;
    }
  >({
    mutationFn: async ({
      title,
      authors,
      publication_date,
      keywords,
      abstract,
      journal,
      doi,
      pages,
      article_id,
    }) => {
      await updateArticle(
        title,
        authors,
        publication_date,
        keywords,
        abstract,
        journal,
        doi,
        pages,
        article_id
      );
    },
    onSuccess: async (data, { article_id }) => {
      // Upon successful update of the article
      await queryClient.invalidateQueries({ queryKey: ["articles"] }); // Invalidate articles data
      await queryClient.invalidateQueries({
        queryKey: ["article", article_id],
      }); // Invalidate articles data
    },
    onError: async (error: any) => {
      // Handling various error scenarios
      if (error.response) {
        if (error.response.status === 401) {
          Alert.alert(
            "Session Expired",
            "Your session has expired. Please log in again." // Session expired message
          );
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
