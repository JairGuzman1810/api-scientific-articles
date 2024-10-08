import { ApiResponse, Article } from "@/src/helpers/type";
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

export const getArticlesByUserId = async (
  user_id: string
): Promise<Article[]> => {
  // Make the API request
  const response = await axiosInstance.get<ApiResponse<Article[]>>(
    ARTICLE_API_ENDPOINTS.GET_ARTICLES_BY_USER(user_id)
  );

  // Return the array of articles from the response
  return response.data.data;
};
