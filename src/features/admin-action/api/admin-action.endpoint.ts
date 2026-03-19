export const ADMIN_ACTION_ENDPOINTS = {
  LIST: '/permissions/admin/actions',
  CREATE: '/permissions/admin/actions',
  DETAIL: (id: number) => `/permissions/admin/actions/${id}`,
  UPDATE: (id: number) => `/permissions/admin/actions/${id}`,
  STATUS: (id: number) => `/permissions/admin/actions/${id}/status`,
  DELETE: (id: number) => `/permissions/admin/actions/${id}`,
} as const;
