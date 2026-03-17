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
// Auth 타입 예시
export type AuthType = {};

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

