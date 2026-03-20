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
  sort?: string;
  order?: 'ASC' | 'DESC';
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

// ── GET /roles/:id (역할 상세)
export interface RolePermission {
  permissionId: number;
  displayName: string;
  description: string | null;
  actionId: number;
  actionName: string;
  actionDisplayName: string;
}

export interface RolePermissionsByPage {
  pageId: number;
  pageName: string;
  pageDisplayName: string;
  permissions: RolePermission[];
}

export interface RoleAssignedUser {
  userSeq: number;
  userId: string;
  userName: string;
  email: string;
  isActive: number;
  assignedAt: string;
}

export interface RoleDetailResponse extends Omit<Role, 'userCount' | 'permissionCount'> {
  permissionsByPage: RolePermissionsByPage[];
  assignedUsers: RoleAssignedUser[];
}

// ── POST /roles (역할 생성)
export interface CreateRoleRequest {
  roleName: string;
  displayName: string;
  description?: string;
}

export type CreateRoleResponse = Omit<Role, 'userCount' | 'permissionCount'>;

// ── PATCH /roles/:id (역할 수정)
export interface UpdateRoleRequest {
  roleName?: string;
  displayName?: string;
  description?: string;
}

export type UpdateRoleResponse = Omit<Role, 'userCount' | 'permissionCount'>;

// ── PATCH /roles/:id/status (역할 상태 변경)
export interface UpdateRoleStatusRequest {
  isActive: number;
}

export type UpdateRoleStatusResponse = Omit<Role, 'userCount' | 'permissionCount'>;

// ── PUT /roles/:id/permissions (권한 복사)
export interface CopyRolePermissionsRequest {
  sourceRoleId: number;
}

export type CopyRolePermissionsResponse = RoleDetailResponse;

// ── PATCH /roles/:id/permissions (권한 수정)
export interface UpdateRolePermissionsRequest {
  add?: number[];
  remove?: number[];
}

export interface UpdateRolePermissionsResponse {
  added: number[];
  removed: number[];
  alreadyExists: number[];
  notFound: number[];
  totalCount: number;
}
