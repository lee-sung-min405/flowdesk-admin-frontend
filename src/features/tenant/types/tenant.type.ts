// 테넌트 엔티티
export interface Tenant {
  tenantId: number;
  tenantName: string;
  displayName: string;
  domain: string;
  isActive: number;
  createdAt: string;
  updatedAt: string;
  userCount: number;
}

// ── GET /tenants (목록 조회)
export interface GetTenantsRequest {
  page?: number;
  limit?: number;
  q?: string;
  isActive?: 0 | 1;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

export interface GetTenantsResponse {
  items: Tenant[];
  pageInfo: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

// ── POST /tenants (생성)
export interface CreateTenantRequest {
  tenantName: string;
  displayName: string;
  domain: string;
  isActive?: number;
}

export type CreateTenantResponse = Tenant;

// ── GET /tenants/{id} (상세 조회)
export type GetTenantResponse = Omit<Tenant, 'userCount'>;

// ── PATCH /tenants/{id} (수정)
export interface UpdateTenantRequest {
  tenantName?: string;
  displayName?: string;
  domain?: string;
  isActive?: number;
}

export type UpdateTenantResponse = GetTenantResponse;

// ── DELETE /tenants/{id} (삭제)
// Response 204: No content

// ── PATCH /tenants/{id}/status (상태 변경)
export interface UpdateTenantStatusRequest {
  isActive: 0 | 1;
}

export type UpdateTenantStatusResponse = GetTenantResponse;
