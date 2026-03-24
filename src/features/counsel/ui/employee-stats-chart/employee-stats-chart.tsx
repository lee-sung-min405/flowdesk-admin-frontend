import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Empty } from 'antd';
import type { EmployeeStatsItem } from '../../types/counsel.type';
import styles from './employee-stats-chart.module.css';

interface EmployeeStatsChartProps {
  data: EmployeeStatsItem[];
}

export default function EmployeeStatsChart({ data }: EmployeeStatsChartProps) {
  if (!data.length) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>담당자별 현황</h3>
          <span className={styles.cardDesc}>상담 배분 현황</span>
        </div>
        <div className={styles.emptyWrapper}><Empty description="데이터 없음" /></div>
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.cardTitle}>담당자별 현황</h3>
          <span className={styles.cardDesc}>담당자 {data.length}명</span>
        </div>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="empName" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) => [`${Number(value).toLocaleString()}건`, '총 상담']}
              cursor={{ fill: 'rgba(22, 119, 255, 0.04)' }}
            />
            <Bar dataKey="count" name="총 상담" fill="#1677ff" radius={[4, 4, 0, 0]} maxBarSize={48}>
              {data.map((entry) => {
                const opacity = maxCount > 0 ? 0.4 + (entry.count / maxCount) * 0.6 : 1;
                return (
                  <Cell key={entry.empSeq} fill={`rgba(22, 119, 255, ${opacity})`} />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
