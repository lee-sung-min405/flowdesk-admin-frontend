// 페이지 목록 아이템 (GET /permissions/admin/pages)
export interface AdminPageListItem {
  pageId: number;
  parentId: number | null;
  pageName: string;
  path: string;
  displayName: string;
  description: string | null;
  isActive: number;
  sortOrder: number | null;
  childCount: number;
  permissionCount: number;
  parent: {
    pageId: number;
    pageName: string;
    displayName: string;
  } | null;
}

// 페이지 하위 항목 (상세 조회 응답 내)
export interface AdminPageChild {
  pageId: number;
  pageName: string;
  path: string;
  displayName: string;
  description: string | null;
  isActive: number;
  sortOrder: number | null;
}

// 페이지 상세 응답 (GET/POST/PATCH 공통)
export interface AdminPageResponse {
  pageId: number;
  parentId: number | null;
  pageName: string;
  path: string;
  displayName: string;
  description: string | null;
  isActive: number;
  sortOrder: number | null;
  createdAt: string;
  updatedAt: string;
  children: AdminPageChild[];
}

// ── GET /permissions/admin/pages (목록 조회)
export interface GetAdminPagesRequest {
  page?: number;
  limit?: number;
  q?: string;
  parentId?: string;
  isActive?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

export interface GetAdminPagesResponse {
  items: AdminPageListItem[];
  pageInfo: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

// ── POST /permissions/admin/pages (생성)
export interface CreateAdminPageRequest {
  pageName: string;
  path: string;
  displayName: string;
  description?: string | null;
  parentId?: number | null;
  sortOrder?: number | null;
  isActive?: number;
}

export type CreateAdminPageResponse = AdminPageResponse;

// ── PATCH /permissions/admin/pages/:id (수정)
export interface UpdateAdminPageRequest {
  pageName?: string;
  path?: string;
  displayName?: string;
  description?: string | null;
  parentId?: number | null;
  sortOrder?: number | null;
  isActive?: number;
}

export type UpdateAdminPageResponse = AdminPageResponse;

// ── PATCH /permissions/admin/pages/:id/status (상태 변경)
export interface UpdateAdminPageStatusRequest {
  isActive: number;
}

export type UpdateAdminPageStatusResponse = AdminPageResponse;
