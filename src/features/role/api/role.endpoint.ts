export const ROLE_ENDPOINTS = {
  LIST: '/roles',
  CREATE: '/roles',
  DETAIL: (id: number) => `/roles/${id}`,
  UPDATE: (id: number) => `/roles/${id}`,
  STATUS: (id: number) => `/roles/${id}/status`,
  DELETE: (id: number) => `/roles/${id}`,
  PERMISSIONS: (id: number) => `/roles/${id}/permissions`,
  COPY_PERMISSIONS: (id: number) => `/roles/${id}/permissions`,
} as const;
