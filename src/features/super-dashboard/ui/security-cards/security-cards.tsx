import {
  StopOutlined,
  PhoneOutlined,
  EditOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { SuperDashboardSecurity } from '../../types/super-dashboard.type';
import styles from './security-cards.module.css';

interface SecurityCardsProps {
  data: SuperDashboardSecurity;
}

const totalCards = [
  { key: 'totalBlockedIps', title: '차단 IP', icon: <StopOutlined />, color: '#f5222d' },
  { key: 'totalBlockedHps', title: '차단 휴대폰', icon: <PhoneOutlined />, color: '#fa541c' },
  { key: 'totalBlockedWords', title: '금지어', icon: <EditOutlined />, color: '#fa8c16' },
] as const;

const recentCards = [
  { key: 'recentBlockedIps', title: '최근 차단 IP', icon: <WarningOutlined />, color: '#cf1322' },
  { key: 'recentBlockedHps', title: '최근 차단 휴대폰', icon: <ExclamationCircleOutlined />, color: '#ad2102' },
] as const;

export default function SecurityCards({ data }: SecurityCardsProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {totalCards.map((card) => (
          <div key={card.key} className={styles.card}>
            <div className={styles.cardIcon} style={{ color: card.color, background: `${card.color}10` }}>
              {card.icon}
            </div>
            <span className={styles.cardTitle}>{card.title}</span>
            <span className={styles.cardValue}>{data[card.key].toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className={styles.recentGroup}>
        <span className={styles.recentLabel}>최근 감지</span>
        <div className={styles.recentGrid}>
          {recentCards.map((card) => (
            <div key={card.key} className={styles.recentItem}>
              <span className={styles.recentIcon} style={{ color: card.color }}>{card.icon}</span>
              <span className={styles.recentTitle}>{card.title}</span>
              <span className={styles.recentValue}>{data[card.key].toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
