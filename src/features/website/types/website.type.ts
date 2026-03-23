// 웹사이트 엔티티
export interface Website {
  webCode: string;
  userSeq: number;
  userName: string;
  webUrl: string;
  webTitle: string;
  webImg: string;
  webDesc: string;
  webMemo: string;
  isActive: number;
  duplicateAllowAfterDays: number;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
}

// ── GET /websites (목록 조회)
export interface GetWebsitesRequest {
  page?: number;
  limit?: number;
  q?: string;
  isActive?: 0 | 1;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

export interface GetWebsitesResponse {
  items: Website[];
  pageInfo: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

// ── POST /websites (생성)
export interface CreateWebsiteRequest {
  webCode: string;
  userSeq: number;
  webUrl: string;
  webTitle: string;
  webImg?: string;
  webDesc?: string;
  webMemo?: string;
  isActive?: number;
  duplicateAllowAfterDays?: number;
}

export type CreateWebsiteResponse = Website;

// ── GET /websites/{webCode} (상세 조회)
export type GetWebsiteResponse = Website;

// ── PATCH /websites/{webCode} (수정)
export interface UpdateWebsiteRequest {
  userSeq?: number;
  webUrl?: string;
  webTitle?: string;
  webImg?: string;
  webDesc?: string;
  webMemo?: string;
  isActive?: number;
  duplicateAllowAfterDays?: number;
}

export type UpdateWebsiteResponse = Website;

// ── DELETE /websites/{webCode} (삭제)
// Response 204: No content

// ── PATCH /websites/{webCode}/status (상태 변경)
export interface UpdateWebsiteStatusRequest {
  isActive: 0 | 1;
}

export type UpdateWebsiteStatusResponse = Website;
