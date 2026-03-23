// 매칭 타입
export type MatchType = 'EXACT' | 'CONTAINS' | 'REGEX';

// 금칙어 엔티티
export interface BlockWord {
  dbwIdx: number;
  tenantId: number;
  blockWord: string;
  matchType: MatchType;
  reason: string | null;
  isActive: number;
  createdBy: number | null;
  createdAt: string;
  updatedAt: string;
}

// ── GET /security/block-word (목록 조회)
export interface GetBlockWordsRequest {
  page?: number;
  limit?: number;
  q?: string;
  isActive?: 0 | 1;
  matchType?: MatchType;
}

export interface GetBlockWordsResponse {
  items: BlockWord[];
  pageInfo: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

// ── GET /security/block-word/:id (상세 조회)
export type GetBlockWordResponse = BlockWord;

// ── POST /security/block-word (등록)
export interface CreateBlockWordRequest {
  blockWord: string;
  matchType?: MatchType;
  reason?: string;
  isActive?: number;
}

export type CreateBlockWordResponse = BlockWord;

// ── POST /security/block-word/bulk (대량 등록)
export interface BulkCreateBlockWordRequest {
  words: string;
  matchType?: MatchType;
  reason?: string;
  isActive?: number;
}

export interface BulkCreateBlockWordResponse {
  successCount: number;
  skippedCount: number;
  totalCount: number;
  skippedWords: string[];
}

// ── PATCH /security/block-word/:id (수정)
export interface UpdateBlockWordRequest {
  matchType?: MatchType;
  reason?: string;
  isActive?: number;
}

export type UpdateBlockWordResponse = BlockWord;

// ── DELETE /security/block-word/:id (삭제)
// Response 204: No content

// ── GET /security/block-word/check (차단 여부 확인)
export interface CheckBlockWordRequest {
  text: string;
}
