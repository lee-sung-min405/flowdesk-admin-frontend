# Flowdesk Admin Frontend

## 프로젝트 소개

Flowdesk Admin Frontend는 React, TypeScript, Vite, Ant Design, TanStack Query 등 최신 프론트엔드 스택을 기반으로 한 어드민 대시보드 프로젝트입니다. 실무에서 확장성과 유지보수성을 고려한 폴더 구조와 모듈화 전략을 적용하였습니다.

## 주요 기술 스택
- React 19
- TypeScript
- Vite 8
- Ant Design
- TanStack React Query
- Zustand (상태관리)
- React Hook Form, Zod (폼/유효성)
- Axios (API 통신)

## 폴더 구조

```
src/
├─ app/                # 앱 진입점, 전역 Provider, 라우터, 레이아웃, 상태관리, 스타일
│  ├─ providers/       # 전역 Provider 컴포넌트 (app-provider, query-provider, antd-theme-provider 등)
│  ├─ router/          # 라우터 설정 및 보호 라우트 (index, protected-route, route-path 등)
│  ├─ layouts/         # 레이아웃 컴포넌트 (admin-layout, auth-layout 등)
│  ├─ store/           # 전역 상태관리(zustand 등)
│  ├─ styles/          # 글로벌/라이브러리 오버라이드 스타일 (global.css, antd-overrides.css 등)
│  ├─ App.tsx          # 앱 루트 컴포넌트
│  └─ main.tsx         # React DOM 엔트리
│
├─ shared/             # 공통 API, 컴포넌트, 훅, 상수, 타입, 유틸리티
│  ├─ api/             # 공통 API 인스턴스, 엔드포인트, 쿼리 클라이언트
│  ├─ components/      # 공통 UI 컴포넌트
│  │  ├─ common/       # 페이지/도메인과 무관한 공통 컴포넌트
│  │  └─ feedback/     # 로딩, 에러 등 피드백 컴포넌트
│  ├─ constants/       # 쿼리키, 메시지 등 상수
│  ├─ hooks/           # 공통 커스텀 훅
│  ├─ types/           # 공통 타입 정의
│  └─ utils/           # 공통 유틸리티 함수
│
├─ widgets/            # 레이아웃/페이지 단위의 공통 UI 블록
│  ├─ sidebar/         # 사이드바 관련 컴포넌트 및 메뉴
│  ├─ header/          # 헤더 관련 컴포넌트
│  └─ breadcrumb/      # 브레드크럼 관련 컴포넌트
│
├─ features/           # 도메인(기능)별 폴더 (auth, dashboard, users 등)
│  ├─ auth/            # 인증 도메인
│  │  ├─ api/          # 인증 관련 API
│  │  ├─ components/   # 인증 관련 컴포넌트
│  │  ├─ hooks/        # 인증 관련 커스텀 훅
│  │  ├─ pages/        # 인증 관련 페이지
│  │  ├─ schemas/      # 인증 관련 스키마
│  │  └─ types/        # 인증 관련 타입
│  ├─ dashboard/       # 대시보드 도메인
│  │  └─ pages/        # 대시보드 관련 페이지
│  └─ users/           # 사용자 관리 도메인
│     ├─ api/          # 사용자 관련 API
│     ├─ components/   # 사용자 관련 컴포넌트
│     ├─ hooks/        # 사용자 관련 커스텀 훅
│     ├─ pages/        # 사용자 관련 페이지
│     └─ types/        # 사용자 관련 타입
│
├─ vite-env.d.ts       # Vite 환경 타입 정의

# public 폴더는 현재 생성되어 있지 않으며, 정적 자산(이미지, favicon 등)이 필요할 경우 별도로 public/ 디렉터리를 생성하여 사용합니다.
```
