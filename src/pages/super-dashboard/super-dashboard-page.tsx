import { Spin, Alert } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import {
  useSuperDashboard,
  OverviewCards,
  TodayCards,
  MonthlyTrendsChart,
  SecurityCards,
  TenantStatsTable,
} from '@features/super-dashboard';
import dayjs from 'dayjs';
import styles from './super-dashboard-page.module.css';

export default function SuperDashboardPage() {
  const { data, isLoading, error, dataUpdatedAt, refetch, isFetching } = useSuperDashboard();

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

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>슈퍼 관리자 대시보드</h1>
          <p className={styles.pageDesc}>전체 시스템 현황을 한눈에 확인할 수 있습니다.</p>
        </div>
        <div className={styles.pageHeaderRight}>
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

      <div className={styles.topRow}>
        <section className={styles.overviewSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>전체 현황</h2>
            <span className={styles.sectionBadge}>Overview</span>
          </div>
          <OverviewCards data={data.overview} />
        </section>

        <section className={styles.todaySection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>오늘 현황</h2>
            <span className={styles.sectionBadgeLive}>Live</span>
          </div>
          <TodayCards data={data.today} />
        </section>
      </div>

      <section className={styles.section}>
        <MonthlyTrendsChart data={data.monthlyTrends} />
      </section>

      <div className={styles.bottomRow}>
        <section className={styles.securitySection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>보안 현황</h2>
            <span className={styles.sectionBadge}>Security</span>
          </div>
          <SecurityCards data={data.security} />
        </section>

        <section className={styles.tenantSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>테넌트별 상세 통계</h2>
            <span className={styles.sectionBadge}>{data.tenantStats.length}개</span>
          </div>
          <TenantStatsTable data={data.tenantStats} />
        </section>
      </div>
    </div>
  );
}
