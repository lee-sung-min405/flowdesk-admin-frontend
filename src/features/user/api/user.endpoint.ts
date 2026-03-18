export const USER_ENDPOINTS = {
  LIST: '/users',
  CREATE: '/users',
  DETAIL: (id: number) => `/users/${id}`,
  UPDATE: (id: number) => `/users/${id}`,
  STATUS: (id: number) => `/users/${id}/status`,
  PASSWORD: (id: number) => `/users/${id}/password`,
  INVALIDATE_TOKENS: (id: number) => `/users/${id}/invalidate-tokens`,
  ROLES: (id: number) => `/users/${id}/roles`,
} as const;
