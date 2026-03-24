import {
  PhoneOutlined,
  RiseOutlined,
  CheckCircleOutlined,
  PercentageOutlined,
} from '@ant-design/icons';
import { Progress } from 'antd';
import type { CounselDashboardSummary } from '../../types/counsel.type';
import styles from './summary-cards.module.css';

interface SummaryCardsProps {
  data: CounselDashboardSummary;
}

const statCards = [
  { key: 'totalCounsels', title: '총 상담 건수', desc: '조회 기간 전체', unit: '건', icon: <PhoneOutlined />, color: '#233d7b', bg: 'rgba(35, 61, 123, 0.06)' },
  { key: 'newCounsels', title: '신규 상담', desc: '미처리 상담', unit: '건', icon: <RiseOutlined />, color: '#1677ff', bg: 'rgba(22, 119, 255, 0.06)' },
  { key: 'completedCounsels', title: '완료 상담', desc: '처리 완료', unit: '건', icon: <CheckCircleOutlined />, color: '#389e0d', bg: 'rgba(56, 158, 13, 0.06)' },
] as const;

export default function SummaryCards({ data }: SummaryCardsProps) {
  return (
    <div className={styles.grid}>
      {statCards.map((card) => (
        <div key={card.key} className={styles.card}>
          <div className={styles.iconWrapper} style={{ background: card.bg, color: card.color }}>
            {card.icon}
          </div>
          <div className={styles.cardContent}>
            <span className={styles.cardTitle}>{card.title}</span>
            <div className={styles.cardValue} style={{ color: card.color }}>
              {data[card.key].toLocaleString()}
              <span className={styles.cardUnit}>{card.unit}</span>
            </div>
            <span className={styles.cardDesc}>{card.desc}</span>
          </div>
        </div>
      ))}

      {/* 완료율 — Progress ring */}
      <div className={styles.card}>
        <div className={styles.completionContent}>
          <div className={styles.completionLeft}>
            <div className={styles.iconWrapper} style={{ background: 'rgba(114, 46, 209, 0.06)', color: '#722ed1' }}>
              <PercentageOutlined />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardTitle}>완료율</span>
              <div className={styles.cardValue} style={{ color: '#722ed1' }}>
                {data.completionRate.toFixed(1)}
                <span className={styles.cardUnit}>%</span>
              </div>
              <span className={styles.cardDesc}>완료 / 전체</span>
            </div>
          </div>
          <Progress
            type="circle"
            percent={Math.round(data.completionRate)}
            size={64}
            strokeColor="#722ed1"
            trailColor="rgba(114, 46, 209, 0.08)"
            format={(p) => `${p}%`}
          />
        </div>
      </div>
    </div>
  );
}
