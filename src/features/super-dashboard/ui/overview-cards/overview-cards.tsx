import {
  BlockOutlined,
  TeamOutlined,
  MessageOutlined,
  FileTextOutlined,
  AuditOutlined,
  LockOutlined,
  CheckCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { SuperDashboardOverview } from '../../types/super-dashboard.type';
import styles from './overview-cards.module.css';

interface OverviewCardsProps {
  data: SuperDashboardOverview;
}

const cards = [
  { key: 'totalTenants', title: '전체 테넌트', icon: <BlockOutlined />, color: '#233d7b', bg: 'rgba(35, 61, 123, 0.08)' },
  { key: 'activeTenants', title: '활성 테넌트', icon: <CheckCircleOutlined />, color: '#389e0d', bg: 'rgba(56, 158, 13, 0.08)' },
  { key: 'totalUsers', title: '전체 사용자', icon: <TeamOutlined />, color: '#1677ff', bg: 'rgba(22, 119, 255, 0.08)' },
  { key: 'activeUsers', title: '활성 사용자', icon: <UserOutlined />, color: '#13c2c2', bg: 'rgba(19, 194, 194, 0.08)' },
  { key: 'totalCounsels', title: '전체 상담', icon: <MessageOutlined />, color: '#722ed1', bg: 'rgba(114, 46, 209, 0.08)' },
  { key: 'totalPosts', title: '전체 게시물', icon: <FileTextOutlined />, color: '#fa8c16', bg: 'rgba(250, 140, 22, 0.08)' },
  { key: 'totalRoles', title: '전체 역할', icon: <AuditOutlined />, color: '#eb2f96', bg: 'rgba(235, 47, 150, 0.08)' },
  { key: 'totalPermissions', title: '전체 권한', icon: <LockOutlined />, color: '#d4b106', bg: 'rgba(212, 177, 6, 0.08)' },
] as const;

export default function OverviewCards({ data }: OverviewCardsProps) {
  return (
    <div className={styles.grid}>
      {cards.map((card) => (
        <div key={card.key} className={styles.card}>
          <div className={styles.cardTop}>
            <span className={styles.cardTitle}>{card.title}</span>
            <div className={styles.iconWrapper} style={{ background: card.bg, color: card.color }}>
              {card.icon}
            </div>
          </div>
          <div className={styles.cardValue} style={{ color: card.color }}>
            {data[card.key].toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
