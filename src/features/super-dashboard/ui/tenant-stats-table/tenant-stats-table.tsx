import { useState, useEffect, useMemo } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { TenantStat } from '../../types/super-dashboard.type';
import styles from './tenant-stats-table.module.css';

interface TenantStatsTableProps {
  data: TenantStat[];
}

const num = (v: number) => v.toLocaleString();

function StatusDot({ active }: { active: boolean }) {
  return (
    <span className={active ? styles.statusActive : styles.statusInactive}>
      <span className={styles.statusDot} />
      {active ? '활성' : '비활성'}
    </span>
  );
}

const allColumns: ColumnsType<TenantStat> = [
  {
    title: '테넌트명',
    dataIndex: 'tenantName',
    key: 'tenantName',
    fixed: 'left',
    width: 140,
    render: (name: string) => <span className={styles.tenantName}>{name}</span>,
  },
  {
    title: '상태',
    dataIndex: 'isActive',
    key: 'isActive',
    width: 90,
    align: 'center',
    render: (isActive: number) => <StatusDot active={!!isActive} />,
  },
  {
    title: '생성일',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 110,
    render: (date: string) => (
      <span className={styles.dateCell}>{dayjs(date).format('YYYY-MM-DD')}</span>
    ),
  },
  {
    title: '사용자',
    dataIndex: 'userCount',
    key: 'userCount',
    width: 80,
    align: 'right',
    render: num,
  },
  {
    title: '활성 사용자',
    dataIndex: 'activeUserCount',
    key: 'activeUserCount',
    width: 100,
    align: 'right',
    render: num,
  },
  {
    title: '상담',
    dataIndex: 'counselCount',
    key: 'counselCount',
    width: 80,
    align: 'right',
    render: num,
  },
  {
    title: '오늘 상담',
    dataIndex: 'todayCounselCount',
    key: 'todayCounselCount',
    width: 100,
    align: 'right',
    render: (v: number) => (
      <span className={v > 0 ? styles.highlight : undefined}>{num(v)}</span>
    ),
  },
  {
    title: '게시물',
    dataIndex: 'postCount',
    key: 'postCount',
    width: 80,
    align: 'right',
    render: num,
  },
  {
    title: '역할',
    dataIndex: 'roleCount',
    key: 'roleCount',
    width: 80,
    align: 'right',
    render: num,
  },
  {
    title: '웹사이트',
    dataIndex: 'websiteCount',
    key: 'websiteCount',
    width: 90,
    align: 'right',
    render: num,
  },
  {
    title: '차단 IP',
    dataIndex: 'blockedIpCount',
    key: 'blockedIpCount',
    width: 80,
    align: 'right',
    render: (v: number) => (
      <span className={v > 0 ? styles.warn : undefined}>{num(v)}</span>
    ),
  },
  {
    title: '차단 HP',
    dataIndex: 'blockedHpCount',
    key: 'blockedHpCount',
    width: 80,
    align: 'right',
    render: (v: number) => (
      <span className={v > 0 ? styles.warn : undefined}>{num(v)}</span>
    ),
  },
  {
    title: '금지어',
    dataIndex: 'blockedWordCount',
    key: 'blockedWordCount',
    width: 80,
    align: 'right',
    render: num,
  },
  {
    title: '활성 세션',
    dataIndex: 'activeSessionCount',
    key: 'activeSessionCount',
    width: 90,
    align: 'right',
    render: (v: number) => (
      <span className={v > 0 ? styles.highlight : undefined}>{num(v)}</span>
    ),
  },
];

const mobileKeys = new Set([
  'tenantName', 'isActive', 'userCount', 'activeUserCount', 'counselCount', 'postCount',
]);

export default function TenantStatsTable({ data }: TenantStatsTableProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function update() {
      setIsMobile(window.innerWidth <= 768);
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const columns = useMemo(
    () =>
      isMobile
        ? allColumns.filter((c) => mobileKeys.has(c.key as string)).map((c) => ({ ...c, fixed: undefined }))
        : allColumns,
    [isMobile],
  );

  return (
    <div className={styles.wrapper}>
      <Table<TenantStat>
        columns={columns}
        dataSource={data}
        rowKey="tenantId"
        pagination={false}
        scroll={isMobile ? undefined : { x: 1400 }}
        size={isMobile ? 'small' : 'middle'}
        className={styles.table}
      />
    </div>
  );
}
