// 역할 엔티티
export interface Role {
  roleId: number;
  roleName: string;
  displayName: string;
  description: string | null;
  isActive: number;
  createdAt: string;
  updatedAt: string;
  tenantId: number;
  userCount: number;
  permissionCount: number;
}

// ── GET /roles (역할 목록 조회)
export interface GetRolesRequest {
  page?: number;
  limit?: number;
  q?: string;
  isActive?: 0 | 1;
}

export interface GetRolesResponse {
  items: Role[];
  pageInfo: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
