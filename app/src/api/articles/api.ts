import { ApiResponse } from "@/src/helpers/type";
import axiosInstance from "../axiosConfig";
import { ARTICLE_API_ENDPOINTS } from "./endpoints";

// Function to create a new article
// Function to create a new article
export const createArticle = async (
  title: string,
  authors: string,
  publication_date: string,
  keywords: string,
  abstract: string,
  journal: string,
  doi: string,
  pages: number | null,
  user_id: number
): Promise<void> => {
  // Keep the return type as void
  const payload = {
    title,
    authors: authors.split(",").map((author) => author.trim()), // Convert string to array of strings
    publication_date,
    keywords: keywords.split(",").map((keyword) => keyword.trim()), // Convert string to array of strings
    abstract,
    journal,
    doi,
    pages,
    user_id,
  };

  // Make the API request to create the article
  await axiosInstance.post<ApiResponse>(ARTICLE_API_ENDPOINTS.CREATE, payload);
};
