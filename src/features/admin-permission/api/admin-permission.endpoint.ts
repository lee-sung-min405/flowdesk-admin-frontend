export const ADMIN_PERMISSION_ENDPOINTS = {
  LIST: '/permissions/admin/permissions',
  CREATE: '/permissions/admin/permissions',
  DETAIL: (id: number) => `/permissions/admin/permissions/${id}`,
  UPDATE: (id: number) => `/permissions/admin/permissions/${id}`,
  STATUS: (id: number) => `/permissions/admin/permissions/${id}/status`,
  DELETE: (id: number) => `/permissions/admin/permissions/${id}`,
} as const;
