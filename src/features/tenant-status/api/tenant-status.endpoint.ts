export const TENANT_STATUS_ENDPOINTS = {
  LIST: '/tenants/status',
  CREATE: '/tenants/status',
  DETAIL: (id: number) => `/tenants/status/${id}`,
  UPDATE: (id: number) => `/tenants/status/${id}`,
  DELETE: (id: number) => `/tenants/status/${id}`,
  ACTIVE: (id: number) => `/tenants/status/${id}/active`,
} as const;
