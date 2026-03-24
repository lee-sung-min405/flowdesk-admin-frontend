import { useState, useMemo } from 'react';
import { Spin, Alert, DatePicker } from 'antd';
import {
  ReloadOutlined,
  FundOutlined,
  TeamOutlined,
  GlobalOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import {
  useCounselDashboard,
  SummaryCards,
  StatusDistributionChart,
  EmployeeStatsChart,
  DailyTrendsChart,
  TopWebsitesChart,
  HourlyDistributionChart,
  UpcomingReservationsTable,
} from '@features/counsel';
import type { GetCounselDashboardRequest } from '@features/counsel';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import styles from './counsel-dashboard-page.module.css';

const { RangePicker } = DatePicker;

const RANGE_PRESETS: { label: string; value: [Dayjs, Dayjs] }[] = [
  { label: '오늘', value: [dayjs(), dayjs()] },
  { label: '최근 7일', value: [dayjs().subtract(6, 'day'), dayjs()] },
  { label: '최근 30일', value: [dayjs().subtract(29, 'day'), dayjs()] },
  { label: '이번 달', value: [dayjs().startOf('month'), dayjs()] },
  { label: '지난 달', value: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')] },
];

export default function CounselDashboardPage() {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  const params = useMemo<GetCounselDashboardRequest>(() => {
    if (!dateRange) return {};
    return {
      startDate: dateRange[0].format('YYYY-MM-DD'),
      endDate: dateRange[1].format('YYYY-MM-DD'),
    };
  }, [dateRange]);

  const { data, isLoading, error, dataUpdatedAt, refetch, isFetching } = useCounselDashboard(params);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.page}>
        <Alert
          type="error"
          showIcon
          message="데이터를 불러오지 못했습니다."
          description={error?.message}
        />
      </div>
    );
  }

  const periodLabel = dateRange
    ? `${dateRange[0].format('YYYY.MM.DD')} ~ ${dateRange[1].format('YYYY.MM.DD')}`
    : '전체 기간';

  return (
    <div className={styles.page}>
      {/* ── 페이지 헤더 ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>상담 대시보드</h1>
          <p className={styles.pageDesc}>
            상담 현황을 한눈에 확인할 수 있습니다.
          </p>
        </div>
        <div className={styles.pageHeaderRight}>
          <RangePicker
            presets={RANGE_PRESETS}
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs] | null)}
            allowClear
            placeholder={['시작일', '종료일']}
            className={styles.rangePicker}
          />
          <button
            className={styles.refreshBtn}
            onClick={() => refetch()}
            disabled={isFetching}
            type="button"
          >
            <ReloadOutlined spin={isFetching} />
            <span>새로고침</span>
          </button>
          {dataUpdatedAt > 0 && (
            <span className={styles.updatedAt}>
              {dayjs(dataUpdatedAt).format('HH:mm:ss')} 기준
            </span>
          )}
        </div>
      </div>

      {/* ── 기간 안내 ── */}
      <div className={styles.periodBar}>
        <CalendarOutlined />
        <span>조회 기간: <strong>{periodLabel}</strong></span>
      </div>

      {/* ── 핵심 지표 ── */}
      <SummaryCards data={data.summary} />

      {/* ── 분석 섹션 ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <FundOutlined className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>상태 · 담당자 분석</h2>
          <span className={styles.sectionBadge}>Analysis</span>
        </div>
        <div className={styles.twoColGrid}>
          <StatusDistributionChart data={data.statusDistribution} />
          <EmployeeStatsChart data={data.employeeStats} />
        </div>
      </section>

      {/* ── 추이 섹션 ── */}
      <section className={styles.section}>
        <DailyTrendsChart data={data.dailyTrends} />
      </section>

      {/* ── 채널 · 시간대 섹션 ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <GlobalOutlined className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>채널 · 시간대 분석</h2>
          <span className={styles.sectionBadge}>Channel</span>
        </div>
        <div className={styles.twoColGrid}>
          <TopWebsitesChart data={data.topWebsites} />
          <HourlyDistributionChart data={data.hourlyDistribution} />
        </div>
      </section>

      {/* ── 예약 섹션 ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <TeamOutlined className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>예약 상담</h2>
          <span className={styles.sectionBadgeLive}>Upcoming</span>
        </div>
        <UpcomingReservationsTable data={data.upcomingReservations} />
      </section>
    </div>
  );
}
