import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TeamOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
  SafetyOutlined,
  CustomerServiceOutlined,
  ReadOutlined,
  DashboardOutlined,
  SettingOutlined,
  RightOutlined,
  CrownOutlined,
  ApartmentOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  BarChartOutlined,
  LockOutlined,
  LayoutOutlined,
  UserOutlined,
  SafetyCertificateFilled,
  ThunderboltOutlined,
  FileTextOutlined,
  ControlOutlined,
  LinkOutlined,
  SendOutlined,
  InfoCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useMe } from '@features/auth';
import styles from './home-page.module.css';

/* ═══════════════════════════════════════════════
   역할별 서비스 이용 플로우 데이터 정의
   ═══════════════════════════════════════════════ */

interface FlowStep {
  key: string;
  title: string;
  desc: string;
  path: string;
  pageName: string;
  icon: React.ReactNode;
  color: string;
}

interface FlowPhase {
  phase: number;
  title: string;
  steps: FlowStep[];
}

interface RoleLane {
  key: string;
  role: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  phases: FlowPhase[];
}

const ROLE_LANES: RoleLane[] = [
  /* ── 슈퍼 관리자 ── */
  {
    key: 'super',
    role: '슈퍼 관리자',
    label: 'Super Admin',
    desc: '시스템 전체를 관리하고, 업체(테넌트) 생성 · 권한 체계 구성 · 전사 모니터링을 수행합니다.',
    icon: <ThunderboltOutlined />,
    color: '#233d7b',
    gradient: 'linear-gradient(135deg, #233d7b 0%, #2a5298 100%)',
    phases: [
      {
        phase: 1,
        title: '업체 · 권한 체계 구성',
        steps: [
          { key: 'tenants', title: '업체 관리', desc: '테넌트(업체) 생성 · 상태 변경 · 정보 관리', path: '/tenants', pageName: 'super.tenants', icon: <ApartmentOutlined />, color: '#531dab' },
          { key: 'pages', title: '페이지 관리', desc: '시스템 메뉴 페이지 등록 · 순서 · 계층 관리', path: '/permissions/admin/pages', pageName: 'super.pages', icon: <FileTextOutlined />, color: '#1677ff' },
          { key: 'actions', title: '액션 관리', desc: '페이지별 수행 가능 액션(CRUD) 정의', path: '/permissions/admin/actions', pageName: 'super.actions', icon: <ControlOutlined />, color: '#13c2c2' },
          { key: 'permissions', title: '권한 관리', desc: '페이지 × 액션 권한 조합 생성 · 관리', path: '/permissions/admin/permissions', pageName: 'super.permissions', icon: <LockOutlined />, color: '#f5222d' },
        ],
      },
      {
        phase: 2,
        title: '전체 시스템 모니터링',
        steps: [
          { key: 'super-dashboard', title: '시스템 대시보드', desc: '전체 테넌트 · 사용자 · 보안 현황 통합 모니터링', path: '/super/dashboard', pageName: 'super.dashboard', icon: <DashboardOutlined />, color: '#233d7b' },
        ],
      },
    ],
  },
  /* ── 업체 관리자 ── */
  {
    key: 'admin',
    role: '업체 관리자',
    label: 'Company Admin',
    desc: '업체 내 서비스 환경을 설정하고, 팀원 · 권한을 관리하며, 전체 담당자의 상담 데이터를 통합 관리합니다.',
    icon: <SafetyCertificateFilled />,
    color: '#1677ff',
    gradient: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
    phases: [
      {
        phase: 1,
        title: '서비스 환경 설정',
        steps: [
          { key: 'websites', title: '웹사이트 관리', desc: '상담 유입 웹사이트 등록 · 중복 판정 설정', path: '/websites', pageName: 'websites', icon: <GlobalOutlined />, color: '#52c41a' },
          { key: 'security', title: '차단 관리', desc: 'IP · 휴대폰 번호 · 금칙어 기반 스팸 차단', path: '/security', pageName: 'security', icon: <SafetyOutlined />, color: '#f5222d' },
          { key: 'tenants-status', title: '상태 관리', desc: '상담 처리 단계 커스텀 정의 · 그룹 관리', path: '/tenants/status', pageName: 'tenants.status', icon: <SettingOutlined />, color: '#faad14' },
        ],
      },
      {
        phase: 2,
        title: '조직 · 권한 관리',
        steps: [
          { key: 'users', title: '사용자 관리', desc: '계정 생성 · 상태 변경 · 역할 배정 · 비밀번호 초기화', path: '/users', pageName: 'users', icon: <TeamOutlined />, color: '#1677ff' },
          { key: 'roles', title: '역할 관리', desc: '역할 정의 · 페이지×액션 접근 권한 매트릭스 구성', path: '/roles', pageName: 'roles', icon: <SafetyCertificateOutlined />, color: '#eb2f96' },
          { key: 'permissions-catalog', title: '권한 카탈로그', desc: '전체 권한 매트릭스를 트리 구조로 조회', path: '/permissions/catalog', pageName: 'permissions.catalog', icon: <AppstoreOutlined />, color: '#2f54eb' },
        ],
      },
      {
        phase: 3,
        title: '콘텐츠 운영',
        steps: [
          { key: 'board-types', title: '게시판 타입 관리', desc: '공지사항 · FAQ · 자료실 등 게시판 유형 정의', path: '/board-types', pageName: 'board_types', icon: <LayoutOutlined />, color: '#d48806' },
          { key: 'boards', title: '게시글 관리', desc: '게시판 타입별 전체 게시물 조회 · 작성 · 수정 · 삭제', path: '/boards', pageName: 'boards', icon: <ReadOutlined />, color: '#fa8c16' },
        ],
      },
      {
        phase: 4,
        title: '상담 통합 관리',
        steps: [
          { key: 'counsels', title: '상담 목록', desc: '전체 담당자 상담 조회 · 필터 · 담당자 배정', path: '/counsels', pageName: 'counsels', icon: <CustomerServiceOutlined />, color: '#13c2c2' },
          { key: 'counsel-calendar', title: '예약 캘린더', desc: '전체 예약 상담 캘린더 조회 · 일정 관리', path: '/counsels/calendar', pageName: 'counsels.calendar', icon: <CalendarOutlined />, color: '#722ed1' },
          { key: 'counsel-dashboard', title: '상담 대시보드', desc: '전체 담당자 상담 통계 · 성과 분석', path: '/counsels/dashboard', pageName: 'counsels.dashboard', icon: <BarChartOutlined />, color: '#1677ff' },
        ],
      },
    ],
  },
  /* ── 일반 사용자 ── */
  {
    key: 'user',
    role: '일반 사용자',
    label: 'Company User',
    desc: '자신에게 배정된 상담 데이터만 조회 · 처리할 수 있으며, 담당 상담의 일정과 성과를 확인합니다.',
    icon: <UserOutlined />,
    color: '#13c2c2',
    gradient: 'linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%)',
    phases: [
      {
        phase: 1,
        title: '콘텐츠 이용',
        steps: [
          { key: 'boards', title: '게시글', desc: '공지사항 · FAQ · 자료실 등 각종 게시물 조회 · 작성', path: '/boards', pageName: 'boards', icon: <ReadOutlined />, color: '#fa8c16' },
        ],
      },
      {
        phase: 2,
        title: '담당 상담 처리',
        steps: [
          { key: 'counsels', title: '상담 목록', desc: '본인 담당 상담만 조회 · 상태 변경 · 메모', path: '/counsels', pageName: 'counsels', icon: <CustomerServiceOutlined />, color: '#13c2c2' },
          { key: 'counsel-calendar', title: '예약 캘린더', desc: '본인 담당 예약 상담 캘린더 관리', path: '/counsels/calendar', pageName: 'counsels.calendar', icon: <CalendarOutlined />, color: '#722ed1' },
        ],
      },
      {
        phase: 3,
        title: '내 성과 확인',
        steps: [
          { key: 'counsel-dashboard', title: '상담 대시보드', desc: '본인 담당 상담 통계 · 처리 현황 분석', path: '/counsels/dashboard', pageName: 'counsels.dashboard', icon: <BarChartOutlined />, color: '#1677ff' },
        ],
      },
    ],
  },
];

/* ── 아키텍처 하이라이트 ── */
const TECH_HIGHLIGHTS = [
  { icon: '🏢', label: '멀티테넌트 격리', desc: 'tenantId 기반 완전한 데이터 분리' },
  { icon: '🔐', label: 'RBAC 권한 제어', desc: 'page.action 기반 세분화된 접근 제어' },
  { icon: '🔑', label: 'JWT 인증', desc: '자동 갱신 + tokenVersion 즉시 무효화' },
  { icon: '📋', label: '동적 메뉴', desc: '권한 기반 서버사이드 메뉴 트리 구성' },
  { icon: '🧱', label: 'Feature-Sliced Design', desc: '레이어별 단방향 의존성 아키텍처' },
  { icon: '🛡️', label: '보안 3단계 검증', desc: 'IP · 번호 · 금칙어 + Advisory Lock' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { me } = useMe();

  const user = me?.user;
  const roles = me?.roles ?? [];

  /* 모든 Lane/Phase/Step을 예시로 표시 (권한 필터 없음) */
  const visibleLanes = ROLE_LANES;
  const [activeLane, setActiveLane] = useState(ROLE_LANES[0].key);

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? '좋은 아침입니다' : currentHour < 18 ? '좋은 오후입니다' : '좋은 저녁입니다';

  return (
    <div className={styles.page}>
      {/* ── 페이지 헤더 ── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>HOME</h1>
        <p className={styles.pageDesc}>서비스 이용 플로우와 시스템 개요를 확인하세요.</p>
      </div>

      {/* ── 환영 섹션 ── */}
      <section className={styles.hero}>
        <div className={styles.heroTop}>
          <div className={styles.heroProfile}>
            <div className={styles.heroAvatar}>
              <UserOutlined />
            </div>
            <div>
              <p className={styles.greeting}>{greeting},</p>
              <h1 className={styles.heroName}>{user?.userName ?? '사용자'}님</h1>
            </div>
          </div>
          <div className={styles.heroBrand}>
            <strong>{user?.corpName}</strong> 관리자 포털
          </div>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><ApartmentOutlined /></div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>소속 업체</span>
              <span className={styles.statValue}>{user?.corpName ?? '-'}</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><CrownOutlined /></div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>나의 역할</span>
              <span className={styles.statValue}>{roles.length > 0 ? roles.join(', ') : '미배정'}</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><CalendarOutlined /></div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>가입일</span>
              <span className={styles.statValue}>{user?.regDtm ? dayjs(user.regDtm).format('YYYY. M. D.') : '-'}</span>
            </div>
          </div>
          <div className={styles.statCard} data-status={user?.isActive ? 'active' : 'inactive'}>
            <div className={styles.statIcon}>
              {user?.isActive ? <SafetyCertificateOutlined /> : <LockOutlined />}
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>계정 상태</span>
              <span className={styles.statValue}>{user?.isActive ? '활성' : '비활성'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 섹션 퀴네비 ── */}
      <nav className={styles.quickNav}>
        {[
          { id: 'portfolio', icon: <LinkOutlined />, label: '포트폴리오' },
          { id: 'dataflow', icon: <SendOutlined />, label: '데이터 흐름' },
          { id: 'roles', icon: <SafetyCertificateOutlined />, label: '역할별 플로우' },
          { id: 'arch', icon: <AppstoreOutlined />, label: '아키텍처' },
        ].map((nav) => (
          <button
            key={nav.id}
            className={styles.quickNavItem}
            type="button"
            onClick={() => document.getElementById(nav.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            {nav.icon}
            <span>{nav.label}</span>
          </button>
        ))}
      </nav>

      {/* ── 포트폴리오 사이트 안내 ── */}
      <section id="portfolio" className={styles.section}>
        <div className={styles.portfolioBanner}>
          <div className={styles.portfolioBannerContent}>
            <span className={styles.sectionLabel} style={{ color: 'rgba(255,255,255,0.8)' }}>
              <LinkOutlined /> Developer Portfolio
            </span>
            <h2 className={styles.portfolioBannerTitle}>
              이 프로젝트를 만든 개발자가 궁금하신가요?
            </h2>
            <p className={styles.portfolioBannerDesc}>
              포트폴리오 사이트에서 기술 스택, 프로젝트 경험, 경력 사항을 확인하실 수 있습니다.
            </p>
            <a
              className={styles.portfolioBtn}
              href="https://leeseongmin.pro/"
              target="_blank"
              rel="noopener noreferrer"
            >
              포트폴리오 사이트 방문하기
              <RightOutlined />
            </a>
          </div>
          <div className={styles.portfolioBannerVisual}>
            <span className={styles.portfolioEmoji}>👨‍💻</span>
          </div>
        </div>
        <div className={styles.portfolioGrid}>
          {[
            { icon: <UserOutlined />, label: 'About', desc: '개발자 소개 · 커리어 경험', color: '#1677ff' },
            { icon: <AppstoreOutlined />, label: 'Tech Stack', desc: '기술 스택 · 도구 · 환경', color: '#52c41a' },
            { icon: <ReadOutlined />, label: 'Projects', desc: '프로젝트 상세 · 기여 내역', color: '#722ed1' },
            { icon: <BarChartOutlined />, label: 'Experience', desc: '실무 경력 · 성과 정리', color: '#fa8c16' },
            { icon: <SendOutlined />, label: 'Contact', desc: '상담 신청 · 연락처 확인', color: '#0958d9', highlight: true },
          ].map((item) => (
            <div
              key={item.label}
              className={`${styles.portfolioFeatureCard} ${item.highlight ? styles.portfolioFeatureCardHighlight : ''}`}
            >
              <div className={styles.portfolioFeatureIcon} style={{ background: `${item.color}10`, color: item.color }}>
                {item.icon}
              </div>
              <div className={styles.portfolioFeatureLabel}>{item.label}</div>
              <div className={styles.portfolioFeatureDesc}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 실시간 데이터 흐름 ── */}
      <section id="dataflow" className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel} style={{ color: '#52c41a' }}>
            <SendOutlined /> Live Data Flow
          </span>
          <h2 className={styles.sectionTitle}>
            상담 데이터는 어디서 유입될까요?
          </h2>
          <p className={styles.sectionDesc}>
            업체가 등록한 웹사이트에 <strong>웹코드(스크립트)</strong>를 삽입하면,
            해당 사이트의 상담 신청 폼 데이터가 이 시스템으로 실시간 유입됩니다.
            아래 다이어그램은 실제 구현된 데이터 연동 흐름을 나타냅니다.
          </p>
        </div>

        <div className={styles.flowDiagram}>
          <div className={styles.flowNode}>
            <div className={styles.flowNodeIcon} style={{ background: '#f0f5ff', color: '#1677ff' }}>
              <GlobalOutlined />
            </div>
            <div className={styles.flowNodeLabel}>업체 웹사이트</div>
            <div className={styles.flowNodeSub}>웹코드 삽입 사이트</div>
          </div>
          <div className={styles.flowArrow}>
            <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
              <path d="M2 10h32m-6-5 6 5-6 5" stroke="#91caff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={styles.flowArrowLabel}>상담 폼 제출</span>
          </div>
          <div className={styles.flowNode}>
            <div className={styles.flowNodeIcon} style={{ background: '#f6ffed', color: '#52c41a' }}>
              <SendOutlined />
            </div>
            <div className={styles.flowNodeLabel}>API 연동</div>
            <div className={styles.flowNodeSub}>실시간 데이터 전송</div>
          </div>
          <div className={styles.flowArrow}>
            <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
              <path d="M2 10h32m-6-5 6 5-6 5" stroke="#91caff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={styles.flowArrowLabel}>데이터 유입</span>
          </div>
          <div className={styles.flowNode}>
            <div className={styles.flowNodeIcon} style={{ background: '#fff7e6', color: '#fa8c16' }}>
              <DashboardOutlined />
            </div>
            <div className={styles.flowNodeLabel}>FlowDesk Admin</div>
            <div className={styles.flowNodeSub}>상담 목록 · 캘린더 · 대시보드</div>
          </div>
        </div>
      </section>

      {/* ── 역할별 서비스 이용 플로우 ── */}
      {visibleLanes.length > 0 && (
        <section id="roles" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel} style={{ color: '#233d7b' }}>
              <SafetyCertificateOutlined /> Role-Based Flow
            </span>
            <h2 className={styles.sectionTitle}>역할별 서비스 이용 플로우</h2>
            <p className={styles.sectionDesc}>
              각 역할에 따라 사용 가능한 기능과 권장 이용 순서를 안내합니다.
              탭을 클릭하여 각 역할의 플로우를 확인하세요.
            </p>
          </div>

          <div className={styles.sectionBody} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 역할 탭 */}
          <div className={styles.laneTabs}>
            {visibleLanes.map((lane) => (
              <button
                key={lane.key}
                type="button"
                className={`${styles.laneTab} ${activeLane === lane.key ? styles.laneTabActive : ''}`}
                style={activeLane === lane.key ? { borderColor: lane.color, color: lane.color } : undefined}
                onClick={() => setActiveLane(lane.key)}
              >
                {lane.icon}
                <span>{lane.role}</span>
              </button>
            ))}
          </div>

          <div className={styles.customizeNotice}>
            <div className={styles.noticeIcon}>
              <InfoCircleOutlined />
            </div>
            <div className={styles.noticeContent}>
              <strong className={styles.noticeTitle}>
                아래 구성은 이해를 돕기 위한 예시입니다
              </strong>
              <p className={styles.noticeDesc}>
                실제 운영 환경에서는 슈퍼 관리자가 <em>페이지 · 액션 · 권한</em>을 자유롭게 등록하고,
                업체 관리자가 <em>역할별 권한 매트릭스</em>를 직접 구성할 수 있습니다.
                각 업체(테넌트)의 업무 프로세스에 맞게 메뉴 접근 범위와 기능 권한을 유연하게 커스터마이징하세요.
              </p>
              <p className={styles.noticeWarn}>
                <LockOutlined /> 보유하지 않은 권한의 페이지를 클릭하면 접근이 제한될 수 있습니다.
              </p>
              <div className={styles.noticeChips}>
                <span className={styles.noticeChip}>
                  <EditOutlined /> 페이지 · 액션 자유 등록
                </span>
                <span className={styles.noticeChip}>
                  <SafetyCertificateOutlined /> 역할별 권한 매트릭스
                </span>
                <span className={styles.noticeChip}>
                  <ApartmentOutlined /> 업체별 독립 구성
                </span>
              </div>
            </div>
          </div>

          <div className={styles.lanes}>
            {visibleLanes.filter((lane) => lane.key === activeLane).map((lane) => (
              <div key={lane.key} className={styles.lane}>
                {/* Lane 헤더 */}
                <div className={styles.laneHeader} style={{ background: lane.gradient }}>
                  <div className={styles.laneIcon}>{lane.icon}</div>
                  <div className={styles.laneInfo}>
                    <div className={styles.laneTitleRow}>
                      <h3 className={styles.laneRole}>{lane.role}</h3>
                      <span className={styles.laneBadge}>{lane.label}</span>
                      <span className={styles.exampleBadge}>예시</span>
                    </div>
                    <p className={styles.laneDesc}>{lane.desc}</p>
                  </div>
                </div>

                {/* Phase별 스텝 */}
                <div className={styles.laneBody}>
                  {lane.phases.map((phase, phaseIdx) => (
                    <div key={phase.phase} className={styles.lanePhase}>
                      {/* Phase 라벨 */}
                      <div className={styles.phaseTag}>
                        <span className={styles.phaseNum} style={{ background: lane.color }}>
                          {phaseIdx + 1}
                        </span>
                        <span className={styles.phaseTitle}>{phase.title}</span>
                      </div>

                      {/* 스텝 카드 그리드 */}
                      <div className={styles.phaseSteps}>
                        {phase.steps.map((step, stepIdx) => (
                          <div key={step.key} className={styles.stepWrap}>
                            <button
                              className={styles.stepCard}
                              onClick={() => navigate(step.path)}
                              type="button"
                            >
                              <div
                                className={styles.stepIcon}
                                style={{ background: `${step.color}10`, color: step.color }}
                              >
                                {step.icon}
                              </div>
                              <div className={styles.stepBody}>
                                <h4 className={styles.stepTitle}>{step.title}</h4>
                                <p className={styles.stepDesc}>{step.desc}</p>
                              </div>
                              <RightOutlined className={styles.stepArrow} />
                            </button>
                            {stepIdx < phase.steps.length - 1 && (
                              <div className={styles.stepConnector}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                  <path d="M5 12h14m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Phase 간 세로 화살표 */}
                      {phaseIdx < lane.phases.length - 1 && (
                        <div className={styles.phaseConnector}>
                          <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
                            <path d="M10 4v16m-4-4 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          </div>
        </section>
      )}

      {/* ── 아키텍처 하이라이트 ── */}
      <section id="arch" className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel} style={{ color: '#722ed1' }}>
            <AppstoreOutlined /> Architecture
          </span>
          <h2 className={styles.sectionTitle}>시스템 아키텍처</h2>
          <p className={styles.sectionDesc}>
            FlowDesk Admin은 멀티테넌트 B2B SaaS 어드민 시스템으로, 아래의 핵심 설계 원칙을 기반으로 구축되었습니다.
          </p>
        </div>
        <div className={styles.sectionBody}>
          <div className={styles.techGrid}>
          {TECH_HIGHLIGHTS.map((item) => (
            <div key={item.label} className={styles.techCard}>
              <span className={styles.techEmoji}>{item.icon}</span>
              <div>
                <div className={styles.techLabel}>{item.label}</div>
                <div className={styles.techDesc}>{item.desc}</div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerBrand}>FlowDesk Admin</div>
        <div className={styles.footerStack}>
          React 19 · TypeScript · Vite 8 · Ant Design 6 · TanStack Query · Zustand · NestJS 11 · MySQL 8
        </div>
        <div className={styles.footerCopy}>멀티테넌트 B2B SaaS 어드민 시스템 — Feature-Sliced Design 아키텍처</div>
      </footer>
    </div>
  );
}
