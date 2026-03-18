// me API 응답 타입
export interface MeResponse {
  user: {
    userSeq: number;
    tenantId: number;
    tenantName: string;
    userId: string;
    userName: string;
    corpName: string;
    userEmail: string;
    userTel: string;
    userHp: string;
    isActive: number;
    regDtm: string;
    tokenVersion: number;
  };
  roles: string[];
  permissions: Record<string, boolean>;
  menuTree: MenuTree[];
}

export interface MenuTree {
  pageName: string;
  displayName: string;
  path: string;
  order: number;
  children: MenuTree[];
}

// 로그인 요청 타입
export interface LoginRequest {
  tenantName: string;
  userId: string;
  password: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  accessToken: string;
  expiresIn: string;
  user: {
    userSeq: number;
    userId: string;
    corpName: string;
    userName: string;
    userEmail: string;
    userTel: string;
    userHp: string;
    isActive: number;
    regDtm: string;
    stopDtm: string | null;
    tenantId: number;
  };
  refreshToken: string;
  refreshExpiresAt: string;
}

// 리프레시 토큰 요청/응답 타입 (refresh.api.ts에서 import)
export type RefreshTokenRequest = {
  refreshToken: string;
};

export type RefreshTokenResponse = Pick<
  LoginResponse,
  'accessToken' | 'expiresIn' | 'refreshToken' | 'refreshExpiresAt'
>;

// 로그아웃 요청/응답 타입
export interface LogoutRequest {
  refreshToken: string;
}

export interface LogoutResponse {
  ok: boolean;
}

// 권한 관련 타입
export type PermissionAction = 'read' | 'create' | 'update' | 'delete';
export type Permissions = Record<string, boolean>;

// 회원가입 요청 타입
export interface SignupRequest {
  companyName: string;
  adminName: string;
  email: string;
  phone: string;
  password: string;
}

// 회원가입 응답 타입
export interface SignupResponse {
  message: string;
  tenant: {
    tenantId: number;
    tenantName: string;
  };
  admin: {
    userSeq: number;
    userId: string;
    userName: string;
  };
}

// 전체 로그아웃 응답 타입
export interface LogoutAllResponse {
  ok: boolean;
}

// 비밀번호 변경 요청 타입
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 프로필 수정 요청 타입
export interface UpdateProfileRequest {
  corpName?: string;
  userName?: string;
  userEmail?: string;
  userTel?: string;
  userHp?: string;
}

// 프로필 수정 응답 타입
export type UpdateProfileResponse = LoginResponse['user'];

// useMe 훅 반환 타입
export interface UseMeReturn {
  me: MeResponse | null;
  menuTree: MenuTree[];
  pathNameMap: Record<string, string>;
  permissions: Permissions;
  hasPermission: (pageName: string, action: PermissionAction) => boolean;
}

