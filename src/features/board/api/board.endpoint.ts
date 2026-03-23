export const BOARD_ENDPOINTS = {
  POSTS: (boardId: number) => `/boards/${boardId}/posts`,
  POST_CREATE: (boardId: number) => `/boards/${boardId}/posts`,
  POST_DETAIL: (boardId: number, postId: number) => `/boards/${boardId}/posts/${postId}`,
  POST_UPDATE: (boardId: number, postId: number) => `/boards/${boardId}/posts/${postId}`,
  POST_DELETE: (boardId: number, postId: number) => `/boards/${boardId}/posts/${postId}`,
} as const;
