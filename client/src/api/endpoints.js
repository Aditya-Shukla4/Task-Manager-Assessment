export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  ME: "/auth/me", // 👈 add this line
};

export const TASK_ENDPOINTS = {
  GET_ALL: "/tasks",
  CREATE: "/tasks",
  UPDATE: (id) => `/tasks/${id}`,
  DELETE: (id) => `/tasks/${id}`,
};
