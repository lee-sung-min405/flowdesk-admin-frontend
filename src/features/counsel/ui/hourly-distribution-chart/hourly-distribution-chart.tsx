import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Empty } from 'antd';
import type { HourlyDistributionItem } from '../../types/counsel.type';
import styles from './hourly-distribution-chart.module.css';

interface HourlyDistributionChartProps {
  data: HourlyDistributionItem[];
}

export default function HourlyDistributionChart({ data }: HourlyDistributionChartProps) {
  const { peakHour, avgCount } = useMemo(() => {
    if (!data.length) return { peakHour: -1, avgCount: 0 };
    let maxIdx = 0;
    let sum = 0;
    data.forEach((d, i) => {
      sum += d.count;
      if (d.count > data[maxIdx].count) maxIdx = i;
    });
    return { peakHour: data[maxIdx].hour, avgCount: sum / data.length };
  }, [data]);

  if (!data.length) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>시간대별 분포</h3>
          <span className={styles.cardDesc}>24시간 기준</span>
        </div>
        <div className={styles.chartWrapper}><Empty description="데이터 없음" /></div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.cardTitle}>시간대별 분포</h3>
          <span className={styles.cardDesc}>피크 시간: {peakHour}시</span>
        </div>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 11 }}
              tickFormatter={(h: number) => `${h}`}
              interval={1}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip
              labelFormatter={(h) => `${h}시`}
              formatter={(value) => [`${Number(value).toLocaleString()}건`, '상담']}
              contentStyle={{ borderRadius: 8, border: '1px solid var(--color-border)' }}
            />
            <ReferenceLine y={avgCount} stroke="#722ed1" strokeDasharray="3 3" strokeOpacity={0.5} />
            <Bar dataKey="count" name="상담" radius={[3, 3, 0, 0]} maxBarSize={22}>
              {data.map((entry) => (
                <Cell
                  key={entry.hour}
                  fill={entry.hour === peakHour ? '#13c2c2' : 'rgba(19, 194, 194, 0.45)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
