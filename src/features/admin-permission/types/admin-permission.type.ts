// 권한 목록 아이템 (GET /permissions/admin/permissions)
export interface AdminPermissionListItem {
  permissionId: number;
  pageId: number;
  actionId: number;
  displayName: string | null;
  description: string | null;
  isActive: number;
  page: {
    pageId: number;
    pageName: string;
    displayName: string;
  } | null;
  action: {
    actionId: number;
    actionName: string;
    displayName: string;
  } | null;
}

// 권한 상세 응답 (GET/POST/PATCH 공통)
export interface AdminPermissionResponse {
  permissionId: number;
  pageId: number;
  actionId: number;
  displayName: string | null;
  description: string | null;
  isActive: number;
  createdAt: string;
  updatedAt: string;
  page: {
    pageId: number;
    pageName: string;
    displayName: string;
  };
  action: {
    actionId: number;
    actionName: string;
    displayName: string;
  };
}

// ── GET /permissions/admin/permissions (목록 조회)
export interface GetAdminPermissionsRequest {
  page?: number;
  limit?: number;
  q?: string;
  pageId?: number;
  actionId?: number;
  isActive?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

export interface GetAdminPermissionsResponse {
  items: AdminPermissionListItem[];
  pageInfo: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

// ── POST /permissions/admin/permissions (생성)
export interface CreateAdminPermissionRequest {
  pageId: number;
  actionId: number;
  displayName?: string | null;
  description?: string | null;
  isActive?: number;
}

export type CreateAdminPermissionResponse = AdminPermissionResponse;

// ── PATCH /permissions/admin/permissions/:id (수정)
export interface UpdateAdminPermissionRequest {
  pageId?: number;
  actionId?: number;
  displayName?: string | null;
  description?: string | null;
  isActive?: number;
}

export type UpdateAdminPermissionResponse = AdminPermissionResponse;

// ── PATCH /permissions/admin/permissions/:id/status (상태 변경)
export interface UpdateAdminPermissionStatusRequest {
  isActive: number;
}

export type UpdateAdminPermissionStatusResponse = AdminPermissionResponse;
