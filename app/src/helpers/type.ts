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
