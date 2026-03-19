import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { TooltipContentProps } from 'recharts/types/component/Tooltip';
import type { TooltipPayloadEntry } from 'recharts/types/state/tooltipSlice';
import dayjs from 'dayjs';
import type { SuperDashboardMonthlyTrends } from '../../types/super-dashboard.type';
import styles from './monthly-trends-chart.module.css';

interface MonthlyTrendsChartProps {
  data: SuperDashboardMonthlyTrends;
}

const SERIES = [
  { dataKey: 'users', name: '사용자 가입', color: '#1677ff' },
  { dataKey: 'counsels', name: '상담 등록', color: '#722ed1' },
  { dataKey: 'tenants', name: '테넌트 등록', color: '#52c41a' },
] as const;

function useChartHeight() {
  const [height, setHeight] = useState(360);

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w <= 576) setHeight(240);
      else if (w <= 768) setHeight(300);
      else setHeight(360);
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return height;
}

function CustomTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipLabel}>{label}</div>
      {payload.map((entry: TooltipPayloadEntry) => (
        <div key={String(entry.dataKey)} className={styles.tooltipRow}>
          <span className={styles.tooltipDot} style={{ background: entry.color }} />
          <span className={styles.tooltipName}>{entry.name}</span>
          <span className={styles.tooltipValue}>{entry.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export default function MonthlyTrendsChart({ data }: MonthlyTrendsChartProps) {
  const chartHeight = useChartHeight();
  const isMobile = chartHeight <= 240;

  const chartData = useMemo(() => {
    return data.userRegistrations.map((item, index) => ({
      month: dayjs(item.month).format('YY.MM'),
      users: item.count,
      counsels: data.counselRegistrations[index]?.count ?? 0,
      tenants: data.tenantRegistrations[index]?.count ?? 0,
    }));
  }, [data]);

  const renderTooltip = useCallback((props: TooltipContentProps) => (
    <CustomTooltip {...props} />
  ), []);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.cardTitle}>월별 트렌드</h3>
          <p className={styles.cardDesc}>최근 12개월 주요 지표 추이</p>
        </div>
        <div className={styles.legendCustom}>
          {SERIES.map((s) => (
            <span key={s.dataKey} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: s.color }} />
              {s.name}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <AreaChart data={chartData} margin={{ top: 8, right: isMobile ? 8 : 24, left: isMobile ? -16 : 0, bottom: 0 }}>
            <defs>
              {SERIES.map((s) => (
                <linearGradient key={s.dataKey} id={`gradient-${s.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: isMobile ? 10 : 12, fill: '#8c8c8c' }}
              axisLine={{ stroke: '#f0f0f0' }}
              tickLine={false}
              interval={isMobile ? 2 : 0}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: isMobile ? 10 : 12, fill: '#8c8c8c' }}
              axisLine={false}
              tickLine={false}
              width={isMobile ? 28 : 40}
            />
            <Tooltip content={renderTooltip} />
            <Legend content={() => null} />
            {SERIES.map((s) => (
              <Area
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                name={s.name}
                stroke={s.color}
                strokeWidth={2}
                fill={`url(#gradient-${s.dataKey})`}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2, fill: '#fff', stroke: s.color }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
