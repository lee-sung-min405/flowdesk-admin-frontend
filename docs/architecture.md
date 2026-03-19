# Flowdesk Admin Frontend — 아키텍처 문서

## 목차

- [1. 아키텍처 개요](#1-아키텍처-개요)
  - [1.1 Feature-Sliced Design (FSD)](#11-feature-sliced-design-fsd)
  - [1.2 레이어 의존성 규칙](#12-레이어-의존성-규칙)
- [2. 앱 초기화 흐름](#2-앱-초기화-흐름)
  - [2.1 엔트리포인트](#21-엔트리포인트)
  - [2.2 Provider 구조](#22-provider-구조)
  - [2.3 라우팅](#23-라우팅)
  - [2.4 메인 레이아웃 구조](#24-메인-레이아웃-구조)
  - [2.5 권한 기반 동적 메뉴](#25-권한-기반-동적-메뉴)
- [3. 인증 아키텍처](#3-인증-아키텍처)
  - [3.1 로그인 플로우](#31-로그인-플로우)
  - [3.2 토큰 관리](#32-토큰-관리)
  - [3.3 자동 토큰 갱신 (Silent Refresh)](#33-자동-토큰-갱신-silent-refresh)
  - [3.4 보호된 라우트 (Route Guard)](#34-보호된-라우트-route-guard)
  - [3.5 인증 관련 타입](#35-인증-관련-타입)
  - [3.6 회원가입 플로우](#36-회원가입-플로우)
  - [3.7 인증 Feature Slice 구조](#37-인증-feature-slice-구조)
- [4. 상태 관리 전략](#4-상태-관리-전략)
  - [4.1 서버 상태 — TanStack React Query](#41-서버-상태--tanstack-react-query)
  - [4.2 클라이언트 상태 — Zustand](#42-클라이언트-상태--zustand)
  - [4.3 영속 상태 — localStorage](#43-영속-상태--localstorage)
  - [4.4 폼 상태 — React Hook Form + Zod](#44-폼-상태--react-hook-form--zod)
- [5. API 통신 계층](#5-api-통신-계층)
  - [5.1 Axios 인스턴스](#51-axios-인스턴스)
  - [5.2 요청 인터셉터](#52-요청-인터셉터)
  - [5.3 응답 인터셉터](#53-응답-인터셉터)
  - [5.4 에러 처리](#54-에러-처리)
  - [5.5 API 엔드포인트 관리](#55-api-엔드포인트-관리)
- [6. UI / 스타일링 전략](#6-ui--스타일링-전략)
  - [6.1 컴포넌트 라이브러리](#61-컴포넌트-라이브러리)
  - [6.2 스타일링 방식](#62-스타일링-방식)
  - [6.3 반응형 디자인](#63-반응형-디자인)
  - [6.4 디자인 토큰](#64-디자인-토큰)
- [7. 빌드 및 개발 환경](#7-빌드-및-개발-환경)
  - [7.1 Vite 설정](#71-vite-설정)
  - [7.2 TypeScript 설정](#72-typescript-설정)
  - [7.3 코드 품질 도구](#73-코드-품질-도구)
  - [7.4 테스트 환경](#74-테스트-환경)
- [8. 배포](#8-배포)
- [9. 파일 네이밍 규칙](#9-파일-네이밍-규칙)
- [10. 새 기능 추가 가이드](#10-새-기능-추가-가이드)
- [11. 구현된 Feature Slice 상세](#11-구현된-feature-slice-상세)
  - [11.1 사용자 관리 Feature](#111-사용자-관리-feature-featuresuser)
  - [11.2 역할 관리 Feature](#112-역할-관리-feature-featuresrole)
  - [11.3 슈퍼 관리자 대시보드 Feature](#113-슈퍼-관리자-대시보드-feature-featuressuper-dashboard)
  - [11.4 테넌트 관리 Feature](#114-테넌트-관리-feature-featurestenant)
  - [11.5 페이지 관리 Feature](#115-페이지-관리-feature-featuresadmin-page)
  - [11.6 액션 관리 Feature](#116-액션-관리-feature-featuresadmin-action)
  - [11.7 권한 관리 Feature](#117-권한-관리-feature-featuresadmin-permission)
  - [11.8 권한 카탈로그 Feature](#118-권한-카탈로그-feature-featurespermission-catalog)

---

## 1. 아키텍처 개요

### 1.1 Feature-Sliced Design (FSD)

본 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처를 채택합니다. FSD는 프론트엔드 프로젝트를 **레이어(Layer)**와 **슬라이스(Slice)**로 분리하여, 각 모듈의 책임을 명확히 하고 의존성 방향을 단방향으로 유지하는 아키텍처 방법론입니다.

```
┌─────────────────────────────────────────────────┐
│  app/          앱 초기화, Provider, 라우터        │  ← 최상위 레이어
├─────────────────────────────────────────────────┤
│  pages/        라우트 단위 페이지 컴포넌트         │
├─────────────────────────────────────────────────┤
│  widgets/      레이아웃 공통 UI 블록               │
├─────────────────────────────────────────────────┤
│  features/     도메인별 비즈니스 기능 슬라이스       │
├─────────────────────────────────────────────────┤
│  shared/       공통 API, 타입, 유틸, 에셋          │  ← 최하위 레이어
└─────────────────────────────────────────────────┘
```

**핵심 원칙:**
- 상위 레이어는 하위 레이어만 import 가능 (단방향 의존성)
- 같은 레이어 간 직접 import 금지 (features끼리 직접 참조 불가)
- 각 feature slice는 `index.ts`를 통해 Public API만 외부에 노출

### 1.2 레이어 의존성 규칙

```
app  ──→  pages  ──→  widgets  ──→  features  ──→  shared
 │          │           │              │
 │          └───────────┴──────────────┴──────→  shared
 └─────────────────────────────────────────────→  shared
```

| 레이어 | 역할 | import 가능 대상 | import 불가 |
|--------|------|-----------------|------------|
| `app/` | 앱 진입, Provider 합성, 라우터 정의 | pages, widgets, features, shared | — |
| `pages/` | 라우트별 페이지 구성, 비즈니스 로직 없음 | widgets, features, shared | app, 다른 pages |
| `widgets/` | 복합 UI 블록 (Header, Sidebar 등) | features, shared | app, pages |
| `features/` | 도메인 비즈니스 로직 (api, model, ui, lib, types) | shared | app, pages, widgets, 다른 features |
| `shared/` | 범용 유틸, 공통 API, 타입, 에셋 | 외부 npm 패키지만 | 프로젝트 내부 레이어 |

---

## 2. 앱 초기화 흐름

### 2.1 엔트리포인트

```
index.html
  └─ <script src="/src/app/main.tsx">
       ├─ import { setupAuthAxiosInterceptor } from '@features/auth'
       ├─ setupAuthAxiosInterceptor()                ← DI 패턴으로 인터셉터 초기화
       ├─ import './styles/global.css'               ← 글로벌 CSS 리셋
       └─ ReactDOM.createRoot(#root).render(<App />)
```

`main.tsx`는 다음을 수행합니다:
1. **Axios 인터셉터 초기화** — `setupAuthAxiosInterceptor()`를 명시적으로 호출하여 인터셉터를 등록합니다 (사이드이펙트 import 대신 DI 패턴 사용)
2. **글로벌 CSS 적용** — CSS 리셋 및 기본 레이아웃 스타일
3. **React 앱 마운트** — `React.StrictMode`로 감싸 개발 시 이중 렌더링 체크

### 2.2 Provider 구조

```tsx
// src/app/App.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,         // 5분 — 데이터 신선도 유지
      gcTime: 1000 * 60 * 10,            // 10분 — 가비지 컬렉션 시간
      retry: 1,                          // 재시도 1회
      refetchOnWindowFocus: false,       // 포커스 시 자동 리페치 비활성화
    },
  },
});

<QueryClientProvider client={queryClient}>   // 서버 상태 관리 (React Query)
  <BrowserRouter>                            // 클라이언트 사이드 라우팅
    <Routes>...</Routes>
  </BrowserRouter>
</QueryClientProvider>
```

| Provider | 라이브러리 | 역할 |
|----------|-----------|------|
| `QueryClientProvider` | @tanstack/react-query | React Query의 QueryClient 컨텍스트 제공 (defaultOptions 포함) |
| `BrowserRouter` | react-router-dom | HTML5 History API 기반 클라이언트 라우팅 |

> Zustand는 Provider 없이 글로벌 스토어로 동작합니다.

### 2.3 라우팅

모든 페이지는 `React.lazy()`로 동적 import되어 라우트별 코드 스플리팅이 적용됩니다.

```tsx
// 페이지 동적 import (React.lazy)
const LoginPage = lazy(() => import('@pages/login/login-page'));
const SignupPage = lazy(() => import('@pages/signup/signup-page'));
const DashboardPage = lazy(() => import('@pages/dashboard/dashboard-page'));
const MypagePage = lazy(() => import('@pages/mypage/mypage-page'));
const UserPage = lazy(() => import('@pages/user/user-page'));
const TenantPage = lazy(() => import('@pages/tenant/tenant-page'));
const SuperDashboardPage = lazy(() => import('@pages/super-dashboard/super-dashboard-page'));
const AdminPageManagePage = lazy(() => import('@pages/admin-page-manage/admin-page-manage-page'));
const AdminActionManagePage = lazy(() => import('@pages/admin-action-manage/admin-action-manage-page'));
const AdminPermissionManagePage = lazy(() => import('@pages/admin-permission-manage/admin-permission-manage-page'));

<Suspense fallback={<Spin />}>
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />

    {/* 인증 필요 + MainLayout 적용 라우트 */}
    <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/mypage" element={<MypagePage />} />
      <Route path="/users" element={<UserPage />} />
      <Route path="/tenants" element={<TenantPage />} />
      <Route path="/super/dashboard" element={<SuperDashboardPage />} />
      <Route path="/permissions/admin/pages" element={<AdminPageManagePage />} />
      <Route path="/permissions/admin/actions" element={<AdminActionManagePage />} />
      <Route path="/permissions/admin/permissions" element={<AdminPermissionManagePage />} />
    </Route>

    <Route path="/" element={<Navigate to="/login" />} />
  </Routes>
</Suspense>
```

**코드 스플리팅 전략:**
- 모든 페이지 컴포넌트를 `React.lazy()`로 동적 import하여 각 페이지가 별도 청크로 분리됨
- `Suspense`로 감싸 로딩 중 Ant Design `Spin` 컴포넌트 표시
- `antd`, `recharts` 등 대형 라이브러리가 해당 페이지 접근 시에만 로드되어 초기 번들 크기 최적화

**Layout Route 패턴:**
- `MainLayout`은 `<Outlet />`을 통해 자식 라우트를 렌더링합니다
- `ProtectedRoute`가 `MainLayout`을 감싸 인증 필요 라우트를 보호합니다
- Sidebar, Header, Content 영역을 포함하는 통합 레이아웃 셸로 동작합니다
- 향후 인증이 필요한 모든 페이지는 이 Layout Route 아래에 추가합니다

| 경로 | 컴포넌트 | 레이아웃 | 접근 제어 | 비고 |
|------|---------|---------|----------|------|
| `/` | `Navigate` | — | 없음 | `/login`으로 리다이렉트 |
| `/login` | `LoginPage` | — | 공개 | 이미 로그인 시 `/dashboard`로 리다이렉트 |
| `/signup` | `SignupPage` | — | 공개 | 이미 로그인 시 `/dashboard`로 리다이렉트 |
| `/dashboard` | `DashboardPage` | `MainLayout` | `ProtectedRoute` | 토큰 없으면 `/login`으로 리다이렉트 |
| `/mypage` | `MypagePage` | `MainLayout` | `ProtectedRoute` | 프로필 정보, 역할/권한, 보안 설정 |
| `/users` | `UserPage` | `MainLayout` | `ProtectedRoute` | 사용자 관리 (CRUD, 상태 변경, 역할 설정) |
| `/tenants` | `TenantPage` | `MainLayout` | `ProtectedRoute` | 테넌트 관리 (CRUD, 상태 변경, 삭제) |
| `/super/dashboard` | `SuperDashboardPage` | `MainLayout` | `ProtectedRoute` | 슈퍼 관리자 대시보드 (전체 시스템 현황) |
| `/permissions/admin/pages` | `AdminPageManagePage` | `MainLayout` | `ProtectedRoute` | RBAC 페이지 관리 (CRUD, 상세 보기, 계층 구조) |
| `/permissions/admin/actions` | `AdminActionManagePage` | `MainLayout` | `ProtectedRoute` | RBAC 액션 관리 (CRUD, 상세 보기) |
| `/permissions/admin/permissions` | `AdminPermissionManagePage` | `MainLayout` | `ProtectedRoute` | RBAC 권한 관리 (페이지+액션 조합, 상세 보기) |

### 2.4 메인 레이아웃 구조

```
┌──────────────────────────────────────────────────────┐
│  MainLayout (Layout Route + Outlet)                  │
├──────────┬───────────────────────────────────────────┤
│          │  Header (sticky)                          │
│          │  ┌─ 토글 버튼 + Breadcrumb ─── 테넌트 │ 🔔 │ 프로필 ─┐ │
│ Sidebar  │  └──────────────────────────────────────┘ │
│ (fixed)  │                                           │
│  ┌─────┐ │  Content (Outlet → 자식 페이지)            │
│  │로고  │ │                                           │
│  │메뉴  │ │     ┌──────────────────────────┐          │
│  │     │ │     │  DashboardPage 등        │          │
│  │유저  │ │     │  (Outlet으로 렌더링)      │          │
│  │로그  │ │     └──────────────────────────┘          │
│  │아웃  │ │                                           │
│  └─────┘ │                                           │
└──────────┴───────────────────────────────────────────┘
```

**`MainLayout` 컴포넌트 (`src/app/layouts/main-layout.tsx`):**
- `collapsed` 상태를 단일 소스로 관리, Sidebar와 Header에 prop으로 전달
- `<main data-scroll-area>` 속성을 통해 Header의 스크롤 감지 연동
- CSS Custom Properties 기반 반응형 margin-left 전환

**Sidebar (`src/widgets/sidebar/sidebar.tsx`):**
- `useMe()` 훅으로 API menuTree 기반 동적 메뉴 렌더링
- `buildMenuItems()` — MenuTree[] → Ant Design MenuItem[] 재귀 변환
- `menuIconMap` — pageName → 아이콘 매핑 테이블 (확장 시 이 파일만 수정)
- 접기/펼치기 + Tooltip, 모바일 오버레이 + 라우트 변경 시 자동 닫힘
- 하단 사용자 정보(아바타, 이름, 이메일) 클릭 시 `/mypage`로 네비게이션 + 로그아웃 버튼
- 로고/유저 영역 호버 효과 (background, scale, box-shadow 트랜지션)

**Header (`src/widgets/header/header.tsx`):**
- 사이드바 토글 + 동적 Breadcrumb
- 테넌트 뱃지(corpName) + 알림 Popover + 프로필 Dropdown
- 프로필 드롭다운: "내 정보" → `/mypage` 네비게이션, "비밀번호 변경" → ChangePasswordForm 모달
- `data-scrolled` 속성 기반 스크롤 감지 box-shadow

**Breadcrumb (`src/widgets/breadcrumb/breadcrumb.tsx`):**
- `useMe().pathNameMap` 기반 URL 세그먼트 → 한국어 이름 매핑
- Home 아이콘 + 현재 경로 자동 파싱

### 2.5 권한 기반 동적 메뉴

서버 `/auth/me` 응답의 `menuTree`와 `permissions`를 기반으로 사용자별 메뉴를 동적 생성합니다:

```
┌────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌────────────────┐
│ /auth/me   │────▶│ MeResponse       │────▶│ filterMenuTree() │────▶│ buildMenuItems │
│ API 응답    │     │ .menuTree[]      │     │ (read 권한 필터)  │     │ → MenuItem[]   │
│            │     │ .permissions{}   │     │ (재귀 + 정렬)     │     │ (AntD 메뉴)    │
└────────────┘     └──────────────────┘     └──────────────────┘     └────────────────┘
```

**권한 유틸 (`src/features/auth/lib/permission.ts`):**

| 함수 | 설명 |
|------|------|
| `hasPermission(permissions, pageName, action)` | `{pageName}.{action}` 키 기반 권한 체크 |
| `hasReadPermission(permissions, pageName)` | read 권한 단축 함수 |
| `filterMenuTree(menuTree, permissions)` | read 권한 없는 메뉴 재귀 제거 + order 정렬 |
| `buildPathNameMap(menuTree)` | path → displayName 플랫 맵 생성 (breadcrumb용) |

**`useMe()` 훅 (`src/features/auth/model/use-me.ts`):**
- Zustand store의 `me` 상태를 반응적으로 구독
- `filterMenuTree()`, `buildPathNameMap()`, `hasPermission()` 파생 데이터 제공
- Sidebar, Header, Breadcrumb에서 공통 사용

---

## 3. 인증 아키텍처

### 3.1 로그인 플로우

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   사용자      │     │  LoginForm    │     │  useLogin()   │     │  서버 API     │
│  입력 폼      │────▶│  Zod 검증     │────▶│mutateAsync() │────▶│ POST /auth/  │
│              │     │              │     │              │     │    login      │
└──────────────┘     └──────────────┘     └──────┬───────┘     └──────┬───────┘
                                                  │                     │
                                                  │    ◀── LoginResponse ──┘
                                                  │
                                          ┌───────▼───────┐
                                          │ authService.   │
                                          │ loginSuccess() │
                                          │  (await 완료)  │
                                          └───────┬───────┘
                                                  │
                              ┌────────────────────┼────────────────────┐
                              ▼                    ▼                    ▼
                     ┌────────────────┐  ┌─────────────────┐  ┌────────────────┐
                     │ authStorage.   │  │ useAuthStore.   │  │ meApi()        │
                     │ setTokens()    │  │ setAccessToken()│  │ GET /auth/me   │
                     │ (localStorage) │  │ (Zustand)       │  │ → setMe()      │
                     └────────────────┘  └─────────────────┘  └────────────────┘
                                                                       │
                                                              ┌────────▼────────┐
                                                              │ authStorage.    │
                                                              │   setMe()       │
                                                              │ useAuthStore.   │
                                                              │   setMe()       │
                                                              └────────┬────────┘
                                                                       │
                                                              ┌────────▼────────┐
                                                              │ mutateAsync     │
                                                              │ resolve → 이후  │
                                                              │ navigate(       │
                                                              │  '/dashboard')  │
                                                              └─────────────────┘
```

**상세 단계:**

1. 사용자가 **업체명(tenantName)**, **아이디(userId)**, **비밀번호(password)** 입력
2. `LoginForm`에서 **Zod 스키마** 검증 (`loginSchema`)
3. `useLogin()` 훅의 `mutateAsync()` 호출 → `loginApi()` → `POST /auth/login`
4. 서버 응답(`LoginResponse`) 수신:
   - `accessToken`, `refreshToken`, `expiresIn`, `refreshExpiresAt`, `user` 정보 포함
5. `authService.loginSuccess()` 실행 (**await 완료 후 navigate**):
   - `authStorage.setTokens()` → localStorage에 토큰 저장
   - `useAuthStore.setAccessToken()` → Zustand에 토큰 동기화
   - `meApi()` 호출 → 사용자 프로필, 역할, 권한, 메뉴 트리 조회
   - `authStorage.setMe()` → localStorage에 캐시
   - `useAuthStore.setMe()` → **Zustand에 me 동기화 (반응성 확보)**
6. `mutateAsync` promise resolve 후 `/dashboard`로 네비게이션

> **중요**: `mutateAsync`를 사용하여 me 데이터 저장이 완료된 후에 navigate가 실행됩니다. `mutate` + 콜백 방식에서는 me API가 완료되기 전에 navigate가 실행되어 메뉴/사용자 정보가 보이지 않는 문제가 있었습니다.

### 3.2 토큰 관리

**저장소 분리:**

| 데이터 | 저장소 | 키 | 용도 |
|--------|--------|-----|------|
| Access Token | localStorage | `accessToken` | API 요청 인증 헤더 |
| Refresh Token | localStorage | `refreshToken` | Access Token 갱신 |
| Access Token | Zustand (`useAuthStore`) | `accessToken` | 컴포넌트 반응성 |
| 사용자 정보 | localStorage | `me` | 사용자 프로필/권한/메뉴 캐시 (영속) |
| 사용자 정보 | Zustand (`useAuthStore`) | `me` | 사용자 프로필/권한/메뉴 (반응성) |

**`authStorage` API:**

```typescript
authStorage.setTokens({ accessToken, refreshToken })  // 토큰 쌍 저장
authStorage.getAccessToken()                           // Access Token 조회
authStorage.getRefreshToken()                          // Refresh Token 조회
authStorage.clearTokens()                              // 토큰 삭제
authStorage.setMe(meResponse)                          // 사용자 정보 저장
authStorage.getMe()                                    // 사용자 정보 조회
authStorage.clearMe()                                  // 사용자 정보 삭제
```

### 3.3 자동 토큰 갱신 (Silent Refresh)

Axios 응답 인터셉터가 **401 Unauthorized** 응답을 감지하면 자동으로 토큰을 갱신합니다.

```
┌────────────┐     ┌──────────────┐     ┌──────────────┐
│ 원본 요청    │────▶│  서버 응답     │────▶│ 401 감지      │
│ (API 호출)  │     │              │     │              │
└────────────┘     └──────────────┘     └──────┬───────┘
                                                │
                                    ┌───────────▼──────────┐
                                    │  refreshToken 존재?   │
                                    └───────────┬──────────┘
                                          예 │        │ 아니오
                                             │        ▼
                                             │   토큰 삭제 → reject
                                             ▼
                                    ┌────────────────────┐
                                    │  isRefreshing?      │
                                    └────────┬───────────┘
                                       예 │       │ 아니오
                                          │       ▼
                                          │  ┌────────────────────┐
                                          │  │ POST /auth/        │
                                          │  │   refresh-token    │
                                          │  └────────┬───────────┘
                                          │           │
                                          │     ┌─────▼─────┐
                                          │     │ 성공?      │
                                          │     └─────┬─────┘
                                          │      예 │    │ 실패
                                          │         │    ▼
                                          │         │  토큰 삭제 → 대기열 모두 reject
                                          │         ▼
                                          │  ┌────────────────┐
                                          │  │ 새 토큰 저장    │
                                          │  │ 대기열 처리     │
                                          │  │ 원본 요청 재시도 │
                                          │  └────────────────┘
                                          │         │
                                    ┌─────▼─────────▼────┐
                                    │ 대기열에 추가        │
                                    │ (리프레시 완료 후     │
                                    │  일괄 재시도)        │
                                    └────────────────────┘
```

**동시성 처리:**
- `isRefreshing` 플래그로 **동시 다중 리프레시 요청 방지**
- `failedQueue` 배열에 401 실패 요청을 대기시킨 뒤, 리프레시 완료 후 일괄 처리
- `processQueue()` 함수가 대기열의 모든 Promise를 resolve 또는 reject

### 3.4 보호된 라우트 (Route Guard)

```tsx
// src/app/ProtectedRoute.tsx
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const storeToken = useAuthStore((state) => state.accessToken);
  const storageToken = authStorage.getAccessToken();
  const isLoggedIn = !!(storeToken || storageToken);
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}
```

- **이중 인증 체크**: Zustand 스토어(반응성) + localStorage(영속성) 모두 확인
- Zustand 스토어의 토큰이 변경되면 즉시 리렌더링 → 반응적 인증 상태 관리
- localStorage는 페이지 새로고침 후에도 로그인 유지를 위한 폴백
- 미인증 시 `/login`으로 리다이렉트 (`replace`로 히스토리 대체)

### 3.5 인증 관련 타입

```typescript
// 로그인 요청
interface LoginRequest {
  tenantName: string;    // 업체명 (멀티 테넌트)
  userId: string;        // 사용자 ID
  password: string;      // 비밀번호
}

// 로그인 응답
interface LoginResponse {
  accessToken: string;
  expiresIn: string;
  refreshToken: string;
  refreshExpiresAt: string;
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
}

// 사용자 프로필 (/auth/me 응답)
interface MeResponse {
  user: { userSeq, tenantId, tenantName, userId, userName, ... };
  roles: string[];                        // 역할 목록
  permissions: Record<string, boolean>;   // 권한 맵
  menuTree: MenuTree[];                   // 동적 메뉴 트리
}

// 메뉴 트리 (재귀 구조)
interface MenuTree {
  pageName: string;
  displayName: string;
  path: string;
  order: number;
  children: MenuTree[];
}

// 토큰 갱신
type RefreshTokenRequest = { refreshToken: string };
type RefreshTokenResponse = Pick<LoginResponse,
  'accessToken' | 'expiresIn' | 'refreshToken' | 'refreshExpiresAt'
>;

// 로그아웃
interface LogoutRequest { refreshToken: string }
interface LogoutResponse { ok: boolean }

// 전체 기기 로그아웃
interface LogoutAllResponse { ok: boolean }

// 비밀번호 변경
interface ChangePasswordRequest {
  currentPassword: string;    // 현재 비밀번호
  newPassword: string;        // 새 비밀번호
  confirmPassword: string;    // 새 비밀번호 확인
}
// 응답: void (204 No Content)

// 프로필 수정
interface UpdateProfileRequest {
  corpName?: string;
  userName?: string;
  userEmail?: string;
  userTel?: string;
  userHp?: string;
}
type UpdateProfileResponse = LoginResponse['user'];  // user 객체 응답

// 회원가입
interface SignupRequest {
  companyName: string;    // 회사명 (새 Tenant)
  adminName: string;      // 관리자 이름
  email: string;          // 이메일 (시스템 전체 중복 체크)
  phone: string;          // 전화번호
  password: string;       // 비밀번호
}

interface SignupResponse {
  message: string;
  tenant: { tenantId: number; tenantName: string };
  admin: { userSeq: number; userId: string; userName: string };
}

// 권한 관련
type PermissionAction = 'read' | 'create' | 'update' | 'delete';
type Permissions = Record<string, boolean>;

// useMe 훅 반환 타입
interface UseMeReturn {
  me: MeResponse | null;
  menuTree: MenuTree[];                  // 권한 필터링된 메뉴 트리
  pathNameMap: Record<string, string>;   // breadcrumb용 경로→이름 맵
  permissions: Permissions;
  hasPermission: (pageName: string, action: PermissionAction) => boolean;
}
```

### 3.6 회원가입 플로우

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   사용자      │     │  SignupForm   │     │  useSignup()  │     │  서버 API     │
│  입력 폼      │────▶│  Zod 검증     │────▶│mutateAsync() │────▶│ POST /auth/  │
│              │     │  (6필드)      │     │              │     │    signup     │
└──────────────┘     └──────────────┘     └──────┬───────┘     └──────┬───────┘
                                                  │                     │
                                                  │  ◀── SignupResponse ──┘
                                                  │
                                          ┌───────▼───────┐
                                          │ 성공:          │
                                          │ message.success│
                                          │ navigate       │
                                          │ ('/login')     │
                                          └───────────────┘
```

**상세 단계:**

1. 사용자가 **회사명**, **관리자 이름**, **이메일**, **전화번호**, **비밀번호**, **비밀번호 확인** 입력
2. `SignupForm`에서 **Zod 스키마** 검증 (`signupSchema`)
   - 이메일 형식, 비밀번호 8자+ 대문자/숫자/특수문자, 비밀번호 확인 일치 검증
   - `.refine()`으로 비밀번호 확인 교차 검증
3. `passwordConfirm` 필드 제거 후 5필드만 `useSignup()` → `signupApi()` → `POST /auth/signup`
4. 성공 시: `message.success('회원가입이 완료되었습니다.')` → `/login`으로 이동
5. 실패 시: `getApiErrorMessage()`로 에러 메시지 표시
   - **400** (`VAL001`): 유효성 검사 실패
   - **409** (`BIZ001`): 이메일 또는 회사명 중복

> **참고**: 회원가입 후 자동 로그인하지 않고 로그인 페이지로 이동합니다. 이는 향후 이메일 인증 등 추가 단계 확장을 고려한 설계입니다.

**프로세스 (서버 측):**
1. 이메일 중복 체크 (전체 시스템)
2. 회사명 중복 체크
3. 새 Tenant 생성
4. 관리자 계정 생성 (즉시 활성화)

### 3.7 인증 Feature Slice 구조

```
features/auth/
├─ index.ts                    # Public API — 외부 노출 인터페이스
│   ├─ export LoginForm, SignupForm, ChangePasswordForm, ProfileEditForm  (UI 컴포넌트)
│   ├─ export useLogin, useSignup    (커스텀 훅)
│   ├─ export useLogout, useLogoutAll  (커스텀 훅)
│   ├─ export useMe                 (커스텀 훅)
│   ├─ export useChangePassword, useUpdateProfile  (커스텀 훅)
│   ├─ export loginSchema, signupSchema, changePasswordSchema, updateProfileSchema  (Zod 스키마)
│   ├─ export hasPermission, hasReadPermission, filterMenuTree, buildPathNameMap (권한 유틸)
│   ├─ export loginApi, logoutApi, logoutAllApi, signupApi  (API 함수)
│   ├─ export meApi, changePasswordApi, updateProfileApi  (API 함수)
│   ├─ export refreshTokenApi        (API 함수)
│   ├─ export setupAuthAxiosInterceptor  (인터셉터 초기화)
│   ├─ export authStorage            (localStorage 래퍼)
│   └─ export 모든 타입               (타입 정의)
│
├─ api/
│   ├─ endpoints.ts            API 엔드포인트 경로 상수 (AUTH_ENDPOINTS)
│   ├─ login.api.ts            POST /auth/login
│   ├─ logout.api.ts           POST /auth/logout
│   ├─ logout-all.api.ts       POST /auth/logout-all
│   ├─ me.api.ts               GET /auth/me
│   ├─ change-password.api.ts  POST /auth/change-password
│   ├─ update-profile.api.ts   PATCH /auth/me/profile
│   ├─ refresh-token.api.ts    POST /auth/refresh-token
│   └─ signup.api.ts           POST /auth/signup
│
├─ lib/
│   ├─ auth-storage.ts         localStorage 래퍼 (토큰 + 사용자 정보 CRUD, JSON.parse 안전 처리)
│   ├─ permission.ts           권한 체크 + 메뉴 필터링 + pathNameMap 빌드 유틸
│   └─ setup-auth-interceptor.ts  Axios 인터셉터에 auth 의존성 주입 (DI 브릿지)
│
├─ model/
│   ├─ auth.store.ts           Zustand 스토어 (accessToken + me 상태, localStorage hydration)
│   ├─ auth.service.ts         비즈니스 로직 (로그인 성공 처리 오케스트레이션)
│   ├─ login.schema.ts         Zod 유효성 스키마 (tenantName, userId, password)
│   ├─ signup.schema.ts        Zod 유효성 스키마 (회원가입 6필드 + refine 비밀번호 확인)
│   ├─ change-password.schema.ts  Zod 유효성 스키마 (비밀번호 규칙 + refine 현재/새 비밀번호 교차검증)
│   ├─ update-profile.schema.ts  Zod 유효성 스키마 (회사명, 이름, 이메일, 전화번호, 휴대폰)
│   ├─ use-login.ts            useMutation 기반 로그인 훅
│   ├─ use-signup.ts           useMutation 기반 회원가입 훅
│   ├─ use-logout.ts           로그아웃 훅 (API 호출 + 로컬 상태 정리 + 리다이렉트)
│   ├─ use-logout-all.ts       전체 기기 로그아웃 훅 (useCallback 패턴, API + 로컬 상태 정리)
│   ├─ use-me.ts               사용자 정보 훅 (Zustand 구독 + 메뉴/권한 파생 데이터)
│   ├─ use-change-password.ts  useMutation 기반 비밀번호 변경 훅
│   ├─ use-update-profile.ts   useMutation 기반 프로필 수정 훅 (onSuccess에서 로컬 상태 병합)
│   └─ use-refresh-token.ts    useMutation 기반 토큰 갱신 훅
│
├─ types/
│   └─ auth.type.ts            인증/권한 관련 TypeScript 타입/인터페이스
│
└─ ui/                         # 컴포넌트별 폴더 분리
    ├─ login-form/
    │  ├─ login-form.tsx       로그인 폼 (React Hook Form + mutateAsync + Ant Design)
    │  └─ login-form.module.css
    ├─ signup-form/
    │  ├─ signup-form.tsx      회원가입 폼 (6필드, passwordConfirm 제거 후 전송)
    │  └─ signup-form.module.css
    ├─ change-password-form/
    │  ├─ change-password-form.tsx     비밀번호 변경 모달 폼 (3필드, Ant Design Modal 내부)
    │  └─ change-password-form.module.css
    └─ profile-edit-form/
       ├─ profile-edit-form.tsx       프로필 수정 모달 폼 (5필드, z.infer 타입)
       └─ profile-edit-form.module.css
```

---

## 4. 상태 관리 전략

본 프로젝트는 상태의 성격에 따라 4가지 관리 전략을 사용합니다.

```
┌─────────────────────┬──────────────────────┬────────────────────────┐
│     상태 종류        │    관리 도구          │    사용 사례            │
├─────────────────────┼──────────────────────┼────────────────────────┤
│ 서버 상태           │ TanStack React Query │ API 데이터 캐싱/동기화  │
│ 클라이언트 전역 상태 │ Zustand              │ 인증 토큰, UI 상태      │
│ 영속 상태           │ localStorage         │ 토큰, 사용자 프로필     │
│ 폼 상태            │ React Hook Form + Zod │ 폼 입력값, 유효성 검증  │
└─────────────────────┴──────────────────────┴────────────────────────┘
```

### 4.1 서버 상태 — TanStack React Query

- **useMutation**: 로그인, 토큰 갱신 등 변경 작업
- `QueryClient`는 `App.tsx`에서 한 번 생성하여 Provider로 전달
- 향후 `useQuery`를 활용한 데이터 조회/캐싱 확장 가능

```typescript
// 뮤테이션 패턴 예시
export function useLogin() {
  return useMutation<LoginResponse, AxiosError<ErrorResponse>, LoginRequest>({
    mutationFn: loginApi,
    onSuccess: async (data) => {
      await authService.loginSuccess(data);
    },
  });
}

// 호출부에서는 mutateAsync를 사용하여 완료를 보장
const onSubmit = async (data: LoginRequest) => {
  try {
    await loginMutation.mutateAsync(data);
    navigate('/dashboard');  // me 저장 완료 후 navigate
  } catch (error) {
    // 에러 처리
  }
};
```

- **에러 타입**: `AxiosError<ErrorResponse>`로 래핑하여 `error.response?.data`에서 타입 안전하게 에러 상세 정보 접근
- **mutateAsync**: `mutate` + 콜백 대신 `mutateAsync` + `await`를 사용하여 비동기 처리 순서를 보장합니다. 이는 `authService.loginSuccess()` 내 me API 호출이 완료된 후에 navigate가 실행되도록 합니다.
```

### 4.2 클라이언트 상태 — Zustand

- Provider 없이 글로벌 스토어 사용
- 인터셉터 등 React 외부에서도 `getState()`로 접근 가능

```typescript
// 스토어 정의
const useAuthStore = create<AuthState>((set) => ({
  accessToken: authStorage.getAccessToken(),  // localStorage에서 초기 hydration
  me: authStorage.getMe(),                    // localStorage에서 초기 hydration
  setAccessToken: (accessToken) => set({ accessToken }),
  setMe: (me) => set({ me }),
  clearAuth: () => set({ accessToken: null, me: null }),
}));

// 컴포넌트 내 사용
const token = useAuthStore((state) => state.accessToken);
const me = useAuthStore((state) => state.me);  // me 데이터 반응적 구독

// React 외부 사용 (인터셉터 등)
useAuthStore.getState().setAccessToken(newToken);
useAuthStore.getState().setMe(meData);
```

### 4.3 영속 상태 — localStorage

`authStorage` 유틸을 통해 추상화된 인터페이스로 접근합니다:

- **토큰**: `accessToken`, `refreshToken` 키로 문자열 저장
- **사용자 정보**: `me` 키로 JSON 직렬화하여 저장
- **안전 파싱**: `getMe()`는 `JSON.parse`를 `try-catch`로 감싸 손상된 데이터 자동 제거
- 인터셉터가 요청마다 `getAccessToken()`으로 토큰을 읽어 헤더에 첨부

### 4.4 폼 상태 — React Hook Form + Zod

```typescript
// 로그인 Zod 스키마
const loginSchema = z.object({
  tenantName: z.string().min(1, '업체명을 입력하세요'),
  userId: z.string().min(1, '아이디를 입력하세요'),
  password: z.string().min(1, '비밀번호를 입력하세요'),
});

// 회원가입 Zod 스키마 (refine으로 교차 검증)
const signupSchema = z.object({
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
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['passwordConfirm'],
});

// React Hook Form + zodResolver
const { control, handleSubmit, reset, setFocus, formState: { errors } } = useForm<LoginRequest>({
  resolver: zodResolver(loginSchema),
  defaultValues: { tenantName: '', userId: '', password: '' },
});
```

- **Zod**: 스키마 기반 유효성 검증 (타입 자동 추론)
- **zodResolver**: React Hook Form과 Zod 통합 어댑터
- **Controller**: Ant Design 컴포넌트와 React Hook Form 연결
- **reset()**: 로그인 실패 시 폼 초기화 (DOM 직접 조작 대신 React 방식)
- **setFocus()**: 초기화 후 첫 번째 필드로 포커스 이동
- **refine()**: 회원가입/비밀번호 변경 스키마에서 교차 검증에 사용 (비밀번호 확인 일치, 현재/새 비밀번호 상이)
- **z.infer**: 프로필 수정 폼에서 optional 필드를 포함한 정확한 폼 타입 추론에 사용

**등록된 Zod 스키마:**

| 스키마 | 파일 | 필드 수 | 주요 검증 |
|--------|------|--------|----------|
| `loginSchema` | `login.schema.ts` | 3 | 필수 입력 |
| `signupSchema` | `signup.schema.ts` | 6 | 이메일 형식, 비밀번호 강도, refine 비밀번호 확인 |
| `changePasswordSchema` | `change-password.schema.ts` | 3 | 8자+ 영문/숫자/특수문자, refine 비밀번호 확인 + 현재와 상이 |
| `updateProfileSchema` | `update-profile.schema.ts` | 5 | 이메일 형식, 최대 길이, optional 필드 (`userTel`, `userHp`) |
| `createUserSchema` | `create-user.schema.ts` | 7 | 사용자 ID/비밀번호 필수, 이메일 형식, 회사명 필수 |
| `updateUserSchema` | `update-user.schema.ts` | 5 | 이름/회사명 필수, 이메일/전화번호 optional |
| `resetUserPasswordSchema` | `reset-user-password.schema.ts` | 1 | 새 비밀번호 8자 이상 |
| `createTenantSchema` | `create-tenant.schema.ts` | 3 | 테넌트명, 표시명, 도메인 필수 |
| `updateTenantSchema` | `update-tenant.schema.ts` | 3 | 테넌트명, 표시명, 도메인 필수 |
| `createAdminPageSchema` | `create-admin-page.schema.ts` | 6 | pageName, path, displayName 필수, description/parentId/sortOrder optional |
| `updateAdminPageSchema` | `update-admin-page.schema.ts` | 6 | 동일 필드 |
| `createAdminActionSchema` | `create-admin-action.schema.ts` | 2 | actionName 필수 (max 50), displayName optional |
| `updateAdminActionSchema` | `update-admin-action.schema.ts` | 2 | 동일 필드 |
| `createAdminPermissionSchema` | `create-admin-permission.schema.ts` | 4 | pageId min(1), actionId min(1), displayName/description optional |
| `updateAdminPermissionSchema` | `update-admin-permission.schema.ts` | 4 | 동일 필드 |

---

## 5. API 통신 계층

### 5.1 Axios 인스턴스

```typescript
// src/shared/api/axios.ts
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});
```

- 환경변수 `VITE_API_URL`로 API 서버 주소 설정
- JSON Content-Type 기본 적용
- 모든 feature의 API 함수는 이 인스턴스를 공유

### 5.2 요청 인터셉터

**DI(Dependency Injection) 패턴:**

`shared/api/axios-interceptor.ts`는 FSD 레이어 규칙을 준수하기 위해 **DI 패턴**으로 구현되어 있습니다. shared 레이어는 features를 직접 import할 수 없으므로, 인터페이스(`AuthInterceptorDeps`)를 정의하고 외부에서 의존성을 주입받습니다.

```typescript
// src/shared/api/axios-interceptor.ts
export interface AuthInterceptorDeps {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  clearTokens: () => void;
  setStoreToken: (token: string) => void;
  clearStoreAuth: () => void;
  refreshTokenApi: (body: { refreshToken: string }) => Promise<{ accessToken: string; refreshToken: string }>;
  onRefreshFailure?: () => void;
}

export function setupAuthInterceptor(deps: AuthInterceptorDeps) {
  // 요청 인터셉터: Authorization Bearer 헤더 자동 첨부
  axiosInstance.interceptors.request.use((config) => {
    const token = deps.getAccessToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });

  // 응답 인터셉터: 401 응답 시 자동 토큰 갱신 + 실패 시 로그아웃
  // (isRefreshing, failedQueue 가 클로저 내에 캡슐화)
}
```

**DI 브릿지 (의존성 주입):**

```typescript
// src/features/auth/lib/setup-auth-interceptor.ts
import { setupAuthInterceptor } from '@shared/api/axios-interceptor';
import { authStorage } from './auth-storage';
import { useAuthStore } from '../model/auth.store';
import { refreshTokenApi } from '../api/refresh-token.api';

export function setupAuthAxiosInterceptor() {
  setupAuthInterceptor({
    getAccessToken: () => authStorage.getAccessToken(),
    getRefreshToken: () => authStorage.getRefreshToken(),
    setTokens: (tokens) => authStorage.setTokens(tokens),
    clearTokens: () => authStorage.clearTokens(),
    setStoreToken: (token) => useAuthStore.getState().setAccessToken(token),
    clearStoreAuth: () => useAuthStore.getState().clearAuth(),
    refreshTokenApi: (body) => refreshTokenApi(body),
    onRefreshFailure: () => { window.location.href = '/login'; },
  });
}
```

**이 패턴의 장점:**
- `shared/` 레이어가 `features/`를 import하지 않아 **FSD 의존성 규칙 준수**
- 인터셉터 로직이 테스트 가능하고 교체 가능
- `isRefreshing`, `failedQueue` 상태가 클로저 내에 캡슐화되어 모듈 외부에 노출되지 않음

### 5.3 응답 인터셉터

401 응답 처리 로직:

1. `deps.getRefreshToken()`으로 refreshToken 존재 확인
2. 이미 리프레시 중(`isRefreshing`)이면 대기열(`failedQueue`)에 추가
3. 리프레시 중이 아니면 `deps.refreshTokenApi()` 호출
4. 성공 시: `deps.setTokens()` + `deps.setStoreToken()` + 대기열 처리 + 원본 요청 재시도
5. 실패 시: `deps.clearTokens()` + `deps.clearStoreAuth()` + `deps.onRefreshFailure()` → `/login` 리다이렉트

### 5.4 에러 처리

**공통 에러 응답 구조:**

```typescript
interface ErrorResponse {
  error: {
    code: string;       // 에러 코드 (예: "AUTH001")
    message: string;    // 서버 에러 메시지
    statusCode: number; // HTTP 상태 코드
  };
  meta: {
    requestId: string;  // 요청 추적 ID
    timestamp: string;  // 발생 시각
    path: string;       // 요청 경로
  };
}
```

**에러 메시지 매핑 (`getApiErrorMessage`):**

| 에러 코드 키 | 한국어 메시지 |
|-------------|-------------|
| `AUTH001_401` | 인증에 실패했습니다. |
| `AUTH101_403` | 권한이 부족합니다. |
| `VAL001_400` | 입력값이 올바르지 않습니다. |
| `BIZ001_409` | 비즈니스 충돌 오류가 발생했습니다. |
| `RES001_404` | 요청한 리소스를 찾을 수 없습니다. |
| (네트워크 에러) | 네트워크 오류가 발생했습니다. 다시 시도해주세요. |
| (타임아웃) | 요청 시간이 초과되었습니다. 다시 시도해주세요. |
| (서버 무응답) | 서버 응답이 없습니다. 잠시 후 다시 시도해주세요. |
| (기본) | 알 수 없는 오류가 발생했습니다. |

**처리 우선순위:**
1. Axios 에러 → 네트워크/타임아웃/서버 에러 분기
2. ErrorResponse 구조 확인 → `{code}_{statusCode}` 키로 매핑 테이블 조회
3. 매핑 없으면 서버 `message` 필드 사용
4. 최종 폴백: "알 수 없는 오류가 발생했습니다."

### 5.5 API 엔드포인트 관리

**엔드포인트 상수 파일:**

각 feature slice는 `api/endpoints.ts`에 API 경로를 상수로 정의합니다:

```typescript
// src/features/auth/api/endpoints.ts
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

// src/features/user/api/user.endpoint.ts
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

// src/features/role/api/role.endpoint.ts
export const ROLE_ENDPOINTS = {
  LIST: '/roles',
} as const;

// src/features/super-dashboard/api/super-dashboard.endpoint.ts
export const SUPER_DASHBOARD_ENDPOINTS = {
  DASHBOARD: '/super/dashboard',
} as const;

// src/features/tenant/api/tenant.endpoint.ts
export const TENANT_ENDPOINTS = {
  LIST: '/tenants',
  CREATE: '/tenants',
  DETAIL: (id: number) => `/tenants/${id}`,
  UPDATE: (id: number) => `/tenants/${id}`,
  DELETE: (id: number) => `/tenants/${id}`,
  STATUS: (id: number) => `/tenants/${id}/status`,
} as const;

// src/features/admin-page/api/admin-page.endpoint.ts
export const ADMIN_PAGE_ENDPOINTS = {
  LIST: '/permissions/admin/pages',
  CREATE: '/permissions/admin/pages',
  DETAIL: (id: number) => `/permissions/admin/pages/${id}`,
  UPDATE: (id: number) => `/permissions/admin/pages/${id}`,
  STATUS: (id: number) => `/permissions/admin/pages/${id}/status`,
  DELETE: (id: number) => `/permissions/admin/pages/${id}`,
} as const;

// src/features/admin-action/api/admin-action.endpoint.ts
export const ADMIN_ACTION_ENDPOINTS = {
  LIST: '/permissions/admin/actions',
  CREATE: '/permissions/admin/actions',
  DETAIL: (id: number) => `/permissions/admin/actions/${id}`,
  UPDATE: (id: number) => `/permissions/admin/actions/${id}`,
  STATUS: (id: number) => `/permissions/admin/actions/${id}/status`,
  DELETE: (id: number) => `/permissions/admin/actions/${id}`,
} as const;

// src/features/admin-permission/api/admin-permission.endpoint.ts
export const ADMIN_PERMISSION_ENDPOINTS = {
  LIST: '/permissions/admin/permissions',
  CREATE: '/permissions/admin/permissions',
  DETAIL: (id: number) => `/permissions/admin/permissions/${id}`,
  UPDATE: (id: number) => `/permissions/admin/permissions/${id}`,
  STATUS: (id: number) => `/permissions/admin/permissions/${id}/status`,
  DELETE: (id: number) => `/permissions/admin/permissions/${id}`,
} as const;
```

- 상수 파일을 분리하여 API 경로 변경 시 한 곳만 수정
- `as const`로 리터럴 타입 보장

**API 엔드포인트 목록:**

| 메서드 | 경로 | 설명 | 요청 타입 | 응답 타입 |
|--------|------|------|----------|----------|
| POST | `/auth/login` | 로그인 | `LoginRequest` | `LoginResponse` |
| POST | `/auth/logout` | 로그아웃 (토큰 폐기) | `LogoutRequest` | `LogoutResponse` |
| POST | `/auth/logout-all` | 전체 기기 로그아웃 | — | `LogoutAllResponse` |
| GET | `/auth/me` | 현재 사용자 정보 조회 | — | `MeResponse` |
| POST | `/auth/change-password` | 비밀번호 변경 | `ChangePasswordRequest` | `void` (204) |
| PATCH | `/auth/me/profile` | 프로필 수정 | `UpdateProfileRequest` | `UpdateProfileResponse` |
| POST | `/auth/refresh-token` | 토큰 갱신 | `RefreshTokenRequest` | `RefreshTokenResponse` |
| POST | `/auth/signup` | 회원가입 (Tenant + 관리자 생성) | `SignupRequest` | `SignupResponse` |
| GET | `/users` | 사용자 목록 조회 | `GetUsersRequest` (query) | `GetUsersResponse` |
| GET | `/users/{id}` | 사용자 상세 조회 | — | `GetUserResponse` |
| POST | `/users` | 사용자 생성 | `CreateUserRequest` | `CreateUserResponse` |
| PATCH | `/users/{id}` | 사용자 수정 | `UpdateUserRequest` | `UpdateUserResponse` |
| PATCH | `/users/{id}/status` | 사용자 상태 변경 (활성/정지) | `UpdateUserStatusRequest` | `UpdateUserStatusResponse` |
| PATCH | `/users/{id}/password` | 비밀번호 초기화 | `ResetUserPasswordRequest` | `void` (204) |
| POST | `/users/{id}/invalidate-tokens` | 강제 로그아웃 (토큰 무효화) | — | `void` (204) |
| PATCH | `/users/{id}/roles` | 사용자 역할 변경 | `UpdateUserRolesRequest` | `UpdateUserRolesResponse` |
| GET | `/roles` | 역할 목록 조회 | `GetRolesRequest` (query) | `GetRolesResponse` |
| GET | `/super/dashboard` | 슈퍼 관리자 대시보드 데이터 | — | `SuperDashboardResponse` |
| GET | `/tenants` | 테넌트 목록 조회 | `GetTenantsRequest` (query) | `GetTenantsResponse` |
| GET | `/tenants/{id}` | 테넌트 상세 조회 | — | `GetTenantResponse` |
| POST | `/tenants` | 테넌트 생성 | `CreateTenantRequest` | `CreateTenantResponse` |
| PATCH | `/tenants/{id}` | 테넌트 수정 | `UpdateTenantRequest` | `UpdateTenantResponse` |
| DELETE | `/tenants/{id}` | 테넌트 삭제 (사용자 존재 시 400) | — | `void` (204) |
| PATCH | `/tenants/{id}/status` | 테넌트 상태 변경 (활성/비활성) | `UpdateTenantStatusRequest` | `UpdateTenantStatusResponse` |
| GET | `/permissions/admin/pages` | RBAC 페이지 목록 조회 | `GetAdminPagesRequest` (query) | `GetAdminPagesResponse` |
| GET | `/permissions/admin/pages/{id}` | RBAC 페이지 상세 조회 | — | `AdminPageResponse` |
| POST | `/permissions/admin/pages` | RBAC 페이지 생성 | `CreateAdminPageRequest` | `CreateAdminPageResponse` |
| PATCH | `/permissions/admin/pages/{id}` | RBAC 페이지 수정 | `UpdateAdminPageRequest` | `UpdateAdminPageResponse` |
| PATCH | `/permissions/admin/pages/{id}/status` | RBAC 페이지 상태 변경 | `{ isActive: 0 \| 1 }` | `AdminPageResponse` |
| DELETE | `/permissions/admin/pages/{id}` | RBAC 페이지 삭제 | — | `void` (204) |
| GET | `/permissions/admin/actions` | RBAC 액션 목록 조회 | `GetAdminActionsRequest` (query) | `GetAdminActionsResponse` |
| GET | `/permissions/admin/actions/{id}` | RBAC 액션 상세 조회 | — | `AdminActionResponse` |
| POST | `/permissions/admin/actions` | RBAC 액션 생성 | `CreateAdminActionRequest` | `CreateAdminActionResponse` |
| PATCH | `/permissions/admin/actions/{id}` | RBAC 액션 수정 | `UpdateAdminActionRequest` | `UpdateAdminActionResponse` |
| PATCH | `/permissions/admin/actions/{id}/status` | RBAC 액션 상태 변경 | `{ isActive: 0 \| 1 }` | `AdminActionResponse` |
| DELETE | `/permissions/admin/actions/{id}` | RBAC 액션 삭제 | — | `void` (204) |
| GET | `/permissions/admin/permissions` | RBAC 권한 목록 조회 | `GetAdminPermissionsRequest` (query) | `GetAdminPermissionsResponse` |
| GET | `/permissions/admin/permissions/{id}` | RBAC 권한 상세 조회 | — | `AdminPermissionResponse` |
| POST | `/permissions/admin/permissions` | RBAC 권한 생성 | `CreateAdminPermissionRequest` | `CreateAdminPermissionResponse` |
| PATCH | `/permissions/admin/permissions/{id}` | RBAC 권한 수정 | `UpdateAdminPermissionRequest` | `UpdateAdminPermissionResponse` |
| PATCH | `/permissions/admin/permissions/{id}/status` | RBAC 권한 상태 변경 | `{ isActive: 0 \| 1 }` | `AdminPermissionResponse` |
| DELETE | `/permissions/admin/permissions/{id}` | RBAC 권한 삭제 | — | `void` (204) |

---

## 6. UI / 스타일링 전략

### 6.1 컴포넌트 라이브러리 및 UI 전략

- **Ant Design 6.3.3**: 인터랙션 중심 UI (테이블, 폼, 모달, 알림, 메뉴, Dropdown, Popover 등)
- **@ant-design/icons 6.1.0**: 아이콘 (UserOutlined, LockOutlined, MenuFoldOutlined, BellOutlined 등)
- **Recharts 3.8.0**: 차트 컴포넌트 (AreaChart — 월별 트렌드)

**UI 컴포넌트 선택 기준:**

| 영역 | 접근 방식 | 이유 |
|------|-----------|------|
| 대시보드 카드/지표 | 커스텀 div + CSS Modules | 디자인 자유도 (아이콘 배치, 색상 틴팅, 카드 구조), 번들 최적화 |
| 차트 툴팁 | 커스텀 ReactNode | Recharts 기본 툴팁 스타일 제한, 커스텀 디자인 필요 |
| 테이블 | Ant Design Table | 정렬, 고정 컨럼, 스크롤, 페이지네이션 등 복잡 인터랙션 |
| 폼/모달/알림 | Ant Design 컴포넌트 | CRUD 화면 생산성 |
| 상태 배지 | 커스텀 span + CSS | 경량화, Ant Design Tag 대체 |

> **원칙**: "표현 중심" 컴포넌트(대시보드 카드, 차트) → 커스텀, "인터랙션 중심" 컴포넌트(테이블, 폼) → Ant Design

### 6.2 스타일링 방식

| 방식 | 파일 패턴 | 용도 |
|------|----------|------|
| **CSS Custom Properties** | `global.css :root` | 디자인 토큰 (색상, 크기, 전환) |
| **CSS Modules** | `*.module.css` | 컴포넌트 스코프 스타일 (충돌 방지) |
| **글로벌 CSS** | `global.css` | CSS 리셋, 기본 레이아웃, 접근성 |
| **Ant Design 오버라이드** | `antd-overrides.module.css` | 라이브러리 스타일 커스터마이징 |
| **data-* 속성** | `data-collapsed`, `data-scrolled` 등 | 상태 기반 조건부 스타일링 |

**CSS Modules 사용 패턴:**

```tsx
import styles from './login-form.module.css';

<Form className={styles.formContainer}>
  ...
</Form>
```

**data-* 속성 기반 상태 스타일링:**

```css
/* 사이드바 접기/펼치기 */
.sidebar[data-collapsed='true'] { width: var(--sidebar-collapsed-width); }

/* 헤더 스크롤 그림자 */
.header[data-scrolled='true'] { box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08); }
```

### 6.3 반응형 디자인

- **브레이크포인트**: `960px` (2열→1열 레이아웃), `768px` (모바일 분기), `576px` (소형 모바일), `400px` (싱글 컬럼)
- **접근 방식**: 데스크톱 우선, `@media (max-width)`으로 모바일 조정
- 로그인 페이지에 `100dvh` 사용으로 모바일 뷰포트 대응
- 모바일 사이드바: 오버레이 + 슬라이드 방식, 라우트 변경 시 자동 닫힘
- 모바일 헤더: 테넌트 뱃지 숨김, 프로필 이름 숨김
- 대시보드: 차트 높이 동적 조절 (360/300/240px), 테이블 모바일 핵심 6개 컬럼만 표시

### 6.4 디자인 토큰 (CSS Custom Properties)

모든 디자인 토큰은 `:root`에 CSS Custom Properties로 정의되어 있으며, 컴포넌트에서 `var()` 함수로 참조합니다:

**전역 색상 토큰:**

| 변수명 | 값 | 용도 |
|--------|-----|------|
| `--color-primary` | `#233d7b` | 메인 브랜드 컬러 |
| `--color-primary-dark` | `#1d3266` | 버튼 활성 상태 |
| `--color-primary-light` | `#2a5298` | 버튼 호버 상태 |
| `--color-accent` | `#3b82f6` | 강조 컬러 (로고, 아바타, focus-visible) |
| `--color-bg` | `#f5f5f5` | 페이지 배경 |
| `--color-bg-sidebar` | `#001529` | 사이드바 배경 (다크 테마) |
| `--color-bg-header` | `#ffffff` | 헤더 배경 |
| `--color-text` | `#1a1a1a` | 기본 텍스트 |
| `--color-text-secondary` | `#6b7280` | 보조 텍스트 |
| `--color-border` | `#e5e7eb` | 테두리 |

**사이드바 전용 토큰:**

| 변수명 | 값 | 용도 |
|--------|-----|------|
| `--sidebar-text` | `rgba(255,255,255,0.85)` | 사이드바 텍스트 |
| `--sidebar-text-muted` | `rgba(255,255,255,0.45)` | 사이드바 보조 텍스트 |
| `--sidebar-text-dim` | `rgba(255,255,255,0.55)` | 로그아웃 버튼 텍스트 |
| `--sidebar-text-hover` | `rgba(255,255,255,0.75)` | 호버 텍스트 |
| `--sidebar-hover-bg` | `rgba(255,255,255,0.08)` | 호버 배경 |
| `--sidebar-subtle-bg` | `rgba(255,255,255,0.06)` | 접기 버튼 배경 |
| `--sidebar-border` | `rgba(255,255,255,0.08)` | 구분선 |
| `--sidebar-scrollbar` | `rgba(255,255,255,0.15)` | 스크롤바 |

**레이아웃 토큰:**

| 변수명 | 값 | 용도 |
|--------|-----|------|
| `--font-family` | `'Pretendard', 'Noto Sans KR', Arial, sans-serif` | 기본 폰트 |
| `--sidebar-width` | `240px` | 사이드바 펼침 너비 |
| `--sidebar-collapsed-width` | `64px` | 사이드바 접힘 너비 |
| `--header-height` | `56px` | 헤더 높이 |
| `--transition-base` | `0.2s ease` | 기본 전환 애니메이션 |

---

## 7. 빌드 및 개발 환경

### 7.1 Vite 설정

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@widgets': fileURLToPath(new URL('./src/widgets', import.meta.url)),
    },
  },
  server: {
    port: 3000,     // 개발 서버 포트
    open: true,     // 브라우저 자동 열기
  },
  build: {
    outDir: 'dist',                // 빌드 출력 디렉토리
    chunkSizeWarningLimit: 1000,   // 청크 크기 경고 한도 (1000KB)
  },
});
```

- **Path Alias**: 5개 레이어에 대한 alias가 설정되어 깊은 상대 경로 대신 `@shared/api/axios` 같은 표현 사용
- **코드 스플리팅**: React.lazy + Suspense로 라우트별 동적 import 적용, 빌드 시 페이지별 독립 청크 생성

### 7.2 TypeScript 설정

**Path Alias 설정:**

```json
// tsconfig.json (paths 설정)
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@app/*": ["src/app/*"],
      "@shared/*": ["src/shared/*"],
      "@features/*": ["src/features/*"],
      "@pages/*": ["src/pages/*"],
      "@widgets/*": ["src/widgets/*"]
    }
  }
}
```

> `tsconfig.json`의 `paths`와 `vite.config.ts`의 `resolve.alias`는 동일한 매핑을 유지해야 합니다.

**주요 컴파일러 옵션:**

| 옵션 | 값 | 설명 |
|------|-----|------|
| `target` | ESNext | 최신 ECMAScript 타깃 |
| `strict` | true | 엄격 모드 전체 활성화 |
| `module` | ESNext | ESM 모듈 시스템 |
| `moduleResolution` | bundler | Vite 번들러 호환 모듈 해석 |
| `jsx` | react-jsx | React 17+ JSX Transform |
| `verbatimModuleSyntax` | true | import type 구문 강제 |
| `noUnusedLocals` | true | 미사용 지역 변수 에러 |
| `noUnusedParameters` | true | 미사용 파라미터 에러 |
| `isolatedModules` | true | 단일 파일 컴파일 보장 |
| `noFallthroughCasesInSwitch` | true | switch 문 fall-through 방지 |

### 7.3 코드 품질 도구

| 도구 | 버전 | 역할 |
|------|------|------|
| ESLint | 10.0.3 | 코드 린팅 (TypeScript ESLint 플러그인) |
| Prettier | 3.8.1 | 코드 포매팅 |
| eslint-config-prettier | 10.1.8 | ESLint-Prettier 충돌 방지 |

### 7.4 테스트 환경

| 도구 | 버전 | 역할 |
|------|------|------|
| Vitest | 4.1.0 | 테스트 러너 (Vite 네이티브) |
| @testing-library/react | 16.3.2 | React 컴포넌트 테스트 유틸 |
| @testing-library/jest-dom | 6.9.1 | DOM 매처 확장 |
| @testing-library/user-event | 14.6.1 | 사용자 이벤트 시뮬레이션 |
| jsdom | 29.0.0 | 브라우저 환경 시뮬레이션 |
| MSW | 2.12.11 | API 모킹 (Service Worker) |

---

## 8. 배포

**플랫폼:** Vercel

**SPA 라우팅 설정 (`vercel.json`):**

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

- 정적 파일(`*.ext`), API, 에셋 등을 제외한 모든 경로를 `index.html`로 리라이트
- React Router의 클라이언트 사이드 라우팅과 호환

**빌드 명령어:** `tsc -b && vite build` → `dist/` 디렉토리에 출력

---

## 9. 파일 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | kebab-case | `login-form.tsx`, `dashboard-page.tsx` |
| CSS Modules | kebab-case + `.module.css` | `login-form.module.css` |
| API 파일 | kebab-case + `.api.ts` | `login.api.ts`, `refresh-token.api.ts` |
| 엔드포인트 상수 | `endpoints.ts` | `endpoints.ts` (각 feature slice당 1개) |
| 타입 파일 | kebab-case + `.type.ts` | `auth.type.ts`, `error-response.type.ts` |
| 스토어 파일 | kebab-case + `.store.ts` | `auth.store.ts` |
| 서비스 파일 | kebab-case + `.service.ts` | `auth.service.ts` |
| 스키마 파일 | kebab-case + `.schema.ts` | `login.schema.ts` |
| 커스텀 훅 | `use-` prefix + kebab-case | `use-login.ts`, `use-refresh-token.ts` |
| 유틸리티 | kebab-case | `api-error-message.ts` |
| 컴포넌트 export | PascalCase (default) | `export default function LoginForm()` |
| 훅 export | camelCase (named) | `export function useLogin()` |

---

## 10. 새 기능 추가 가이드

새로운 도메인 기능(예: `user` 관리)을 추가할 때의 단계별 가이드입니다.

### Step 1: Feature Slice 생성

```
src/features/user/
├─ index.ts              # Public API
├─ api/
│  ├─ user.endpoint.ts   # API 엔드포인트 경로 상수
│  ├─ get-users.api.ts   # GET /users
│  ├─ get-user.api.ts    # GET /users/{id}
│  ├─ create-user.api.ts # POST /users
│  └─ ...                # 기능별 api 파일
├─ model/
│  ├─ use-users.ts       # React Query useQuery 훅 (목록 조회)
│  ├─ use-user.ts        # React Query useQuery 훅 (상세 조회)
│  ├─ use-create-user.ts # React Query useMutation 훅
│  ├─ create-user.schema.ts  # Zod 유효성 스키마
│  └─ ...                # 기능별 훅/스키마 파일
├─ types/
│  └─ user.type.ts       # 타입 정의
└─ ui/                   # 컴포넌트별 폴더 분리
   ├─ user-table/
   │  ├─ user-table.tsx
   │  └─ user-table.module.css
   └─ user-edit-form/
      ├─ user-edit-form.tsx
      └─ user-edit-form.module.css
```

### Step 2: API 함수 작성

```typescript
// src/features/user/api/user.endpoint.ts
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

```typescript
// src/features/user/api/get-users.api.ts
import { axiosInstance } from '@shared/api/axios';
import { USER_ENDPOINTS } from './user.endpoint';
import type { GetUsersRequest, GetUsersResponse } from '../types/user.type';

export async function getUsersApi(params?: GetUsersRequest): Promise<GetUsersResponse> {
  const response = await axiosInstance.get<GetUsersResponse>(USER_ENDPOINTS.LIST, { params });
  return response.data;
}
```

### Step 3: React Query 훅 작성

```typescript
// src/features/user/model/use-users.ts — useQuery 패턴 (조회)
import { useQuery } from '@tanstack/react-query';
import { getUsersApi } from '../api/get-users.api';
import type { GetUsersRequest, GetUsersResponse } from '../types/user.type';

export function useUsers(params?: GetUsersRequest) {
  return useQuery<GetUsersResponse>({
    queryKey: ['users', params],
    queryFn: () => getUsersApi(params),
  });
}

// src/features/user/model/use-create-user.ts — useMutation 패턴 (변경)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUserApi } from '../api/create-user.api';

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

### Step 4: Public API 내보내기

```typescript
// src/features/user/index.ts
export { default as UserTable } from './ui/user-table/user-table.tsx';
export { default as UserCreateForm } from './ui/user-create-form/user-create-form.tsx';
export { default as UserEditForm } from './ui/user-edit-form/user-edit-form.tsx';
export { default as UserPasswordForm } from './ui/user-password-form/user-password-form.tsx';

export { useUsers } from './model/use-users';
export { useUser } from './model/use-user';
export { useCreateUser } from './model/use-create-user';
// ... 기타 훅, 스키마

export * from './types/user.type';
```

### Step 5: 페이지에서 사용

```typescript
// src/pages/user/user-page.tsx
import { UserTable, UserCreateForm, UserEditForm, useUsers } from '@features/user';
import { useRoles } from '@features/role';  // 크로스 feature 참조는 pages 레이어에서만

export default function UserPage() {
  const { data } = useUsers(params);
  const { data: rolesData } = useRoles();
  // ...
}
```

### Step 6: 라우트 등록

```tsx
// src/app/App.tsx — React.lazy로 동적 import 후 MainLayout 내부 Route에 추가
const UserPage = lazy(() => import('@pages/user/user-page'));

<Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/mypage" element={<MypagePage />} />
  <Route path="/users" element={<UserPage />} />
</Route>
```

> Layout Route 패턴을 사용하므로 `ProtectedRoute`와 `MainLayout`으로 감싸진 부모 Route 안에 자식 Route를 추가합니다. 모든 페이지는 `React.lazy()`로 동적 import하여 코드 스플리팅을 적용합니다.

---

## 11. 구현된 Feature Slice 상세

### 11.1 사용자 관리 Feature (`features/user/`)

사용자 CRUD, 상태 변경, 비밀번호 초기화, 강제 로그아웃, 역할 배정 기능을 담당합니다.

**Feature Slice 구조:**

```
features/user/
├─ index.ts                          # Public API
├─ api/
│  ├─ user.endpoint.ts               # USER_ENDPOINTS 상수
│  ├─ get-users.api.ts               # GET /users (페이지네이션, 검색, 필터, 정렬)
│  ├─ get-user.api.ts                # GET /users/{id} (상세 조회 + 역할 정보)
│  ├─ create-user.api.ts             # POST /users
│  ├─ update-user.api.ts             # PATCH /users/{id}
│  ├─ update-user-status.api.ts      # PATCH /users/{id}/status
│  ├─ reset-user-password.api.ts     # PATCH /users/{id}/password
│  ├─ invalidate-user-tokens.api.ts  # POST /users/{id}/invalidate-tokens
│  └─ update-user-roles.api.ts       # PATCH /users/{id}/roles
├─ model/
│  ├─ use-users.ts                   # useQuery — 목록 조회 (queryKey: ['users', params])
│  ├─ use-user.ts                    # useQuery — 상세 조회 (queryKey: ['users', id])
│  ├─ use-create-user.ts             # useMutation + invalidateQueries(['users'])
│  ├─ use-update-user.ts             # useMutation + invalidateQueries(['users'])
│  ├─ use-update-user-status.ts      # useMutation + invalidateQueries(['users'])
│  ├─ use-reset-user-password.ts     # useMutation
│  ├─ use-invalidate-user-tokens.ts  # useMutation
│  ├─ use-update-user-roles.ts       # useMutation + invalidateQueries(['users'])
│  ├─ create-user.schema.ts          # Zod 스키마 (userId, password, userName, corpName 등)
│  ├─ update-user.schema.ts          # Zod 스키마 (userName, corpName 등 optional)
│  └─ reset-user-password.schema.ts  # Zod 스키마 (newPassword 8자+)
├─ types/
│  └─ user.type.ts                   # User, GetUsersRequest/Response, CreateUserRequest 등
└─ ui/
   ├─ user-table/                    # 사용자 목록 테이블
   │  ├─ user-table.tsx              # AntD Table + 정렬 + 페이지네이션 + Dropdown 액션 메뉴
   │  └─ user-table.module.css       #   ├─ 액션: 정보 수정, 상태 변경, 비밀번호 초기화, 강제 로그아웃
   ├─ user-detail/                   # 사용자 상세 보기
   │  └─ user-detail.tsx             # Descriptions (bordered, 2열) — 기본정보 + 역할 목록
   ├─ user-create-form/              # 사용자 생성 폼
   │  ├─ user-create-form.tsx        # RHF + Zod + Controller 패턴 (7필드)
   │  └─ user-create-form.module.css
   ├─ user-edit-form/                # 사용자 수정 폼
   │  ├─ user-edit-form.tsx          # 3섹션 구조 (기본정보 / 연락처 / 역할 설정)
   │  └─ user-edit-form.module.css   #   역할: Select mode="multiple" + role 데이터 연동
   └─ user-password-form/            # 비밀번호 초기화 폼
      ├─ user-password-form.tsx
      └─ user-password-form.module.css
```

**사용자 관리 페이지 (`pages/user/user-page.tsx`):**
- 페이지 헤더: 제목 + 총 사용자 수 Badge + 검색/필터 툴바 + 생성 버튼
- 테이블: 아이디, 이름, 회사명, 이메일, 상태(Tooltip으로 정지일 표시), 등록일, Dropdown 액션 메뉴
- 모달: 사용자 생성, 사용자 수정(역할 포함), 비밀번호 초기화, **상세 보기(Descriptions)**
- 확인 다이얼로그: 상태 변경(활성↔정지), 강제 로그아웃

**주요 타입:**

```typescript
interface User {
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

interface GetUsersResponse {
  items: User[];
  pageInfo: { currentPage: number; pageSize: number; totalItems: number; totalPages: number };
}

interface GetUserResponse extends User {
  assignedRoleIds: number[];
  availableRoles: Role[];  // from @features/role
}
```

### 11.2 역할 관리 Feature (`features/role/`)

역할(Role) 도메인을 독립 슬라이스로 분리하여, 사용자 관리와 향후 권한 관리에서 공통 사용합니다.

**Feature Slice 구조:**

```
features/role/
├─ index.ts                  # Public API (useRoles, getRolesApi, 타입)
├─ api/
│  ├─ role.endpoint.ts       # ROLE_ENDPOINTS = { LIST: '/roles' }
│  └─ get-roles.api.ts       # GET /roles (페이지네이션, 검색, 필터)
├─ model/
│  └─ use-roles.ts           # useQuery — 역할 목록 조회 (queryKey: ['roles', params])
└─ types/
   └─ role.type.ts           # Role, GetRolesRequest, GetRolesResponse
```

**주요 타입:**

```typescript
interface Role {
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

interface GetRolesResponse {
  items: Role[];
  pageInfo: { currentPage: number; pageSize: number; totalItems: number; totalPages: number };
}
```

> **설계 의도**: Role은 사용자 수정 시 역할 배정에 사용되며, 향후 역할 CRUD/권한 관리 페이지 확장 시 이 슬라이스에 기능을 추가합니다. FSD 원칙에 따라 `features/user/`와 `features/role/`은 서로 직접 참조하지 않으며, `pages/` 레이어에서 조합합니다.

### 11.3 슈퍼 관리자 대시보드 Feature (`features/super-dashboard/`)

슈퍼 관리자 전용 대시보드로, 전체 시스템 현황(개요, 오늘, 월별 트렌드, 보안, 테넌트별 통계)을 시각화합니다.

**Feature Slice 구조:**

```
features/super-dashboard/
├─ index.ts                                    # Public API (UI 5개, useSuperDashboard, 타입)
├─ api/
│  ├─ super-dashboard.endpoint.ts              # SUPER_DASHBOARD_ENDPOINTS = { DASHBOARD: '/super/dashboard' }
│  └─ get-super-dashboard.api.ts               # GET /super/dashboard
├─ model/
│  └─ use-super-dashboard.ts                   # useQuery — 대시보드 데이터 조회 (queryKey: ['super-dashboard'])
├─ types/
│  └─ super-dashboard.type.ts                  # SuperDashboardResponse 및 하위 타입
└─ ui/                                         # 대시보드 UI 컴포넌트 (커스텀 div + CSS Modules)
   ├─ overview-cards/
   │  ├─ overview-cards.tsx                    # 전체 현황 8개 지표 카드 (테넌트, 사용자, 상담, 게시물 등)
   │  └─ overview-cards.module.css             #   4열 그리드, 아이콘 틴팅 배경, 반응형 2/1열 전환
   ├─ today-cards/
   │  ├─ today-cards.tsx                       # 오늘 현황 4개 항목 (신규 가입, 상담, 게시물, 세션)
   │  └─ today-cards.module.css                #   수직 리스트 레이아웃, 모바일 4→2→1열 그리드
   ├─ monthly-trends-chart/
   │  ├─ monthly-trends-chart.tsx              # Recharts AreaChart 기반 12개월 트렌드 (3개 시리즈)
   │  └─ monthly-trends-chart.module.css       #   커스텀 툴팁, 커스텀 범례, 반응형 높이 (360/300/240px)
   ├─ security-cards/
   │  ├─ security-cards.tsx                    # 보안 현황 (누적 3개 + 최근 감지 2개 분리 레이아웃)
   │  └─ security-cards.module.css             #   3열 그리드(누적) + 2열 그리드(최근), 경고 색상
   └─ tenant-stats-table/
      ├─ tenant-stats-table.tsx                # 테넌트별 14개 컬럼 상세 통계 (Ant Design Table)
      └─ tenant-stats-table.module.css         #   커스텀 상태 뱃지, 숫자 하이라이트/경고, 모바일 6개 핵심 컬럼
```

**주요 타입:**

```typescript
// GET /super/dashboard 응답
interface SuperDashboardResponse {
  overview: SuperDashboardOverview;      // 전체 현황 8개 지표
  today: SuperDashboardToday;            // 오늘 현황 4개 지표
  monthlyTrends: SuperDashboardMonthlyTrends;  // 12개월 트렌드 3개 시리즈
  security: SuperDashboardSecurity;      // 보안 현황 (차단 IP/HP/금지어, 최근 감지)
  tenantStats: TenantStat[];             // 테넌트별 15개 필드 상세 통계
}

interface SuperDashboardOverview {
  totalTenants: number;    activeTenants: number;
  totalUsers: number;      activeUsers: number;
  totalCounsels: number;   totalPosts: number;
  totalRoles: number;      totalPermissions: number;
}

interface SuperDashboardToday {
  newUsers: number;        newCounsels: number;
  newPosts: number;        activeSessions: number;
}

interface SuperDashboardMonthlyTrends {
  userRegistrations: MonthlyTrendItem[];
  counselRegistrations: MonthlyTrendItem[];
  tenantRegistrations: MonthlyTrendItem[];
}

interface SuperDashboardSecurity {
  totalBlockedIps: number;   totalBlockedHps: number;   totalBlockedWords: number;
  recentBlockedIps: number;  recentBlockedHps: number;
}

interface TenantStat {
  tenantId: number;          tenantName: string;         isActive: number;
  createdAt: string;         userCount: number;          activeUserCount: number;
  counselCount: number;      todayCounselCount: number;  postCount: number;
  roleCount: number;         websiteCount: number;       blockedIpCount: number;
  blockedHpCount: number;    blockedWordCount: number;   activeSessionCount: number;
}
```

**페이지 구성 (`pages/super-dashboard/super-dashboard-page.tsx`):**

```
┌──────────────────────────────────────────────────────────────┐
│  페이지 헤더 (타이틀 + 설명 | 새로고침 버튼 + 업데이트 시각)   │
├──────────────────────────────────────┬───────────────────────┤
│  전체 현황 [Overview]                │  오늘 현황 [Live 🟢]  │
│  OverviewCards (8개 지표, 4열 그리드) │  TodayCards (4개 리스트)│
│  1fr                                │  340px                 │
├──────────────────────────────────────┴───────────────────────┤
│  MonthlyTrendsChart (AreaChart, 12개월, 3개 시리즈)           │
├──────────────────────────────────────────────────────────────┤
│  보안 현황 [Security]                                        │
│  SecurityCards (누적 3개 + 최근 감지 2개)                     │
├──────────────────────────────────────────────────────────────┤
│  테넌트별 상세 통계 [N개]                                     │
│  TenantStatsTable (14개 컬럼, 가로 스크롤)                    │
└──────────────────────────────────────────────────────────────┘
```

**UI/UX 설계 원칙:**
- **커스텀 카드**: Ant Design Card/Statistic 대신 커스텀 div + CSS Modules 사용 (디자인 자유도, 번들 최적화)
- **Ant Design Table 유지**: 테넌트 상세 통계는 정렬/고정 컬럼/스크롤 등 인터랙션이 필요하므로 AntD Table 사용
- **커스텀 차트 툴팁**: Recharts 기본 툴팁 대신 CSS Modules 기반 커스텀 디자인
- **섹션 헤더 배지**: Overview, Live (펄스 애니메이션), Security, 테넌트 수
- **반응형**: 960px에서 2열→1열 전환, 768px 모바일 최적화, 400px 싱글 컬럼

> **설계 의도**: 슈퍼 관리자 대시보드는 읽기 전용 데이터 시각화 페이지로, "표현 중심" 컴포넌트(카드, 차트)는 커스텀으로, "인터랙션 중심" 컴포넌트(테이블)는 Ant Design으로 구현하여 디자인 자유도와 개발 효율성을 균형있게 유지합니다.

### 11.4 테넌트 관리 Feature (`features/tenant/`)

테넌트 CRUD, 상태 변경(활성/비활성), 삭제 기능을 담당합니다. 사용자 관리(`features/user/`)와 동일한 패턴으로 구현되어 코드 일관성을 유지합니다.

**Feature Slice 구조:**

```
features/tenant/
├─ index.ts                              # Public API
├─ api/
│  ├─ tenant.endpoint.ts                 # TENANT_ENDPOINTS 상수
│  ├─ get-tenants.api.ts                 # GET /tenants (페이지네이션, 검색, 필터, 정렬)
│  ├─ get-tenant.api.ts                  # GET /tenants/{id} (상세 조회)
│  ├─ create-tenant.api.ts               # POST /tenants
│  ├─ update-tenant.api.ts               # PATCH /tenants/{id}
│  ├─ delete-tenant.api.ts               # DELETE /tenants/{id}
│  └─ update-tenant-status.api.ts        # PATCH /tenants/{id}/status
├─ model/
│  ├─ use-tenants.ts                     # useQuery — 목록 조회 (queryKey: ['tenants', params])
│  ├─ use-tenant.ts                      # useQuery — 상세 조회 (queryKey: ['tenants', id])
│  ├─ use-create-tenant.ts               # useMutation + invalidateQueries(['tenants'])
│  ├─ use-update-tenant.ts               # useMutation + invalidateQueries(['tenants'])
│  ├─ use-delete-tenant.ts               # useMutation + invalidateQueries(['tenants'])
│  ├─ use-update-tenant-status.ts        # useMutation + invalidateQueries(['tenants'])
│  ├─ create-tenant.schema.ts            # Zod 스키마 (tenantName, displayName, domain)
│  └─ update-tenant.schema.ts            # Zod 스키마 (tenantName, displayName, domain)
├─ types/
│  └─ tenant.type.ts                     # Tenant, GetTenantsRequest/Response, CreateTenantRequest 등
└─ ui/
   ├─ tenant-table/                      # 테넌트 목록 테이블
   │  ├─ tenant-table.tsx                # AntD Table + 정렬 + 페이지네이션 + Dropdown 액션 메뉴
   │  └─ tenant-table.module.css         #   ├─ 액션: 정보 수정, 상태 변경, 삭제
   ├─ tenant-detail/                     # 테넌트 상세 보기
   │  └─ tenant-detail.tsx               # Descriptions (bordered, 2열) — 기본정보, 도메인, 상태, 일시
   ├─ tenant-create-form/                # 테넌트 생성 폼
   │  ├─ tenant-create-form.tsx          # RHF + Zod + Controller 패턴 (3필드)
   │  └─ tenant-create-form.module.css
   └─ tenant-edit-form/                  # 테넌트 수정 폼
      ├─ tenant-edit-form.tsx            # 2섹션 구조 (기본 정보 / 도메인)
      └─ tenant-edit-form.module.css
```

**테넌트 관리 페이지 (`pages/tenant/tenant-page.tsx`):**
- 페이지 헤더: 제목 + 총 테넌트 수 Badge + 검색/필터 툴바 + 생성 버튼
- 테이블: 테넌트 ID, 테넌트명, 표시 이름, 도메인, 사용자 수, 상태(활성/비활성), 생성일, 수정일, Dropdown 액션 메뉴
- 모달: 테넌트 생성, 테넌트 수정(기본정보/도메인 섹션 분리), **상세 보기(Descriptions)**
- 확인 다이얼로그: 상태 변경(활성↔비활성), 삭제(사용자 존재 시 차단 안내)

**주요 타입:**

```typescript
interface Tenant {
  tenantId: number;
  tenantName: string;
  displayName: string;
  domain: string;
  isActive: number;
  createdAt: string;
  updatedAt: string;
  userCount: number;
}

interface GetTenantsRequest {
  page?: number;
  limit?: number;
  q?: string;                    // tenantName, displayName, domain 검색
  isActive?: 0 | 1;
  sort?: string;                 // tenantId, tenantName, displayName, createdAt, updatedAt
  order?: 'ASC' | 'DESC';
}

interface GetTenantsResponse {
  items: Tenant[];
  pageInfo: { page: number; limit: number; totalItems: number; totalPages: number };
}

// 상세 조회 응답 (userCount 제외)
type GetTenantResponse = Omit<Tenant, 'userCount'>;

interface CreateTenantRequest {
  tenantName: string;
  displayName: string;
  domain: string;
  isActive?: number;
}

interface UpdateTenantRequest {
  tenantName?: string;
  displayName?: string;
  domain?: string;
  isActive?: number;
}

interface UpdateTenantStatusRequest {
  isActive: 0 | 1;
}
```

**사용자 관리와의 패턴 차이점:**

| 항목 | 사용자 관리 (`/users`) | 테넌트 관리 (`/tenants`) |
|------|----------------------|------------------------|
| 페이지네이션 필드명 | `currentPage` / `pageSize` | `page` / `limit` |
| 정렬 파라미터 | `sortField` / `sortOrder` (`asc`/`desc`) | `sort` / `order` (`ASC`/`DESC`) |
| 삭제 기능 | 없음 (비활성화로 대체) | 있음 (사용자 미존재 시에만 가능) |
| 역할 연동 | 수정 시 역할 다중 선택 (`@features/role`) | 없음 |
| rowKey | `userSeq` | `tenantId` |

> **설계 의도**: 테넌트 관리는 사용자 관리와 동일한 FSD 패턴(types → api → model → ui → index.ts → page)을 따르면서도, API 스펙의 차이(페이지네이션 필드명, 정렬 파라미터 대소문자, DELETE 엔드포인트)를 정확히 반영합니다. 삭제 기능은 서버 측에서 사용자가 존재하는 테넌트의 삭제를 거부(400)하므로, UI에서 확인 다이얼로그에 이 제약을 안내합니다.

### 11.5 페이지 관리 Feature (`features/admin-page/`)

RBAC 권한 시스템의 **페이지**(관리 대상 화면)에 대한 CRUD, 상태 변경, 삭제, 계층 구조(부모-자식) 관리를 담당합니다.

**Feature Slice 구조:**

```
features/admin-page/
├─ index.ts                                  # Public API
├─ api/
│  ├─ admin-page.endpoint.ts                 # ADMIN_PAGE_ENDPOINTS 상수
│  ├─ get-admin-pages.api.ts                 # GET /permissions/admin/pages
│  ├─ get-admin-page.api.ts                  # GET /permissions/admin/pages/{id}
│  ├─ create-admin-page.api.ts               # POST /permissions/admin/pages
│  ├─ update-admin-page.api.ts               # PATCH /permissions/admin/pages/{id}
│  ├─ update-admin-page-status.api.ts        # PATCH /permissions/admin/pages/{id}/status
│  └─ delete-admin-page.api.ts               # DELETE /permissions/admin/pages/{id}
├─ model/
│  ├─ use-admin-pages.ts                     # useQuery — 목록 조회 (queryKey: ['admin-pages', params], enabled 옵션 지원)
│  ├─ use-admin-page.ts                      # useQuery — 상세 조회 (queryKey: ['admin-pages', id])
│  ├─ use-create-admin-page.ts               # useMutation + invalidateQueries(['admin-pages'])
│  ├─ use-update-admin-page.ts               # useMutation + invalidateQueries(['admin-pages'])
│  ├─ use-update-admin-page-status.ts        # useMutation + invalidateQueries(['admin-pages'])
│  ├─ use-delete-admin-page.ts               # useMutation + invalidateQueries(['admin-pages'])
│  ├─ create-admin-page.schema.ts            # Zod 스키마 (pageName, path, displayName, description, parentId, sortOrder)
│  └─ update-admin-page.schema.ts            # Zod 스키마 (동일 필드)
├─ types/
│  └─ admin-page.type.ts                     # AdminPageListItem, AdminPageResponse, Get/Create/Update Request/Response
└─ ui/
   ├─ admin-page-table/                      # 페이지 목록 테이블
   │  ├─ admin-page-table.tsx                # 이름(root/child 스타일), 경로(code), 표시이름, 상위페이지(Tag), 상태, 정렬, 하위수, 권한수, Dropdown(상세/수정/상태/삭제)
   │  └─ admin-page-table.module.css
   ├─ admin-page-detail/                     # 상세 보기
   │  └─ admin-page-detail.tsx               # Descriptions (bordered, 2열) + 하위 페이지 Table
   ├─ admin-page-create-form/                # 생성 폼
   │  ├─ admin-page-create-form.tsx          # parentPages prop으로 상위 페이지 Select 옵션 전달
   │  └─ admin-page-create-form.module.css
   └─ admin-page-edit-form/                  # 수정 폼
      ├─ admin-page-edit-form.tsx            # 2섹션: 기본 정보 / 계층 구조, parentId 자기참조 필터링
      └─ admin-page-edit-form.module.css
```

**페이지 관리 페이지 (`pages/admin-page-manage/admin-page-manage-page.tsx`):**
- 라우트: `/permissions/admin/pages`
- 필터: 검색(이름/경로/표시이름), 부모 필터(전체/최상위만), 상태 필터
- 모달: 생성, 수정(상세 조회 후 defaultValues 설정), 상세 보기(Descriptions + 하위 페이지)
- 확인 다이얼로그: 상태 변경, 삭제
- `useAdminPages`에 `enabled` 옵션을 사용하여 모달이 열릴 때만 상위 페이지 목록 조회 (API 이중 호출 방지)

### 11.6 액션 관리 Feature (`features/admin-action/`)

RBAC 권한 시스템의 **액션**(read, create, update, delete 등)에 대한 CRUD, 상태 변경, 삭제를 담당합니다.

**Feature Slice 구조:**

```
features/admin-action/
├─ index.ts
├─ api/
│  ├─ admin-action.endpoint.ts               # ADMIN_ACTION_ENDPOINTS 상수
│  ├─ get-admin-actions.api.ts               # GET /permissions/admin/actions
│  ├─ get-admin-action.api.ts                # GET /permissions/admin/actions/{id}
│  ├─ create-admin-action.api.ts             # POST /permissions/admin/actions
│  ├─ update-admin-action.api.ts             # PATCH /permissions/admin/actions/{id}
│  ├─ update-admin-action-status.api.ts      # PATCH /permissions/admin/actions/{id}/status
│  └─ delete-admin-action.api.ts             # DELETE /permissions/admin/actions/{id}
├─ model/
│  ├─ use-admin-actions.ts                   # useQuery (queryKey: ['admin-actions', params])
│  ├─ use-admin-action.ts                    # useQuery (queryKey: ['admin-actions', id])
│  ├─ use-create-admin-action.ts             # useMutation
│  ├─ use-update-admin-action.ts             # useMutation
│  ├─ use-update-admin-action-status.ts      # useMutation
│  ├─ use-delete-admin-action.ts             # useMutation
│  ├─ create-admin-action.schema.ts          # Zod (actionName required max 50, displayName optional)
│  └─ update-admin-action.schema.ts          # Zod (동일)
├─ types/
│  └─ admin-action.type.ts                   # AdminActionListItem, AdminActionResponse 등
└─ ui/
   ├─ admin-action-table/
   │  ├─ admin-action-table.tsx              # actionName(code), displayName, 상태, 권한수, Dropdown(상세/수정/상태/삭제)
   │  └─ admin-action-table.module.css
   ├─ admin-action-detail/                   # 상세 보기
   │  └─ admin-action-detail.tsx             # Descriptions (bordered, 2열) — ID, 상태, actionName(code), displayName, 날짜
   ├─ admin-action-create-form/
   │  ├─ admin-action-create-form.tsx
   │  └─ admin-action-create-form.module.css
   └─ admin-action-edit-form/
      ├─ admin-action-edit-form.tsx           # 2섹션: 기본 정보 / 표시 정보
      └─ admin-action-edit-form.module.css
```

**액션 관리 페이지 (`pages/admin-action-manage/admin-action-manage-page.tsx`):**
- 라우트: `/permissions/admin/actions`
- 필터: 검색(이름/표시이름), 상태 필터
- 모달: 생성, 수정, 상세 보기(Descriptions)

### 11.7 권한 관리 Feature (`features/admin-permission/`)

RBAC 권한 시스템의 **권한**(페이지+액션 조합)에 대한 CRUD, 상태 변경, 삭제를 담당합니다. **크로스 피처 합성** 패턴을 사용하여 페이지 관리(`admin-page`)와 액션 관리(`admin-action`) feature의 데이터를 pages 레이어에서 조합합니다.

**Feature Slice 구조:**

```
features/admin-permission/
├─ index.ts
├─ api/
│  ├─ admin-permission.endpoint.ts           # ADMIN_PERMISSION_ENDPOINTS 상수
│  ├─ get-admin-permissions.api.ts           # GET /permissions/admin/permissions
│  ├─ get-admin-permission.api.ts            # GET /permissions/admin/permissions/{id}
│  ├─ create-admin-permission.api.ts         # POST /permissions/admin/permissions
│  ├─ update-admin-permission.api.ts         # PATCH /permissions/admin/permissions/{id}
│  ├─ update-admin-permission-status.api.ts  # PATCH /permissions/admin/permissions/{id}/status
│  └─ delete-admin-permission.api.ts         # DELETE /permissions/admin/permissions/{id}
├─ model/
│  ├─ use-admin-permissions.ts               # useQuery (queryKey: ['admin-permissions', params])
│  ├─ use-admin-permission.ts                # useQuery (queryKey: ['admin-permissions', id])
│  ├─ use-create-admin-permission.ts         # useMutation
│  ├─ use-update-admin-permission.ts         # useMutation
│  ├─ use-update-admin-permission-status.ts  # useMutation
│  ├─ use-delete-admin-permission.ts         # useMutation
│  ├─ create-admin-permission.schema.ts      # Zod (pageId min(1), actionId min(1), displayName/description optional)
│  └─ update-admin-permission.schema.ts      # Zod (동일)
├─ types/
│  └─ admin-permission.type.ts               # AdminPermissionListItem (page/action 중첩 객체), Request/Response
└─ ui/
   ├─ admin-permission-table/
   │  ├─ admin-permission-table.tsx          # 표시이름, 설명, 페이지(Tag), 액션(Tag), 상태, Dropdown(상세/수정/상태/삭제)
   │  └─ admin-permission-table.module.css
   ├─ admin-permission-detail/               # 상세 보기
   │  └─ admin-permission-detail.tsx         # Descriptions (bordered, 2열) — 페이지/액션 Tag+code, displayName, description, 날짜
   ├─ admin-permission-create-form/
   │  ├─ admin-permission-create-form.tsx    # pages/actions props로 Select 옵션 전달
   │  └─ admin-permission-create-form.module.css
   └─ admin-permission-edit-form/
      ├─ admin-permission-edit-form.tsx       # 2섹션: 연결 정보(페이지/액션 Select) / 표시 정보
      └─ admin-permission-edit-form.module.css
```

**권한 관리 페이지 (`pages/admin-permission-manage/admin-permission-manage-page.tsx`):**
- 라우트: `/permissions/admin/permissions`
- **크로스 피처 합성**: `useAdminPages`(`@features/admin-page`) + `useAdminActions`(`@features/admin-action`)로 페이지/액션 목록을 가져와 필터 Select와 생성/수정 폼에 props로 전달
- 필터: 검색(표시이름/설명), 페이지 필터(Select), 액션 필터(Select), 상태 필터
- 모달: 생성, 수정, 상세 보기(페이지/액션 Tag+code)

**RBAC 3 Feature의 공통 패턴:**

| 항목 | 페이지 관리 | 액션 관리 | 권한 관리 |
|------|-----------|---------|---------|
| API 경로 | `/permissions/admin/pages` | `/permissions/admin/actions` | `/permissions/admin/permissions` |
| rowKey | `pageId` | `actionId` | `permissionId` |
| Query Key | `['admin-pages']` | `['admin-actions']` | `['admin-permissions']` |
| 페이지네이션 | `page`/`limit` + `ASC`/`DESC` | 동일 | 동일 |
| 계층 구조 | 있음 (parentId, children) | 없음 | 페이지+액션 조합 |
| 상세 보기 | Descriptions + 하위 페이지 Table | Descriptions | Descriptions (페이지/액션 Tag+code) |
| 크로스 피처 | 없음 | 없음 | admin-page + admin-action |

### 11.8 권한 카탈로그 Feature (`features/permission-catalog/`)

전체 페이지×액션 권한 매트릭스를 **트리 구조**로 시각화하는 읽기 전용 카탈로그 페이지입니다. `CatalogPage.parentId`를 활용하여 페이지를 계층적으로 표시하며, 접기/펼치기 및 검색 필터링을 지원합니다.

**Feature Slice 구조:**

```
features/permission-catalog/
├─ index.ts                                    # Public API (PermissionMatrix, usePermissionCatalog, 타입)
├─ api/
│  ├─ permission-catalog.endpoint.ts           # PERMISSION_CATALOG_ENDPOINTS = { CATALOG: '/permissions/catalog' }
│  └─ get-permission-catalog.api.ts            # GET /permissions/catalog
├─ model/
│  └─ use-permission-catalog.ts                # useQuery — 카탈로그 조회 (queryKey: ['permission-catalog'])
├─ types/
│  └─ permission-catalog.type.ts               # CatalogPage, CatalogAction, CatalogPermission, MatrixEntry, GetPermissionCatalogResponse
└─ ui/
   └─ permission-matrix/
      ├─ permission-matrix.tsx                 # 트리 구조 권한 매트릭스 (접기/펼치기, 검색, 요약 바)
      └─ permission-matrix.module.css          # 스티키 컬럼, 행 스트라이핑, 호버, 트리 들여쓰기
```

**주요 타입:**

```typescript
// 페이지 항목 (트리 구조 지원)
interface CatalogPage {
  pageId: number;
  parentId: number | null;   // 트리 구조 — null이면 루트 노드
  pageName: string;
  path: string;
  displayName: string;
  description: string | null;
  sortOrder: number | null;  // 같은 레벨 내 정렬 순서
}

// 액션 항목 (테이블 컬럼 헤더로 사용)
interface CatalogAction {
  actionId: number;
  actionName: string;       // read, create, update, delete 등
  displayName: string;
}

// 권한 항목 (툴팁 상세 정보용)
interface CatalogPermission {
  permissionId: number;
  pageId: number;
  actionId: number;
  displayName: string | null;
  description: string | null;
}

// 매트릭스 셀 데이터
interface MatrixEntry {
  actionName: string;
  permissionId: number;
}

// API 응답 — matrix는 pageName을 키로 한 Record
interface GetPermissionCatalogResponse {
  pages: CatalogPage[];
  actions: CatalogAction[];
  permissions: CatalogPermission[];
  matrix: Record<string, MatrixEntry[]>;
}
```

**PermissionMatrix 컴포넌트 핵심 기능:**

| 기능 | 구현 방식 |
|------|---------|
| **트리 구조** | `buildTree()` — `parentId` 기반 `TreeNode[]` 변환, `sortOrder` 정렬, 재귀적 depth 계산 |
| **접기/펼치기** | `expandedIds` Set 상태, 노드별 토글, 전체 펼치기/접기 버튼 |
| **검색 필터** | `filterTree()` — displayName, pageName, path 매칭 + 조상 경로 보존 |
| **요약 통계 바** | 페이지 수, 액션 수, 권한 수 + 검색 시 결과 수 |
| **스티키 컬럼** | 첫 번째 컬럼(페이지명) 고정 (min 300px ~ max 400px) |
| **트리 시각화** | depth별 들여쓰기 (20px/depth), `FolderOutlined`/`FileOutlined` 아이콘, `▶/▼` 토글 |
| **셀 상태** | 할당: 초록 배경 + `CheckCircleFilled`, 미할당: `—` 대시 |
| **툴팁** | 할당된 셀 hover 시 권한 ID, 이름, 설명 표시 |
| **행 스트라이핑** | 짝수 행 배경색 + 마우스 hover 하이라이트 |

**권한 카탈로그 페이지 (`pages/permission-catalog/permission-catalog-page.tsx`):**
- 라우트: `/permissions/catalog`
- 페이지 헤더: 제목 "권한 카탈로그" + 설명 + 검색 Input(SearchOutlined prefix, allowClear)
- `searchKeyword` 상태를 PermissionMatrix에 전달하여 실시간 필터링
- 읽기 전용 페이지로 CRUD 없음, 단일 API 호출(`GET /permissions/catalog`)

> **설계 의도**: 권한 카탈로그는 RBAC 관리(페이지/액션/권한) 3 feature와 별도의 읽기 전용 슬라이스로 분리합니다. 복잡한 매트릭스 데이터를 하나의 API에서 받아 프론트엔드에서 트리 변환/플래트닝/필터링을 수행하며, 관리자가 전체 권한 구조를 한눈에 파악할 수 있도록 합니다.
