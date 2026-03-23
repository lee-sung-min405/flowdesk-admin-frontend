export const BOARD_TYPE_ENDPOINTS = {
  LIST: '/boards',
  CREATE: '/boards',
  DETAIL: (boardId: number) => `/boards/${boardId}`,
  UPDATE: (boardId: number) => `/boards/${boardId}`,
  DELETE: (boardId: number) => `/boards/${boardId}`,
} as const;
