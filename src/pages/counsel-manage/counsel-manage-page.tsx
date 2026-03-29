import { useState, useMemo, useCallback } from 'react';
import { Modal, Input, Button, Select, Dropdown, message } from 'antd';
import {
  ExclamationCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
  CloseOutlined,
  DownOutlined,
  DeleteOutlined,
  SwapOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  CounselTable,
  CounselDetail,
  CounselEditForm,
  useCounsels,
  useCounsel,
  useDeleteCounsel,
  useUpdateCounsel,
  useUpdateCounselStatus,
  useCounselDashboard,
} from '@features/counsel';
import type { CounselListItem, GetCounselsRequest } from '@features/counsel';
import { useMe } from '@features/auth';
import { useUsers } from '@features/user';
import { useWebsites } from '@features/website';
import { useTenantStatuses } from '@features/tenant-status';
import styles from './counsel-manage-page.module.css';

const { confirm } = Modal;

type QuickDateFilter = 'today' | 'week' | null;
type StatFilter = number | 'duplicate' | null;

export default function CounselManagePage() {
  const [params, setParams] = useState<GetCounselsRequest>({ page: 1, limit: 20 });
  const [quickDateFilter, setQuickDateFilter] = useState<QuickDateFilter>(null);
  const [statFilter, setStatFilter] = useState<StatFilter>(null);
  const [detailTarget, setDetailTarget] = useState<CounselListItem | null>(null);
  const [editTarget, setEditTarget] = useState<CounselListItem | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  const { permissions, hasPermission } = useMe();
  const isAdmin = !!permissions['counsels.admin'];
  const canUpdate = hasPermission('counsels', 'update');
  const canDelete = hasPermission('counsels', 'delete');

  const { data, isLoading, refetch, isFetching, dataUpdatedAt } = useCounsels(params);
  const { data: dashboardData } = useCounselDashboard();
  const { data: detailData, isLoading: detailLoading } = useCounsel(detailTarget?.counselSeq ?? 0);
  const { data: editDetailData } = useCounsel(editTarget?.counselSeq ?? 0);
  const deleteCounsel = useDeleteCounsel();
  const updateCounsel = useUpdateCounsel();
  const updateCounselStatus = useUpdateCounselStatus();

  // 담당자 목록 (어드민만 로드)
  const { data: usersData } = useUsers({}, { enabled: isAdmin });
  const assigneeOptions = useMemo(
    () => usersData?.items.map((u) => ({ value: u.userSeq, label: u.userName })) ?? [],
    [usersData],
  );

  // 웹사이트 목록
  const { data: websitesData } = useWebsites({});
  const websiteOptions = useMemo(
    () => websitesData?.items.map((w) => ({ value: w.webCode, label: w.webTitle || w.webCode })) ?? [],
    [websitesData],
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

  const handleAssign = async (counselSeq: number, empSeq: number | null) => {
    try {
      await updateCounsel.mutateAsync({ id: counselSeq, data: { empSeq } });
      message.success('담당자가 변경되었습니다.');
    } catch {
      message.error('담당자 변경에 실패했습니다.');
    }
  };

  /* ── Stat card counts ── */
  const totalCount = dashboardData?.summary?.totalCounsels ?? 0;
  const statusDistribution = dashboardData?.statusDistribution ?? [];

  const VISIBLE_STATUS_KEYS = ['NEW', 'DUPLICATE', 'IN_PROGRESS', 'SCHEDULED', 'CONTACTED'];
  const statCards = useMemo(() => {
    const distributionMap = new Map(statusDistribution.map((s) => [s.counselStat, s.count]));
    return statusOptions
      .filter((o) => o.statusKey && VISIBLE_STATUS_KEYS.includes(o.statusKey))
      .map((o) => ({
        counselStat: o.value as number,
        statusName: o.label,
        color: o.color || '#9ca3af',
        statusKey: o.statusKey,
        count: distributionMap.get(o.value as number) ?? 0,
      }));
  }, [statusOptions, statusDistribution]);

  /* ── Handlers ── */
  const handleSearch = (value: string) => {
    setParams((prev) => ({ ...prev, q: value || undefined, page: 1 }));
  };

  const handleQuickDateFilter = (filter: QuickDateFilter) => {
    const next = quickDateFilter === filter ? null : filter;
    setQuickDateFilter(next);

    setParams((prev) => {
      const updated: GetCounselsRequest = { ...prev, page: 1 };
      delete updated.startDate;
      delete updated.endDate;

      if (next === 'today') {
        updated.startDate = dayjs().format('YYYY-MM-DD');
        updated.endDate = dayjs().format('YYYY-MM-DD');
      } else if (next === 'week') {
        updated.startDate = dayjs().subtract(6, 'day').format('YYYY-MM-DD');
        updated.endDate = dayjs().format('YYYY-MM-DD');
      }

      return updated;
    });
  };

  const handleStatFilter = (filter: StatFilter) => {
    const next = statFilter === filter ? null : filter;
    setStatFilter(next);

    setParams((prev) => {
      const updated: GetCounselsRequest = { ...prev, page: 1 };
      delete updated.counselStat;
      delete updated.duplicateState;

      if (typeof next === 'number') {
        updated.counselStat = next;
      } else if (next === 'duplicate') {
        updated.duplicateState = 'Y';
      }

      return updated;
    });
  };

  const handleDelete = (item: CounselListItem) => {
    confirm({
      title: '상담 삭제',
      icon: <ExclamationCircleOutlined />,
      content: `상담 #${item.counselSeq}(${item.name ?? item.counselHp})을 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteCounsel.mutateAsync(item.counselSeq);
          message.success('상담이 삭제되었습니다.');
        } catch {
          message.error('상담 삭제에 실패했습니다.');
        }
      },
    });
  };

  /* ── Bulk handlers ── */
  const executeBulk = useCallback(
    async (
      action: (key: React.Key) => Promise<unknown>,
      successLabel: string,
      failLabel: string,
    ) => {
      let success = 0;
      let fail = 0;
      for (const key of selectedKeys) {
        try {
          await action(key);
          success++;
        } catch {
          fail++;
        }
      }
      if (success > 0) message.success(`${success}${successLabel}`);
      if (fail > 0) message.error(`${fail}${failLabel}`);
      setSelectedKeys([]);
    },
    [selectedKeys],
  );

  const handleBulkStatusChange = useCallback((statusValue: number) => {
    const count = selectedKeys.length;
    confirm({
      title: '일괄 상태 변경',
      icon: <ExclamationCircleOutlined />,
      content: `선택된 ${count}건의 상담 상태를 변경하시겠습니까?`,
      okText: '변경',
      cancelText: '취소',
      onOk: () => executeBulk(
        (key) => updateCounselStatus.mutateAsync({ id: Number(key), data: { counselStat: statusValue } }),
        '건의 상태가 변경되었습니다.',
        '건의 변경에 실패했습니다.',
      ),
    });
  }, [selectedKeys, executeBulk, updateCounselStatus]);

  const handleBulkAssign = useCallback((empSeq: number | null) => {
    const count = selectedKeys.length;
    const actionLabel = empSeq === null ? '미배정으로' : '담당자를';
    confirm({
      title: '일괄 담당자 변경',
      icon: <ExclamationCircleOutlined />,
      content: `선택된 ${count}건의 ${actionLabel} 변경하시겠습니까?`,
      okText: '변경',
      cancelText: '취소',
      onOk: () => executeBulk(
        (key) => updateCounsel.mutateAsync({ id: Number(key), data: { empSeq } }),
        '건의 담당자가 변경되었습니다.',
        '건의 변경에 실패했습니다.',
      ),
    });
  }, [selectedKeys, executeBulk, updateCounsel]);

  const handleBulkDelete = useCallback(() => {
    const count = selectedKeys.length;
    confirm({
      title: '일괄 삭제',
      icon: <ExclamationCircleOutlined />,
      content: `선택된 ${count}건의 상담을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      okText: '삭제',
      cancelText: '취소',
      okButtonProps: { danger: true },
      onOk: () => executeBulk(
        (key) => deleteCounsel.mutateAsync(Number(key)),
        '건의 상담이 삭제되었습니다.',
        '건의 삭제에 실패했습니다.',
      ),
    });
  }, [selectedKeys, executeBulk, deleteCounsel]);

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>상담 관리</h1>
          <p className={styles.pageDesc}>상담 데이터를 조회하고 관리할 수 있습니다.</p>
        </div>
        <div className={styles.headerActions}>
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

      {/* ── Stat Filter Cards ── */}
      <div className={styles.statCards}>
        <div
          className={`${styles.statCard} ${statFilter === null ? styles.statCardActive : ''}`}
          style={{ '--accent-color': 'var(--color-primary)' } as React.CSSProperties}
          onClick={() => handleStatFilter(null)}
        >
          <span className={styles.statCardLabel}>총 상담</span>
          <span className={styles.statCardCount}>{totalCount}</span>
          <span className={styles.statCardLink}>전체 보기</span>
        </div>
        {statCards.map((s) => {
          const isDuplicate = s.statusKey === 'DUPLICATE';
          const filterKey = isDuplicate ? 'duplicate' as const : s.counselStat;
          const isActive = statFilter === filterKey;
          return (
            <div
              key={s.counselStat}
              className={`${styles.statCard} ${isActive ? styles.statCardActive : ''}`}
              style={{
                '--accent-color': s.color,
                ...(isActive
                  ? { borderColor: s.color, background: `${s.color}08` }
                  : {}),
              } as React.CSSProperties}
              onClick={() => handleStatFilter(filterKey)}
            >
              <span className={styles.statCardLabel}>{s.statusName}</span>
              <span className={styles.statCardCount} style={{ color: s.color }}>
                {s.count}
              </span>
              <span className={styles.statCardLink}>{s.statusName}만 보기</span>
            </div>
          );
        })}
      </div>

      {/* ── Quick Filter Bar ── */}
      <div className={styles.filterBar}>
        <Button
          type={quickDateFilter === 'today' ? 'primary' : 'default'}
          onClick={() => handleQuickDateFilter('today')}
        >
          오늘
        </Button>
        <Button
          type={quickDateFilter === 'week' ? 'primary' : 'default'}
          onClick={() => handleQuickDateFilter('week')}
        >
          최근 7일
        </Button>

        <div className={styles.filterDivider} />

        <Select
          className={styles.filterSelect}
          placeholder="상태"
          allowClear
          options={statusOptions}
          value={params.counselStat}
          onChange={(val) => {
            setStatFilter(val ?? null);
            setParams((prev) => {
              const updated = { ...prev, page: 1 };
              if (val != null) {
                updated.counselStat = val;
                delete updated.duplicateState;
              } else {
                delete updated.counselStat;
              }
              return updated;
            });
          }}
        />
        {isAdmin && (
          <Select
            className={styles.filterSelect}
            placeholder="담당자"
            allowClear
            showSearch
            optionFilterProp="label"
            options={assigneeOptions}
            value={params.empSeq != null ? params.empSeq : undefined}
            onChange={(val) => {
              setParams((prev) => {
                const updated = { ...prev, page: 1 };
                if (val != null) {
                  updated.empSeq = val;
                } else {
                  delete updated.empSeq;
                }
                return updated;
              });
            }}
          />
        )}
        <Select
          className={styles.filterSelect}
          placeholder="웹사이트"
          allowClear
          showSearch
          optionFilterProp="label"
          options={websiteOptions}
          value={params.webCode || undefined}
          onChange={(val) =>
            setParams((prev) => {
              const updated = { ...prev, page: 1 };
              if (val) {
                updated.webCode = val;
              } else {
                delete updated.webCode;
              }
              return updated;
            })
          }
        />

        <Input
          className={styles.searchInput}
          placeholder="이름, 연락처 검색..."
          prefix={<SearchOutlined />}
          allowClear
          onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
          onChange={(e) => {
            if (!e.target.value) handleSearch('');
          }}
        />
      </div>

      {/* ── Table ── */}
      <div className={styles.card}>
        <CounselTable
          data={data}
          loading={isLoading}
          params={params}
          onParamsChange={setParams}
          onDetail={setDetailTarget}
          onEdit={setEditTarget}
          onDelete={handleDelete}
          hasAdmin={isAdmin}
          assigneeOptions={assigneeOptions}
          onAssign={handleAssign}
          statusOptions={statusOptions}
          onStatusChangeInline={async (counselSeq, counselStat, counselResvDtm) => {
            try {
              await updateCounselStatus.mutateAsync({
                id: counselSeq,
                data: { counselStat, ...(counselResvDtm ? { counselResvDtm } : {}) },
              });
              message.success('상태가 변경되었습니다.');
            } catch {
              message.error('상태 변경에 실패했습니다.');
            }
          }}
          selectedRowKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          canUpdate={canUpdate}
          canDelete={canDelete}
        />
      </div>

      {/* 상세 보기 모달 */}
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
          canDelete={canDelete}
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

      {/* 수정 모달 */}
      <Modal
        title="상담 수정"
        open={!!editTarget}
        onCancel={() => setEditTarget(null)}
        footer={null}
        destroyOnClose
        width={600}
      >
        {editTarget && editDetailData && (
          <CounselEditForm
            counselSeq={editTarget.counselSeq}
            defaultValues={{
              name: editDetailData.name ?? '',
              counselHp: editDetailData.counselHp,
              counselSource: editDetailData.counselSource ?? '',
              counselMedium: editDetailData.counselMedium ?? '',
              counselCampaign: editDetailData.counselCampaign ?? '',
              counselMemo: editDetailData.counselMemo ?? '',
            }}
            onSuccess={() => {
              setEditTarget(null);
              message.success('상담이 수정되었습니다.');
            }}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>

      {/* ── Bulk Action Bar ── */}
      {selectedKeys.length > 0 && (
        <div className={styles.bulkBar}>
          <span className={styles.bulkCount}>{selectedKeys.length}개 선택됨</span>
          <span className={styles.bulkDivider} />
          <button className={styles.bulkBtn} onClick={() => setSelectedKeys([])}>
            <CloseOutlined /> 선택 해제
          </button>
          <span className={styles.bulkDivider} />
          <Dropdown
            menu={{
              items: (statusOptions ?? []).map((opt) => ({
                key: `status-${opt.value}`,
                label: opt.label,
                icon: <SwapOutlined />,
                onClick: () => handleBulkStatusChange(opt.value as number),
              })),
            }}
            trigger={['click']}
          >
            <button className={styles.bulkBtn}>
              <SwapOutlined /> 상태 변경 <DownOutlined style={{ fontSize: 10 }} />
            </button>
          </Dropdown>
          {isAdmin && assigneeOptions && assigneeOptions.length > 0 && (
            <>
              <span className={styles.bulkDivider} />
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'assign-unassign',
                      label: '미배정',
                      icon: <CloseOutlined />,
                      onClick: () => handleBulkAssign(null),
                    },
                    { type: 'divider' as const, key: 'assign-divider' },
                    ...assigneeOptions.map((opt) => ({
                      key: `assign-${opt.value}`,
                      label: opt.label,
                      icon: <UserSwitchOutlined />,
                      onClick: () => handleBulkAssign(opt.value as number),
                    })),
                  ],
                }}
                trigger={['click']}
              >
                <button className={styles.bulkBtn}>
                  <UserSwitchOutlined /> 담당자 변경 <DownOutlined style={{ fontSize: 10 }} />
                </button>
              </Dropdown>
            </>
          )}
          {canDelete && (
            <>
              <span className={styles.bulkDivider} />
              <button className={`${styles.bulkBtn} ${styles.bulkDanger}`} onClick={handleBulkDelete}>
                <DeleteOutlined /> 삭제
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
