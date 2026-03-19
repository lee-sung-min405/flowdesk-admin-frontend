// 액션 목록 아이템 (GET /permissions/admin/actions)
export interface AdminActionListItem {
  actionId: number;
  actionName: string;
  displayName: string | null;
  isActive: number;
  permissionCount: number;
}

// 액션 상세 응답 (GET/POST/PATCH 공통)
export interface AdminActionResponse {
  actionId: number;
  actionName: string;
  displayName: string | null;
  isActive: number;
  createdAt: string;
  updatedAt: string;
}

// ── GET /permissions/admin/actions (목록 조회)
export interface GetAdminActionsRequest {
  page?: number;
  limit?: number;
  q?: string;
  isActive?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

export interface GetAdminActionsResponse {
  items: AdminActionListItem[];
  pageInfo: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

// ── POST /permissions/admin/actions (생성)
export interface CreateAdminActionRequest {
  actionName: string;
  displayName?: string | null;
  isActive?: number;
}

export type CreateAdminActionResponse = AdminActionResponse;

// ── PATCH /permissions/admin/actions/:id (수정)
export interface UpdateAdminActionRequest {
  actionName?: string;
  displayName?: string | null;
  isActive?: number;
}

export type UpdateAdminActionResponse = AdminActionResponse;

// ── PATCH /permissions/admin/actions/:id/status (상태 변경)
export interface UpdateAdminActionStatusRequest {
  isActive: number;
}

export type UpdateAdminActionStatusResponse = AdminActionResponse;
