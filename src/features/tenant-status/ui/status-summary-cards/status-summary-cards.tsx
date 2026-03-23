import {
  AppstoreOutlined,
  TagOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import type { GetTenantStatusesResponse } from '../../types/tenant-status.type';
import styles from './status-summary-cards.module.css';

interface StatusSummaryCardsProps {
  data: GetTenantStatusesResponse | undefined;
}

export default function StatusSummaryCards({ data }: StatusSummaryCardsProps) {
  const groupCount = data?.groups.length ?? 0;
  const total = data?.total ?? 0;

  let activeCount = 0;
  let inactiveCount = 0;
  if (data) {
    for (const group of data.groups) {
      for (const item of group.items) {
        if (item.isActive) activeCount++;
        else inactiveCount++;
      }
    }
  }

  const cards = [
    {
      label: '전체 그룹',
      value: groupCount,
      icon: <AppstoreOutlined />,
      className: styles.cardDefault,
    },
    {
      label: '전체 상태',
      value: total,
      icon: <TagOutlined />,
      className: styles.cardDefault,
    },
    {
      label: '활성 상태',
      value: activeCount,
      icon: <CheckCircleOutlined />,
      className: styles.cardActive,
    },
    {
      label: '비활성 상태',
      value: inactiveCount,
      icon: <CloseCircleOutlined />,
      className: styles.cardInactive,
    },
  ];

  return (
    <div className={styles.grid}>
      {cards.map((card) => (
        <div key={card.label} className={`${styles.card} ${card.className}`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>{card.icon}</span>
            <span className={styles.cardLabel}>{card.label}</span>
          </div>
          <span className={styles.cardValue}>{card.value}</span>
        </div>
      ))}
    </div>
  );
}
