import { useState } from 'react';
import { Button, Modal, Input, Select, message } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import {
  AdminActionTable,
  AdminActionDetail,
  AdminActionCreateForm,
  AdminActionEditForm,
  useAdminActions,
  useAdminAction,
  useUpdateAdminActionStatus,
  useDeleteAdminAction,
} from '@features/admin-action';
import type { AdminActionListItem, GetAdminActionsRequest } from '@features/admin-action';
import { useMe } from '@features/auth';
import styles from './admin-action-manage-page.module.css';

const { confirm } = Modal;

export default function AdminActionManagePage() {
  const [params, setParams] = useState<GetAdminActionsRequest>({ page: 1, limit: 20 });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminActionListItem | null>(null);
  const [detailTarget, setDetailTarget] = useState<AdminActionListItem | null>(null);

  const { data, isLoading } = useAdminActions(params);
  const { hasPermission } = useMe();
  const canCreate = hasPermission('super.actions', 'create');
  const canUpdate = hasPermission('super.actions', 'update');
  const canDelete = hasPermission('super.actions', 'delete');
  const { data: detailData, isLoading: detailLoading } = useAdminAction(detailTarget?.actionId ?? 0);
  const updateStatus = useUpdateAdminActionStatus();
  const deleteAction = useDeleteAdminAction();

  const handleSearch = (value: string) => {
    setParams((prev) => ({ ...prev, q: value || undefined, page: 1 }));
  };

  const handleFilterChange = (value: string) => {
    setParams((prev) => ({
      ...prev,
      isActive: value === 'active' ? 1 : value === 'inactive' ? 0 : undefined,
      page: 1,
    }));
  };

  const handleToggleStatus = (action: AdminActionListItem) => {
    const nextActive = action.isActive ? 0 : 1;
    const actionLabel = nextActive ? '활성화' : '비활성화';
    confirm({
      title: `액션 ${actionLabel}`,
      icon: <ExclamationCircleOutlined />,
      content: `${action.actionName} 액션을 ${actionLabel}하시겠습니까?`,
      okText: actionLabel,
      cancelText: '취소',
      okButtonProps: { danger: !nextActive },
      onOk: async () => {
        try {
          await updateStatus.mutateAsync({ id: action.actionId, data: { isActive: nextActive } });
          message.success(`액션이 ${actionLabel}되었습니다.`);
        } catch {
          message.error(`액션 ${actionLabel}에 실패했습니다.`);
        }
      },
    });
  };

  const handleDelete = (action: AdminActionListItem) => {
    confirm({
      title: '액션 삭제',
      icon: <ExclamationCircleOutlined />,
      content: `${action.actionName} 액션을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      okText: '삭제',
      cancelText: '취소',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteAction.mutateAsync(action.actionId);
          message.success('액션이 삭제되었습니다.');
        } catch {
          message.error('액션 삭제에 실패했습니다.');
        }
      },
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.pageTitleRow}>
            <h1 className={styles.pageTitle}>액션 관리</h1>
            {data?.pageInfo && (
              <span className={styles.totalBadge}>{data.pageInfo.totalItems}</span>
            )}
          </div>
          <p className={styles.pageDesc}>권한 시스템에서 사용되는 액션을 관리할 수 있습니다.</p>
        </div>
        <div className={styles.toolbar}>
          <Input
            className={styles.searchInput}
            placeholder="액션 검색 (이름, 표시이름)..."
            prefix={<SearchOutlined />}
            allowClear
            onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
            onChange={(e) => { if (!e.target.value) handleSearch(''); }}
          />
          <Select
            className={styles.filterSelect}
            defaultValue="all"
            onChange={handleFilterChange}
            options={[
              { value: 'all', label: '전체' },
              { value: 'active', label: '활성' },
              { value: 'inactive', label: '비활성' },
            ]}
          />
          {canCreate && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalOpen(true)}
            >
              액션 생성
            </Button>
          )}
        </div>
      </div>

      <div className={styles.card}>
        <AdminActionTable
          data={data}
          loading={isLoading}
          params={params}
          onParamsChange={setParams}
          onDetail={setDetailTarget}
          onEdit={setEditTarget}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
          canUpdate={canUpdate}
          canDelete={canDelete}
        />
      </div>

      {/* 액션 상세 보기 모달 */}
      <Modal
        title={detailTarget ? `${detailTarget.actionName} 상세` : '액션 상세'}
        open={!!detailTarget}
        onCancel={() => setDetailTarget(null)}
        footer={null}
        destroyOnClose
        width={560}
      >
        <AdminActionDetail data={detailData} loading={detailLoading} />
      </Modal>

      {/* 액션 생성 모달 */}
      <Modal
        title="액션 생성"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
        destroyOnClose
        width={480}
      >
        <AdminActionCreateForm
          onSuccess={() => {
            setCreateModalOpen(false);
            message.success('액션이 생성되었습니다.');
          }}
          onCancel={() => setCreateModalOpen(false)}
        />
      </Modal>

      {/* 액션 수정 모달 */}
      <Modal
        title="액션 수정"
        open={!!editTarget}
        onCancel={() => setEditTarget(null)}
        footer={null}
        destroyOnClose
        width={480}
      >
        {editTarget && (
          <AdminActionEditForm
            actionId={editTarget.actionId}
            defaultValues={{
              actionName: editTarget.actionName || '',
              displayName: editTarget.displayName || '',
            }}
            onSuccess={() => {
              setEditTarget(null);
              message.success('액션 정보가 수정되었습니다.');
            }}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>
    </div>
  );
}
