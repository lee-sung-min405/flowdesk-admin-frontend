import { useState } from 'react';
import { Button, Modal, Input, Select, message } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import {
  AdminPermissionTable,
  AdminPermissionDetail,
  AdminPermissionCreateForm,
  AdminPermissionEditForm,
  useAdminPermissions,
  useAdminPermission,
  useUpdateAdminPermissionStatus,
  useDeleteAdminPermission,
} from '@features/admin-permission';
import type { AdminPermissionListItem, GetAdminPermissionsRequest } from '@features/admin-permission';
import { useAdminPages } from '@features/admin-page';
import { useAdminActions } from '@features/admin-action';
import styles from './admin-permission-manage-page.module.css';

const { confirm } = Modal;

export default function AdminPermissionManagePage() {
  const [params, setParams] = useState<GetAdminPermissionsRequest>({ page: 1, limit: 20 });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminPermissionListItem | null>(null);
  const [detailTarget, setDetailTarget] = useState<AdminPermissionListItem | null>(null);

  const { data, isLoading } = useAdminPermissions(params);
  const { data: detailData, isLoading: detailLoading } = useAdminPermission(detailTarget?.permissionId ?? 0);
  const { data: pagesData } = useAdminPages({ limit: 100, isActive: 1 });
  const { data: actionsData } = useAdminActions({ limit: 100, isActive: 1 });
  const updateStatus = useUpdateAdminPermissionStatus();
  const deletePermission = useDeleteAdminPermission();

  const pageOptions = (pagesData?.items ?? []).map((p) => ({
    pageId: p.pageId,
    displayName: p.displayName,
  }));

  const actionOptions = (actionsData?.items ?? []).map((a) => ({
    actionId: a.actionId,
    actionName: a.actionName,
    displayName: a.displayName,
  }));

  const handleSearch = (value: string) => {
    setParams((prev) => ({ ...prev, q: value || undefined, page: 1 }));
  };

  const handleStatusFilterChange = (value: string) => {
    setParams((prev) => ({
      ...prev,
      isActive: value === 'active' ? 1 : value === 'inactive' ? 0 : undefined,
      page: 1,
    }));
  };

  const handlePageFilterChange = (value: number | undefined) => {
    setParams((prev) => ({
      ...prev,
      pageId: value,
      page: 1,
    }));
  };

  const handleActionFilterChange = (value: number | undefined) => {
    setParams((prev) => ({
      ...prev,
      actionId: value,
      page: 1,
    }));
  };

  const handleToggleStatus = (permission: AdminPermissionListItem) => {
    const nextActive = permission.isActive ? 0 : 1;
    const action = nextActive ? '활성화' : '비활성화';
    const name = permission.displayName || `#${permission.permissionId}`;
    confirm({
      title: `권한 ${action}`,
      icon: <ExclamationCircleOutlined />,
      content: `${name} 권한을 ${action}하시겠습니까?`,
      okText: action,
      cancelText: '취소',
      okButtonProps: { danger: !nextActive },
      onOk: async () => {
        try {
          await updateStatus.mutateAsync({ id: permission.permissionId, data: { isActive: nextActive } });
          message.success(`권한이 ${action}되었습니다.`);
        } catch {
          message.error(`권한 ${action}에 실패했습니다.`);
        }
      },
    });
  };

  const handleDelete = (permission: AdminPermissionListItem) => {
    const name = permission.displayName || `#${permission.permissionId}`;
    confirm({
      title: '권한 삭제',
      icon: <ExclamationCircleOutlined />,
      content: `${name} 권한을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      okText: '삭제',
      cancelText: '취소',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deletePermission.mutateAsync(permission.permissionId);
          message.success('권한이 삭제되었습니다.');
        } catch {
          message.error('권한 삭제에 실패했습니다.');
        }
      },
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.pageTitleRow}>
            <h1 className={styles.pageTitle}>권한 관리</h1>
            {data?.pageInfo && (
              <span className={styles.totalBadge}>{data.pageInfo.totalItems}</span>
            )}
          </div>
          <p className={styles.pageDesc}>페이지와 액션의 조합으로 구성된 권한을 관리할 수 있습니다.</p>
        </div>
        <div className={styles.toolbar}>
          <Input
            className={styles.searchInput}
            placeholder="권한 검색 (표시이름, 설명)..."
            prefix={<SearchOutlined />}
            allowClear
            onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
            onChange={(e) => { if (!e.target.value) handleSearch(''); }}
          />
          <Select
            className={styles.filterSelect}
            placeholder="페이지"
            allowClear
            onChange={handlePageFilterChange}
            options={(pagesData?.items ?? []).map((p) => ({ value: p.pageId, label: p.displayName }))}
          />
          <Select
            className={styles.filterSelect}
            placeholder="액션"
            allowClear
            onChange={handleActionFilterChange}
            options={(actionsData?.items ?? []).map((a) => ({ value: a.actionId, label: a.displayName || a.actionName }))}
          />
          <Select
            className={styles.filterSelect}
            defaultValue="all"
            onChange={handleStatusFilterChange}
            options={[
              { value: 'all', label: '전체 상태' },
              { value: 'active', label: '활성' },
              { value: 'inactive', label: '비활성' },
            ]}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalOpen(true)}
          >
            권한 생성
          </Button>
        </div>
      </div>

      <div className={styles.card}>
        <AdminPermissionTable
          data={data}
          loading={isLoading}
          params={params}
          onParamsChange={setParams}
          onDetail={setDetailTarget}
          onEdit={setEditTarget}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      </div>

      {/* 권한 상세 보기 모달 */}
      <Modal
        title={detailTarget?.displayName ? `${detailTarget.displayName} 상세` : '권한 상세'}
        open={!!detailTarget}
        onCancel={() => setDetailTarget(null)}
        footer={null}
        destroyOnClose
        width={600}
      >
        <AdminPermissionDetail data={detailData} loading={detailLoading} />
      </Modal>

      {/* 권한 생성 모달 */}
      <Modal
        title="권한 생성"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
        destroyOnClose
        width={560}
      >
        <AdminPermissionCreateForm
          pages={pageOptions}
          actions={actionOptions}
          onSuccess={() => {
            setCreateModalOpen(false);
            message.success('권한이 생성되었습니다.');
          }}
          onCancel={() => setCreateModalOpen(false)}
        />
      </Modal>

      {/* 권한 수정 모달 */}
      <Modal
        title="권한 수정"
        open={!!editTarget}
        onCancel={() => setEditTarget(null)}
        footer={null}
        destroyOnClose
        width={600}
      >
        {editTarget && (
          <AdminPermissionEditForm
            permissionId={editTarget.permissionId}
            defaultValues={{
              pageId: editTarget.pageId,
              actionId: editTarget.actionId,
              displayName: editTarget.displayName || '',
              description: editTarget.description || '',
            }}
            pages={pageOptions}
            actions={actionOptions}
            onSuccess={() => {
              setEditTarget(null);
              message.success('권한 정보가 수정되었습니다.');
            }}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>
    </div>
  );
}
