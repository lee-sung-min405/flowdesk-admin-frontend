// 권한 카탈로그 페이지 항목
export interface CatalogPage {
  pageId: number;
  parentId: number | null;
  pageName: string;
  path: string;
  displayName: string;
  description: string | null;
  sortOrder: number | null;
}

// 권한 카탈로그 액션 항목
export interface CatalogAction {
  actionId: number;
  actionName: string;
  displayName: string;
}

// 권한 카탈로그 권한 항목
export interface CatalogPermission {
  permissionId: number;
  pageId: number;
  actionId: number;
  displayName: string | null;
  description: string | null;
}

// 권한 매트릭스 항목
export interface MatrixEntry {
  actionName: string;
  permissionId: number;
}

// ── GET /permissions/catalog (카탈로그 조회)
export interface GetPermissionCatalogResponse {
  pages: CatalogPage[];
  actions: CatalogAction[];
  permissions: CatalogPermission[];
  matrix: Record<string, MatrixEntry[]>;
}
