export const COUNSEL_ENDPOINTS = {
  DASHBOARD: '/counsels/dashboard',
  LIST: '/counsels',
  DETAIL: (id: number) => `/counsels/${id}`,
  UPDATE: (id: number) => `/counsels/${id}`,
  DELETE: (id: number) => `/counsels/${id}`,
  STATUS: (id: number) => `/counsels/${id}/status`,
  LOGS: (id: number) => `/counsels/${id}/logs`,
  MEMO: (id: number) => `/counsels/${id}/memo`,
} as const;
