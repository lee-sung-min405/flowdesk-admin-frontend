// IP 차단 엔티티
export interface BlockIp {
  dbiIdx: number;
  tenantId: number;
  blockIp: string;
  reason: string | null;
  isActive: number;
  createdBy: number | null;
  createdAt: string;
  updatedAt: string;
}

// ── 공통 페이지네이션
export interface SecurityPageInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// ── GET /security/block-ip (목록 조회)
export interface GetBlockIpsRequest {
  page?: number;
  limit?: number;
  q?: string;
  isActive?: 0 | 1;
}

export interface GetBlockIpsResponse {
  items: BlockIp[];
  pageInfo: SecurityPageInfo;
}

// ── GET /security/block-ip/:id (상세 조회)
export type GetBlockIpResponse = BlockIp;

// ── POST /security/block-ip (등록)
export interface CreateBlockIpRequest {
  blockIp: string;
  reason?: string;
  isActive?: number;
}

export type CreateBlockIpResponse = BlockIp;

// ── POST /security/block-ip/bulk (대량 등록)
export interface BulkCreateBlockIpRequest {
  ips: string;
  reason?: string;
  isActive?: number;
}

export interface BulkCreateBlockIpResponse {
  successCount: number;
  skippedCount: number;
  totalCount: number;
  skippedIps: string[];
}

// ── PATCH /security/block-ip/:id (수정)
export interface UpdateBlockIpRequest {
  reason?: string;
  isActive?: number;
}

export type UpdateBlockIpResponse = BlockIp;

// ── DELETE /security/block-ip/:id (삭제)
// Response 204: No content

// ── GET /security/block-ip/check (차단 여부 확인)
export interface CheckBlockIpRequest {
  ip: string;
}

export interface CheckBlockedResponse {
  isBlocked: boolean;
  reason?: string | null;
  blockId?: number;
  matchedWord?: string;
}
