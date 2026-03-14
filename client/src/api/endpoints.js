export const AUTH_ENDPOINTS = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
};

export const TASK_ENDPOINTS = {
  GET_ALL: "/tasks",
  CREATE: "/tasks",
  UPDATE: (id) => `/tasks/${id}`,
  DELETE: (id) => `/tasks/${id}`,
};
