# Flowdesk Admin Frontend

## 목차

- [Flowdesk Admin Frontend](#flowdesk-admin-frontend)
  - [목차](#목차)
  - [프로젝트 소개](#프로젝트-소개)
  - [주요 기술 스택](#주요-기술-스택)
  - [시작하기](#시작하기)
    - [사전 요구사항](#사전-요구사항)
    - [설치 및 실행](#설치-및-실행)
    - [환경 변수](#환경-변수)
    - [사용 가능한 스크립트](#사용-가능한-스크립트)
  - [폴더 구조](#폴더-구조)
  - [폴더/파일 구조 규칙 및 사용 가이드](#폴더파일-구조-규칙-및-사용-가이드)
    - [레이어별 역할 요약](#레이어별-역할-요약)
    - [폴더별 생성/사용 예시](#폴더별-생성사용-예시)
    - [Feature Slice 내부 구조 가이드](#feature-slice-내부-구조-가이드)
    - [Path Alias](#path-alias)
  - [라우팅 구조](#라우팅-구조)
  - [구현 현황](#구현-현황)
  - [배포](#배포)
  - [문서](#문서)

---

## 프로젝트 소개

Flowdesk Admin Frontend는 React 19, TypeScript, Vite 8, Ant Design 6, TanStack Query 등 최신 프론트엔드 스택을 기반으로 한 **어드민 대시보드** 프로젝트입니다.

**Feature-Sliced Design (FSD)** 아키텍처를 채택하여 확장성과 유지보수성을 고려한 폴더 구조와 모듈화 전략을 적용하였습니다. 멀티 테넌트 인증, JWT 토큰 자동 갱신, 보호된 라우트 등의 기능을 포함합니다.

## 주요 기술 스택

| 카테고리 | 기술 | 버전 |
|---------|------|------|
| **프레임워크** | React | 19.2.4 |
| **언어** | TypeScript | 5.9.3 |
| **빌드 도구** | Vite | 8.0.0 |
| **UI 라이브러리** | Ant Design | 6.3.3 |
| **아이콘** | @ant-design/icons | 6.1.0 |
| **서버 상태** | TanStack React Query | 5.90.21 |
| **클라이언트 상태** | Zustand | 5.0.12 |
| **폼 관리** | React Hook Form | 7.71.2 |
| **폼 리졸버** | @hookform/resolvers | 5.2.2 |
| **유효성 검증** | Zod | 4.3.6 |
| **HTTP 클라이언트** | Axios | 1.13.6 |
| **라우팅** | React Router DOM | 7.13.1 |
| **차트** | Recharts | 3.8.0 |
| **날짜** | Day.js | 1.11.20 |
| **리치 텍스트** | React Quill New | 3.8.3 |
| **XSS 방어** | DOMPurify | 3.3.3 |
| **테스트** | Vitest + Testing Library | 4.1.0 |
| **모킹** | MSW | 2.12.11 |
| **코드 품질** | ESLint + Prettier | 10.0.3 / 3.8.1 |

## 시작하기

### 사전 요구사항

- **Node.js** 18 이상
- **npm** 또는 **yarn**

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과물 미리보기
npm run preview
```

### 환경 변수

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수를 설정합니다:

```env
VITE_API_URL=https://your-api-server.com
```

### 사용 가능한 스크립트

| 스크립트 | 설명 |
|---------|------|
| `npm run dev` | Vite 개발 서버 실행 (포트 3000, 자동 브라우저 열기) |
| `npm run build` | TypeScript 타입 체크 후 프로덕션 빌드 (`dist/` 출력) |
| `npm run preview` | 빌드된 결과물을 로컬에서 미리보기 |
| `npm run typecheck` | TypeScript 타입 체크만 실행 (`tsc --noEmit`) |

## 폴더 구조

```
flowdesk-admin-frontend/
├─ index.html                    # HTML 엔트리포인트 (Vite SPA)
├─ package.json                  # 의존성 및 스크립트 정의
├─ tsconfig.json                 # TypeScript 설정 (strict 모드)
├─ tsconfig.node.json            # Vite 설정용 TypeScript 설정
├─ vite.config.ts                # Vite 빌드/개발 서버 설정
├─ vite-env.d.ts                 # Vite 환경 타입 정의
├─ vercel.json                   # Vercel SPA 라우팅 리라이트 설정
├─ docs/                         # 프로젝트 문서
│  ├─ architecture.md            # 아키텍처 상세 문서
├─ public/                       # 정적 파일 (favicon 등)
│
└─ src/
   ├─ app/                       # 앱 진입점, 전역 Provider, 라우터
   │  ├─ App.tsx                 # 루트 컴포넌트 (라우터 + QueryClientProvider)
   │  ├─ main.tsx                # ReactDOM 엔트리 (인터셉터 초기화 포함)
   │  ├─ ProtectedRoute.tsx      # 인증 보호 라우트 가드
   │  ├─ layouts/                # 레이아웃 컴포넌트
   │  │  ├─ main-layout.tsx     # 메인 레이아웃 (Sidebar + Header + Outlet)
   │  │  └─ main-layout.module.css  # 레이아웃 스타일
   │  └─ styles/                 # 글로벌 스타일
   │     ├─ global.css           # CSS 리셋, CSS Custom Properties 토큰, 접근성 스타일
   │     └─ antd-overrides.module.css  # Ant Design 오버라이드 (CSS Modules)
   │
   ├─ shared/                    # 공통 모듈 (API, 타입, 유틸, 에셋)
   │  ├─ api/
   │  │  ├─ axios.ts             # Axios 인스턴스 (baseURL, 기본 헤더)
   │  │  ├─ axios-interceptor.ts # 인터셉터 설정 인터페이스 (DI 패턴, FSD 준수)
   │  │  └─ query-client.ts      # QueryClient 공유 모듈 (retry: 1)
   │  ├─ assets/
   │  │  └─ logo.png             # 애플리케이션 로고
   │  ├─ types/
   │  │  └─ error-response.type.ts  # 공통 API 에러 응답 타입
   │  ├─ ui/
   │  │  └─ rich-text-editor/       # React Quill 기반 WYSIWYG 에디터
   │  │     ├─ rich-text-editor.tsx
   │  │     └─ rich-text-editor.module.css
   │  └─ utils/
   │     └─ api-error-message.ts    # 에러 코드→한국어 메시지 매핑 유틸
   │
   ├─ widgets/                   # 레이아웃 공통 UI 블록
   │  ├─ sidebar/
   │  │  ├─ sidebar.tsx          # 사이드바 컴포넌트 (동적 메뉴, 접기/펼치기, 모바일 오버레이, 유저 클릭→마이페이지)
   │  │  ├─ sidebar.module.css   # 사이드바 스타일 (호버 효과 포함)
   │  │  ├─ sidebar.type.ts      # SidebarProps 타입
   │  │  └─ lib/
   │  │     ├─ build-menu-items.ts  # MenuTree[] → AntD MenuItem[] 재귀 변환
   │  │     └─ menu-icon-map.tsx    # pageName → 아이콘 매핑 테이블
   │  ├─ header/
   │  │  ├─ header.tsx           # 헤더 컴포넌트 (토글, 브레드크럼, 알림, 프로필, 비밀번호 변경 모달)
   │  │  ├─ header.module.css    # 헤더 스타일
   │  │  └─ header.type.ts       # HeaderProps 타입
   │  └─ breadcrumb/
   │     ├─ breadcrumb.tsx       # 브레드크럼 컴포넌트 (동적 pathNameMap 기반)
   │     └─ breadcrumb.module.css # 브레드크럼 스타일
   │
   ├─ features/                  # 도메인(기능)별 Feature Slice
   │  ├─ auth/                   # 인증/권한 도메인
   │  │  ├─ index.ts             # Public API (외부 노출 인터페이스)
   │  │  ├─ api/                 # API 호출 함수
   │  │  │  ├─ endpoints.ts      # API 엔드포인트 상수 정의
   │  │  │  ├─ login.api.ts      # POST /auth/login
   │  │  │  ├─ logout.api.ts     # POST /auth/logout
   │  │  │  ├─ logout-all.api.ts # POST /auth/logout-all
   │  │  │  ├─ me.api.ts         # GET /auth/me
   │  │  │  ├─ change-password.api.ts  # POST /auth/change-password
   │  │  │  ├─ update-profile.api.ts   # PATCH /auth/me/profile
   │  │  │  ├─ refresh-token.api.ts  # POST /auth/refresh-token
   │  │  │  └─ signup.api.ts     # POST /auth/signup
   │  │  ├─ lib/                 # 비즈니스 로직 헬퍼
   │  │  │  ├─ auth-storage.ts   # localStorage 토큰/사용자 정보 관리
   │  │  │  ├─ permission.ts     # 권한 체크 + 메뉴 필터링 + pathNameMap 빌드
   │  │  │  └─ setup-auth-interceptor.ts  # Axios 인터셉터에 auth 의존성 주입
   │  │  ├─ model/               # 상태 관리, 서비스, 커스텀 훅
   │  │  │  ├─ auth.store.ts     # Zustand 인증 상태 스토어 (accessToken + me)
   │  │  │  ├─ auth.service.ts   # 로그인 성공 처리, 사용자 정보 관리
   │  │  │  ├─ login.schema.ts   # Zod 로그인 폼 유효성 스키마
   │  │  │  ├─ signup.schema.ts  # Zod 회원가입 폼 유효성 스키마 (refine 비밀번호 확인)
   │  │  │  ├─ change-password.schema.ts  # Zod 비밀번호 변경 스키마 (비밀번호 규칙 + refine)
   │  │  │  ├─ update-profile.schema.ts   # Zod 프로필 수정 스키마 (이메일/길이 검증)
   │  │  │  ├─ use-login.ts      # useLogin() React Query 뮤테이션 훅
   │  │  │  ├─ use-signup.ts     # useSignup() React Query 뮤테이션 훅
   │  │  │  ├─ use-logout.ts     # useLogout() 로그아웃 훅 (API + 로컬 상태 정리)
   │  │  │  ├─ use-logout-all.ts  # useLogoutAll() 전체 기기 로그아웃 훅
   │  │  │  ├─ use-me.ts         # useMe() 사용자/메뉴/권한 훅 (Zustand 구독)
   │  │  │  ├─ use-change-password.ts  # useChangePassword() 비밀번호 변경 훅
   │  │  │  ├─ use-update-profile.ts   # useUpdateProfile() 프로필 수정 훅 (로컬 상태 병합)
   │  │  │  └─ use-refresh-token.ts  # useRefreshToken() 뮤테이션 훅
   │  │  ├─ types/               # 도메인 타입 정의
   │  │  │  └─ auth.type.ts      # LoginRequest/Response, MeResponse, MenuTree, 권한 타입 등
   │  │  └─ ui/                  # 도메인 UI 컴포넌트 (컴포넌트별 폴더 분리)
   │  │     ├─ login-form/
   │  │     │  ├─ login-form.tsx    # 로그인 폼 (React Hook Form + Zod + Ant Design)
   │  │     │  └─ login-form.module.css
   │  │     ├─ signup-form/
   │  │     │  ├─ signup-form.tsx   # 회원가입 폼 (6필드, passwordConfirm 제거 후 전송)
   │  │     │  └─ signup-form.module.css
   │  │     ├─ change-password-form/
   │  │     │  ├─ change-password-form.tsx    # 비밀번호 변경 모달 폼 (3필드)
   │  │     │  └─ change-password-form.module.css
   │  │     └─ profile-edit-form/
   │  │        ├─ profile-edit-form.tsx       # 프로필 수정 모달 폼 (5필드)
   │  │        └─ profile-edit-form.module.css
   │  │
   │  ├─ user/                   # 사용자 관리 도메인
   │  │  ├─ index.ts             # Public API (UI 컴포넌트, 훅, 스키마, 타입 노출)
   │  │  ├─ api/                 # API 호출 함수
   │  │  │  ├─ user.endpoint.ts  # API 엔드포인트 상수 (USER_ENDPOINTS)
   │  │  │  ├─ get-users.api.ts  # GET /users (목록 조회)
   │  │  │  ├─ get-user.api.ts   # GET /users/{id} (상세 조회)
   │  │  │  ├─ create-user.api.ts  # POST /users (생성)
   │  │  │  ├─ update-user.api.ts  # PATCH /users/{id} (수정)
   │  │  │  ├─ update-user-status.api.ts  # PATCH /users/{id}/status (상태 변경)
   │  │  │  ├─ reset-user-password.api.ts  # PATCH /users/{id}/password (비밀번호 초기화)
   │  │  │  ├─ invalidate-user-tokens.api.ts  # POST /users/{id}/invalidate-tokens (강제 로그아웃)
   │  │  │  └─ update-user-roles.api.ts  # PATCH /users/{id}/roles (역할 변경)
   │  │  ├─ model/               # 커스텀 훅, Zod 스키마
   │  │  │  ├─ use-users.ts      # useUsers() 사용자 목록 조회 훅 (useQuery)
   │  │  │  ├─ use-user.ts       # useUser() 사용자 상세 조회 훅 (useQuery)
   │  │  │  ├─ use-create-user.ts  # useCreateUser() 뮤테이션 훅
   │  │  │  ├─ use-update-user.ts  # useUpdateUser() 뮤테이션 훅
   │  │  │  ├─ use-update-user-status.ts  # useUpdateUserStatus() 뮤테이션 훅
   │  │  │  ├─ use-reset-user-password.ts  # useResetUserPassword() 뮤테이션 훅
   │  │  │  ├─ use-invalidate-user-tokens.ts  # useInvalidateUserTokens() 뮤테이션 훅
   │  │  │  ├─ use-update-user-roles.ts  # useUpdateUserRoles() 뮤테이션 훅
   │  │  │  ├─ create-user.schema.ts  # Zod 사용자 생성 스키마
   │  │  │  ├─ update-user.schema.ts  # Zod 사용자 수정 스키마
   │  │  │  └─ reset-user-password.schema.ts  # Zod 비밀번호 초기화 스키마
   │  │  ├─ types/
   │  │  │  └─ user.type.ts      # User, GetUsersRequest/Response, CreateUserRequest 등 타입
   │  │  └─ ui/                  # 도메인 UI 컴포넌트
   │  │     ├─ user-table/
   │  │     │  ├─ user-table.tsx  # 사용자 목록 테이블 (정렬, 페이지네이션, Dropdown 액션 메뉴)
   │  │     │  └─ user-table.module.css
   │  │     ├─ user-detail/
   │  │     │  └─ user-detail.tsx  # 사용자 상세 보기 (Descriptions + 역할 정보)
   │  │     ├─ user-create-form/
   │  │     │  ├─ user-create-form.tsx  # 사용자 생성 폼
   │  │     │  └─ user-create-form.module.css
   │  │     ├─ user-edit-form/
   │  │     │  ├─ user-edit-form.tsx  # 사용자 수정 폼 (기본정보/연락처/역할 섹션 분리)
   │  │     │  └─ user-edit-form.module.css
   │  │     └─ user-password-form/
   │  │        ├─ user-password-form.tsx  # 비밀번호 초기화 폼
   │  │        └─ user-password-form.module.css
   │  │
   │  ├─ tenant/                  # 테넌트 관리 도메인
   │  │  ├─ index.ts             # Public API (UI 컴포넌트, 훅, 스키마, 타입 노출)
   │  │  ├─ api/                 # API 호출 함수
   │  │  │  ├─ tenant.endpoint.ts  # API 엔드포인트 상수 (TENANT_ENDPOINTS)
   │  │  │  ├─ get-tenants.api.ts  # GET /tenants (목록 조회)
   │  │  │  ├─ get-tenant.api.ts   # GET /tenants/{id} (상세 조회)
   │  │  │  ├─ create-tenant.api.ts  # POST /tenants (생성)
   │  │  │  ├─ update-tenant.api.ts  # PATCH /tenants/{id} (수정)
   │  │  │  ├─ delete-tenant.api.ts  # DELETE /tenants/{id} (삭제)
   │  │  │  └─ update-tenant-status.api.ts  # PATCH /tenants/{id}/status (상태 변경)
   │  │  ├─ model/               # 커스텀 훅, Zod 스키마
   │  │  │  ├─ use-tenants.ts      # useTenants() 테넌트 목록 조회 훅 (useQuery)
   │  │  │  ├─ use-tenant.ts       # useTenant() 테넌트 상세 조회 훅 (useQuery)
   │  │  │  ├─ use-create-tenant.ts  # useCreateTenant() 뮤테이션 훅
   │  │  │  ├─ use-update-tenant.ts  # useUpdateTenant() 뮤테이션 훅
   │  │  │  ├─ use-delete-tenant.ts  # useDeleteTenant() 뮤테이션 훅
   │  │  │  ├─ use-update-tenant-status.ts  # useUpdateTenantStatus() 뮤테이션 훅
   │  │  │  ├─ create-tenant.schema.ts  # Zod 테넌트 생성 스키마
   │  │  │  └─ update-tenant.schema.ts  # Zod 테넌트 수정 스키마
   │  │  ├─ types/
   │  │  │  └─ tenant.type.ts     # Tenant, GetTenantsRequest/Response, CreateTenantRequest 등 타입
   │  │  └─ ui/                  # 도메인 UI 컴포넌트
   │  │     ├─ tenant-table/
   │  │     │  ├─ tenant-table.tsx  # 테넌트 목록 테이블 (정렬, 페이지네이션, Dropdown 액션 메뉴)
   │  │     │  └─ tenant-table.module.css
   │  │     ├─ tenant-detail/
   │  │     │  └─ tenant-detail.tsx  # 테넌트 상세 보기 (Descriptions)
   │  │     ├─ tenant-create-form/
   │  │     │  ├─ tenant-create-form.tsx  # 테넌트 생성 폼
   │  │     │  └─ tenant-create-form.module.css
   │  │     └─ tenant-edit-form/
   │  │        ├─ tenant-edit-form.tsx  # 테넌트 수정 폼 (기본정보/도메인 섹션 분리)
   │  │        └─ tenant-edit-form.module.css
   │  │
   │  ├─ role/                   # 역할 관리 도메인
   │  │  ├─ index.ts             # Public API (UI 4개, 훅 10개, 스키마 2개, 타입 노출)
   │  │  ├─ api/
   │  │  │  ├─ role.endpoint.ts  # API 엔드포인트 상수 (ROLE_ENDPOINTS)
   │  │  │  ├─ get-roles.api.ts  # GET /roles (역할 목록 조회)
   │  │  │  ├─ get-role.api.ts   # GET /roles/{id} (상세 조회)
   │  │  │  ├─ create-role.api.ts  # POST /roles (생성)
   │  │  │  ├─ update-role.api.ts  # PATCH /roles/{id} (수정)
   │  │  │  ├─ delete-role.api.ts  # DELETE /roles/{id} (삭제)
   │  │  │  ├─ update-role-status.api.ts  # PATCH /roles/{id}/status (상태 변경)
   │  │  │  ├─ update-role-permissions.api.ts  # PATCH /roles/{id}/permissions (권한 수정)
   │  │  │  ├─ copy-role-permissions.api.ts  # PUT /roles/{id}/permissions (권한 복사)
   │  │  │  └─ update-role-users.api.ts  # PATCH /users/{userSeq}/roles (사용자-역할 할당/해제)
   │  │  ├─ model/
   │  │  │  ├─ use-roles.ts      # useRoles() 역할 목록 조회 훅 (useQuery, enabled 옵션)
   │  │  │  ├─ use-role.ts       # useRole() 역할 상세 조회 훅 (useQuery)
   │  │  │  ├─ use-create-role.ts  # useCreateRole() 뮤테이션 훅
   │  │  │  ├─ use-update-role.ts  # useUpdateRole() 뮤테이션 훅
   │  │  │  ├─ use-delete-role.ts  # useDeleteRole() 뮤테이션 훅
   │  │  │  ├─ use-update-role-status.ts  # useUpdateRoleStatus() 뮤테이션 훅
   │  │  │  ├─ use-update-role-permissions.ts  # useUpdateRolePermissions() 뮤테이션 훅
   │  │  │  ├─ use-copy-role-permissions.ts  # useCopyRolePermissions() 뮤테이션 훅
   │  │  │  ├─ use-update-role-users.ts  # useAddUserToRole() + useRemoveUserFromRole() 뮤테이션 훅
   │  │  │  ├─ create-role.schema.ts  # Zod 역할 생성 스키마
   │  │  │  └─ update-role.schema.ts  # Zod 역할 수정 스키마
   │  │  ├─ types/
   │  │  │  └─ role.type.ts      # Role, RoleDetailResponse, CRUD Request/Response, 권한/사용자 타입
   │  │  └─ ui/                  # 도메인 UI 컴포넌트
   │  │     ├─ role-table/
   │  │     │  ├─ role-table.tsx  # 역할 목록 테이블 (통계 바, 페이지네이션, Dropdown 액션 메뉴)
   │  │     │  └─ role-table.module.css
   │  │     ├─ role-create-form/
   │  │     │  ├─ role-create-form.tsx  # 역할 생성 폼
   │  │     │  └─ role-create-form.module.css
   │  │     ├─ role-edit-form/
   │  │     │  ├─ role-edit-form.tsx  # 역할 수정 폼
   │  │     │  └─ role-edit-form.module.css
   │  │     └─ role-detail-drawer/
   │  │        ├─ role-detail-drawer.tsx  # 역할 상세 Drawer (3탭: 기본정보, 권한관리, 할당된 사용자)
   │  │        └─ role-detail-drawer.module.css
   │  │
   │  ├─ super-dashboard/        # 슈퍼 관리자 대시보드 도메인
   │  │  ├─ index.ts             # Public API (UI 컴포넌트 5개, useSuperDashboard 훅, 타입 노출)
   │  │  ├─ api/
   │  │  │  ├─ super-dashboard.endpoint.ts  # API 엔드포인트 상수 (SUPER_DASHBOARD_ENDPOINTS)
   │  │  │  └─ get-super-dashboard.api.ts   # GET /super/dashboard
   │  │  ├─ model/
   │  │  │  └─ use-super-dashboard.ts       # useSuperDashboard() 대시보드 데이터 조회 훅 (useQuery)
   │  │  ├─ types/
   │  │  │  └─ super-dashboard.type.ts      # SuperDashboardResponse, Overview, Today, MonthlyTrends, Security, TenantStat 타입
   │  │  └─ ui/                  # 대시보드 UI 컴포넌트 (컴포넌트별 폴더 분리)
   │  │     ├─ overview-cards/
   │  │     │  ├─ overview-cards.tsx          # 전체 현황 8개 지표 카드
   │  │     │  └─ overview-cards.module.css
   │  │     ├─ today-cards/
   │  │     │  ├─ today-cards.tsx             # 오늘 현황 4개 항목 리스트
   │  │     │  └─ today-cards.module.css
   │  │     ├─ monthly-trends-chart/
   │  │     │  ├─ monthly-trends-chart.tsx    # Recharts AreaChart 12개월 트렌드
   │  │     │  └─ monthly-trends-chart.module.css
   │  │     ├─ security-cards/
   │  │     │  ├─ security-cards.tsx          # 보안 현황 (누적 3개 + 최근 감지 2개)
   │  │     │  └─ security-cards.module.css
   │  │     └─ tenant-stats-table/
   │  │        ├─ tenant-stats-table.tsx      # 테넌트별 14개 컬럼 상세 통계 테이블
   │  │        └─ tenant-stats-table.module.css
   │  │
   │  ├─ permission-catalog/     # 권한 카탈로그 도메인
   │  │  ├─ index.ts             # Public API (PermissionMatrix, usePermissionCatalog, 타입 노출)
   │  │  ├─ api/
   │  │  │  ├─ permission-catalog.endpoint.ts  # PERMISSION_CATALOG_ENDPOINTS 상수
   │  │  │  └─ get-permission-catalog.api.ts   # GET /permissions/catalog
   │  │  ├─ model/
   │  │  │  └─ use-permission-catalog.ts       # usePermissionCatalog() 카탈로그 조회 훅 (useQuery)
   │  │  ├─ types/
   │  │  │  └─ permission-catalog.type.ts      # CatalogPage, CatalogAction, CatalogPermission, MatrixEntry, GetPermissionCatalogResponse 타입
   │  │  └─ ui/
   │  │     └─ permission-matrix/
   │  │        ├─ permission-matrix.tsx        # 트리 구조 권한 매트릭스 (접기/펼치기, 검색, 요약 바)
   │  │        └─ permission-matrix.module.css
   │  │
   │  ├─ tenant-status/           # 테넌트 상태 관리 도메인
   │  │  ├─ index.ts             # Public API (UI 5개, 훅 6개, 스키마 2개, 타입 노출)
   │  │  ├─ api/
   │  │  │  ├─ tenant-status.endpoint.ts      # TENANT_STATUS_ENDPOINTS 상수
   │  │  │  ├─ get-tenant-statuses.api.ts     # GET /tenants/status (목록 조회)
   │  │  │  ├─ get-tenant-status.api.ts       # GET /tenants/status/{id} (상세 조회)
   │  │  │  ├─ create-tenant-status.api.ts    # POST /tenants/status (생성)
   │  │  │  ├─ update-tenant-status.api.ts    # PATCH /tenants/status/{id} (수정)
   │  │  │  ├─ delete-tenant-status.api.ts    # DELETE /tenants/status/{id} (삭제)
   │  │  │  └─ update-tenant-status-active.api.ts  # PATCH /tenants/status/{id}/active (활성화/비활성화)
   │  │  ├─ model/
   │  │  │  ├─ use-tenant-statuses.ts         # useTenantStatuses() 목록 조회 훅 (useQuery)
   │  │  │  ├─ use-tenant-status.ts           # useTenantStatus() 상세 조회 훅 (useQuery)
   │  │  │  ├─ use-create-tenant-status.ts    # useCreateTenantStatus() 뮤테이션 훅
   │  │  │  ├─ use-update-tenant-status.ts    # useUpdateTenantStatus() 뮤테이션 훅
   │  │  │  ├─ use-delete-tenant-status.ts    # useDeleteTenantStatus() 뮤테이션 훅
   │  │  │  ├─ use-update-tenant-status-active.ts  # useUpdateTenantStatusActive() 뮤테이션 훅
   │  │  │  ├─ create-tenant-status.schema.ts # Zod 상태 생성 스키마
   │  │  │  └─ update-tenant-status.schema.ts # Zod 상태 수정 스키마
   │  │  ├─ types/
   │  │  │  └─ tenant-status.type.ts          # TenantStatus, TenantStatusGroup, CRUD Request/Response 타입
   │  │  └─ ui/
   │  │     ├─ status-summary-cards/
   │  │     │  ├─ status-summary-cards.tsx    # 요약 카드 (전체 그룹, 전체 상태, 활성, 비활성)
   │  │     │  └─ status-summary-cards.module.css
   │  │     ├─ status-group-list/
   │  │     │  ├─ status-group-list.tsx        # 그룹별 Collapse + 상태 테이블 (Dropdown 액션 메뉴)
   │  │     │  └─ status-group-list.module.css
   │  │     ├─ status-detail/
   │  │     │  ├─ status-detail.tsx            # 상태 상세 보기 (Descriptions)
   │  │     │  └─ status-detail.module.css
   │  │     ├─ status-create-form/
   │  │     │  ├─ status-create-form.tsx       # 상태 생성 폼 (그룹 자동완성, Ant Design ColorPicker)
   │  │     │  └─ status-create-form.module.css
   │  │     └─ status-edit-form/
   │  │        ├─ status-edit-form.tsx         # 상태 수정 폼 (Ant Design ColorPicker)
   │  │        └─ status-edit-form.module.css
   │  │
   │  └─ website/                # 웹사이트 관리 도메인
   │     ├─ index.ts             # Public API (UI 4개, 훅 6개, 스키마 2개, 타입 노출)
   │     ├─ api/
   │     │  ├─ website.endpoint.ts            # WEBSITE_ENDPOINTS 상수
   │     │  ├─ get-websites.api.ts            # GET /websites (목록 조회)
   │     │  ├─ get-website.api.ts             # GET /websites/{webCode} (상세 조회)
   │     │  ├─ create-website.api.ts          # POST /websites (생성)
   │     │  ├─ update-website.api.ts          # PATCH /websites/{webCode} (수정)
   │     │  ├─ delete-website.api.ts          # DELETE /websites/{webCode} (삭제)
   │     │  └─ update-website-status.api.ts   # PATCH /websites/{webCode}/status (활성화/비활성화)
   │     ├─ model/
   │     │  ├─ use-websites.ts               # useWebsites() 목록 조회 훅 (useQuery)
   │     │  ├─ use-website.ts                # useWebsite() 상세 조회 훅 (useQuery)
   │     │  ├─ use-create-website.ts          # useCreateWebsite() 뮤테이션 훅
   │     │  ├─ use-update-website.ts          # useUpdateWebsite() 뮤테이션 훅
   │     │  ├─ use-delete-website.ts          # useDeleteWebsite() 뮤테이션 훅
   │     │  ├─ use-update-website-status.ts   # useUpdateWebsiteStatus() 뮤테이션 훅
   │     │  ├─ create-website.schema.ts       # Zod 웹사이트 생성 스키마 (webCode 정규식, URL 검증)
   │     │  └─ update-website.schema.ts       # Zod 웹사이트 수정 스키마
   │     ├─ types/
   │     │  └─ website.type.ts                # Website, CRUD Request/Response 타입
   │     └─ ui/
   │        ├─ website-table/
   │        │  ├─ website-table.tsx           # 웹사이트 목록 테이블 (썸네일, URL 링크, Dropdown 액션)
   │        │  └─ website-table.module.css
   │        ├─ website-detail/
   │        │  ├─ website-detail.tsx          # 웹사이트 상세 보기 (이미지 프리뷰, Descriptions)
   │        │  └─ website-detail.module.css
   │        ├─ website-create-form/
   │        │  ├─ website-create-form.tsx     # 웹사이트 생성 폼 (관리자 Select, URL 검증)
   │        │  └─ website-create-form.module.css
   │        └─ website-edit-form/
   │           ├─ website-edit-form.tsx       # 웹사이트 수정 폼 (기본정보/상세정보 섹션 분리)
   │           └─ website-edit-form.module.css
   │
   │  ├─ counsel/                 # 상담 관리 도메인
   │  │  ├─ index.ts             # Public API (UI 11개, 훅 7개, 스키마 2개, 타입 노출)
   │  │  ├─ api/                 # API 호출 함수
   │  │  │  ├─ counsel.endpoint.ts       # COUNSEL_ENDPOINTS 상수
   │  │  │  ├─ get-counsel-dashboard.api.ts  # GET /counsels/dashboard
   │  │  │  ├─ get-counsels.api.ts       # GET /counsels (목록 조회)
   │  │  │  ├─ get-counsel.api.ts        # GET /counsels/{id} (상세 조회)
   │  │  │  ├─ update-counsel.api.ts     # PATCH /counsels/{id} (수정)
   │  │  │  ├─ delete-counsel.api.ts     # DELETE /counsels/{id} (삭제)
   │  │  │  ├─ update-counsel-status.api.ts  # PATCH /counsels/{id}/status (상태 변경)
   │  │  │  └─ create-counsel-memo.api.ts   # POST /counsels/{id}/memo (메모 작성)
   │  │  ├─ model/               # 커스텀 훅, Zod 스키마
   │  │  │  ├─ use-counsel-dashboard.ts  # useCounselDashboard() 대시보드 통계 훅
   │  │  │  ├─ use-counsels.ts           # useCounsels() 목록 조회 훅
   │  │  │  ├─ use-counsel.ts            # useCounsel() 상세 조회 훅
   │  │  │  ├─ use-update-counsel.ts     # useUpdateCounsel() 뮤테이션 훅
   │  │  │  ├─ use-delete-counsel.ts     # useDeleteCounsel() 뮤테이션 훅
   │  │  │  ├─ use-update-counsel-status.ts  # useUpdateCounselStatus() 뮤테이션 훅
   │  │  │  ├─ use-create-counsel-memo.ts   # useCreateCounselMemo() 뮤테이션 훅
   │  │  │  ├─ update-counsel.schema.ts  # Zod 상담 수정 스키마
   │  │  │  └─ create-memo.schema.ts     # Zod 메모 생성 스키마
   │  │  ├─ types/
   │  │  │  └─ counsel.type.ts           # CounselListItem, CounselDetail, Dashboard 관련 타입
   │  │  └─ ui/                  # 도메인 UI 컴포넌트 (11개)
   │  │     ├─ summary-cards/            # 대시보드 요약 카드 (4지표)
   │  │     ├─ status-distribution-chart/ # 상태별 분포 파이차트
   │  │     ├─ employee-stats-chart/      # 담당자별 현황 바차트
   │  │     ├─ daily-trends-chart/        # 일별 상담 추이 영역차트
   │  │     ├─ top-websites-chart/        # 웹사이트별 Top 5 바차트
   │  │     ├─ hourly-distribution-chart/ # 시간대별 분포 바차트
   │  │     ├─ upcoming-reservations-table/ # 예정 예약 테이블
   │  │     ├─ reservation-calendar/       # 예약 캘린더 (월별 그리드, 드래그 앤 드롭 일정 변경, TimePicker)
   │  │     ├─ counsel-table/             # 상담 목록 테이블 (인라인 상태/담당자 변경)
   │  │     ├─ counsel-detail/            # 상담 상세 (4탭, 메모, 이력, 차단)
   │  │     └─ counsel-edit-form/         # 상담 수정 폼 (React Hook Form + Zod)
   │  │
   │  └─ security/                # 보안(차단) 관리 도메인
   │     ├─ index.ts             # Public API (UI 15개, 훅 21개, 스키마 9개, 타입 노출)
   │     ├─ api/                 # API 호출 함수 (21개: IP/HP/Word × 7 엔드포인트)
   │     │  ├─ security.endpoint.ts       # SECURITY_ENDPOINTS 상수
   │     │  ├─ get-block-ips.api.ts       # GET /security/block-ip
   │     │  ├─ create-block-ip.api.ts     # POST /security/block-ip
   │     │  ├─ bulk-create-block-ip.api.ts# POST /security/block-ip/bulk
   │     │  ├─ check-block-ip.api.ts      # GET /security/block-ip/check
   │     │  └─ ... (block-hp 7개, block-word 7개 동일 패턴)
   │     ├─ model/               # 커스텀 훅 21개 + Zod 스키마 9개
   │     │  ├─ use-block-ips.ts           # useBlockIps() 목록 조회 훅 (useQuery)
   │     │  ├─ use-check-block-ip.ts      # useCheckBlockIp() 차단 여부 확인 훅
   │     │  ├─ create-block-ip.schema.ts  # Zod IP 차단 생성 스키마
   │     │  └─ ... (block-hp, block-word 동일 패턴)
   │     ├─ types/
   │     │  ├─ block-ip.type.ts           # BlockIp, SecurityPageInfo, CheckBlockedResponse, CRUD 타입
   │     │  ├─ block-hp.type.ts           # BlockHp, CheckBlockHpRequest, CRUD 타입
   │     │  └─ block-word.type.ts         # BlockWord, MatchType, CheckBlockWordRequest, CRUD 타입
   │     └─ ui/                  # 도메인 UI 컴포넌트 (15개: 각 타입 × 5)
   │        ├─ block-ip-table/            # IP 차단 목록 테이블
   │        ├─ block-ip-detail/           # IP 차단 상세 보기
   │        ├─ block-ip-create-form/      # IP 차단 생성 폼 (Segmented 단건/대량)
   │        ├─ block-ip-edit-form/        # IP 차단 수정 폼
   │        ├─ block-ip-check/            # IP 차단 여부 확인
   │        ├─ block-hp-table/            # 휴대폰 차단 목록 테이블
   │        ├─ block-hp-check/            # 휴대폰 차단 여부 확인
   │        ├─ block-word-table/          # 금칙어 목록 테이블 (matchType Tag)
   │        ├─ block-word-check/          # 금칙어 차단 여부 확인 (matchedWord 표시)
   │        └─ ... (detail, create-form, edit-form 동일 패턴)
   │
   └─ pages/                     # 라우트 단위 페이지 컴포넌트
      ├─ login/
      │  ├─ login-page.tsx       # 로그인 페이지 (이미 로그인 시 대시보드 리다이렉트)
      │  └─ login-page.module.css
      ├─ signup/
      │  ├─ signup-page.tsx      # 회원가입 페이지 (이미 로그인 시 대시보드 리다이렉트)
      │  └─ signup-page.module.css
      ├─ mypage/
      │  ├─ mypage-page.tsx      # 마이페이지 (프로필, 역할, 권한, 보안 설정)
      │  └─ mypage-page.module.css
      ├─ user/
      │  ├─ user-page.tsx        # 사용자 관리 페이지 (검색/필터 + 테이블 + CRUD 모달)
      │  └─ user-page.module.css
      ├─ home/
      │  ├─ home-page.tsx        # 홈 페이지 (온보딩 · 역할별 플로우 · 포트폴리오 · 아키텍처 개요)
      │  └─ home-page.module.css
      ├─ tenant/
      │  ├─ tenant-page.tsx      # 테넌트 관리 페이지 (검색/필터 + 테이블 + CRUD 모달 + 삭제)
      │  └─ tenant-page.module.css
      ├─ forbidden/
      │  └─ forbidden-page.tsx   # 403 권한 없음 에러 페이지
      ├─ super-dashboard/
      │  ├─ super-dashboard-page.tsx       # 슈퍼 관리자 대시보드 (전체 시스템 현황)
      │  └─ super-dashboard-page.module.css
      ├─ permission-catalog/
      │  ├─ permission-catalog-page.tsx    # 권한 카탈로그 (트리 기반 매트릭스 + 검색)
      │  └─ permission-catalog-page.module.css
      ├─ admin-page-manage/
      │  ├─ admin-page-manage-page.tsx    # RBAC 페이지 관리 (CRUD, 계층 구조)
      │  └─ admin-page-manage-page.module.css
      ├─ admin-action-manage/
      │  ├─ admin-action-manage-page.tsx  # RBAC 액션 관리 (CRUD)
      │  └─ admin-action-manage-page.module.css
      ├─ admin-permission-manage/
      │  ├─ admin-permission-manage-page.tsx # RBAC 권한 관리 (페이지+액션 조합)
      │  └─ admin-permission-manage-page.module.css
      ├─ role-manage/
      │  ├─ role-manage-page.tsx           # 역할 관리 페이지 (CRUD, 권한 매핑, 사용자 할당)
      │  └─ role-manage-page.module.css
      ├─ tenant-status-manage/
      │  ├─ tenant-status-manage-page.tsx  # 상태 관리 페이지 (CRUD, 그룹별 Collapse, 요약 카드, 활성화/비활성화)
      │  └─ tenant-status-manage-page.module.css
      ├─ website-manage/
      │  ├─ website-manage-page.tsx        # 웹사이트 관리 페이지 (검색/필터 + 테이블 + CRUD 모달)
      │  └─ website-manage-page.module.css
      ├─ board-type-manage/
      │  ├─ board-type-manage-page.tsx     # 게시판 타입 관리 페이지 (CRUD)
      │  └─ board-type-manage-page.module.css
      ├─ board-manage/
      │  ├─ board-manage-page.tsx          # 게시글 관리 페이지 (RichTextEditor, 게시판 타입별 필터)
      │  └─ board-manage-page.module.css
      ├─ block-manage/
      │  ├─ block-manage-page.tsx           # 차단 관리 페이지 (Tabs: IP/휴대폰/금칙어)
      │  ├─ block-manage-page.module.css
      │  ├─ block-ip-panel.tsx              # IP 차단 탭 패널 (CRUD + 차단 여부 확인)
      │  ├─ block-hp-panel.tsx              # 휴대폰 차단 탭 패널
      │  └─ block-word-panel.tsx            # 금칙어 탭 패널 (matchType 필터 추가)
      ├─ counsel-dashboard/
      │  ├─ counsel-dashboard-page.tsx      # 상담 대시보드 (7개 통계 위젯, 기간 선택)
      │  └─ counsel-dashboard-page.module.css
      ├─ counsel-manage/
      │  ├─ counsel-manage-page.tsx        # 상담 관리 (상태 카드, 필터, 테이블, 일괄 처리)
      │  └─ counsel-manage-page.module.css
      └─ counsel-calendar/
         ├─ counsel-calendar-page.tsx       # 예약 캘린더 (월별 그리드, 드래그 앤 드롭)
         └─ counsel-calendar-page.module.css
```

## 폴더/파일 구조 규칙 및 사용 가이드

### 레이어별 역할 요약

본 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처를 따릅니다. 각 레이어는 단방향 의존성을 가집니다:

```
pages → features → shared
  ↓        ↓         ↓
widgets ←──┘    (공통 모듈)
```

| 레이어 | 역할 | 의존 가능 대상 |
|--------|------|---------------|
| `app/` | 앱 진입점, 전역 Provider, 라우터, 글로벌 스타일 | 모든 레이어 |
| `pages/` | 라우트 단위 페이지 컴포넌트. 비즈니스 로직 없음 | features, widgets, shared |
| `widgets/` | 여러 페이지에서 재사용되는 UI 블록 | features, shared |
| `features/` | 도메인별 비즈니스 기능 (api, model, ui, types, lib) | shared |
| `shared/` | 공통 API, 타입, 유틸리티, 에셋 | 외부 라이브러리만 |

### 폴더별 생성/사용 예시

```
src/
├─ app/                # 프로젝트 시작 시 생성. 전역 Provider/라우터/스타일 필요할 때 추가
│  ├─ styles/          # 글로벌 스타일 필요 시 생성
│  ├─ App.tsx          # 앱 루트 컴포넌트 (필수)
│  ├─ main.tsx         # React DOM 엔트리 (필수)
│  └─ ProtectedRoute.tsx  # 인증 필요 라우트 보호 시 생성
│
├─ shared/             # 여러 도메인/페이지에서 공통 코드 필요 시 생성
│  ├─ api/             # 공통 API 인스턴스, 인터셉터 등
│  ├─ assets/          # 공통 이미지 등 정적 자산
│  ├─ types/           # 공통 타입 정의
│  └─ utils/           # 공통 유틸리티 함수
│
├─ widgets/            # 여러 페이지에서 반복되는 레이아웃 UI 블록 필요 시 생성
│  ├─ sidebar/         # 사이드바 UI
│  ├─ header/          # 헤더 UI
│  └─ breadcrumb/      # 브레드크럼 UI
│
├─ features/           # 도메인별 slice 구현 필요 시 생성
│  └─ auth/            # 인증/권한 도메인
│     ├─ api/          # API 호출 함수
│     ├─ lib/          # 스토리지/비즈니스 로직 헬퍼
│     ├─ model/        # 상태관리(Zustand), 서비스, 커스텀 훅, 스키마
│     ├─ types/        # 도메인 타입 정의
│     ├─ ui/           # 도메인 UI 컴포넌트
│     └─ index.ts      # Public API (필수 — 외부에서 이 파일만 import)
│
└─ pages/              # 라우트 단위 페이지 컴포넌트
   ├─ login/           # 로그인 페이지
   ├─ signup/          # 회원가입 페이지
   └─ home/            # 홈 페이지 (온보딩 · 플로우 안내 · 포트폴리오 · 아키텍처)
```

### Feature Slice 내부 구조 가이드

새로운 도메인 기능(feature)을 추가할 때 아래 구조를 따릅니다:

```
features/{도메인명}/
├─ index.ts            # (필수) Public API — 외부에서 import할 수 있는 유일한 진입점
├─ api/                # API 호출 함수 (@shared/api/axios 인스턴스 사용)
│  ├─ endpoints.ts     # API 엔드포인트 경로 상수
│  └─ {기능}.api.ts
├─ model/              # 상태관리, 서비스 로직, 커스텀 훅, Zod 스키마
│  ├─ {도메인}.store.ts      # Zustand 스토어
│  ├─ {도메인}.service.ts    # 비즈니스 서비스 로직
│  ├─ {기능}.schema.ts       # Zod 유효성 스키마
│  └─ use-{기능}.ts          # React Query 커스텀 훅
├─ types/              # 도메인 타입/인터페이스 정의
│  └─ {도메인}.type.ts
├─ lib/                # 순수 헬퍼 함수, 스토리지 래퍼 등
│  └─ {도메인}-{기능}.ts
└─ ui/                 # 도메인 UI 컴포넌트 + CSS Modules (컴포넌트별 폴더 분리)
   ├─ {컴포넌트}/
   │  ├─ {컴포넌트}.tsx
   │  └─ {컴포넌트}.module.css
```

### Path Alias

`tsconfig.json`과 `vite.config.ts`에 path alias가 설정되어 있어, 깊은 상대 경로(`../../../`) 대신 alias를 사용합니다:

| Alias | 경로 | 사용 예시 |
|-------|------|----------|
| `@app/*` | `src/app/*` | `import MainLayout from '@app/layouts/main-layout'` |
| `@shared/*` | `src/shared/*` | `import { axiosInstance } from '@shared/api/axios'` |
| `@features/*` | `src/features/*` | `import { LoginForm } from '@features/auth'` |
| `@pages/*` | `src/pages/*` | `import LoginPage from '@pages/login/login-page'` |
| `@widgets/*` | `src/widgets/*` | `import Sidebar from '@widgets/sidebar/sidebar'` |

> **규칙**: 같은 feature slice 내부의 import는 상대 경로(`./`, `../`)를 사용하고, cross-layer import만 alias를 사용합니다.

## 라우팅 구조

| 경로 | 페이지 | 레이아웃 | 인증 필요 | 설명 |
|------|--------|---------|----------|------|
| `/` | — | — | — | `/login`으로 리다이렉트 |
| `/login` | LoginPage | — | 불필요 | 로그인 페이지 (로그인 상태 시 `/home`으로 리다이렉트) |
| `/signup` | SignupPage | — | 불필요 | 회원가입 페이지 (로그인 상태 시 `/home`으로 리다이렉트) |
| `/403` | ForbiddenPage | — | 불필요 | 권한 없음 에러 페이지 (ProtectedRoute에서 미허용 경로 접근 시 리다이렉트) |
| `/home` | HomePage | MainLayout | **필요** | 홈 (온보딩 · 역할별 플로우 · 포트폴리오 · 아키텍처 개요) |
| `/mypage` | MypagePage | MainLayout | **필요** | 마이페이지 (프로필 정보, 역할/권한, 보안 설정) |
| `/users` | UserPage | MainLayout | **필요** | 사용자 관리 (CRUD, 상태 변경, 비밀번호 초기화, 역할 설정) |
| `/tenants` | TenantPage | MainLayout | **필요** | 테넌트 관리 (CRUD, 상태 변경, 삭제) |
| `/super/dashboard` | `SuperDashboardPage` | `MainLayout` | **필요** | 슈퍼 관리자 대시보드 (전체 시스템 현황, 보안, 테넌트 통계) |
| `/permissions/admin/pages` | `AdminPageManagePage` | `MainLayout` | **필요** | RBAC 페이지 관리 (CRUD, 상세 보기, 계층 구조) |
| `/permissions/admin/actions` | `AdminActionManagePage` | `MainLayout` | **필요** | RBAC 액션 관리 (CRUD, 상세 보기) |
| `/permissions/admin/permissions` | `AdminPermissionManagePage` | `MainLayout` | **필요** | RBAC 권한 관리 (페이지+액션 조합, 크로스 피처) |
| `/permissions/catalog` | `PermissionCatalogPage` | `MainLayout` | **필요** | 권한 카탈로그 (트리 구조 페이지×액션 매트릭스, 검색, 접기/펼치기) |
| `/roles` | `RoleManagePage` | `MainLayout` | **필요** | 역할 관리 (CRUD, 권한 매핑, 사용자 할당) |
| `/tenants/status` | `TenantStatusManagePage` | `MainLayout` | **필요** | 상태 관리 (CRUD, 그룹별 Collapse, 요약 카드, 활성화/비활성화) |
| `/websites` | `WebsiteManagePage` | `MainLayout` | **필요** | 웹사이트 관리 (CRUD, 검색/필터, 상태 변경, 썸네일, URL 링크) |
| `/security` | `BlockManagePage` | `MainLayout` | **필요** | 차단 관리 (IP/휴대폰/금칙어 탭, CRUD, 대량 등록, 차단 여부 확인) |
| `/board-types` | `BoardTypeManagePage` | `MainLayout` | **필요** | 게시판 타입 관리 (CRUD) |
| `/boards` | `BoardManagePage` | `MainLayout` | **필요** | 게시글 관리 (RichTextEditor, 게시판 타입별 필터, CRUD) |
| `/counsels/dashboard` | `CounselDashboardPage` | `MainLayout` | **필요** | 상담 대시보드 (7개 통계 위젯, 기간 선택, 새로고침) |
| `/counsels` | `CounselManagePage` | `MainLayout` | **필요** | 상담 관리 (상태 필터 카드, 목록, 상세/수정, 일괄 처리) |
| `/counsels/calendar` | `CounselCalendarPage` | `MainLayout` | **필요** | 예약 캘린더 (월별 그리드, 드래그 앤 드롭 일정 변경, 상세 모달) |

## 구현 현황

| 기능 | 상태 | 설명 |
|------|------|------|
| 멀티 테넌트 로그인 | ✅ 완료 | 업체명 + 아이디 + 비밀번호 기반 로그인 |
| 회원가입 | ✅ 완료 | Tenant + 관리자 동시 생성, Zod 검증 (이메일/비밀번호 강도), 중복 에러 처리 |
| JWT 토큰 관리 | ✅ 완료 | Access/Refresh 토큰 localStorage 저장 + Zustand 동기화 |
| 자동 토큰 갱신 | ✅ 완료 | DI 패턴 인터셉터 기반 401 응답 시 자동 리프레시 + 실패 시 로그아웃 |
| 보호된 라우트 | ✅ 완료 | ProtectedRoute (Zustand + localStorage 이중 체크) |
| 로그아웃 | ✅ 완료 | POST /auth/logout API 연동 + 로컬 상태 정리 |
| 동적 메뉴 시스템 | ✅ 완료 | API menuTree + 권한 기반 필터링 + 아이콘 매핑 |
| 권한 시스템 | ✅ 완료 | `{pageName}.{action}` 패턴, hasPermission/filterMenuTree/buildPathNameMap |
| 메인 레이아웃 | ✅ 완료 | Sidebar + Header + Content (Layout Route + Outlet 패턴) |
| 사이드바 | ✅ 완료 | 접기/펼치기, 모바일 오버레이, 동적 메뉴, 사용자 정보(→마이페이지), 로그아웃, 호버 효과 |
| 헤더 | ✅ 완료 | 토글 버튼, 브레드크럼, 테넌트 뱃지, 알림 Popover, 프로필 Dropdown(→마이페이지/비밀번호 변경 모달) |
| 브레드크럼 | ✅ 완료 | 동적 pathNameMap 기반 URL → 한국어 이름 매핑 |
| 마이페이지 | ✅ 완료 | 프로필 정보 조회/수정, 역할/권한 요약, 보안 설정 (로그아웃/전체 로그아웃) |
| 비밀번호 변경 | ✅ 완료 | 모달 폼 (현재 비밀번호 + 새 비밀번호 + 확인), Zod 검증 (8자+, 영문/숫자/특수문자) |
| 프로필 수정 | ✅ 완료 | 모달 폼 (회사명, 이름, 이메일, 전화번호, 휴대폰), Zustand + localStorage 즉시 동기화 |
| 전체 기기 로그아웃 | ✅ 완료 | POST /auth/logout-all API 연동 + 로컬 상태 정리 |
| 사용자 관리 | ✅ 완료 | 사용자 CRUD, 검색/필터, 상태 변경, 비밀번호 초기화, 강제 로그아웃, 역할 배정, **상세 보기** |
| 테넌트 관리 | ✅ 완료 | 테넌트 CRUD, 검색/필터, 상태 변경(활성/비활성), 삭제(사용자 존재 시 차단), 도메인 관리, **상세 보기** |
| 역할 관리 (기본) | ✅ 완료 | 역할 목록 조회, 사용자 수정 시 역할 다중 선택 (features/role 슬라이스 분리) |
| 역할 관리 (전체) | ✅ 완료 | 역할 CRUD, 권한 매트릭스 (페이지×액션 체크박스), 권한 복사, 사용자 할당/해제 (서버사이드 페이지네이션), 3탭 Drawer, enabled 가드 최적화 |
| 슈퍼 관리자 대시보드 | ✅ 완료 | 전체 현황(8지표), 오늘 현황(4지표), 월별 트렌드 차트, 보안 현황, 테넌트별 상세 통계 |
| RBAC 페이지 관리 | ✅ 완료 | 페이지 CRUD, 상세 보기(Descriptions + 하위 페이지 Table), 상태 변경, 삭제, 계층(부모-자식) 구조 |
| RBAC 액션 관리 | ✅ 완료 | 액션 CRUD, 상세 보기(Descriptions), 상태 변경, 삭제 |
| RBAC 권한 관리 | ✅ 완료 | 권한 CRUD, 상세 보기(페이지/액션 Tag+code), 상태 변경, 삭제, 크로스 피처 합성(admin-page + admin-action) |
| 권한 카탈로그 | ✅ 완료 | 페이지×액션 권한 매트릭스, **트리 구조** (parentId 기반 계층), 접기/펼치기, 검색 필터, 요약 통계 바, 스티키 컬럼, 행 스트라이핑/호버 |
| 라우트 코드 스플리팅 | ✅ 완료 | React.lazy + Suspense 기반 라우트별 동적 import (번들 최적화) |
| CSS 토큰 체계 | ✅ 완료 | CSS Custom Properties 23개 (:root), focus-visible 접근성 |
| 에러 처리 | ✅ 완료 | AxiosError 타입 래핑 + 에러 코드 매핑 + 한국어 메시지 |
| 반응형 디자인 | ✅ 완료 | 모바일 대응 (768px 브레이크포인트) |
| Path Alias | ✅ 완료 | @app, @shared, @features, @pages, @widgets |
| API 상수 관리 | ✅ 완료 | 엔드포인트 경로 상수 파일 분리 |
| 상태 관리 | ✅ 완료 | 테넌트 상태 CRUD, 그룹별 Collapse, 요약 카드, Ant Design ColorPicker, Dropdown 액션 메뉴, 활성화/비활성화 |
| 웹사이트 관리 | ✅ 완료 | 웹사이트 CRUD, 검색/필터, 상태 변경(활성/비활성), 삭제, 관리자 배정(Select), 썸네일/URL 표시, 중복허용 기간 설정 |
| 차단 관리 | ✅ 완료 | IP/휴대폰/금칙어 3도메인 Tabs UI, CRUD, 대량 등록(Segmented 단건/대량), 차단 여부 확인, matchType 필터/Tag, 활성화/비활성화 토글 |
| 상담 대시보드 | ✅ 완료 | 요약 카드(4지표), 상태별 분포(파이), 담당자별 현황(바), 일별 추이(영역), 웹사이트 Top5(바), 시간대별 분포(바), 예정 예약 테이블, 기간 선택(RangePicker) |
| 상담 관리 | ✅ 완료 | 상태 필터 카드, 날짜/상태/담당자/웹사이트 필터, 인라인 상태/담당자 변경, 상세 모달(4탭: 기본정보/메모/이력/관련상담), 수정, 메모, 차단(전화번호/IP/금칙어), 일괄 처리(상태 변경/담당자 배정/삭제), `counsels.admin` 권한 기반 데이터 격리 |
| 예약 캘린더 | ✅ 완료 | 월별 7×6 캘린더 그리드, 예약 카드(상태별 색상), 드래그 앤 드롭 일정 변경(확인 모달 + TimePicker), 담당자 필터(어드민), 상세 모달(상담 관리와 동일) |
| 홈 페이지 | ✅ 완료 | 온보딩 가이드 (히어로 프로필+통계, 섹션 퀵네비, 포트폴리오 배너, 데이터 흐름 다이어그램, 역할별 서비스 플로우 탭 UI, 아키텍처 하이라이트, 반응형 3단계) |

## 배포

Vercel을 통한 자동 배포를 지원합니다. `vercel.json`에 SPA 라우팅을 위한 리라이트 규칙이 설정되어 있습니다.

```json
{
  "rewrites": [
    {
      "source": "/((?!api|assets|favicon.ico|robots.txt|manifest.json|static|_next|.*\\.[\\w]+$).*)",
      "destination": "/index.html"
    }
  ]
}
```

## 문서

- [아키텍처 상세 문서](docs/architecture.md) — 프로젝트 아키텍처, 데이터 흐름, 인증 플로우, 상태관리 전략 등 상세 기술 문서
