import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';
import type { DailyTrendItem } from '../../types/counsel.type';
import styles from './daily-trends-chart.module.css';

interface DailyTrendsChartProps {
  data: DailyTrendItem[];
}

export default function DailyTrendsChart({ data }: DailyTrendsChartProps) {
  const { chartData, total, avg } = useMemo(() => {
    const mapped = data.map((item) => ({ ...item, label: dayjs(item.date).format('M/D') }));
    const sum = data.reduce((s, d) => s + d.count, 0);
    return {
      chartData: mapped,
      total: sum,
      avg: data.length > 0 ? (sum / data.length).toFixed(1) : '0',
    };
  }, [data]);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.cardTitle}>일별 상담 추이</h3>
          <p className={styles.cardDesc}>기간 내 일별 상담 접수 건수</p>
        </div>
        <div className={styles.statChips}>
          <span className={styles.chip}>합계 <strong>{total.toLocaleString()}</strong>건</span>
          <span className={styles.chip}>일 평균 <strong>{avg}</strong>건</span>
        </div>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradient-daily" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#722ed1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#722ed1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip
              labelFormatter={(label) => `${label}`}
              formatter={(value) => [`${Number(value).toLocaleString()}건`, '상담 수']}
              contentStyle={{ borderRadius: 8, border: '1px solid var(--color-border)' }}
            />
            <Area
              type="monotone"
              dataKey="count"
              name="상담 수"
              stroke="#722ed1"
              strokeWidth={2}
              fill="url(#gradient-daily)"
              dot={{ r: 3, fill: '#722ed1', strokeWidth: 0 }}
              activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
