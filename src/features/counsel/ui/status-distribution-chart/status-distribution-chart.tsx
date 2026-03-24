import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Empty } from 'antd';
import type { StatusDistributionItem } from '../../types/counsel.type';
import styles from './status-distribution-chart.module.css';

interface StatusDistributionChartProps {
  data: StatusDistributionItem[];
}

const DEFAULT_COLORS = ['#233d7b', '#1677ff', '#389e0d', '#fa8c16', '#722ed1', '#eb2f96', '#13c2c2', '#d4b106'];

export default function StatusDistributionChart({ data }: StatusDistributionChartProps) {
  const total = useMemo(() => data.reduce((sum, d) => sum + d.count, 0), [data]);

  if (!data.length) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>상태별 분포</h3>
          <span className={styles.cardDesc}>상담 상태 비율</span>
        </div>
        <div className={styles.emptyWrapper}><Empty description="데이터 없음" /></div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>상태별 분포</h3>
        <span className={styles.cardDesc}>총 {total.toLocaleString()}건</span>
      </div>
      <div className={styles.body}>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={88}
                paddingAngle={2}
                dataKey="count"
                nameKey="statusName"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.counselStat}
                    fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${Number(value).toLocaleString()}건`, `${name}`]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.legendList}>
          {data.map((item, index) => {
            const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0.0';
            const color = item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
            return (
              <div key={item.counselStat} className={styles.legendItem}>
                <div className={styles.legendLeft}>
                  <span className={styles.legendDot} style={{ background: color }} />
                  <span className={styles.legendName}>{item.statusName}</span>
                </div>
                <div className={styles.legendRight}>
                  <span className={styles.legendCount}>{item.count.toLocaleString()}</span>
                  <span className={styles.legendPct}>{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
