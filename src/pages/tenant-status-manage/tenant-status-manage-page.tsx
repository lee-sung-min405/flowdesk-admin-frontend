import { useState } from 'react';
import { Button, Input, Select, Modal, Spin, message } from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  StatusSummaryCards,
  StatusGroupList,
  StatusCreateForm,
  StatusDetail,
  StatusEditForm,
  useTenantStatuses,
  useTenantStatus,
  useUpdateTenantStatusActive,
  useDeleteTenantStatus,
} from '@features/tenant-status';
import type { GetTenantStatusesRequest, TenantStatus } from '@features/tenant-status';
import styles from './tenant-status-manage-page.module.css';

const { confirm } = Modal;

export default function TenantStatusManagePage() {
  const [params, setParams] = useState<GetTenantStatusesRequest>({});
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState<TenantStatus | null>(null);
  const [editTarget, setEditTarget] = useState<TenantStatus | null>(null);

  const { data, isLoading, refetch } = useTenantStatuses(params);
  const { data: detailData, isLoading: detailLoading } = useTenantStatus(
    detailTarget?.tenantStatusId ?? 0,
  );
  const updateActive = useUpdateTenantStatusActive();
  const deleteTenantStatus = useDeleteTenantStatus();

  const handleSearch = (value: string) => {
    setParams((prev) => ({ ...prev, q: value || undefined }));
  };

  const handleGroupFilter = (value: string) => {
    setParams((prev) => ({
      ...prev,
      statusGroup: value || undefined,
    }));
  };

  const handleActiveFilter = (value: string) => {
    setParams((prev) => ({
      ...prev,
      isActive: value === 'active' ? 1 : value === 'inactive' ? 0 : undefined,
    }));
  };

  const handleToggleActive = (item: TenantStatus) => {
    const nextActive = item.isActive ? 0 : 1;
    const action = nextActive ? '활성화' : '비활성화';
    confirm({
      title: `상태 ${action}`,
      icon: <ExclamationCircleOutlined />,
      content: `"${item.statusName}" 상태를 ${action}하시겠습니까?`,
      okText: action,
      cancelText: '취소',
      okButtonProps: { danger: !nextActive },
      onOk: async () => {
        try {
          await updateActive.mutateAsync({
            id: item.tenantStatusId,
            data: { isActive: nextActive as 0 | 1 },
          });
          message.success(`상태가 ${action}되었습니다.`);
        } catch {
          message.error(`상태 ${action}에 실패했습니다.`);
        }
      },
    });
  };

  const handleDelete = (item: TenantStatus) => {
    confirm({
      title: '상태 삭제',
      icon: <ExclamationCircleOutlined />,
      content: `"${item.statusName}" (${item.statusKey}) 상태를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      okText: '삭제',
      cancelText: '취소',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteTenantStatus.mutateAsync(item.tenantStatusId);
          message.success('상태가 삭제되었습니다.');
        } catch {
          message.error('상태 삭제에 실패했습니다.');
        }
      },
    });
  };

  // 기존 그룹 목록 (필터 Select 옵션용)
  const groupOptions = data?.groups.map((g) => ({
    value: g.statusGroup,
    label: g.statusGroup,
  })) ?? [];

  return (
    <div className={styles.page}>
      {/* ── 페이지 헤더 ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>상태 관리</h1>
          <p className={styles.pageDesc}>도메인별 상태 값을 관리합니다.</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalOpen(true)}
        >
          상태 추가
        </Button>
      </div>

      {/* ── 요약 카드 ── */}
      <StatusSummaryCards data={data} />

      {/* ── 검색 및 필터 ── */}
      <div className={styles.card}>
        <div className={styles.filterBar}>
          <Input
            className={styles.searchInput}
            placeholder="상태 검색 (이름, 키, 설명)..."
            prefix={<SearchOutlined />}
            allowClear
            onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
            onChange={(e) => { if (!e.target.value) handleSearch(''); }}
          />
          <Select
            className={styles.filterSelect}
            placeholder="상태 그룹"
            allowClear
            onChange={handleGroupFilter}
            options={groupOptions}
          />
          <Select
            className={styles.filterSelectSmall}
            defaultValue="all"
            onChange={handleActiveFilter}
            options={[
              { value: 'all', label: '전체 상태' },
              { value: 'active', label: '활성' },
              { value: 'inactive', label: '비활성' },
            ]}
          />
          <span className={styles.totalLabel}>총 {data?.total ?? 0}개 상태</span>
        </div>
      </div>

      {/* ── 상태 그룹 목록 ── */}
      <div className={styles.card}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>상태 그룹</h2>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            loading={isLoading}
          >
            새로고침
          </Button>
        </div>

        {isLoading ? (
          <div className={styles.loadingContainer}>
            <Spin />
          </div>
        ) : (
          <StatusGroupList
            groups={data?.groups ?? []}
            onDetail={setDetailTarget}
            onEdit={setEditTarget}
            onToggleActive={handleToggleActive}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* ── 상태 상세 보기 모달 ── */}
      <Modal
        title={detailTarget ? `${detailTarget.statusName} 상세` : '상태 상세'}
        open={!!detailTarget}
        onCancel={() => setDetailTarget(null)}
        footer={null}
        destroyOnClose
        width={560}
      >
        <StatusDetail data={detailData} loading={detailLoading} />
      </Modal>

      {/* ── 상태 수정 모달 ── */}
      <Modal
        title="상태 수정"
        open={!!editTarget}
        onCancel={() => setEditTarget(null)}
        footer={null}
        destroyOnClose
        width={520}
      >
        {editTarget && (
          <StatusEditForm
            tenantStatusId={editTarget.tenantStatusId}
            defaultValues={{
              statusName: editTarget.statusName,
              description: editTarget.description || '',
              color: editTarget.color,
              sortOrder: editTarget.sortOrder,
            }}
            onSuccess={() => {
              setEditTarget(null);
              message.success('상태가 수정되었습니다.');
            }}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>

      {/* ── 상태 생성 모달 ── */}
      <Modal
        title="상태 추가"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
        destroyOnClose
        width={520}
      >
        <StatusCreateForm
          onSuccess={() => {
            setCreateModalOpen(false);
            message.success('상태가 생성되었습니다.');
          }}
          onCancel={() => setCreateModalOpen(false)}
          existingGroups={data}
        />
      </Modal>
    </div>
  );
}
