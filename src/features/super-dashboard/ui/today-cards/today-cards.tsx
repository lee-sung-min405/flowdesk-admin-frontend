import {
  UserAddOutlined,
  MessageOutlined,
  FileAddOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import type { SuperDashboardToday } from '../../types/super-dashboard.type';
import styles from './today-cards.module.css';

interface TodayCardsProps {
  data: SuperDashboardToday;
}

const cards = [
  { key: 'newUsers', title: '신규 사용자', icon: <UserAddOutlined />, color: '#1677ff' },
  { key: 'newCounsels', title: '신규 상담', icon: <MessageOutlined />, color: '#722ed1' },
  { key: 'newPosts', title: '신규 게시물', icon: <FileAddOutlined />, color: '#fa8c16' },
  { key: 'activeSessions', title: '활성 세션', icon: <ApiOutlined />, color: '#52c41a' },
] as const;

export default function TodayCards({ data }: TodayCardsProps) {
  return (
    <div className={styles.list}>
      {cards.map((card) => (
        <div key={card.key} className={styles.item}>
          <div className={styles.itemLeft}>
            <div className={styles.dot} style={{ background: card.color }} />
            <span className={styles.itemIcon} style={{ color: card.color }}>{card.icon}</span>
            <span className={styles.itemTitle}>{card.title}</span>
          </div>
          <span className={styles.itemValue}>{data[card.key].toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
