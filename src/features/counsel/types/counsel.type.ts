// ── 동적 필드 값 (요청)
export interface CounselFieldValueDto {
  fieldId: number;
  valueText?: string;
  valueNumber?: number;
  valueDate?: string;
  valueDatetime?: string;
}

// ── 동적 필드 값 (응답)
export interface CounselFieldValueResponse {
  fieldId: number;
  fieldKey: string;
  label: string;
  fieldType: string;
  valueText: string | null;
  valueNumber: number | null;
  valueDate: string | null;
  valueDatetime: string | null;
}

// ── 상태 변경 이력
export interface CounselLog {
  counselSeq: number;
  logNo: number;
  counselStat: number;
  statusName: string | null;
  regDtm: string;
}

// ── 메모
export interface CounselMemo {
  memoLogId: number;
  counselSeq: number;
  statusId: number;
  statusName: string | null;
  memoText: string;
  createdBy: number | null;
  creatorName: string | null;
  createdAt: string;
}

// ── 상담 목록 아이템
export interface CounselListItem {
  counselSeq: number;
  webCode: string;
  webTitle: string | null;
  name: string | null;
  counselHp: string;
  counselStat: number;
  statusName: string | null;
  empSeq: number | null;
  empName: string | null;
  duplicateState: string;
  counselResvDtm: string | null;
  regDtm: string;
  editDtm: string;
  fieldValues: CounselFieldValueResponse[];
}

// ── 상담 상세
export interface CounselDetail extends CounselListItem {
  counselIp: string;
  counselSource: string | null;
  counselMedium: string | null;
  counselCampaign: string | null;
  counselMemo: string | null;
  logs: CounselLog[];
  memos: CounselMemo[];
}

// ── 페이지 정보
export interface CounselPageInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// ── GET /counsels (목록 조회)
export interface GetCounselsRequest {
  page?: number;
  limit?: number;
  q?: string;
  counselStat?: number;
  empSeq?: number;
  webCode?: string;
  duplicateState?: 'Y' | 'N';
  startDate?: string;
  endDate?: string;
  resvStartDate?: string;
  resvEndDate?: string;
}

export interface GetCounselsResponse {
  items: CounselListItem[];
  pageInfo: CounselPageInfo;
}

// ── GET /counsels/:id (상세 조회)
export type GetCounselResponse = CounselDetail;

// ── PATCH /counsels/:id (수정)
export interface UpdateCounselRequest {
  name?: string | null;
  counselHp?: string;
  empSeq?: number | null;
  counselSource?: string | null;
  counselMedium?: string | null;
  counselCampaign?: string | null;
  counselResvDtm?: string | null;
  counselMemo?: string | null;
  fieldValues?: CounselFieldValueDto[];
}

export type UpdateCounselResponse = CounselDetail;

// ── PATCH /counsels/:id/status (상태 변경)
export interface UpdateCounselStatusRequest {
  counselStat: number;
  counselResvDtm?: string;
}

// ── POST /counsels/:id/memo (메모 작성)
export interface CreateMemoRequest {
  memoText: string;
}

export type CreateMemoResponse = CounselMemo;

// ── DELETE /counsels/:id (삭제)
// Response 204: No content

// ── GET /counsels/:id/logs (이력 조회)
// Response: CounselLog[]

// ── GET /counsels/:id/memo (메모 목록)
// Response: CounselMemo[]

// ════════════════════════════════════════════
//  대시보드 타입
// ════════════════════════════════════════════

export interface CounselDashboardSummary {
  totalCounsels: number;
  newCounsels: number;
  completedCounsels: number;
  completionRate: number;
}

export interface StatusDistributionItem {
  counselStat: number;
  statusName: string;
  color: string | null;
  count: number;
}

export interface EmployeeStatsItem {
  empSeq: number | null;
  empName: string;
  count: number;
}

export interface DailyTrendItem {
  date: string;
  count: number;
}

export interface WebsiteStatsItem {
  webCode: string;
  webTitle: string | null;
  count: number;
}

export interface HourlyDistributionItem {
  hour: number;
  count: number;
}

export interface UpcomingReservationItem {
  counselSeq: number;
  name: string | null;
  counselHp: string;
  counselResvDtm: string;
  empName: string | null;
  statusName: string;
}

export interface GetCounselDashboardRequest {
  startDate?: string;
  endDate?: string;
}

export interface CounselDashboardResponse {
  summary: CounselDashboardSummary;
  statusDistribution: StatusDistributionItem[];
  employeeStats: EmployeeStatsItem[];
  dailyTrends: DailyTrendItem[];
  topWebsites: WebsiteStatsItem[];
  hourlyDistribution: HourlyDistributionItem[];
  upcomingReservations: UpcomingReservationItem[];
}
