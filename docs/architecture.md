# Flowdesk Admin Frontend — 아키텍처 문서

## 목차

- [1. 아키텍처 개요](#1-아키텍처-개요)
  - [1.1 Feature-Sliced Design (FSD)](#11-feature-sliced-design-fsd)
  - [1.2 레이어 의존성 규칙](#12-레이어-의존성-규칙)
- [2. 앱 초기화 흐름](#2-앱-초기화-흐름)
  - [2.1 엔트리포인트](#21-엔트리포인트)
  - [2.2 Provider 구조](#22-provider-구조)
  - [2.3 라우팅](#23-라우팅)
- [3. 인증 아키텍처](#3-인증-아키텍처)
  - [3.1 로그인 플로우](#31-로그인-플로우)
  - [3.2 토큰 관리](#32-토큰-관리)
  - [3.3 자동 토큰 갱신 (Silent Refresh)](#33-자동-토큰-갱신-silent-refresh)
  - [3.4 보호된 라우트 (Route Guard)](#34-보호된-라우트-route-guard)
  - [3.5 인증 관련 타입](#35-인증-관련-타입)
  - [3.6 인증 Feature Slice 구조](#36-인증-feature-slice-구조)
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

```tsx
<Routes>
  <Route path="/login"     element={<LoginPage />} />
  <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
  <Route path="/"          element={<Navigate to="/login" />} />
</Routes>
```

| 경로 | 컴포넌트 | 접근 제어 | 비고 |
|------|---------|----------|------|
| `/` | `Navigate` | 없음 | `/login`으로 리다이렉트 |
| `/login` | `LoginPage` | 공개 | 이미 로그인 시 `/dashboard`로 리다이렉트 |
| `/dashboard` | `DashboardPage` | `ProtectedRoute` | 토큰 없으면 `/login`으로 리다이렉트 |

---

## 3. 인증 아키텍처

### 3.1 로그인 플로우

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   사용자      │     │  LoginForm    │     │  useLogin()   │     │  서버 API     │
│  입력 폼      │────▶│  Zod 검증     │────▶│  mutate()     │────▶│ POST /auth/  │
│              │     │              │     │              │     │    login      │
└──────────────┘     └──────────────┘     └──────┬───────┘     └──────┬───────┘
                                                  │                     │
                                                  │    ◀── LoginResponse ──┘
                                                  │
                                          ┌───────▼───────┐
                                          │ authService.   │
                                          │ loginSuccess() │
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
                                                                       ▼
                                                              ┌────────────────┐
                                                              │ navigate(      │
                                                              │  '/dashboard') │
                                                              └────────────────┘
```

**상세 단계:**

1. 사용자가 **업체명(tenantName)**, **아이디(userId)**, **비밀번호(password)** 입력
2. `LoginForm`에서 **Zod 스키마** 검증 (`loginSchema`)
3. `useLogin()` 훅의 `mutate()` 호출 → `loginApi()` → `POST /auth/login`
4. 서버 응답(`LoginResponse`) 수신:
   - `accessToken`, `refreshToken`, `expiresIn`, `refreshExpiresAt`, `user` 정보 포함
5. `authService.loginSuccess()` 실행:
   - `authStorage.setTokens()` → localStorage에 토큰 저장
   - `useAuthStore.setAccessToken()` → Zustand에 토큰 동기화
   - `meApi()` 호출 → 사용자 프로필, 역할, 권한, 메뉴 트리 조회 → localStorage에 캐시
6. 성공 시 `/dashboard`로 네비게이션

### 3.2 토큰 관리

**저장소 분리:**

| 데이터 | 저장소 | 키 | 용도 |
|--------|--------|-----|------|
| Access Token | localStorage | `accessToken` | API 요청 인증 헤더 |
| Refresh Token | localStorage | `refreshToken` | Access Token 갱신 |
| Access Token | Zustand (`useAuthStore`) | `accessToken` | 컴포넌트 반응성 |
| 사용자 정보 | localStorage | `me` | 사용자 프로필/권한/메뉴 캐시 |

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
```

### 3.6 인증 Feature Slice 구조

```
features/auth/
├─ index.ts                    # Public API — 외부 노출 인터페이스
│   ├─ export LoginForm             (UI 컴포넌트)
│   ├─ export useLogin              (커스텀 훅)
│   ├─ export loginSchema           (Zod 스키마)
│   ├─ export loginApi              (API 함수)
│   ├─ export meApi                 (API 함수)
│   ├─ export refreshTokenApi       (API 함수)
│   ├─ export setupAuthAxiosInterceptor  (인터셉터 초기화)
│   ├─ export authStorage           (localStorage 래퍼)
│   └─ export 모든 타입              (타입 정의)
│
├─ api/
│   ├─ endpoints.ts            API 엔드포인트 경로 상수 (AUTH_ENDPOINTS)
│   ├─ login.api.ts            POST /auth/login
│   ├─ me.api.ts               GET /auth/me
│   └─ refresh-token.api.ts    POST /auth/refresh-token
│
├─ lib/
│   ├─ auth-storage.ts         localStorage 래퍼 (토큰 + 사용자 정보 CRUD, JSON.parse 안전 처리)
│   └─ setup-auth-interceptor.ts  Axios 인터셉터에 auth 의존성 주입 (DI 브릿지)
│
├─ model/
│   ├─ auth.store.ts           Zustand 스토어 (accessToken 상태)
│   ├─ auth.service.ts         비즈니스 로직 (로그인 성공 처리 오케스트레이션)
│   ├─ login.schema.ts         Zod 유효성 스키마 (tenantName, userId, password)
│   ├─ use-login.ts            useMutation 기반 로그인 훅 (AxiosError<ErrorResponse> 타입)
│   └─ use-refresh-token.ts    useMutation 기반 토큰 갱신 훅 (AxiosError<ErrorResponse> 타입)
│
├─ types/
│   └─ auth.type.ts            인증 관련 TypeScript 타입/인터페이스
│
└─ ui/
    ├─ login-form.tsx          로그인 폼 (React Hook Form reset/setFocus + Ant Design)
    └─ login-form.module.css   로그인 폼 스타일 (CSS Modules)
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
```

- **에러 타입**: `AxiosError<ErrorResponse>`로 래핑하여 `error.response?.data`에서 타입 안전하게 에러 상세 정보 접근
```

### 4.2 클라이언트 상태 — Zustand

- Provider 없이 글로벌 스토어 사용
- 인터셉터 등 React 외부에서도 `getState()`로 접근 가능

```typescript
// 스토어 정의
const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken }),
  clearAuth: () => set({ accessToken: null }),
}));

// 컴포넌트 내 사용
const token = useAuthStore((state) => state.accessToken);

// React 외부 사용 (인터셉터 등)
useAuthStore.getState().setAccessToken(newToken);
```

### 4.3 영속 상태 — localStorage

`authStorage` 유틸을 통해 추상화된 인터페이스로 접근합니다:

- **토큰**: `accessToken`, `refreshToken` 키로 문자열 저장
- **사용자 정보**: `me` 키로 JSON 직렬화하여 저장
- **안전 파싱**: `getMe()`는 `JSON.parse`를 `try-catch`로 감싸 손상된 데이터 자동 제거
- 인터셉터가 요청마다 `getAccessToken()`으로 토큰을 읽어 헤더에 첨부

### 4.4 폼 상태 — React Hook Form + Zod

```typescript
// Zod 스키마 정의
const loginSchema = z.object({
  tenantName: z.string().min(1, '업체명을 입력하세요'),
  userId: z.string().min(1, '아이디를 입력하세요'),
  password: z.string().min(1, '비밀번호를 입력하세요'),
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
  ME: '/auth/me',
  REFRESH_TOKEN: '/auth/refresh-token',
} as const;
```

- 상수 파일을 분리하여 API 경로 변경 시 한 곳만 수정
- `as const`로 리터럴 타입 보장

**API 엔드포인트 목록:**

| 메서드 | 경로 | 설명 | 요청 타입 | 응답 타입 |
|--------|------|------|----------|----------|
| POST | `/auth/login` | 로그인 | `LoginRequest` | `LoginResponse` |
| GET | `/auth/me` | 현재 사용자 정보 조회 | — | `MeResponse` |
| POST | `/auth/refresh-token` | 토큰 갱신 | `RefreshTokenRequest` | `RefreshTokenResponse` |

---

## 6. UI / 스타일링 전략

### 6.1 컴포넌트 라이브러리

- **Ant Design 6.3.3**: 주요 UI 컴포넌트 (Form, Input, Button, Card, Alert 등)
- **@ant-design/icons 6.1.0**: 아이콘 (UserOutlined, LockOutlined, ApartmentOutlined)
- **Recharts 3.8.0**: 차트 컴포넌트 (대시보드 확장용)

### 6.2 스타일링 방식

| 방식 | 파일 패턴 | 용도 |
|------|----------|------|
| **CSS Modules** | `*.module.css` | 컴포넌트 스코프 스타일 (충돌 방지) |
| **글로벌 CSS** | `global.css` | CSS 리셋, 기본 레이아웃 |
| **Ant Design 오버라이드** | `antd-overrides.module.css` | 라이브러리 스타일 커스터마이징 |

**CSS Modules 사용 패턴:**

```tsx
import styles from './login-form.module.css';

<Form className={styles.formContainer}>
  ...
</Form>
```

### 6.3 반응형 디자인

- **주요 브레이크포인트**: `600px` (모바일/데스크톱 분기)
- **접근 방식**: 데스크톱 우선, `@media (max-width: 600px)`으로 모바일 조정
- 로그인 페이지에 `100dvh` 사용으로 모바일 뷰포트 대응

### 6.4 디자인 토큰

| 토큰 | 값 | 용도 |
|------|-----|------|
| Primary Color | `#233d7b` | 메인 브랜드 컬러 (다크 블루) |
| Primary Gradient | `linear-gradient(90deg, #233d7b, #2a5298)` | 버튼 그라데이션 |
| Active Color | `#1d3266` | 버튼 활성 상태 |
| Background | `#ededed` | 페이지 배경 |
| Card Background | `#fff` | 카드 배경 |
| Input Background | `#f7f7f7` | 입력 필드 배경 |
| Border Color | `#e3e8f0` | 입력 필드 테두리 |
| Border Radius (Card) | `14px` / `10px` (모바일) | 카드 둥근 모서리 |
| Border Radius (Button) | `8px` / `6px` (모바일) | 버튼 둥근 모서리 |
| Font Family | `'Pretendard', 'Noto Sans KR', Arial, sans-serif` | 기본 폰트 |
| Card Top Border | `6px solid #233d7b` | 카드 상단 강조 |

---

## 7. 빌드 및 개발 환경

### 7.1 Vite 설정

```typescript
// vite.config.ts
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@widgets': path.resolve(__dirname, 'src/widgets'),
    },
  },
  server: {
    port: 3000,     // 개발 서버 포트
    open: true,     // 브라우저 자동 열기
  },
  build: {
    outDir: 'dist', // 빌드 출력 디렉토리
  },
});
```

- **Path Alias**: 5개 레이어에 대한 alias가 설정되어 깊은 상대 경로 대신 `@shared/api/axios` 같은 표현 사용

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
│  ├─ endpoints.ts       # API 엔드포인트 경로 상수
│  └─ user.api.ts        # API 호출 함수
├─ model/
│  ├─ user.store.ts      # (필요 시) Zustand 스토어
│  ├─ use-users.ts       # React Query 훅
│  └─ user.schema.ts     # (필요 시) Zod 스키마
├─ types/
│  └─ user.type.ts       # 타입 정의
├─ lib/
│  └─ user-utils.ts      # (필요 시) 유틸 함수
└─ ui/
   ├─ user-list.tsx      # UI 컴포넌트
   └─ user-list.module.css
```

### Step 2: API 함수 작성

```typescript
// src/features/user/api/endpoints.ts
export const USER_ENDPOINTS = {
  USERS: '/users',
  USER_DETAIL: (id: number) => `/users/${id}`,
} as const;
```

```typescript
// src/features/user/api/user.api.ts
import { axiosInstance } from '@shared/api/axios';
import { USER_ENDPOINTS } from './endpoints';
import type { User } from '../types/user.type';

export async function getUsersApi(): Promise<User[]> {
  const response = await axiosInstance.get<User[]>(USER_ENDPOINTS.USERS);
  return response.data;
}
```

### Step 3: React Query 훅 작성

```typescript
// src/features/user/model/use-users.ts
import { useQuery } from '@tanstack/react-query';
import { getUsersApi } from '../api/user.api';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsersApi,
  });
}
```

### Step 4: Public API 내보내기

```typescript
// src/features/user/index.ts
export { useUsers } from './model/use-users';
export * from './api/user.api';
export * from './types/user.type';
export { default as UserList } from './ui/user-list';
```

### Step 5: 페이지에서 사용

```typescript
// src/pages/user/user-page.tsx
import { UserList } from '@features/user';

export default function UserPage() {
  return <UserList />;
}
```

### Step 6: 라우트 등록

```tsx
// src/app/App.tsx — Routes에 추가
import UserPage from '@pages/user/user-page';

<Route path="/users" element={
  <ProtectedRoute><UserPage /></ProtectedRoute>
} />
```
