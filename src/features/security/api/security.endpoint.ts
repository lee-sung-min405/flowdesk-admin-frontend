export const SECURITY_ENDPOINTS = {
  // Block IP
  BLOCK_IP_LIST: '/security/block-ip',
  BLOCK_IP_CREATE: '/security/block-ip',
  BLOCK_IP_BULK_CREATE: '/security/block-ip/bulk',
  BLOCK_IP_DETAIL: (id: number) => `/security/block-ip/${id}`,
  BLOCK_IP_UPDATE: (id: number) => `/security/block-ip/${id}`,
  BLOCK_IP_DELETE: (id: number) => `/security/block-ip/${id}`,
  BLOCK_IP_CHECK: '/security/block-ip/check',

  // Block HP
  BLOCK_HP_LIST: '/security/block-hp',
  BLOCK_HP_CREATE: '/security/block-hp',
  BLOCK_HP_BULK_CREATE: '/security/block-hp/bulk',
  BLOCK_HP_DETAIL: (id: number) => `/security/block-hp/${id}`,
  BLOCK_HP_UPDATE: (id: number) => `/security/block-hp/${id}`,
  BLOCK_HP_DELETE: (id: number) => `/security/block-hp/${id}`,
  BLOCK_HP_CHECK: '/security/block-hp/check',

  // Block Word
  BLOCK_WORD_LIST: '/security/block-word',
  BLOCK_WORD_CREATE: '/security/block-word',
  BLOCK_WORD_BULK_CREATE: '/security/block-word/bulk',
  BLOCK_WORD_DETAIL: (id: number) => `/security/block-word/${id}`,
  BLOCK_WORD_UPDATE: (id: number) => `/security/block-word/${id}`,
  BLOCK_WORD_DELETE: (id: number) => `/security/block-word/${id}`,
  BLOCK_WORD_CHECK: '/security/block-word/check',
} as const;
