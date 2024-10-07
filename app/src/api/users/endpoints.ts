export const USER_API_ENDPOINTS = {
  LOGIN: "/api/users/login",
  REGISTER: "/api/users/register",
  TOKEN: "/api/users/token",
  DELETE: (id: string) => `/api/users/${id}`,
  UPDATE: (id: string) => `/api/users/${id}`,
  UPDATE_PASSWORD: (id: string) => `/api/users/${id}/password`,
};
