export const TENANT_ENDPOINTS = {
  LIST: '/tenants',
  CREATE: '/tenants',
  DETAIL: (id: number) => `/tenants/${id}`,
  UPDATE: (id: number) => `/tenants/${id}`,
  DELETE: (id: number) => `/tenants/${id}`,
  STATUS: (id: number) => `/tenants/${id}/status`,
} as const;
