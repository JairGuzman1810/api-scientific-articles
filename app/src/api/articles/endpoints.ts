export const ARTICLE_API_ENDPOINTS = {
  CREATE: "/api/articles",
  GET_ARTICLES_BY_USER: (user_id: string) => `/api/articles/user/${user_id}`,
};
