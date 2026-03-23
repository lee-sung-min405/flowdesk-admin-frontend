export const WEBSITE_ENDPOINTS = {
  LIST: '/websites',
  CREATE: '/websites',
  DETAIL: (webCode: string) => `/websites/${webCode}`,
  UPDATE: (webCode: string) => `/websites/${webCode}`,
  DELETE: (webCode: string) => `/websites/${webCode}`,
  STATUS: (webCode: string) => `/websites/${webCode}/status`,
} as const;
