# Flowdesk Admin Frontend
## 목차

- [Flowdesk Admin Frontend](#flowdesk-admin-frontend)
  - [목차](#목차)
  - [폴더/파일 구조 규칙 및 사용 가이드](#폴더파일-구조-규칙-및-사용-가이드)
      - [폴더별 생성/사용 예시](#폴더별-생성사용-예시)
      - [폴더/파일별 사용 예시](#폴더파일별-사용-예시)
  - [프로젝트 소개](#프로젝트-소개)
  - [주요 기술 스택](#주요-기술-스택)
  - [폴더 구조](#폴더-구조)


## 폴더/파일 구조 규칙 및 사용 가이드

| 폴더/파일         | 생성/사용 상황                          | 설명 및 예시 |
|-------------------|------------------------------------------|-------------|
| app/              | 프로젝트 초기화, 전역 Provider/라우터 필요 | 앱 진입점, 전역 Provider, 라우터, 레이아웃, 상태관리, 스타일만 위치. 예: App.tsx, main.tsx, styles/ |
| shared/           | 여러 features, pages, widgets에서 공통 사용 | 공통 API, 타입, 유틸리티, 에셋 등. 예: api/axios.ts, assets/logo.png |
| widgets/          | 여러 페이지에서 반복되는 UI 블록 필요      | 레이아웃/페이지 단위 공통 UI 블록. 예: sidebar/sidebar.tsx, header/header.tsx |
| features/         | 도메인별 slice 구현 필요                   | 비즈니스 기능별로 slice 분리, FSD 구조(model, api, ui 등)로만 구성. 예: auth/api/login.api.ts |
| pages/            | 라우트 단위 페이지 컴포넌트 필요           | 라우트 단위 컴포넌트만 위치, 비즈니스 로직은 features에서만. 예: login/login-page.tsx |
| vite-env.d.ts     | Vite 환경 타입 정의 필요                   | Vite 환경 타입 정의 파일 |

#### 폴더별 생성/사용 예시

```
src/
├─ app/                # 프로젝트 시작 시 생성, 전역 Provider/라우터/스타일 필요할 때 추가
│  ├─ styles/          # 글로벌 스타일 필요 시 생성
│  ├─ App.tsx          # 앱 루트 컴포넌트(필수)
│  └─ main.tsx         # React DOM 엔트리(필수)
│
├─ shared/             # 여러 도메인/페이지에서 공통 코드 필요 시 생성
│  ├─ api/             # 공통 API 인스턴스, 인터셉터 등 필요 시 생성
│  ├─ assets/          # 공통 이미지 등 정적 자산 필요 시 생성
│  ├─ types/           # 공통 타입 정의 필요 시 생성
│  └─ utils/           # 공통 유틸리티 함수 필요 시 생성
│
├─ widgets/            # 여러 페이지에서 반복되는 UI 블록 필요 시 생성
│  ├─ sidebar/         # 사이드바 UI 필요 시 생성
│  ├─ header/          # 헤더 UI 필요 시 생성
│  └─ breadcrumb/      # 브레드크럼 UI 필요 시 생성
│
├─ features/           # 도메인별 slice 구현 필요 시 생성
│  ├─ auth/            # 인증/권한 도메인 필요 시 생성
│  │  ├─ api/          # 인증 관련 API 필요 시 생성
│  │  ├─ lib/          # 인증 관련 스토리지/비즈니스 로직 필요 시 생성
│  │  ├─ model/        # 인증 상태관리/서비스/훅 필요 시 생성
│  │  ├─ types/        # 인증 관련 타입 필요 시 생성
│  │  ├─ ui/           # 인증 관련 UI 컴포넌트 필요 시 생성
│  │  └─ index.ts      # 인증 도메인 public API(필수)
│  ├─ dashboard/       # 대시보드 도메인 필요 시 생성
│  │  └─ pages/        # 대시보드 관련 페이지 필요 시 생성
│
├─ pages/              # 라우트 단위 페이지 컴포넌트 필요 시 생성
│  ├─ login/           # 로그인 페이지 필요 시 생성
│  │  ├─ login-page.tsx
│  │  └─ login-page.module.css
│  ├─ mypage/          # 마이페이지 필요 시 생성
│
├─ vite-env.d.ts       # Vite 환경 타입 정의 필요 시 생성
```

#### 폴더/파일별 사용 예시


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
│  ├─ styles/          # 글로벌/라이브러리 오버라이드 스타일 (global.css, antd-overrides.module.css 등)
│  ├─ App.tsx          # 앱 루트 컴포넌트
│  └─ main.tsx         # React DOM 엔트리
│
├─ shared/             # 공통 API, 타입, 유틸리티, 에셋
│  ├─ api/             # 공통 API 인스턴스, 인터셉터 등
│  ├─ assets/          # 공통 이미지 등 정적 자산
│  ├─ types/           # 공통 타입 정의
│  └─ utils/           # 공통 유틸리티 함수
│
├─ widgets/            # 레이아웃/페이지 단위의 공통 UI 블록
│  ├─ sidebar/         # 사이드바 관련 컴포넌트 및 메뉴
│  ├─ header/          # 헤더 관련 컴포넌트
│  └─ breadcrumb/      # 브레드크럼 관련 컴포넌트
│
├─ features/           # 도메인(기능)별 폴더 (auth, dashboard 등)
│  ├─ auth/            # 인증/권한 도메인 (로그인, 토큰, 권한 등)
│  │  ├─ api/          # 인증 관련 API (login, refresh, me 등)
│  │  ├─ lib/          # 인증 관련 스토리지/비즈니스 로직
│  │  ├─ model/        # 인증 상태관리(zustand 등), 서비스, 훅
│  │  ├─ types/        # 인증 관련 타입
│  │  ├─ ui/           # 인증 관련 UI 컴포넌트
│  │  └─ index.ts      # 인증 도메인 public API
│  ├─ dashboard/       # 대시보드 도메인
│  │  └─ pages/        # 대시보드 관련 페이지
│
├─ pages/              # 라우트 단위 페이지 (login, mypage 등)
│  ├─ login/           # 로그인 페이지
│  │  ├─ login-page.tsx
│  │  └─ login-page.module.css
│  ├─ mypage/          # 마이페이지
│
├─ vite-env.d.ts       # Vite 환경 타입 정의
```
