// 게시판(타입) 엔티티
export interface BoardType {
  boardId: number;
  boardKey: string;
  name: string;
  description: string | null;
  isActive: number;
  sortOrder: number | null;
  createdAt: string;
  updatedAt: string;
}

// ── GET /boards (목록 조회 — 페이지네이션 없음)
export interface GetBoardTypesResponse {
  items: BoardType[];
}

// ── POST /boards (생성)
export interface CreateBoardTypeRequest {
  boardKey: string;
  name: string;
  description?: string;
  sortOrder?: number;
}

export type CreateBoardTypeResponse = BoardType;

// ── GET /boards/:boardId (상세 조회)
export type GetBoardTypeResponse = BoardType;

// ── PATCH /boards/:boardId (수정)
export interface UpdateBoardTypeRequest {
  name?: string;
  description?: string | null;
  sortOrder?: number;
  isActive?: number;
}

export type UpdateBoardTypeResponse = BoardType;

// ── DELETE /boards/:boardId (비활성화)
// Response 204: No content
