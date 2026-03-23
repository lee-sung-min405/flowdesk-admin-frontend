// 테넌트 커스텀 상태 엔티티
export interface TenantStatus {
  tenantStatusId: number;
  statusGroup: string;
  statusKey: string;
  statusName: string;
  description: string;
  color: string;
  sortOrder: number;
  isActive: number;
  createdAt: string;
  updatedAt: string;
}

// 상태 그룹 (그룹핑된 응답 단위)
export interface TenantStatusGroup {
  statusGroup: string;
  count: number;
  items: TenantStatus[];
}

// ── GET /tenants/status (목록 조회)
export interface GetTenantStatusesRequest {
  statusGroup?: string;
  isActive?: 0 | 1;
  q?: string;
}

export interface GetTenantStatusesResponse {
  groups: TenantStatusGroup[];
  total: number;
}

// ── POST /tenants/status (생성)
export interface CreateTenantStatusRequest {
  statusGroup: string;
  statusKey: string;
  statusName: string;
  description?: string;
  color: string;
  sortOrder?: number;
  isActive?: number;
}

export type CreateTenantStatusResponse = TenantStatus;

// ── GET /tenants/status/{id} (상세 조회)
export type GetTenantStatusResponse = TenantStatus;

// ── PATCH /tenants/status/{id} (수정)
export interface UpdateTenantStatusRequest {
  statusName?: string;
  description?: string;
  color?: string;
  sortOrder?: number;
}

export type UpdateTenantStatusResponse = TenantStatus;

// ── PATCH /tenants/status/{id}/active (활성화/비활성화)
export interface UpdateTenantStatusActiveRequest {
  isActive: 0 | 1;
}

export type UpdateTenantStatusActiveResponse = TenantStatus;

// ── DELETE /tenants/status/{id} (삭제)
// Response 204: No content
