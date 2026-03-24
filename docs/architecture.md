# FlowDesk Admin Frontend — 기술 아키텍처 문서

> **최종 갱신**: 2026-03-25

---

## 목차

- [1. 프로젝트 개요](#1-프로젝트-개요)
- [2. 폴더 구조](#2-폴더-구조)
- [3. 라우팅 구조](#3-라우팅-구조)
- [4. 페이지 구성](#4-페이지-구성)
- [5. UI 구조](#5-ui-구조)
- [6. API 연동 구조](#6-api-연동-구조)
- [7. 상태 관리](#7-상태-관리)
- [8. 인증 / 인가 흐름](#8-인증--인가-흐름)
- [9. 권한 처리](#9-권한-처리)
- [10. 타입 및 스키마 구조](#10-타입-및-스키마-구조)

---

## 1. 프로젝트 개요

FlowDesk Admin Frontend는 **멀티테넌트 B2B SaaS 어드민 시스템**의 프론트엔드이다. 업체(테넌트)별 데이터 격리, RBAC 권한 제어, JWT 자동 갱신, 동적 메뉴 시스템을 기반으로 상담 데이터를 관리한다.

### 1.1 기술 스택

| 카테고리 | 기술 | 버전 |
|---------|------|------|
| 프레임워크 | React | 19.2.4 |
| 언어 | TypeScript | 5.9.3 |
| 빌드 도구 | Vite | 8.0.0 |
| UI 라이브러리 | Ant Design | 6.3.3 |
| 아이콘 | @ant-design/icons | 6.1.0 |
| 서버 상태 | TanStack React Query | 5.90.21 |
| 클라이언트 상태 | Zustand | 5.0.12 |
| 폼 관리 | React Hook Form | 7.71.2 |
| 폼 리졸버 | @hookform/resolvers | 5.2.2 |
| 유효성 검증 | Zod | 4.3.6 |
| HTTP 클라이언트 | Axios | 1.13.6 |
| 라우팅 | React Router DOM | 7.13.1 |
| 차트 | Recharts | 3.8.0 |
| 날짜 | Day.js | 1.11.20 |
| 리치 텍스트 | React Quill New | 3.8.3 |
| XSS 방어 | DOMPurify | 3.3.3 |
| 테스트 | Vitest + Testing Library | 4.1.0 |
| 모킹 | MSW | 2.12.11 |
| 코드 품질 | ESLint + Prettier | 10.0.3 / 3.8.1 |

### 1.2 아키텍처 패턴

**Feature-Sliced Design (FSD)** 을 채택한다. 레이어 간 단방향 의존성을 강제한다.

```
app → pages → widgets → features → shared
```

| 레이어 | 역할 | 의존 가능 대상 |
|--------|------|---------------|
| `app/` | 엔트리포인트, Provider, 라우터, 글로벌 스타일 | 모든 레이어 |
| `pages/` | 라우트 단위 페이지 컴포넌트 (비즈니스 로직 없음) | features, widgets, shared |
| `widgets/` | 여러 페이지에서 재사용되는 레이아웃 UI 블록 | features, shared |
| `features/` | 도메인별 비즈니스 로직 (api, model, ui, types, lib) | shared |
| `shared/` | 공통 API, 타입, 유틸, 에셋, UI 컴포넌트 | 외부 라이브러리만 |

### 1.3 Path Alias

`tsconfig.json` + `vite.config.ts`에 동일하게 설정:

| Alias | 실제 경로 |
|-------|----------|
| `@app/*` | `src/app/*` |
| `@shared/*` | `src/shared/*` |
| `@features/*` | `src/features/*` |
| `@pages/*` | `src/pages/*` |
| `@widgets/*` | `src/widgets/*` |

**규칙**: 같은 feature slice 내부는 상대 경로(`./`, `../`), cross-layer import만 alias를 사용한다.

### 1.4 빌드 & 개발 서버

```bash
npm run dev        # Vite 개발 서버 (포트 3000, 자동 브라우저 열기)
npm run build      # tsc -b && vite build → dist/
npm run preview    # 빌드 결과물 미리보기
npm run typecheck  # tsc --noEmit (타입 체크만)
```

환경 변수: `.env` 파일에 `VITE_API_URL` 설정.

---

## 2. 폴더 구조

실제 파일시스템 기준 전체 구조:

```
flowdesk-admin-frontend/
├─ index.html
├─ package.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite.config.ts
├─ vite-env.d.ts
├─ vercel.json
├─ docs/
│  └─ architecture.md
├─ public/
│
└─ src/
   ├─ app/
   │  ├─ App.tsx                    # 루트 컴포넌트 (QueryClientProvider + BrowserRouter + Routes)
   │  ├─ main.tsx                   # ReactDOM 엔트리 (인터셉터 초기화)
   │  ├─ ProtectedRoute.tsx         # 인증 보호 라우트 가드
   │  ├─ layouts/
   │  │  ├─ main-layout.tsx         # Sidebar + Header + Outlet 레이아웃
   │  │  └─ main-layout.module.css
   │  └─ styles/
   │     ├─ global.css              # CSS Custom Properties, 리셋, 접근성
   │     └─ antd-overrides.module.css
   │
   ├─ shared/
   │  ├─ api/
   │  │  ├─ axios.ts                # Axios 인스턴스 (baseURL, 기본 헤더)
   │  │  └─ axios-interceptor.ts    # 인터셉터 설정 (DI 패턴)
   │  ├─ assets/
   │  │  └─ logo.png
   │  ├─ types/
   │  │  └─ error-response.type.ts  # 공통 API 에러 응답 타입
   │  ├─ ui/
   │  │  └─ rich-text-editor/       # React Quill 기반 WYSIWYG 에디터
   │  │     ├─ rich-text-editor.tsx
   │  │     └─ rich-text-editor.module.css
   │  └─ utils/
   │     └─ api-error-message.ts    # 에러 코드→한국어 메시지 매핑
   │
   ├─ widgets/
   │  ├─ sidebar/
   │  │  ├─ sidebar.tsx
   │  │  ├─ sidebar.module.css
   │  │  ├─ sidebar.type.ts
   │  │  └─ lib/
   │  │     ├─ build-menu-items.ts  # MenuTree[] → AntD MenuItem[] 변환
   │  │     └─ menu-icon-map.tsx    # pageName → 아이콘 매핑
   │  ├─ header/
   │  │  ├─ header.tsx
   │  │  ├─ header.module.css
   │  │  └─ header.type.ts
   │  └─ breadcrumb/
   │     ├─ breadcrumb.tsx
   │     └─ breadcrumb.module.css
   │
   ├─ features/
   │  ├─ auth/                      # 인증/권한
   │  ├─ user/                      # 사용자 관리
   │  ├─ tenant/                    # 테넌트 관리
   │  ├─ role/                      # 역할 관리
   │  ├─ admin-page/                # RBAC 페이지 관리
   │  ├─ admin-action/              # RBAC 액션 관리
   │  ├─ admin-permission/          # RBAC 권한 관리
   │  ├─ permission-catalog/        # 권한 카탈로그
   │  ├─ super-dashboard/           # 슈퍼 관리자 대시보드
   │  ├─ tenant-status/             # 테넌트 커스텀 상태 관리
   │  ├─ website/                   # 웹사이트 관리
   │  ├─ security/                  # 차단 관리 (IP/HP/Word)
   │  ├─ board-type/                # 게시판 타입 관리
   │  ├─ board/                     # 게시글 관리
   │  └─ counsel/                   # 상담 관리
   │
   └─ pages/
      ├─ login/
      ├─ signup/
      ├─ home/
      ├─ mypage/
      ├─ user/
      ├─ tenant/
      ├─ super-dashboard/
      ├─ admin-page-manage/
      ├─ admin-action-manage/
      ├─ admin-permission-manage/
      ├─ permission-catalog/
      ├─ role-manage/
      ├─ tenant-status-manage/
      ├─ website-manage/
      ├─ block-manage/
      ├─ board-type-manage/
      ├─ board-manage/
      ├─ counsel-dashboard/
      ├─ counsel-manage/
      └─ counsel-calendar/
```

### 2.1 Feature Slice 내부 구조 (공통 패턴)

```
features/{도메인}/
├─ index.ts              # Public API (외부 노출 유일 진입점)
├─ api/
│  ├─ {도메인}.endpoint.ts  # API 경로 상수 객체 (auth는 endpoints.ts)
│  └─ {기능}.api.ts         # API 호출 함수 (axiosInstance 사용)
├─ model/
│  ├─ {도메인}.store.ts     # Zustand 스토어 (auth만 해당)
│  ├─ {도메인}.service.ts   # 비즈니스 서비스 로직 (auth만 해당)
│  ├─ {기능}.schema.ts      # Zod 유효성 스키마
│  └─ use-{기능}.ts         # React Query 커스텀 훅
├─ types/
│  └─ {도메인}.type.ts      # 도메인 타입/인터페이스 (security는 block-ip/hp/word.type.ts 3개 분리)
├─ lib/                     # 순수 헬퍼 함수 (일부 feature만 해당)
└─ ui/                      # UI 컴포넌트 (컴포넌트별 폴더)
   └─ {컴포넌트}/
      ├─ {컴포넌트}.tsx
      └─ {컴포넌트}.module.css
```

---

## 3. 라우팅 구조

### 3.1 라우터 설정

`src/app/App.tsx`에서 `BrowserRouter` + `Routes`로 구성한다. 모든 페이지는 `React.lazy`로 동적 import하며, `Suspense`로 로딩 UI를 보여준다.

```tsx
// src/app/App.tsx 실제 구조
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // 5분
      gcTime: 1000 * 60 * 10,     // 10분
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

<QueryClientProvider client={queryClient}>
  <BrowserRouter>
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><Spin size="large" /></div>}>
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 인증 필요 + MainLayout 적용 */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          {/* 18개 하위 라우트 */}
        </Route>

        {/* 루트 리다이렉트 */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
</QueryClientProvider>
```

### 3.2 전체 라우트 테이블

| 경로 | 페이지 컴포넌트 | lazy import 경로 | 레이아웃 | 인증 | 설명 |
|------|----------------|------------------|---------|------|------|
| `/` | — | — | — | — | `/login`으로 리다이렉트 |
| `/login` | `LoginPage` | `@pages/login/login-page` | 없음 | 불필요 | 로그인 (로그인 상태 시 `/home`으로 리다이렉트) |
| `/signup` | `SignupPage` | `@pages/signup/signup-page` | 없음 | 불필요 | 회원가입 (로그인 상태 시 `/home`으로 리다이렉트) |
| `/home` | `HomePage` | `@pages/home/home-page` | `MainLayout` | **필요** | 홈 (역할별 플로우, 포트폴리오, 아키텍처 개요) |
| `/mypage` | `MypagePage` | `@pages/mypage/mypage-page` | `MainLayout` | **필요** | 마이페이지 (프로필, 역할/권한, 보안) |
| `/users` | `UserPage` | `@pages/user/user-page` | `MainLayout` | **필요** | 사용자 관리 |
| `/tenants` | `TenantPage` | `@pages/tenant/tenant-page` | `MainLayout` | **필요** | 테넌트 관리 |
| `/super/dashboard` | `SuperDashboardPage` | `@pages/super-dashboard/super-dashboard-page` | `MainLayout` | **필요** | 슈퍼 관리자 대시보드 |
| `/permissions/admin/pages` | `AdminPageManagePage` | `@pages/admin-page-manage/admin-page-manage-page` | `MainLayout` | **필요** | RBAC 페이지 관리 |
| `/permissions/admin/actions` | `AdminActionManagePage` | `@pages/admin-action-manage/admin-action-manage-page` | `MainLayout` | **필요** | RBAC 액션 관리 |
| `/permissions/admin/permissions` | `AdminPermissionManagePage` | `@pages/admin-permission-manage/admin-permission-manage-page` | `MainLayout` | **필요** | RBAC 권한 관리 |
| `/permissions/catalog` | `PermissionCatalogPage` | `@pages/permission-catalog/permission-catalog-page` | `MainLayout` | **필요** | 권한 카탈로그 |
| `/roles` | `RoleManagePage` | `@pages/role-manage/role-manage-page` | `MainLayout` | **필요** | 역할 관리 |
| `/tenants/status` | `TenantStatusManagePage` | `@pages/tenant-status-manage/tenant-status-manage-page` | `MainLayout` | **필요** | 테넌트 상태 관리 |
| `/websites` | `WebsiteManagePage` | `@pages/website-manage/website-manage-page` | `MainLayout` | **필요** | 웹사이트 관리 |
| `/security` | `BlockManagePage` | `@pages/block-manage/block-manage-page` | `MainLayout` | **필요** | 차단 관리 (IP/HP/금칙어) |
| `/board-types` | `BoardTypeManagePage` | `@pages/board-type-manage/board-type-manage-page` | `MainLayout` | **필요** | 게시판 타입 관리 |
| `/boards` | `BoardManagePage` | `@pages/board-manage/board-manage-page` | `MainLayout` | **필요** | 게시글 관리 |
| `/counsels/dashboard` | `CounselDashboardPage` | `@pages/counsel-dashboard/counsel-dashboard-page` | `MainLayout` | **필요** | 상담 대시보드 |
| `/counsels` | `CounselManagePage` | `@pages/counsel-manage/counsel-manage-page` | `MainLayout` | **필요** | 상담 관리 |
| `/counsels/calendar` | `CounselCalendarPage` | `@pages/counsel-calendar/counsel-calendar-page` | `MainLayout` | **필요** | 예약 캘린더 |

총 22개 `<Route>` 정의: 공개 2 + 인증 필요 18 + 리다이렉트 1 + 레이아웃 래퍼 1.

### 3.3 ProtectedRoute

```tsx
// src/app/ProtectedRoute.tsx
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const storeToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = !!storeToken || !!authStorage.getAccessToken();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}
```

- Zustand 스토어 `accessToken` + `localStorage` 이중 체크
- 미인증 시 `/login`으로 리다이렉트

### 3.4 MainLayout

```tsx
// src/app/layouts/main-layout.tsx
export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = useCallback(() => setCollapsed((prev) => !prev), []);

  return (
    <div className={styles.layout}>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <div className={styles.main} data-collapsed={collapsed}>
        <Header collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
        <main className={styles.content} data-scroll-area>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

- `Sidebar`: `collapsed` / `onCollapse` props
- `Header`: `collapsed` / `onToggleCollapsed` props
- `<Outlet />`으로 하위 라우트 렌더링

---

## 4. 페이지 구성

### 4.1 공개 페이지

#### LoginPage (`/login`)

- 로그인 상태(`Zustand accessToken` 또는 `localStorage`)이면 `/home`으로 리다이렉트
- `<LoginForm />` (features/auth)을 렌더링
- 하단에 회원가입 링크 (`/signup`)

#### SignupPage (`/signup`)

- 로그인 상태이면 `/home`으로 리다이렉트
- `<SignupForm />` (features/auth)을 렌더링
- 하단에 로그인 링크 (`/login`)

### 4.2 인증 필요 페이지

#### HomePage (`/home`)

- 역할별 서비스 이용 플로우 (슈퍼 관리자 / 업체 관리자 / 일반 사용자) 탭 UI
- 환영 섹션: 사용자 프로필 + 통계 카드 (소속 업체, 역할, 가입일, 계정 상태)
- 포트폴리오 사이트 안내 배너
- 데이터 흐름 다이어그램 (웹사이트 → API 연동 → FlowDesk Admin)
- 아키텍처 하이라이트 카드 6개 (멀티테넌트 격리, RBAC, JWT, 동적 메뉴, FSD, 보안 3단계)
- `useMe()` 훅으로 사용자/역할 정보 조회

#### MypagePage (`/mypage`)

- 프로필 정보 카드 (이름, ID, 이메일, 회사명, 전화번호, 휴대폰, 가입일, 상태)
- 프로필 수정 모달 (`ProfileEditForm`)
- 비밀번호 변경 모달 (`ChangePasswordForm`)
- 역할 목록 표시
- 권한 요약 (보유 권한 수 + 목록)
- 보안 설정 (로그아웃 / 모든 기기 로그아웃)

#### UserPage (`/users`)

- `UserTable`: 사용자 목록 (정렬, 페이지네이션, 검색, 필터)
- `UserDetail`: 상세 모달
- `UserCreateForm` / `UserEditForm`: 생성/수정 모달
- `UserPasswordForm`: 비밀번호 초기화 모달
- 사용자 상태 변경 (활성/비활성), 강제 로그아웃, 역할 배정
- `@features/role`의 `useRoles`로 역할 옵션 조회

#### TenantPage (`/tenants`)

- `TenantTable`: 테넌트 목록 (정렬, 페이지네이션, 검색, 필터)
- `TenantDetail`: 상세 모달
- `TenantCreateForm` / `TenantEditForm`: 생성/수정 모달
- 상태 변경, 삭제 (사용자 존재 시 차단)

#### SuperDashboardPage (`/super/dashboard`)

- `OverviewCards`: 전체 현황 8지표 (테넌트, 사용자, 상담, 게시글, 역할, 권한)
- `TodayCards`: 오늘 현황 4지표 (신규 사용자, 신규 상담, 신규 게시글, 활성 세션)
- `MonthlyTrendsChart`: 월별 트렌드 차트 (Recharts)
- `SecurityCards`: 보안 현황 (차단 IP/HP/Word 수)
- `TenantStatsTable`: 테넌트별 상세 통계 테이블

#### AdminPageManagePage (`/permissions/admin/pages`)

- `AdminPageTable`: 페이지 목록 (계층 구조, 부모-자식 관계)
- `AdminPageDetail`: 상세 (Descriptions + 하위 페이지 Table)
- `AdminPageCreateForm` / `AdminPageEditForm`: 생성/수정

#### AdminActionManagePage (`/permissions/admin/actions`)

- `AdminActionTable`: 액션 목록
- `AdminActionDetail`: 상세
- `AdminActionCreateForm` / `AdminActionEditForm`: 생성/수정

#### AdminPermissionManagePage (`/permissions/admin/permissions`)

- `AdminPermissionTable`: 권한 목록 (페이지+액션 조합)
- `AdminPermissionDetail`: 상세
- `AdminPermissionCreateForm` / `AdminPermissionEditForm`: 생성/수정
- `AdminPermissionMatrix`: 권한 매트릭스 UI
- 크로스 피처: `admin-page` + `admin-action` 데이터 합성

#### PermissionCatalogPage (`/permissions/catalog`)

- `PermissionMatrix`: 페이지×액션 권한 매트릭스
- 트리 구조 (parentId 기반 계층), 접기/펼치기, 검색 필터
- 요약 통계 바, 스티키 컬럼, 행 스트라이핑/호버

#### RoleManagePage (`/roles`)

- `RoleTable`: 역할 목록
- `RoleDetailDrawer`: 3탭 Drawer (기본정보 / 권한 매트릭스 / 사용자 할당)
- `RoleCreateForm` / `RoleEditForm`: 생성/수정
- 권한 매트릭스 (페이지×액션 체크박스), 권한 복사
- 사용자 할당/해제

#### TenantStatusManagePage (`/tenants/status`)

- `StatusSummaryCards`: 요약 카드
- `StatusGroupList`: 그룹별 Collapse 리스트
- `StatusCreateForm` / `StatusEditForm`: 생성/수정
- `StatusDetail`: 상세
- 활성화/비활성화 토글, ColorPicker

#### WebsiteManagePage (`/websites`)

- `WebsiteTable`: 웹사이트 목록 (검색/필터, 상태 변경)
- `WebsiteDetail`: 상세
- `WebsiteCreateForm` / `WebsiteEditForm`: 생성/수정
- 썸네일/URL 표시, 관리자 배정, 중복허용 기간 설정

#### BlockManagePage (`/security`)

- Tabs UI: IP 차단 / 휴대폰 차단 / 금칙어 차단
- 각 탭별 `BlockIpTable` / `BlockHpTable` / `BlockWordTable`
- 각 탭별 상세/생성/수정 폼 + 차단 여부 확인 폼
- 대량 등록 (Segmented UI로 단건/대량 전환)
- 활성화/비활성화 토글

#### BoardTypeManagePage (`/board-types`)

- `BoardTypeTable`: 게시판 타입 목록
- `BoardTypeDetail`: 상세
- `BoardTypeCreateForm` / `BoardTypeEditForm`: 생성/수정

#### BoardManagePage (`/boards`)

- `PostTable`: 게시글 목록 (게시판 타입별 필터)
- `PostDetail`: 상세 (HTML 콘텐츠 렌더링)
- `PostCreateForm` / `PostEditForm`: 생성/수정 (RichTextEditor 사용)

#### CounselDashboardPage (`/counsels/dashboard`)

- `SummaryCards`: 요약 카드 4지표
- `StatusDistributionChart`: 상태별 분포 (파이 차트)
- `EmployeeStatsChart`: 담당자별 현황 (바 차트)
- `DailyTrendsChart`: 일별 추이 (영역 차트)
- `TopWebsitesChart`: 웹사이트 Top5 (바 차트)
- `HourlyDistributionChart`: 시간대별 분포 (바 차트)
- `UpcomingReservationsTable`: 예정 예약 테이블
- 기간 선택 (RangePicker)

#### CounselManagePage (`/counsels`)

- `CounselTable`: 상담 목록 (상태 필터 카드, 날짜/상태/담당자/웹사이트 필터)
- `CounselDetail`: 상세 모달 (기본정보/메모/이력/관련상담 탭)
- `CounselEditForm`: 수정
- 인라인 상태/담당자 변경, 메모, 차단(전화번호/IP/금칙어)
- `counsels.admin` 권한 기반 데이터 격리

#### CounselCalendarPage (`/counsels/calendar`)

- `ReservationCalendar`: 월별 7×6 캘린더 그리드
- 예약 카드 (상태별 색상)
- 드래그 앤 드롭 일정 변경 (확인 모달 + TimePicker)
- 담당자 필터 (어드민)
- 상세 모달

---

## 5. UI 구조

### 5.1 메인 레이아웃 구조

```
┌─────────────────────────────────────────────┐
│  Sidebar (aside)  │  Header               │
│                   │  ─────────────────────  │
│  · 로고            │  Breadcrumb            │
│  · 접기/펼치기 버튼  │                        │
│  · 동적 메뉴        │  <Outlet />            │
│  · 사용자 정보      │  (페이지 컴포넌트)       │
│  · 로그아웃 버튼     │                        │
└─────────────────────────────────────────────┘
```

### 5.2 Sidebar

**파일**: `src/widgets/sidebar/sidebar.tsx`

**Props**:

```tsx
interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}
```

**구현 상세**:
- `useMe()` 훅으로 `me` (사용자 정보) + `menuTree` (필터링된 메뉴 트리) 조회
- `buildMenuItems(menuTree)` → Ant Design `Menu` items 배열로 변환
- `menuIconMap`에서 `pageName` → 아이콘 매핑
- 부모 노드: `key = pageName` (서브메뉴 그룹), 리프 노드: `key = path` (라우트 이동)
- 모바일 대응: `768px` 브레이크포인트, 오버레이 배경, 페이지 이동 시 자동 닫힘
- 로고 클릭 → `/home` 이동
- 사용자 정보 영역 클릭 → `/mypage` 이동
- 로그아웃 버튼 → `useLogout()` 훅 호출

**메뉴 아이콘 매핑** (`menu-icon-map.tsx`):

| pageName | 아이콘 |
|----------|--------|
| `super` | `SafetyOutlined` |
| `super.dashboard` | `AppstoreOutlined` |
| `super.tenants` | `BlockOutlined` |
| `super.pages` | `FileTextOutlined` |
| `super.actions` | `ThunderboltOutlined` |
| `super.permissions` | `LockOutlined` |
| `user_management` | `TeamOutlined` |
| `roles` | `AuditOutlined` |
| `users` | `UserOutlined` |
| `permissions` | `SafetyOutlined` |
| `system_management` | `SettingOutlined` |
| `tenants.status` | `BlockOutlined` |
| `security` | `SecurityScanOutlined` |
| `websites` | `GlobalOutlined` |
| `board_types` | `LayoutOutlined` |
| `content_management` | `ContainerOutlined` |
| `boards.posts` | `ReadOutlined` |
| `counsel_management` | `CustomerServiceOutlined` |
| `counsels.dashboard` | `DashboardOutlined` |
| `counsels` | `UnorderedListOutlined` |
| `counsels.calendar` | `CalendarOutlined` |

### 5.3 Header

**파일**: `src/widgets/header/header.tsx`

**Props**:

```tsx
interface HeaderProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}
```

**구성 요소**:
- 좌측: 토글 버튼 (`MenuFoldOutlined` / `MenuUnfoldOutlined`) + `<Breadcrumb />`
- 우측: 테넌트 뱃지 (`me.user.corpName`) + 알림 Popover + 프로필 Dropdown
- 프로필 Dropdown 메뉴: 내 정보 (`/mypage`) / 비밀번호 변경 (모달) / 로그아웃
- 스크롤 감지: `[data-scroll-area]` 요소의 scrollTop > 0 시 `data-scrolled` 속성 설정
- 비밀번호 변경: `ChangePasswordForm` (features/auth) + Modal

### 5.4 Breadcrumb

**파일**: `src/widgets/breadcrumb/breadcrumb.tsx`

**동작**:
1. `useLocation()`으로 현재 경로(`pathname`) 파싱
2. `useMe()` → `pathNameMap` (path → displayName 맵) 조회
3. 홈 아이콘 (`HomeOutlined`, `/home` 링크) 고정 첫 번째 항목
4. 나머지 경로 세그먼트를 순회하며 `pathNameMap`에서 이름 조회
5. 마지막 세그먼트는 텍스트만, 나머지는 `<Link>` 렌더링

**pathNameMap 생성 과정**:
- `meApi()` 응답의 `menuTree`를 `filterMenuTree()`로 권한 필터링
- `buildPathNameMap(menuTree)`로 `path → displayName` 플랫 맵 생성

### 5.5 CSS 토큰

`global.css`에 정의된 CSS Custom Properties:

```css
:root {
  --color-primary: #233d7b;
  --color-primary-dark: #1d3266;
  --color-primary-light: #2a5298;
  --color-accent: #3b82f6;
  --color-bg: #f5f5f5;
  --color-bg-sidebar: #001529;
  --color-bg-header: #ffffff;
  --color-text: #1a1a1a;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;
  --sidebar-text: rgba(255, 255, 255, 0.85);
  --sidebar-text-muted: rgba(255, 255, 255, 0.45);
  --sidebar-text-dim: rgba(255, 255, 255, 0.55);
  --sidebar-text-hover: rgba(255, 255, 255, 0.75);
  --sidebar-hover-bg: rgba(255, 255, 255, 0.08);
  --sidebar-subtle-bg: rgba(255, 255, 255, 0.06);
  --sidebar-border: rgba(255, 255, 255, 0.08);
  --sidebar-scrollbar: rgba(255, 255, 255, 0.15);
  --font-family: 'Pretendard', 'Noto Sans KR', Arial, sans-serif;
  --sidebar-width: 240px;
  --sidebar-collapsed-width: 64px;
  --header-height: 56px;
  --transition-base: 0.2s ease;
}
```

접근성: `button:focus-visible`, `a:focus-visible`에 `outline: 2px solid var(--color-accent)` 적용.

### 5.6 리치 텍스트 에디터

**파일**: `src/shared/ui/rich-text-editor/rich-text-editor.tsx`

```tsx
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
```

- React Quill New 기반 WYSIWYG 에디터
- 툴바: 헤딩(1/2/3), 볼드, 이탤릭, 밑줄, 취소선, 글자색, 배경색, 순서/비순서 목록, 정렬, 인용, 링크, 이미지, 서식 제거
- 빈 입력값(`<p><br></p>`) → 빈 문자열로 변환
- 게시글(Board) 작성/수정 폼에서 사용

---

## 6. API 연동 구조

### 6.1 Axios 인스턴스

```tsx
// src/shared/api/axios.ts
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});
```

### 6.2 에러 응답 타입

```tsx
// src/shared/types/error-response.type.ts
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    statusCode: number;
  };
  meta: {
    requestId: string;
    timestamp: string;
    path: string;
  };
}
```

### 6.3 에러 메시지 매핑

```tsx
// src/shared/utils/api-error-message.ts
const ERROR_MESSAGE_MAP: Record<string, string> = {
  AUTH001_401: '인증에 실패했습니다.',
  AUTH101_403: '권한이 부족합니다.',
  VAL001_400: '입력값이 올바르지 않습니다.',
  BIZ001_409: '비즈니스 충돌 오류가 발생했습니다.',
  RES001_404: '요청한 리소스를 찾을 수 없습니다.',
  USER001_409: '이미 존재하는 사용자입니다.',
  USER001_404: '사용자를 찾을 수 없습니다.',
};
```

매핑 키: `{code}_{statusCode}` 패턴. `getApiErrorMessage(error)` 함수가 AxiosError, ErrorResponse, 일반 Error를 모두 처리하고 네트워크 에러/타임아웃도 한국어 메시지로 변환한다.

### 6.4 엔드포인트 상수

모든 feature는 `api/{도메인}.endpoint.ts` 파일에 엔드포인트 경로를 `as const` 객체로 정의한다.

#### Auth

```tsx
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  LOGOUT_ALL: '/auth/logout-all',
  ME: '/auth/me',
  ME_PROFILE: '/auth/me/profile',
  CHANGE_PASSWORD: '/auth/change-password',
  REFRESH_TOKEN: '/auth/refresh-token',
  SIGNUP: '/auth/signup',
} as const;
```

#### User

```tsx
export const USER_ENDPOINTS = {
  LIST: '/users',
  CREATE: '/users',
  DETAIL: (id: number) => `/users/${id}`,
  UPDATE: (id: number) => `/users/${id}`,
  STATUS: (id: number) => `/users/${id}/status`,
  PASSWORD: (id: number) => `/users/${id}/password`,
  INVALIDATE_TOKENS: (id: number) => `/users/${id}/invalidate-tokens`,
  ROLES: (id: number) => `/users/${id}/roles`,
} as const;
```

#### Tenant

```tsx
export const TENANT_ENDPOINTS = {
  LIST: '/tenants',
  CREATE: '/tenants',
  DETAIL: (id: number) => `/tenants/${id}`,
  UPDATE: (id: number) => `/tenants/${id}`,
  DELETE: (id: number) => `/tenants/${id}`,
  STATUS: (id: number) => `/tenants/${id}/status`,
} as const;
```

#### Role

```tsx
export const ROLE_ENDPOINTS = {
  LIST: '/roles',
  CREATE: '/roles',
  DETAIL: (id: number) => `/roles/${id}`,
  UPDATE: (id: number) => `/roles/${id}`,
  STATUS: (id: number) => `/roles/${id}/status`,
  DELETE: (id: number) => `/roles/${id}`,
  PERMISSIONS: (id: number) => `/roles/${id}/permissions`,
  COPY_PERMISSIONS: (id: number) => `/roles/${id}/permissions`,
} as const;
```

#### Admin Page / Action / Permission

```tsx
export const ADMIN_PAGE_ENDPOINTS = {
  LIST: '/permissions/admin/pages',
  CREATE: '/permissions/admin/pages',
  DETAIL: (id: number) => `/permissions/admin/pages/${id}`,
  UPDATE: (id: number) => `/permissions/admin/pages/${id}`,
  STATUS: (id: number) => `/permissions/admin/pages/${id}/status`,
  DELETE: (id: number) => `/permissions/admin/pages/${id}`,
} as const;

export const ADMIN_ACTION_ENDPOINTS = {
  LIST: '/permissions/admin/actions',
  CREATE: '/permissions/admin/actions',
  DETAIL: (id: number) => `/permissions/admin/actions/${id}`,
  UPDATE: (id: number) => `/permissions/admin/actions/${id}`,
  STATUS: (id: number) => `/permissions/admin/actions/${id}/status`,
  DELETE: (id: number) => `/permissions/admin/actions/${id}`,
} as const;

export const ADMIN_PERMISSION_ENDPOINTS = {
  LIST: '/permissions/admin/permissions',
  CREATE: '/permissions/admin/permissions',
  DETAIL: (id: number) => `/permissions/admin/permissions/${id}`,
  UPDATE: (id: number) => `/permissions/admin/permissions/${id}`,
  STATUS: (id: number) => `/permissions/admin/permissions/${id}/status`,
  DELETE: (id: number) => `/permissions/admin/permissions/${id}`,
} as const;
```

#### Permission Catalog

```tsx
export const PERMISSION_CATALOG_ENDPOINTS = {
  CATALOG: '/permissions/catalog',
} as const;
```

#### Super Dashboard

```tsx
export const SUPER_DASHBOARD_ENDPOINTS = {
  DASHBOARD: '/super/dashboard',
} as const;
```

#### Tenant Status

```tsx
export const TENANT_STATUS_ENDPOINTS = {
  LIST: '/tenants/status',
  CREATE: '/tenants/status',
  DETAIL: (id: number) => `/tenants/status/${id}`,
  UPDATE: (id: number) => `/tenants/status/${id}`,
  DELETE: (id: number) => `/tenants/status/${id}`,
  ACTIVE: (id: number) => `/tenants/status/${id}/active`,
} as const;
```

#### Website

```tsx
export const WEBSITE_ENDPOINTS = {
  LIST: '/websites',
  CREATE: '/websites',
  DETAIL: (webCode: string) => `/websites/${webCode}`,
  UPDATE: (webCode: string) => `/websites/${webCode}`,
  DELETE: (webCode: string) => `/websites/${webCode}`,
  STATUS: (webCode: string) => `/websites/${webCode}/status`,
} as const;
```

#### Security (IP / HP / Word)

```tsx
export const SECURITY_ENDPOINTS = {
  BLOCK_IP_LIST: '/security/block-ip',
  BLOCK_IP_CREATE: '/security/block-ip',
  BLOCK_IP_BULK_CREATE: '/security/block-ip/bulk',
  BLOCK_IP_DETAIL: (id: number) => `/security/block-ip/${id}`,
  BLOCK_IP_UPDATE: (id: number) => `/security/block-ip/${id}`,
  BLOCK_IP_DELETE: (id: number) => `/security/block-ip/${id}`,
  BLOCK_IP_CHECK: '/security/block-ip/check',
  BLOCK_HP_LIST: '/security/block-hp',
  BLOCK_HP_CREATE: '/security/block-hp',
  BLOCK_HP_BULK_CREATE: '/security/block-hp/bulk',
  BLOCK_HP_DETAIL: (id: number) => `/security/block-hp/${id}`,
  BLOCK_HP_UPDATE: (id: number) => `/security/block-hp/${id}`,
  BLOCK_HP_DELETE: (id: number) => `/security/block-hp/${id}`,
  BLOCK_HP_CHECK: '/security/block-hp/check',
  BLOCK_WORD_LIST: '/security/block-word',
  BLOCK_WORD_CREATE: '/security/block-word',
  BLOCK_WORD_BULK_CREATE: '/security/block-word/bulk',
  BLOCK_WORD_DETAIL: (id: number) => `/security/block-word/${id}`,
  BLOCK_WORD_UPDATE: (id: number) => `/security/block-word/${id}`,
  BLOCK_WORD_DELETE: (id: number) => `/security/block-word/${id}`,
  BLOCK_WORD_CHECK: '/security/block-word/check',
} as const;
```

#### Board Type

```tsx
export const BOARD_TYPE_ENDPOINTS = {
  LIST: '/boards',
  CREATE: '/boards',
  DETAIL: (boardId: number) => `/boards/${boardId}`,
  UPDATE: (boardId: number) => `/boards/${boardId}`,
  DELETE: (boardId: number) => `/boards/${boardId}`,
} as const;
```

#### Board (Posts)

```tsx
export const BOARD_ENDPOINTS = {
  POSTS: (boardId: number) => `/boards/${boardId}/posts`,
  POST_CREATE: (boardId: number) => `/boards/${boardId}/posts`,
  POST_DETAIL: (boardId: number, postId: number) => `/boards/${boardId}/posts/${postId}`,
  POST_UPDATE: (boardId: number, postId: number) => `/boards/${boardId}/posts/${postId}`,
  POST_DELETE: (boardId: number, postId: number) => `/boards/${boardId}/posts/${postId}`,
} as const;
```

#### Counsel

```tsx
export const COUNSEL_ENDPOINTS = {
  DASHBOARD: '/counsels/dashboard',
  LIST: '/counsels',
  DETAIL: (id: number) => `/counsels/${id}`,
  UPDATE: (id: number) => `/counsels/${id}`,
  DELETE: (id: number) => `/counsels/${id}`,
  STATUS: (id: number) => `/counsels/${id}/status`,
  LOGS: (id: number) => `/counsels/${id}/logs`,
  MEMO: (id: number) => `/counsels/${id}/memo`,
} as const;
```

### 6.5 API 호출 패턴

모든 API 함수는 동일한 패턴을 따른다:

```tsx
// 예: features/user/api/get-users.api.ts
import { axiosInstance } from '@shared/api/axios';
import type { GetUsersRequest, GetUsersResponse } from '../types/user.type';
import { USER_ENDPOINTS } from './user.endpoint';

export async function getUsersApi(params: GetUsersRequest): Promise<GetUsersResponse> {
  const response = await axiosInstance.get<GetUsersResponse>(USER_ENDPOINTS.LIST, { params });
  return response.data;
}
```

---

## 7. 상태 관리

### 7.1 상태 관리 전략

3종류의 상태를 명확히 분리한다:

| 상태 유형 | 도구 | 용도 |
|----------|------|------|
| 서버 상태 | TanStack React Query | API 데이터 캐싱, 자동 갱신, 페이지네이션 |
| 클라이언트 전역 상태 | Zustand | 인증 토큰, 사용자 정보 (auth 스토어) |
| 폼 로컬 상태 | React Hook Form + Zod | 폼 입력값, 유효성 검증 |

### 7.2 React Query 설정

```tsx
// src/app/App.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,     // 5분
      gcTime: 1000 * 60 * 10,       // 10분 (가비지 컬렉션)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### 7.3 React Query 훅 패턴

**조회 훅** (`useQuery`):

```tsx
export function useUsers(params: GetUsersRequest) {
  return useQuery<GetUsersResponse, AxiosError<ErrorResponse>>({
    queryKey: ['users', params],
    queryFn: () => getUsersApi(params),
  });
}
```

**뮤테이션 훅** (`useMutation`):

```tsx
export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation<CreateUserResponse, AxiosError<ErrorResponse>, CreateUserRequest>({
    mutationFn: createUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

### 7.4 Zustand 스토어

프로젝트에서 Zustand 스토어는 auth 도메인에서만 사용한다:

```tsx
// src/features/auth/model/auth.store.ts
type AuthState = {
  accessToken: string | null;
  me: MeResponse | null;
  setAccessToken: (accessToken: string) => void;
  setMe: (me: MeResponse) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: authStorage.getAccessToken(),   // localStorage에서 초기화
  me: authStorage.getMe(),                     // localStorage에서 초기화
  setAccessToken: (accessToken) => set({ accessToken }),
  setMe: (me) => set({ me }),
  clearAuth: () => set({ accessToken: null, me: null }),
}));
```

- 초기값은 `localStorage`에서 복원 (새로고침 대응)
- 로그인 성공 시 `setAccessToken` + `setMe` 호출
- 로그아웃 시 `clearAuth` 호출

### 7.5 폼 상태 관리

React Hook Form + Zod resolver 패턴:

```tsx
const form = useForm<LoginRequest>({
  resolver: zodResolver(loginSchema),
  defaultValues: { tenantName: '', userId: '', password: '' },
});
```

- Zod 스키마에서 유효성 규칙 정의
- `zodResolver`로 React Hook Form과 연결
- `form.handleSubmit()`으로 제출 시 자동 검증

---

## 8. 인증 / 인가 흐름

### 8.1 앱 초기화

```tsx
// src/app/main.tsx
import { setupAuthAxiosInterceptor } from '@features/auth/lib/setup-auth-interceptor';

setupAuthAxiosInterceptor();  // Axios 인터셉터 등록

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

`setupAuthAxiosInterceptor()`는 앱 마운트 전에 호출되어 모든 HTTP 요청에 인터셉터가 적용된다.

### 8.2 인터셉터 DI 구조

```
shared/api/axios-interceptor.ts              ←── 인터페이스 정의 (shared 레이어)
        ↑
features/auth/lib/setup-auth-interceptor.ts  ←── 의존성 주입 (features 레이어)
```

**인터페이스** (`shared/api/axios-interceptor.ts`):

```tsx
export interface AuthInterceptorDeps {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  onRefresh: (refreshToken: string) => Promise<{ accessToken: string }>;
  onRefreshFailure: () => void;
}
```

**DI 주입** (`features/auth/lib/setup-auth-interceptor.ts`):

```tsx
export function setupAuthAxiosInterceptor() {
  setupAuthInterceptor({
    getAccessToken: () => authStorage.getAccessToken(),
    getRefreshToken: () => authStorage.getRefreshToken(),
    onRefresh: async (refreshToken) => {
      const data = await refreshTokenApi({ refreshToken });
      await authService.loginSuccess(data);
      return { accessToken: data.accessToken };
    },
    onRefreshFailure: () => {
      authStorage.clearTokens();
      authStorage.clearMe();
      window.location.href = '/login';
    },
  });
}
```

이 DI 패턴으로 `shared` 레이어가 `features` 레이어에 의존하지 않으면서도 인증 로직과 연결된다 (FSD 단방향 의존성 준수).

### 8.3 인터셉터 동작

**요청 인터셉터**:
1. `getAccessToken()`으로 localStorage에서 토큰 조회
2. 토큰이 있으면 `Authorization: Bearer {token}` 헤더 자동 설정

**응답 인터셉터** (401 처리):
1. 401 응답 수신 + `refreshToken` 존재 + 재시도 안 한 요청이면:
2. `isRefreshing` 플래그로 동시 갱신 방지 (큐잉)
3. `onRefresh(refreshToken)` 호출 → `refreshTokenApi` → `authService.loginSuccess()` → 새 토큰 저장
4. 원래 요청을 새 토큰으로 재시도
5. 갱신 실패 시 `onRefreshFailure()` → localStorage 클리어 + `/login` 하드 리다이렉트

**동시 요청 큐 처리**:
- 첫 번째 401 요청이 갱신 진행 중이면 후속 401 요청들은 `failedQueue`에 대기
- 갱신 성공: 큐의 모든 요청에 새 토큰 전달 후 재시도
- 갱신 실패: 큐의 모든 요청 reject

### 8.4 토큰 저장

모든 토큰은 **localStorage**에 저장한다:

| 키 | 값 | 타입 |
|----|-----|------|
| `accessToken` | JWT access token | `string` |
| `refreshToken` | JWT refresh token | `string` |
| `me` | 사용자 정보 (MeResponse) | `JSON string` |

```tsx
// src/features/auth/lib/auth-storage.ts
export const authStorage = {
  setTokens: (data) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
  },
  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
  setMe: (me) => localStorage.setItem('me', JSON.stringify(me)),
  getMe: (): MeResponse | null => {
    const raw = localStorage.getItem('me');
    if (!raw) return null;
    try { return JSON.parse(raw); }
    catch { localStorage.removeItem('me'); return null; }
  },
  clearMe: () => localStorage.removeItem('me'),
};
```

### 8.5 로그인 플로우

```
1. LoginForm → useLogin() 뮤테이션 호출
2. loginApi(POST /auth/login) → LoginResponse 수신
3. authService.loginSuccess(data):
   a. authStorage.setTokens({ accessToken, refreshToken })  → localStorage 저장
   b. useAuthStore.getState().setAccessToken(accessToken)    → Zustand 갱신
   c. meApi(GET /auth/me)                                    → 사용자 정보 조회
   d. authStorage.setMe(me)                                  → localStorage 저장
   e. useAuthStore.getState().setMe(me)                      → Zustand 갱신
4. login-form.tsx의 onSuccess → navigate('/home')
```

### 8.6 로그아웃 플로우

```tsx
// src/features/auth/model/use-logout.ts
export function useLogout() {
  const navigate = useNavigate();
  return useCallback(async () => {
    const refreshToken = authStorage.getRefreshToken();
    if (refreshToken) {
      try { await logoutApi({ refreshToken }); }    // POST /auth/logout
      catch { /* 토큰 폐기 실패해도 로컬 로그아웃 진행 */ }
    }
    authStorage.clearTokens();
    authStorage.clearMe();
    useAuthStore.getState().clearAuth();
    navigate('/login', { replace: true });
  }, [navigate]);
}
```

### 8.7 전체 기기 로그아웃

```tsx
// src/features/auth/model/use-logout-all.ts
export function useLogoutAll() {
  const navigate = useNavigate();
  return useCallback(async () => {
    await logoutAllApi();                     // POST /auth/logout-all
    authStorage.clearTokens();
    authStorage.clearMe();
    useAuthStore.getState().clearAuth();
    navigate('/login', { replace: true });
  }, [navigate]);
}
```

### 8.8 Auth Service

`authService`는 인증 관련 비즈니스 로직을 중앙 집중화한다:

```tsx
// src/features/auth/model/auth.service.ts
export const authService = {
  loginSuccess: async (data) => {
    authStorage.setTokens(data);                               // localStorage
    useAuthStore.getState().setAccessToken(data.accessToken);  // Zustand
    try {
      const me = await meApi();                                // GET /auth/me
      authStorage.setMe(me);                                   // localStorage
      useAuthStore.getState().setMe(me);                       // Zustand
    } catch (e) {
      console.error('[auth] 사용자 정보 조회 실패:', e);
      authStorage.clearMe();
    }
  },
  setMe: (me) => authStorage.setMe(me),
  getMe: () => authStorage.getMe(),
  clearMe: () => authStorage.clearMe(),
};
```

### 8.9 프로필 수정 후 상태 동기화

```tsx
// src/features/auth/model/use-update-profile.ts
onSuccess: (data) => {
  const currentMe = useAuthStore.getState().me;
  if (!currentMe) return;
  const mergedMe = { ...currentMe, user: { ...currentMe.user, ...data } };
  authStorage.setMe(mergedMe);             // localStorage 갱신
  useAuthStore.getState().setMe(mergedMe); // Zustand 갱신
},
```

프로필 수정 응답 데이터를 기존 `me` 객체에 병합하여 즉시 동기화한다.

---

## 9. 권한 처리

### 9.1 권한 모델

권한 키 패턴: `{pageName}.{action}`

- `pageName`: 서버에서 정의한 페이지 식별자 (예: `users`, `roles`, `super.dashboard`)
- `action`: `read` | `create` | `update` | `delete`
- 예: `users.read`, `roles.create`, `super.dashboard.read`

`MeResponse.permissions`는 `Record<string, boolean>` 형태로, 보유한 권한만 `true` 값을 가진다.

### 9.2 권한 체크 함수

```tsx
// src/features/auth/lib/permission.ts
export function hasPermission(
  permissions: Permissions,
  pageName: string,
  action: PermissionAction,
): boolean {
  return permissions[`${pageName}.${action}`] === true;
}

export function hasReadPermission(
  permissions: Permissions,
  pageName: string,
): boolean {
  return hasPermission(permissions, pageName, 'read');
}
```

### 9.3 메뉴 필터링

```tsx
export function filterMenuTree(
  menuTree: MenuTree[],
  permissions: Permissions,
): MenuTree[] {
  return menuTree
    .filter((node) => hasReadPermission(permissions, node.pageName))
    .map((node) => ({
      ...node,
      children: filterMenuTree(node.children, permissions),
    }))
    .filter((node) => node.children.length > 0 || !hasChildren(menuTree, node.pageName))
    .sort((a, b) => a.order - b.order);
}
```

- leaf 노드: 자신의 `read` 권한 체크
- 부모 노드: children 필터링 후 남은 자식이 없으면 부모도 제거
- `order` 기준 정렬

### 9.4 useMe 훅

```tsx
// src/features/auth/model/use-me.ts
export function useMe(): UseMeReturn {
  const me = useAuthStore((state) => state.me);
  const menuTree = useMemo(
    () => (me ? filterMenuTree(me.menuTree, me.permissions) : []),
    [me],
  );
  const pathNameMap = useMemo(() => buildPathNameMap(menuTree), [menuTree]);
  const permissions = me?.permissions ?? {};
  const hasPermission = useMemo(
    () => (pageName: string, action: PermissionAction) =>
      checkPermission(permissions, pageName, action),
    [permissions],
  );
  return { me, menuTree, pathNameMap, permissions, hasPermission };
}
```

**반환값**:

| 필드 | 타입 | 용도 |
|------|------|------|
| `me` | `MeResponse \| null` | 사용자 정보 전체 |
| `menuTree` | `MenuTree[]` | 권한 필터링된 메뉴 트리 |
| `pathNameMap` | `Record<string, string>` | path → displayName 맵 (breadcrumb) |
| `permissions` | `Record<string, boolean>` | 원본 permissions 객체 |
| `hasPermission` | `(pageName, action) => boolean` | 권한 체크 함수 |

### 9.5 MenuTree 구조

```tsx
export interface MenuTree {
  pageName: string;      // 권한 키 접두사 (예: 'users')
  displayName: string;   // UI 표시명 (예: '사용자 관리')
  path: string;          // 라우트 경로 (예: '/users')
  order: number;         // 정렬 순서
  children: MenuTree[];  // 하위 메뉴
}
```

서버에서 전달하는 `menuTree`는 전체 메뉴를 포함하며, 클라이언트에서 `filterMenuTree()`로 권한이 있는 메뉴만 필터링한다.

---

## 10. 타입 및 스키마 구조

### 10.1 Auth 타입

```tsx
// src/features/auth/types/auth.type.ts

export interface LoginRequest {
  tenantName: string;
  userId: string;
  password: string;
}

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

export type RefreshTokenRequest = { refreshToken: string };
export type RefreshTokenResponse = Pick<LoginResponse, 'accessToken' | 'expiresIn' | 'refreshToken' | 'refreshExpiresAt'>;

export interface SignupRequest {
  companyName: string;
  adminName: string;
  email: string;
  phone: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  tenant: { tenantId: number; tenantName: string };
  admin: { userSeq: number; userId: string; userName: string };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  corpName?: string;
  userName?: string;
  userEmail?: string;
  userTel?: string;
  userHp?: string;
}

export type UpdateProfileResponse = LoginResponse['user'];
export type PermissionAction = 'read' | 'create' | 'update' | 'delete';
export type Permissions = Record<string, boolean>;
```

### 10.2 Auth 스키마

#### loginSchema

```tsx
z.object({
  tenantName: z.string().min(1, '업체명을 입력하세요'),
  userId: z.string().min(1, '아이디를 입력하세요'),
  password: z.string().min(1, '비밀번호를 입력하세요'),
})
```

#### signupSchema

```tsx
z.object({
  companyName: z.string().min(1, '회사명을 입력하세요'),
  adminName: z.string().min(1, '관리자 이름을 입력하세요'),
  email: z.string().min(1, '이메일을 입력하세요').email('올바른 이메일 형식이 아닙니다'),
  phone: z.string().min(1, '전화번호를 입력하세요'),
  password: z.string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .regex(/[A-Z]/, '대문자를 포함해야 합니다')
    .regex(/[0-9]/, '숫자를 포함해야 합니다')
    .regex(/[!@#$%^&*]/, '특수문자를 포함해야 합니다'),
  passwordConfirm: z.string().min(1, '비밀번호를 다시 입력하세요'),
}).refine(data => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['passwordConfirm'],
})
```

#### changePasswordSchema

```tsx
const passwordRule = z.string()
  .min(8, '비밀번호는 8자 이상이어야 합니다')
  .regex(/[A-Za-z]/, '영문자를 포함해야 합니다')
  .regex(/[0-9]/, '숫자를 포함해야 합니다')
  .regex(/[!@#$%^&*]/, '특수문자를 포함해야 합니다');

z.object({
  currentPassword: z.string().min(1, '현재 비밀번호를 입력하세요'),
  newPassword: passwordRule,
  confirmPassword: z.string().min(1, '새 비밀번호를 다시 입력하세요'),
})
.refine(data => data.newPassword === data.confirmPassword, {
  message: '새 비밀번호가 일치하지 않습니다', path: ['confirmPassword'],
})
.refine(data => data.currentPassword !== data.newPassword, {
  message: '현재 비밀번호와 다른 비밀번호를 입력하세요', path: ['newPassword'],
})
```

#### updateProfileSchema

```tsx
z.object({
  corpName: z.string().min(1, '회사명을 입력하세요').max(100, '회사명은 100자 이하로 입력하세요'),
  userName: z.string().min(1, '이름을 입력하세요').max(50, '이름은 50자 이하로 입력하세요'),
  userEmail: z.string().min(1, '이메일을 입력하세요').email('올바른 이메일 형식이 아닙니다'),
  userTel: z.string().max(20, '전화번호는 20자 이하로 입력하세요').optional().or(z.literal('')),
  userHp: z.string().max(20, '휴대폰 번호는 20자 이하로 입력하세요').optional().or(z.literal('')),
})
```

### 10.3 User 타입

```tsx
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
  pageInfo: { currentPage: number; pageSize: number; totalItems: number; totalPages: number };
}

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

export interface GetUserResponse extends User {
  assignedRoleIds: number[];
  availableRoles: Role[];
}

export interface UpdateUserRequest {
  userName?: string; userEmail?: string; userTel?: string; userHp?: string; corpName?: string; roleIds?: number[];
}

export interface UpdateUserRolesRequest { add?: number[]; remove?: number[] }
export interface ResetUserPasswordRequest { newPassword: string }
export interface UpdateUserStatusRequest { isActive: 0 | 1 }
```

### 10.4 Tenant 타입

```tsx
export interface Tenant {
  tenantId: number;
  tenantName: string;
  displayName: string;
  domain: string;
  isActive: number;
  createdAt: string;
  updatedAt: string;
  userCount: number;
}

export interface CreateTenantRequest { tenantName: string; displayName: string; domain: string; isActive?: number }
export type GetTenantResponse = Omit<Tenant, 'userCount'>;
export interface UpdateTenantRequest { tenantName?: string; displayName?: string; domain?: string; isActive?: number }
export interface UpdateTenantStatusRequest { isActive: 0 | 1 }
```

### 10.5 Role 타입

```tsx
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

export interface RoleDetailResponse extends Omit<Role, 'userCount' | 'permissionCount'> {
  permissionsByPage: RolePermissionsByPage[];
  assignedUsers: RoleAssignedUser[];
}

export interface RolePermissionsByPage {
  pageId: number; pageName: string; pageDisplayName: string;
  permissions: RolePermission[];
}

export interface RolePermission {
  permissionId: number; displayName: string; description: string | null;
  actionId: number; actionName: string; actionDisplayName: string;
}

export interface CreateRoleRequest { roleName: string; displayName: string; description?: string }
export interface UpdateRolePermissionsRequest { add?: number[]; remove?: number[] }
export interface CopyRolePermissionsRequest { sourceRoleId: number }
```

### 10.6 RBAC 타입 (Admin Page / Action / Permission)

#### AdminPage

```tsx
export interface AdminPageListItem {
  pageId: number; parentId: number | null; pageName: string; path: string;
  displayName: string; description: string | null; isActive: number;
  sortOrder: number | null; childCount: number; permissionCount: number;
  parent: { pageId: number; pageName: string; displayName: string } | null;
}

export interface AdminPageResponse {
  pageId: number; parentId: number | null; pageName: string; path: string;
  displayName: string; description: string | null; isActive: number;
  sortOrder: number | null; createdAt: string; updatedAt: string;
  children: AdminPageChild[];
}
```

#### AdminAction

```tsx
export interface AdminActionListItem {
  actionId: number; actionName: string; displayName: string | null;
  isActive: number; permissionCount: number;
}

export interface AdminActionResponse {
  actionId: number; actionName: string; displayName: string | null;
  isActive: number; createdAt: string; updatedAt: string;
}
```

#### AdminPermission

```tsx
export interface AdminPermissionListItem {
  permissionId: number; pageId: number; actionId: number;
  displayName: string | null; description: string | null; isActive: number;
  page: { pageId: number; pageName: string; displayName: string } | null;
  action: { actionId: number; actionName: string; displayName: string } | null;
}
```

### 10.7 Permission Catalog 타입

```tsx
export interface GetPermissionCatalogResponse {
  pages: CatalogPage[];
  actions: CatalogAction[];
  permissions: CatalogPermission[];
  matrix: Record<string, MatrixEntry[]>;  // key: pageName, value: 액션별 권한 존재 여부
}
```

### 10.8 Super Dashboard 타입

```tsx
export interface SuperDashboardResponse {
  overview: SuperDashboardOverview;
  today: SuperDashboardToday;
  monthlyTrends: SuperDashboardMonthlyTrends;
  security: SuperDashboardSecurity;
  tenantStats: TenantStat[];
}

// overview: totalTenants, activeTenants, totalUsers, activeUsers, totalCounsels, totalPosts, totalRoles, totalPermissions
// today: newUsers, newCounsels, newPosts, activeSessions
// monthlyTrends: userRegistrations[], counselRegistrations[], tenantRegistrations[]
// security: totalBlockedIps, totalBlockedHps, totalBlockedWords, recentBlockedIps, recentBlockedHps
// tenantStats: tenantId, tenantName, isActive, ..., userCount, counselCount, postCount, roleCount, websiteCount, blockedIpCount, ...
```

### 10.9 Tenant Status 타입

```tsx
export interface TenantStatus {
  tenantStatusId: number; statusGroup: string; statusKey: string; statusName: string;
  description: string; color: string; sortOrder: number; isActive: number;
  createdAt: string; updatedAt: string;
}

export interface GetTenantStatusesResponse {
  groups: TenantStatusGroup[];  // statusGroup별 그룹핑
  total: number;
}

export interface CreateTenantStatusRequest {
  statusGroup: string; statusKey: string; statusName: string;
  description?: string; color: string; sortOrder?: number; isActive?: number;
}
```

### 10.10 Website 타입

```tsx
export interface Website {
  webCode: string;       // PK (문자열)
  userSeq: number;       // 담당 관리자
  userName: string;
  webUrl: string; webTitle: string; webImg: string; webDesc: string; webMemo: string;
  isActive: number; duplicateAllowAfterDays: number;
  tenantId: number; createdAt: string; updatedAt: string;
}

export interface CreateWebsiteRequest {
  webCode: string; userSeq: number; webUrl: string; webTitle: string;
  webImg?: string; webDesc?: string; webMemo?: string;
  isActive?: number; duplicateAllowAfterDays?: number;
}
```

### 10.11 Security 타입

#### BlockIp

```tsx
export interface BlockIp {
  dbiIdx: number; tenantId: number; blockIp: string; reason: string | null;
  isActive: number; createdBy: number | null; createdAt: string; updatedAt: string;
}

export interface BulkCreateBlockIpRequest { ips: string; reason?: string; isActive?: number }
export interface BulkCreateBlockIpResponse { successCount: number; skippedCount: number; totalCount: number; skippedIps: string[] }
export interface CheckBlockedResponse { isBlocked: boolean; reason?: string | null; blockId?: number; matchedWord?: string }
```

#### BlockHp

```tsx
export interface BlockHp {
  dbhIdx: number; tenantId: number; blockHp: string; reason: string | null;
  isActive: number; createdBy: number | null; createdAt: string; updatedAt: string;
}
```

#### BlockWord

```tsx
export type MatchType = 'EXACT' | 'CONTAINS' | 'REGEX';

export interface BlockWord {
  dbwIdx: number; tenantId: number; blockWord: string; matchType: MatchType;
  reason: string | null; isActive: number; createdBy: number | null;
  createdAt: string; updatedAt: string;
}
```

### 10.12 Board Type 타입

```tsx
export interface BoardType {
  boardId: number; boardKey: string; name: string; description: string | null;
  isActive: number; sortOrder: number | null; createdAt: string; updatedAt: string;
}

export interface CreateBoardTypeRequest { boardKey: string; name: string; description?: string; sortOrder?: number }
```

### 10.13 Board (Post) 타입

```tsx
export interface Post {
  postId: number; boardId: number; userSeq: number; title: string;
  isNotice: number; isActive: number; startDtm: string | null; endDtm: string | null;
  createdAt: string; updatedAt: string;
}

export interface PostDetail extends Post {
  content: string;  // HTML 콘텐츠
}

export interface CreatePostRequest { title: string; content: string; isNotice?: number; startDtm?: string | null; endDtm?: string | null }
```

### 10.14 Counsel 타입

```tsx
export interface CounselListItem {
  counselSeq: number; webCode: string; webTitle: string | null;
  name: string | null; counselHp: string; counselStat: number; statusName: string | null;
  empSeq: number | null; empName: string | null; duplicateState: string;
  counselResvDtm: string | null; regDtm: string; editDtm: string;
  fieldValues: CounselFieldValueResponse[];
}

export interface CounselDetail extends CounselListItem {
  counselIp: string; counselSource: string | null;
  counselMedium: string | null; counselCampaign: string | null;
  counselMemo: string | null; logs: CounselLog[]; memos: CounselMemo[];
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
```

### 10.15 Feature Slice별 Public API 요약

| Feature | UI 컴포넌트 | 훅 | 스키마 |
|---------|-----------|-----|--------|
| **auth** | LoginForm, SignupForm, ChangePasswordForm, ProfileEditForm | useLogin, useSignup, useLogout, useLogoutAll, useMe, useChangePassword, useUpdateProfile | loginSchema, signupSchema, changePasswordSchema, updateProfileSchema |
| **user** | UserTable, UserDetail, UserCreateForm, UserEditForm, UserPasswordForm | useUsers, useUser, useCreateUser, useUpdateUser, useUpdateUserStatus, useResetUserPassword, useInvalidateUserTokens, useUpdateUserRoles | createUserSchema, updateUserSchema, resetUserPasswordSchema |
| **tenant** | TenantTable, TenantDetail, TenantCreateForm, TenantEditForm | useTenants, useTenant, useCreateTenant, useUpdateTenant, useDeleteTenant, useUpdateTenantStatus | createTenantSchema, updateTenantSchema |
| **role** | RoleTable, RoleCreateForm, RoleEditForm, RoleDetailDrawer | useRoles, useRole, useCreateRole, useUpdateRole, useDeleteRole, useUpdateRoleStatus, useUpdateRolePermissions, useCopyRolePermissions, useAddUserToRole, useRemoveUserFromRole | createRoleSchema, updateRoleSchema |
| **admin-page** | AdminPageTable, AdminPageDetail, AdminPageCreateForm, AdminPageEditForm | useAdminPages, useAdminPage, useCreateAdminPage, useUpdateAdminPage, useUpdateAdminPageStatus, useDeleteAdminPage | createAdminPageSchema, updateAdminPageSchema |
| **admin-action** | AdminActionTable, AdminActionDetail, AdminActionCreateForm, AdminActionEditForm | useAdminActions, useAdminAction, useCreateAdminAction, useUpdateAdminAction, useUpdateAdminActionStatus, useDeleteAdminAction | createAdminActionSchema, updateAdminActionSchema |
| **admin-permission** | AdminPermissionTable, AdminPermissionDetail, AdminPermissionCreateForm, AdminPermissionEditForm, AdminPermissionMatrix | useAdminPermissions, useAdminPermission, useCreateAdminPermission, useUpdateAdminPermission, useUpdateAdminPermissionStatus, useDeleteAdminPermission | createAdminPermissionSchema, updateAdminPermissionSchema |
| **permission-catalog** | PermissionMatrix | usePermissionCatalog | — |
| **super-dashboard** | OverviewCards, TodayCards, MonthlyTrendsChart, SecurityCards, TenantStatsTable | useSuperDashboard | — |
| **tenant-status** | StatusSummaryCards, StatusGroupList, StatusCreateForm, StatusDetail, StatusEditForm | useTenantStatuses, useTenantStatus, useCreateTenantStatus, useUpdateTenantStatus, useDeleteTenantStatus, useUpdateTenantStatusActive | createTenantStatusSchema, updateTenantStatusSchema |
| **website** | WebsiteTable, WebsiteDetail, WebsiteCreateForm, WebsiteEditForm | useWebsites, useWebsite, useCreateWebsite, useUpdateWebsite, useDeleteWebsite, useUpdateWebsiteStatus | createWebsiteSchema, updateWebsiteSchema |
| **security** | BlockIp(Table/Detail/CreateForm/EditForm/Check), BlockHp(동일), BlockWord(동일) | useBlockIps, useBlockIp, useCreateBlockIp, useBulkCreateBlockIp, useUpdateBlockIp, useDeleteBlockIp, useCheckBlockIp + HP/Word 동일 패턴 | create/update/bulkCreate × Ip/Hp/Word (9개) |
| **board-type** | BoardTypeTable, BoardTypeDetail, BoardTypeCreateForm, BoardTypeEditForm | useBoardTypes, useBoardType, useCreateBoardType, useUpdateBoardType, useDeleteBoardType | createBoardTypeSchema, updateBoardTypeSchema |
| **board** | PostTable, PostDetail, PostCreateForm, PostEditForm | usePosts, usePost, useCreatePost, useUpdatePost, useDeletePost | createPostSchema, updatePostSchema |
| **counsel** | SummaryCards, StatusDistributionChart, EmployeeStatsChart, DailyTrendsChart, TopWebsitesChart, HourlyDistributionChart, UpcomingReservationsTable, CounselTable, CounselDetail, CounselEditForm, ReservationCalendar | useCounselDashboard, useCounsels, useCounsel, useUpdateCounsel, useDeleteCounsel, useUpdateCounselStatus, useCreateCounselMemo | — |
