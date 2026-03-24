import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Empty } from 'antd';
import type { WebsiteStatsItem } from '../../types/counsel.type';
import styles from './top-websites-chart.module.css';

interface TopWebsitesChartProps {
  data: WebsiteStatsItem[];
}

const BAR_COLORS = ['#fa8c16', '#faad14', '#ffc53d', '#ffd666', '#ffe58f'];

export default function TopWebsitesChart({ data }: TopWebsitesChartProps) {
  const chartData = useMemo(
    () => data.map((item, i) => ({
      ...item,
      name: item.webTitle || item.webCode,
      rank: i + 1,
    })),
    [data],
  );

  if (!data.length) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>웹사이트별 상담</h3>
          <span className={styles.cardDesc}>Top 5</span>
        </div>
        <div className={styles.emptyWrapper}><Empty description="데이터 없음" /></div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>웹사이트별 상담</h3>
        <span className={styles.cardBadge}>Top {data.length}</span>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) => [`${Number(value).toLocaleString()}건`, '상담 수']}
              contentStyle={{ borderRadius: 8, border: '1px solid var(--color-border)' }}
            />
            <Bar dataKey="count" name="상담 수" radius={[0, 4, 4, 0]} maxBarSize={28}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i] || BAR_COLORS[BAR_COLORS.length - 1]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
