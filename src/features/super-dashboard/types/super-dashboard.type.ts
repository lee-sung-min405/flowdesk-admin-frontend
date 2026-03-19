// ── 전체 통계 개요
export interface SuperDashboardOverview {
  totalTenants: number;
  activeTenants: number;
  totalUsers: number;
  activeUsers: number;
  totalCounsels: number;
  totalPosts: number;
  totalRoles: number;
  totalPermissions: number;
}

// ── 오늘 통계
export interface SuperDashboardToday {
  newUsers: number;
  newCounsels: number;
  newPosts: number;
  activeSessions: number;
}

// ── 월별 트렌드 항목
export interface MonthlyTrendItem {
  month: string;
  count: number;
}

// ── 월별 트렌드
export interface SuperDashboardMonthlyTrends {
  userRegistrations: MonthlyTrendItem[];
  counselRegistrations: MonthlyTrendItem[];
  tenantRegistrations: MonthlyTrendItem[];
}

// ── 보안 현황
export interface SuperDashboardSecurity {
  totalBlockedIps: number;
  totalBlockedHps: number;
  totalBlockedWords: number;
  recentBlockedIps: number;
  recentBlockedHps: number;
}

// ── 테넌트별 통계
export interface TenantStat {
  tenantId: number;
  tenantName: string;
  isActive: number;
  createdAt: string;
  userCount: number;
  activeUserCount: number;
  counselCount: number;
  todayCounselCount: number;
  postCount: number;
  roleCount: number;
  websiteCount: number;
  blockedIpCount: number;
  blockedHpCount: number;
  blockedWordCount: number;
  activeSessionCount: number;
}

// ── GET /super/dashboard 응답
export interface SuperDashboardResponse {
  overview: SuperDashboardOverview;
  today: SuperDashboardToday;
  monthlyTrends: SuperDashboardMonthlyTrends;
  security: SuperDashboardSecurity;
  tenantStats: TenantStat[];
}
