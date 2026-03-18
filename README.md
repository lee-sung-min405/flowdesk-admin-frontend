# Flowdesk Admin Frontend

## 목차

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
| **유효성 검증** | Zod | 4.3.6 |
| **HTTP 클라이언트** | Axios | 1.13.6 |
| **라우팅** | React Router DOM | 7.13.1 |
| **차트** | Recharts | 3.8.0 |
| **날짜** | Day.js | 1.11.20 |
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
│  └─ architecture.md            # 아키텍처 상세 문서
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
   │  │  └─ axios-interceptor.ts # 인터셉터 설정 인터페이스 (DI 패턴, FSD 준수)
   │  ├─ assets/
   │  │  └─ logo.png             # 애플리케이션 로고
   │  ├─ types/
   │  │  └─ error-response.type.ts  # 공통 API 에러 응답 타입
   │  └─ utils/
   │     └─ api-error-message.ts    # 에러 코드→한국어 메시지 매핑 유틸
   │
   ├─ widgets/                   # 레이아웃 공통 UI 블록
   │  ├─ sidebar/
   │  │  ├─ sidebar.tsx          # 사이드바 컴포넌트 (동적 메뉴, 접기/펼치기, 모바일 오버레이)
   │  │  ├─ sidebar.module.css   # 사이드바 스타일
   │  │  ├─ sidebar.type.ts      # SidebarProps 타입
   │  │  └─ lib/
   │  │     ├─ build-menu-items.ts  # MenuTree[] → AntD MenuItem[] 재귀 변환
   │  │     └─ menu-icon-map.tsx    # pageName → 아이콘 매핑 테이블
   │  ├─ header/
   │  │  ├─ header.tsx           # 헤더 컴포넌트 (토글, 브레드크럼, 알림, 프로필)
   │  │  ├─ header.module.css    # 헤더 스타일
   │  │  └─ header.type.ts       # HeaderProps 타입
   │  └─ breadcrumb/
   │     ├─ breadcrumb.tsx       # 브레드크럼 컴포넌트 (동적 pathNameMap 기반)
   │     └─ breadcrumb.module.css # 브레드크럼 스타일
   │
   ├─ features/                  # 도메인(기능)별 Feature Slice
   │  └─ auth/                   # 인증/권한 도메인
   │     ├─ index.ts             # Public API (외부 노출 인터페이스)
   │     ├─ api/                 # API 호출 함수
   │     │  ├─ endpoints.ts      # API 엔드포인트 상수 정의
   │     │  ├─ login.api.ts      # POST /auth/login
   │     │  ├─ logout.api.ts     # POST /auth/logout
   │     │  ├─ me.api.ts         # GET /auth/me
   │     │  └─ refresh-token.api.ts  # POST /auth/refresh-token
   │     ├─ lib/                 # 비즈니스 로직 헬퍼
   │     │  ├─ auth-storage.ts   # localStorage 토큰/사용자 정보 관리
   │     │  ├─ permission.ts     # 권한 체크 + 메뉴 필터링 + pathNameMap 빌드
   │     │  └─ setup-auth-interceptor.ts  # Axios 인터셉터에 auth 의존성 주입
   │     ├─ model/               # 상태 관리, 서비스, 커스텀 훅
   │     │  ├─ auth.store.ts     # Zustand 인증 상태 스토어 (accessToken + me)
   │     │  ├─ auth.service.ts   # 로그인 성공 처리, 사용자 정보 관리
   │     │  ├─ login.schema.ts   # Zod 로그인 폼 유효성 스키마
   │     │  ├─ use-login.ts      # useLogin() React Query 뮤테이션 훅
   │     │  ├─ use-logout.ts     # useLogout() 로그아웃 훅 (API + 로컬 상태 정리)
   │     │  ├─ use-me.ts         # useMe() 사용자/메뉴/권한 훅 (Zustand 구독)
   │     │  └─ use-refresh-token.ts  # useRefreshToken() 뮤테이션 훅
   │     ├─ types/               # 도메인 타입 정의
   │     │  └─ auth.type.ts      # LoginRequest/Response, MeResponse, MenuTree, 권한 타입 등
   │     └─ ui/                  # 도메인 UI 컴포넌트
   │        ├─ login-form.tsx    # 로그인 폼 (React Hook Form + Zod + Ant Design)
   │        └─ login-form.module.css  # 로그인 폼 스타일
   │
   └─ pages/                     # 라우트 단위 페이지 컴포넌트
      ├─ login/
      │  ├─ login-page.tsx       # 로그인 페이지 (이미 로그인 시 대시보드 리다이렉트)
      │  └─ login-page.module.css  # 로그인 페이지 스타일
      └─ dashboard/
         └─ dashboard-page.tsx   # 대시보드 페이지 (보호된 라우트)
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
   └─ dashboard/       # 대시보드 페이지
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
└─ ui/                 # 도메인 UI 컴포넌트 + CSS Modules
   ├─ {컴포넌트}.tsx
   └─ {컴포넌트}.module.css
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
| `/login` | LoginPage | — | 불필요 | 로그인 페이지 (로그인 상태 시 `/dashboard`로 리다이렉트) |
| `/dashboard` | DashboardPage | MainLayout | **필요** | 대시보드 (ProtectedRoute + MainLayout으로 보호) |

## 구현 현황

| 기능 | 상태 | 설명 |
|------|------|------|
| 멀티 테넌트 로그인 | ✅ 완료 | 업체명 + 아이디 + 비밀번호 기반 로그인 |
| JWT 토큰 관리 | ✅ 완료 | Access/Refresh 토큰 localStorage 저장 + Zustand 동기화 |
| 자동 토큰 갱신 | ✅ 완료 | DI 패턴 인터셉터 기반 401 응답 시 자동 리프레시 + 실패 시 로그아웃 |
| 보호된 라우트 | ✅ 완료 | ProtectedRoute (Zustand + localStorage 이중 체크) |
| 로그아웃 | ✅ 완료 | POST /auth/logout API 연동 + 로컬 상태 정리 |
| 동적 메뉴 시스템 | ✅ 완료 | API menuTree + 권한 기반 필터링 + 아이콘 매핑 |
| 권한 시스템 | ✅ 완료 | `{pageName}.{action}` 패턴, hasPermission/filterMenuTree/buildPathNameMap |
| 메인 레이아웃 | ✅ 완료 | Sidebar + Header + Content (Layout Route + Outlet 패턴) |
| 사이드바 | ✅ 완료 | 접기/펼치기, 모바일 오버레이, 동적 메뉴, 사용자 정보, 로그아웃 |
| 헤더 | ✅ 완료 | 토글 버튼, 브레드크럼, 테넌트 뱃지, 알림 Popover, 프로필 Dropdown |
| 브레드크럼 | ✅ 완료 | 동적 pathNameMap 기반 URL → 한국어 이름 매핑 |
| CSS 토큰 체계 | ✅ 완료 | CSS Custom Properties 29개 (:root), focus-visible 접근성 |
| 에러 처리 | ✅ 완료 | AxiosError 타입 래핑 + 에러 코드 매핑 + 한국어 메시지 |
| 반응형 디자인 | ✅ 완료 | 모바일 대응 (768px 브레이크포인트) |
| Path Alias | ✅ 완료 | @app, @shared, @features, @pages, @widgets |
| API 상수 관리 | ✅ 완료 | 엔드포인트 경로 상수 파일 분리 |
| 대시보드 | 🔧 스캐폴드 | 기본 플레이스홀더 구현 |

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
