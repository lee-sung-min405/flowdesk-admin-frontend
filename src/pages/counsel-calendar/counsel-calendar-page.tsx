import { useState, useMemo } from 'react';
import { Modal, message } from 'antd';
import {
  CalendarOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import {
  ReservationCalendar,
  CounselDetail,
  useCounsels,
  useCounsel,
  useDeleteCounsel,
  useUpdateCounsel,
} from '@features/counsel';
import type { CounselListItem, GetCounselsRequest } from '@features/counsel';
import { useMe } from '@features/auth';
import { useUsers } from '@features/user';
import { useTenantStatuses } from '@features/tenant-status';
import styles from './counsel-calendar-page.module.css';

const { confirm } = Modal;

export default function CounselCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs().startOf('month'));
  const [assigneeFilter, setAssigneeFilter] = useState<number | undefined>();
  const [detailTarget, setDetailTarget] = useState<CounselListItem | null>(null);

  const { permissions } = useMe();
  const isAdmin = !!permissions['counsels.admin'];

  // 월 범위 계산
  const params = useMemo<GetCounselsRequest>(() => {
    const start = currentMonth.startOf('month');
    const end = currentMonth.endOf('month');
    return {
      page: 1,
      limit: 500,
      resvStartDate: start.format('YYYY-MM-DD'),
      resvEndDate: end.format('YYYY-MM-DD'),
      ...(assigneeFilter != null && { empSeq: assigneeFilter }),
    };
  }, [currentMonth, assigneeFilter]);

  const { data, refetch, isFetching, dataUpdatedAt } = useCounsels(params);
  const { data: detailData, isLoading: detailLoading } = useCounsel(detailTarget?.counselSeq ?? 0);
  const deleteCounsel = useDeleteCounsel();
  const updateCounsel = useUpdateCounsel();

  // 담당자 목록 (어드민만 로드)
  const { data: usersData } = useUsers({ page: 1, limit: 200 }, { enabled: isAdmin });
  const assigneeOptions = useMemo(
    () => usersData?.items.map((u) => ({ value: u.userSeq, label: u.userName })) ?? [],
    [usersData],
  );

  // 상태 옵션 (/tenants/status API에서 counsel 그룹 로드)
  const { data: tenantStatusData } = useTenantStatuses({ statusGroup: 'counsel', isActive: 1 });
  const statusOptions = useMemo(() => {
    const counselGroup = tenantStatusData?.groups?.find((g) => g.statusGroup === 'counsel');
    if (counselGroup && counselGroup.items.length > 0) {
      return counselGroup.items
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((s) => ({ value: s.tenantStatusId, label: s.statusName, color: s.color, statusKey: s.statusKey }));
    }
    return [];
  }, [tenantStatusData]);

  const handleToday = () => setCurrentMonth(dayjs().startOf('month'));

  const handleReschedule = async (counselSeq: number, newResvDtm: string) => {
    try {
      await updateCounsel.mutateAsync({ id: counselSeq, data: { counselResvDtm: newResvDtm } });
      message.success('예약 일정이 변경되었습니다.');
    } catch {
      message.error('예약 변경에 실패했습니다.');
    }
  };

  return (
    <div className={styles.page}>
      {/* ── 페이지 헤더 ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>예약 캘린더</h1>
          <p className={styles.pageDesc}>상담 예약 일정을 확인하고 관리합니다.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.todayBtn} onClick={handleToday} type="button">
            <CalendarOutlined />
            <span>오늘</span>
          </button>
          <button
            className={styles.refreshBtn}
            onClick={() => refetch()}
            disabled={isFetching}
            type="button"
          >
            <ReloadOutlined spin={isFetching} />
            <span>새로고침</span>
          </button>
          {dataUpdatedAt > 0 && (
            <span className={styles.updatedAt}>
              {dayjs(dataUpdatedAt).format('HH:mm:ss')} 기준
            </span>
          )}
        </div>
      </div>

      {/* ── 캘린더 ── */}
      <ReservationCalendar
        data={data?.items ?? []}
        currentMonth={currentMonth}
        onMonthChange={setCurrentMonth}
        onItemClick={setDetailTarget}
        onReschedule={handleReschedule}
        assigneeFilter={assigneeFilter}
        onAssigneeFilterChange={setAssigneeFilter}
        statusOptions={statusOptions}
        assigneeOptions={assigneeOptions}
        showAssigneeFilter={isAdmin}
      />

      {/* ── 상세 모달 (상담 관리와 동일) ── */}
      <Modal
        open={!!detailTarget}
        onCancel={() => setDetailTarget(null)}
        footer={null}
        destroyOnClose
        width={760}
        title={null}
        closable
        styles={{ body: { height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' } }}
        centered
      >
        <CounselDetail
          data={detailData}
          loading={detailLoading}
          statusOptions={statusOptions}
          assigneeOptions={assigneeOptions}
          onDelete={() => {
            if (!detailTarget) return;
            confirm({
              title: '상담 삭제',
              icon: <ExclamationCircleOutlined />,
              content: `상담 #${detailTarget.counselSeq}(${detailTarget.name ?? detailTarget.counselHp})을 삭제하시겠습니까?`,
              okText: '삭제',
              cancelText: '취소',
              okButtonProps: { danger: true },
              onOk: async () => {
                try {
                  await deleteCounsel.mutateAsync(detailTarget.counselSeq);
                  message.success('상담이 삭제되었습니다.');
                  setDetailTarget(null);
                } catch {
                  message.error('상담 삭제에 실패했습니다.');
                }
              },
            });
          }}
        />
      </Modal>
    </div>
  );
}
