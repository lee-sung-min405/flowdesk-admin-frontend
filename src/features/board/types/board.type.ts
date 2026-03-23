// 게시글 엔티티 (목록 — content 미포함)
export interface Post {
  postId: number;
  boardId: number;
  userSeq: number;
  title: string;
  isNotice: number;
  isActive: number;
  startDtm: string | null;
  endDtm: string | null;
  createdAt: string;
  updatedAt: string;
}

// 게시글 엔티티 (상세 — content 포함)
export interface PostDetail extends Post {
  content: string;
}

// 페이지네이션 정보 (currentPage/pageSize)
export interface PostPageInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// ── GET /boards/:boardId/posts (목록 조회)
export interface GetPostsRequest {
  boardId: number;
  page?: number;
  limit?: number;
}

export interface GetPostsResponse {
  items: Post[];
  pageInfo: PostPageInfo;
}

// ── POST /boards/:boardId/posts (생성)
export interface CreatePostRequest {
  title: string;
  content: string;
  isNotice?: number;
  startDtm?: string | null;
  endDtm?: string | null;
}

export type CreatePostResponse = PostDetail;

// ── GET /boards/:boardId/posts/:postId (상세 조회)
export type GetPostResponse = PostDetail;

// ── PATCH /boards/:boardId/posts/:postId (수정)
export interface UpdatePostRequest {
  title?: string;
  content?: string;
  isNotice?: number;
  isActive?: number;
  startDtm?: string | null;
  endDtm?: string | null;
}

export type UpdatePostResponse = PostDetail;

// ── DELETE /boards/:boardId/posts/:postId (소프트 삭제)
// Response 204: No content
