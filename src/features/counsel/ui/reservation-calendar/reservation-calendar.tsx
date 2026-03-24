import { useMemo, useState, useCallback, useRef } from 'react';
import { Select, Modal, TimePicker } from 'antd';
import { LeftOutlined, RightOutlined, ClockCircleOutlined, SwapRightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import type { CounselListItem } from '../../types/counsel.type';
import styles from './reservation-calendar.module.css';

const MAX_VISIBLE = 2;

interface AssigneeOption {
  value: number;
  label: string;
}

interface StatusOption {
  value: number;
  label: string;
  color?: string | null;
  statusKey?: string;
}

interface ReservationCalendarProps {
  data: CounselListItem[];
  currentMonth: Dayjs;
  onMonthChange: (month: Dayjs) => void;
  onItemClick: (item: CounselListItem) => void;
  onReschedule?: (counselSeq: number, newResvDtm: string) => void;
  assigneeFilter?: number;
  onAssigneeFilterChange?: (value: number | undefined) => void;
  statusOptions?: StatusOption[];
  assigneeOptions?: AssigneeOption[];
  showAssigneeFilter?: boolean;
}

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function getCalendarDays(month: Dayjs) {
  const start = month.startOf('month');
  const end = month.endOf('month');
  const startDay = start.day();
  const days: { date: Dayjs; isCurrentMonth: boolean }[] = [];

  // 이전 달 패딩
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({ date: start.subtract(i + 1, 'day'), isCurrentMonth: false });
  }

  // 현재 달
  for (let d = start; d.isBefore(end) || d.isSame(end, 'day'); d = d.add(1, 'day')) {
    days.push({ date: d, isCurrentMonth: true });
  }

  // 다음 달 패딩 (6주까지)
  const remaining = 42 - days.length;
  const lastDay = end;
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: lastDay.add(i, 'day'), isCurrentMonth: false });
  }

  return days;
}

export default function ReservationCalendar({
  data,
  currentMonth,
  onMonthChange,
  onItemClick,
  onReschedule,
  assigneeFilter,
  onAssigneeFilterChange,
  statusOptions = [],
  assigneeOptions = [],
  showAssigneeFilter = false,
}: ReservationCalendarProps) {
  const today = dayjs();
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [pendingReschedule, setPendingReschedule] = useState<{
    item: CounselListItem;
    newDate: string;
    newTime: Dayjs;
  } | null>(null);
  const dragItemRef = useRef<CounselListItem | null>(null);
  const didDragRef = useRef(false);

  const calendarDays = useMemo(() => getCalendarDays(currentMonth), [currentMonth]);

  // 날짜별 예약 그룹핑
  const resvByDate = useMemo(() => {
    const map = new Map<string, CounselListItem[]>();
    for (const item of data) {
      if (!item.counselResvDtm) continue;
      const key = dayjs(item.counselResvDtm).format('YYYY-MM-DD');
      const arr = map.get(key) ?? [];
      arr.push(item);
      map.set(key, arr);
    }
    // 각 날짜 내 시간순 정렬
    for (const [, arr] of map) {
      arr.sort((a, b) => dayjs(a.counselResvDtm!).valueOf() - dayjs(b.counselResvDtm!).valueOf());
    }
    return map;
  }, [data]);

  const monthResvCount = data.filter((d) => d.counselResvDtm).length;

  const getStatusColor = (counselStat: number): string => {
    return statusOptions.find((o) => o.value === counselStat)?.color || '#233d7b';
  };

  /* ── 드래그 앤 드롭 핸들러 ── */
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, item: CounselListItem) => {
      dragItemRef.current = item;
      didDragRef.current = true;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(item.counselSeq));
      e.currentTarget.dataset.dragging = 'true';
    },
    [],
  );

  const handleDragEnd = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.dataset.dragging = '';
    dragItemRef.current = null;
    setDragOverDate(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>, dateKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDate(dateKey);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragOverDate(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, dateKey: string) => {
      e.preventDefault();
      setDragOverDate(null);

      const item = dragItemRef.current;
      dragItemRef.current = null;
      if (!item?.counselResvDtm || !onReschedule) return;

      const origDate = dayjs(item.counselResvDtm).format('YYYY-MM-DD');
      if (origDate === dateKey) return;

      // 확인 모달 표시 (시간 수정 가능)
      const origTime = dayjs(item.counselResvDtm);
      setPendingReschedule({
        item,
        newDate: dateKey,
        newTime: dayjs(`${dateKey} ${origTime.format('HH:mm:ss')}`),
      });
    },
    [onReschedule],
  );

  const handleConfirmReschedule = useCallback(() => {
    if (!pendingReschedule || !onReschedule) return;
    const { item, newTime } = pendingReschedule;
    onReschedule(item.counselSeq, newTime.format('YYYY-MM-DD HH:mm:ss'));
    setPendingReschedule(null);
  }, [pendingReschedule, onReschedule]);

  const handleCardClick = useCallback(
    (item: CounselListItem) => {
      // 드래그 직후 click 이벤트 무시
      if (didDragRef.current) {
        didDragRef.current = false;
        return;
      }
      onItemClick(item);
    },
    [onItemClick],
  );

  return (
    <div className={styles.calendarWrapper}>
      {/* ── 네비게이션 바 ── */}
      <div className={styles.navBar}>
        <div className={styles.navLeft}>
          <button
            className={styles.navBtn}
            onClick={() => onMonthChange(currentMonth.subtract(1, 'month'))}
            type="button"
          >
            <LeftOutlined />
          </button>
          <span className={styles.monthLabel}>
            {currentMonth.format('YYYY년 M월')}
          </span>
          <button
            className={styles.navBtn}
            onClick={() => onMonthChange(currentMonth.add(1, 'month'))}
            type="button"
          >
            <RightOutlined />
          </button>
        </div>
        <div className={styles.navRight}>
          {showAssigneeFilter && (
            <Select
              className={styles.filterSelect}
              placeholder="모든 담당자"
              allowClear
              showSearch
              optionFilterProp="label"
              options={assigneeOptions}
              value={assigneeFilter}
              onChange={(val) => onAssigneeFilterChange?.(val ?? undefined)}
            />
          )}
        </div>
      </div>

      {/* ── 범례 ── */}
      <div className={styles.legendBar}>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: 'var(--color-primary)' }} />
          오늘
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: '#a855f7' }} />
          예약 있음
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: '#d1d5db' }} />
          지난 날짜
        </span>
        <span className={styles.legendSpacer} />
        <span className={styles.monthCount}>이번 달 예약: {monthResvCount}건</span>
      </div>

      {/* ── 캘린더 그리드 ── */}
      <div className={styles.calendarGrid}>
        {/* 요일 헤더 */}
        {DAY_LABELS.map((label) => (
          <div key={label} className={styles.dayHeader}>{label}</div>
        ))}

        {/* 날짜 셀 */}
        {calendarDays.map(({ date, isCurrentMonth }) => {
          const dateKey = date.format('YYYY-MM-DD');
          const isToday = date.isSame(today, 'day');
          const isPast = date.isBefore(today, 'day');
          const dayOfWeek = date.day();
          const items = resvByDate.get(dateKey) ?? [];
          const isExpanded = expandedDates.has(dateKey);
          const visible = isExpanded ? items : items.slice(0, MAX_VISIBLE);
          const overflow = items.length - MAX_VISIBLE;

          const cellClass = [
            styles.dayCell,
            !isCurrentMonth && styles.dayOtherMonth,
            isCurrentMonth && isPast && styles.dayCellPast,
            isCurrentMonth && isToday && styles.dayCellToday,
            dragOverDate === dateKey && styles.dayCellDragOver,
          ].filter(Boolean).join(' ');

          const numClass = [
            styles.dayNum,
            isToday && styles.dayNumToday,
            !isToday && dayOfWeek === 0 && styles.dayNumSunday,
            !isToday && dayOfWeek === 6 && styles.dayNumSaturday,
          ].filter(Boolean).join(' ');

          return (
            <div
              key={dateKey}
              className={cellClass}
              onDragOver={(e) => handleDragOver(e, dateKey)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, dateKey)}
            >
              <div className={styles.dayNumber}>
                <span className={numClass}>{date.date()}</span>
                {isCurrentMonth && items.length > 0 && (
                  <span className={styles.dayBadge}>{items.length}</span>
                )}
              </div>
              {isCurrentMonth && visible.map((item) => {
                const color = getStatusColor(item.counselStat);
                return (
                  <div
                    key={item.counselSeq}
                    className={styles.resvCard}
                    style={{
                      '--accent-color': color,
                      '--accent-bg': `${color}10`,
                    } as React.CSSProperties}
                    onClick={() => handleCardClick(item)}
                    draggable={!!onReschedule}
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragEnd={handleDragEnd}
                  >
                    <span className={styles.resvTime}>
                      {dayjs(item.counselResvDtm!).format('HH:mm')}{' '}
                      {item.name ?? item.counselHp}
                    </span>
                    <span className={styles.resvName}>{item.counselHp}</span>
                  </div>
                );
              })}
              {isCurrentMonth && overflow > 0 && (
                <span
                  className={styles.moreLink}
                  onClick={() =>
                    setExpandedDates((prev) => {
                      const next = new Set(prev);
                      if (next.has(dateKey)) next.delete(dateKey);
                      else next.add(dateKey);
                      return next;
                    })
                  }
                >
                  {isExpanded ? '접기' : `+${overflow}건 더보기`}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── 예약 변경 확인 모달 ── */}
      {pendingReschedule && (
        <Modal
          open
          title="예약 일정 변경"
          okText="변경"
          cancelText="취소"
          onOk={handleConfirmReschedule}
          onCancel={() => setPendingReschedule(null)}
          width={400}
          centered
          destroyOnClose
        >
          <div className={styles.rescheduleModal}>
            <div className={styles.rescheduleInfo}>
              <span className={styles.rescheduleLabel}>
                {pendingReschedule.item.name ?? pendingReschedule.item.counselHp}
              </span>
              <span className={styles.rescheduleSub}>
                {pendingReschedule.item.counselHp}
              </span>
            </div>
            <div className={styles.rescheduleChange}>
              <div className={styles.rescheduleFrom}>
                <span className={styles.rescheduleTag}>변경 전</span>
                <span>{dayjs(pendingReschedule.item.counselResvDtm!).format('YYYY-MM-DD (ddd) HH:mm')}</span>
              </div>
              <SwapRightOutlined className={styles.rescheduleArrow} />
              <div className={styles.rescheduleTo}>
                <span className={styles.rescheduleTag}>변경 후</span>
                <span>{dayjs(pendingReschedule.newDate).format('YYYY-MM-DD (ddd)')}</span>
              </div>
            </div>
            <div className={styles.rescheduleTimePicker}>
              <ClockCircleOutlined />
              <span>시간 선택</span>
              <TimePicker
                value={pendingReschedule.newTime}
                format="HH:mm"
                minuteStep={5}
                onChange={(time) => {
                  if (time) {
                    setPendingReschedule((prev) =>
                      prev ? { ...prev, newTime: prev.newTime.hour(time.hour()).minute(time.minute()) } : null,
                    );
                  }
                }}
                allowClear={false}
                style={{ flex: 1 }}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
