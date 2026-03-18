import type { Role } from '@features/role';

// 사용자 엔티티
export interface User {
  userSeq: number;
  tenantId: number;
  userId: string;
  userName: string;
  userEmail: string;
  userTel: string | null;
  userHp: string | null;
  corpName: string;
  isActive: number;
  regDtm: string;
  stopDtm: string | null;
}

// ── GET /users (목록 조회)
export interface GetUsersRequest {
  page?: number;
  limit?: number;
  q?: string;
  isActive?: 0 | 1;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GetUsersResponse {
  items: User[];
  pageInfo: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

// ── POST /users (생성)
export interface CreateUserRequest {
  userId: string;
  password: string;
  userName: string;
  userEmail: string;
  userTel?: string;
  userHp?: string;
  corpName: string;
  roleIds?: number[];
}

export type CreateUserResponse = User;

// ── GET /users/{id} (상세 조회)
export interface GetUserResponse extends User {
  assignedRoleIds: number[];
  availableRoles: Role[];
}

// ── PATCH /users/{id} (수정)
export interface UpdateUserRequest {
  userName?: string;
  userEmail?: string;
  userTel?: string;
  userHp?: string;
  corpName?: string;
  roleIds?: number[];
}

export type UpdateUserResponse = GetUserResponse;

// ── PATCH /users/{id}/status (상태 변경)
export interface UpdateUserStatusRequest {
  isActive: 0 | 1;
}

export interface UpdateUserStatusResponse {
  userSeq: number;
  isActive: number;
}

// ── PATCH /users/{id}/password (비밀번호 초기화)
export interface ResetUserPasswordRequest {
  newPassword: string;
}
// → 204 No Content (void)

// ── POST /users/{id}/invalidate-tokens (강제 로그아웃)
// Request: body 없음
// → 204 No Content (void)

// ── PATCH /users/{id}/roles (역할 변경)
export interface UpdateUserRolesRequest {
  add?: number[];
  remove?: number[];
}

export interface UpdateUserRolesResponse {
  userSeq: number;
  assignedRoleIds: number[];
}
