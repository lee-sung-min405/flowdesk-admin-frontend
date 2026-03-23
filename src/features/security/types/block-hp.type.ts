// 휴대폰 차단 엔티티
export interface BlockHp {
  dbhIdx: number;
  tenantId: number;
  blockHp: string;
  reason: string | null;
  isActive: number;
  createdBy: number | null;
  createdAt: string;
  updatedAt: string;
}

// ── GET /security/block-hp (목록 조회)
export interface GetBlockHpsRequest {
  page?: number;
  limit?: number;
  q?: string;
  isActive?: 0 | 1;
}

export interface GetBlockHpsResponse {
  items: BlockHp[];
  pageInfo: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

// ── GET /security/block-hp/:id (상세 조회)
export type GetBlockHpResponse = BlockHp;

// ── POST /security/block-hp (등록)
export interface CreateBlockHpRequest {
  blockHp: string;
  reason?: string;
  isActive?: number;
}

export type CreateBlockHpResponse = BlockHp;

// ── POST /security/block-hp/bulk (대량 등록)
export interface BulkCreateBlockHpRequest {
  phones: string;
  reason?: string;
  isActive?: number;
}

export interface BulkCreateBlockHpResponse {
  successCount: number;
  skippedCount: number;
  totalCount: number;
  skippedPhones: string[];
}

// ── PATCH /security/block-hp/:id (수정)
export interface UpdateBlockHpRequest {
  reason?: string;
  isActive?: number;
}

export type UpdateBlockHpResponse = BlockHp;

// ── DELETE /security/block-hp/:id (삭제)
// Response 204: No content

// ── GET /security/block-hp/check (차단 여부 확인)
export interface CheckBlockHpRequest {
  hp: string;
}
