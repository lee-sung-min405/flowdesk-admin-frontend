export const ADMIN_PAGE_ENDPOINTS = {
  LIST: '/permissions/admin/pages',
  CREATE: '/permissions/admin/pages',
  DETAIL: (id: number) => `/permissions/admin/pages/${id}`,
  UPDATE: (id: number) => `/permissions/admin/pages/${id}`,
  STATUS: (id: number) => `/permissions/admin/pages/${id}/status`,
  DELETE: (id: number) => `/permissions/admin/pages/${id}`,
} as const;
