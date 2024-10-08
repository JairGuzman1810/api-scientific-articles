export type ApiResponse<T = any> = {
  data: T;
  status: string;
};

export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export type User = {
  first_name: string;
  id: number;
  last_name: string;
  username: string;
};

export type Auth = {
  tokens: Tokens;
  user: User;
};

export type Article = {
  abstract: string; // Abstract of the article
  authors: string; // JSON string representation of an array of authors
  doi: string; // DOI (Digital Object Identifier)
  id: number; // Unique identifier for the article
  journal: string; // Journal name
  keywords: string; // JSON string representation of an array of keywords
  pages: number | null; // Number of pages or null if not applicable
  publication_date: string; // Publication date in string format
  title: string; // Title of the article
  user_id: number; // ID of the user associated with the article
};
