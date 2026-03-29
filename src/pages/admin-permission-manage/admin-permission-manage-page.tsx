import { useState, useMemo } from 'react';
import { Input, Select, Modal, message } from 'antd';
import { SearchOutlined, ReloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  AdminPermissionMatrix,
  AdminPermissionTable,
  AdminPermissionDetail,
  AdminPermissionEditForm,
  AdminPermissionCreateForm,
  useAdminPermissions,
  useAdminPermission,
  useUpdateAdminPermissionStatus,
  useDeleteAdminPermission,
} from '@features/admin-permission';
import type { AdminPermissionListItem, GetAdminPermissionsRequest } from '@features/admin-permission';
import { useAdminPages } from '@features/admin-page';
import { useMe } from '@features/auth';
import styles from './admin-permission-manage-page.module.css';

const { confirm } = Modal;

interface CreateTarget {
  pageId: number;
  actionId: number;
}

export default function AdminPermissionManagePage() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
  const [detailPermissionId, setDetailPermissionId] = useState<number | null>(null);
  const [editTarget, setEditTarget] = useState<AdminPermissionListItem | null>(null);
  const [createTarget, setCreateTarget] = useState<CreateTarget | null>(null);

  // Table params & filters (server-side)
  const [tableParams, setTableParams] = useState<GetAdminPermissionsRequest>({ page: 1, limit: 20 });
  const [tableSearch, setTableSearch] = useState('');
  const [tablePageId, setTablePageId] = useState<number | undefined>(undefined);
  const [tableActionId, setTableActionId] = useState<number | undefined>(undefined);
  const [tableStatus, setTableStatus] = useState<number | undefined>(undefined);

  // Fetch pages (tree structure requires parentId, sortOrder)
  const { data: pagesData, isLoading: pagesLoading, dataUpdatedAt: pagesUpdatedAt, refetch: refetchPages, isFetching: pagesFetching } = useAdminPages({ isActive: 1 });

  const { hasPermission } = useMe();
  const canCreate = hasPermission('super.permissions', 'create');
  const canUpdate = hasPermission('super.permissions', 'update');
  const canDelete = hasPermission('super.permissions', 'delete');

  // Fetch all permissions
  const { data: permData, isLoading: permLoading, dataUpdatedAt: permUpdatedAt, refetch: refetchPerms, isFetching: permFetching } = useAdminPermissions({});

  // Table query (server-side pagination + filters)
  const tableQueryParams = useMemo<GetAdminPermissionsRequest>(() => ({
    ...tableParams,
    q: tableSearch || undefined,
    pageId: tablePageId,
    actionId: tableActionId,
    isActive: tableStatus,
  }), [tableParams, tableSearch, tablePageId, tableActionId, tableStatus]);
  const { data: tableData, isLoading: tableLoading } = useAdminPermissions(tableQueryParams);

  // Detail query
  const { data: detailData, isLoading: detailLoading } = useAdminPermission(detailPermissionId ?? 0);

  const updateStatus = useUpdateAdminPermissionStatus();
  const deletePermission = useDeleteAdminPermission();

  const pages = pagesData?.items ?? [];
  const permissions = permData?.items ?? [];

  const isLoading = pagesLoading || permLoading;
  const isFetching = pagesFetching || permFetching;

  // Extract unique actions from permissions data (no separate actions API needed)
  const uniqueActions = useMemo(() => {
    const map = new Map<number, { actionId: number; actionName: string; displayName: string | null }>();
    for (const perm of permissions) {
      if (perm.action && !map.has(perm.action.actionId)) {
        map.set(perm.action.actionId, {
          actionId: perm.action.actionId,
          actionName: perm.action.actionName,
          displayName: perm.action.displayName,
        });
      }
    }
    return Array.from(map.values());
  }, [permissions]);

  // Client-side status filter (apply on permissions, not actions — so all columns stay visible)
  const filteredPermissions = useMemo(() => {
    if (statusFilter === undefined) return permissions;
    return permissions.filter((p) => p.isActive === statusFilter);
  }, [permissions, statusFilter]);

  // Page/action options for forms
  const pageOptions = pages.map((p) => ({ pageId: p.pageId, displayName: p.displayName }));
  const actionOptions = uniqueActions.map((a) => ({ actionId: a.actionId, actionName: a.actionName, displayName: a.displayName }));

  // Filter pages by search text
  const filteredPages = searchText
    ? pages.filter(
        (p) =>
          p.displayName.toLowerCase().includes(searchText.toLowerCase()) ||
          p.pageName.toLowerCase().includes(searchText.toLowerCase()),
      )
    : pages;

  const handleRefresh = () => {
    refetchPages();
    refetchPerms();
  };

  const handleOpenCreate = (pageId: number, actionId: number) => {
    setCreateTarget({ pageId, actionId });
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

  const lastUpdated = Math.max(pagesUpdatedAt, permUpdatedAt);
  const updatedLabel = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '';

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.pageTitleRow}>
            <h1 className={styles.pageTitle}>권한 관리</h1>
            {permData?.pageInfo && (
              <span className={styles.totalBadge}>{permData.pageInfo.totalItems}</span>
            )}
          </div>
          <p className={styles.pageDesc}>
            페이지와 액션의 조합으로 구성된 권한을 매트릭스 형태로 관리할 수 있습니다.
          </p>
        </div>
        <div className={styles.pageHeaderRight}>
          <button
            className={styles.refreshBtn}
            onClick={handleRefresh}
            disabled={isFetching}
            type="button"
          >
            <ReloadOutlined spin={isFetching} />
            <span>새로고침</span>
          </button>
          {lastUpdated > 0 && (
            <span className={styles.updatedAt}>
              {updatedLabel} 기준
            </span>
          )}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.sectionTitle}>권한 매트릭스</h3>
          <div className={styles.cardToolbar}>
            <Input
              className={styles.matrixSearchInput}
              placeholder="페이지 검색..."
              prefix={<SearchOutlined />}
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              className={styles.matrixFilterSelect}
              defaultValue="all"
              onChange={(v) => setStatusFilter(v === 'active' ? 1 : v === 'inactive' ? 0 : undefined)}
              options={[
                { value: 'all', label: '전체 상태' },
                { value: 'active', label: '활성' },
                { value: 'inactive', label: '비활성' },
              ]}
            />
          </div>
        </div>
        <AdminPermissionMatrix
          pages={filteredPages}
          actions={uniqueActions}
          permissions={filteredPermissions}
          loading={isLoading}
          onCreate={handleOpenCreate}
          onDetail={setDetailPermissionId}
          onEdit={setEditTarget}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
          canCreate={canCreate}
          canUpdate={canUpdate}
          canDelete={canDelete}
        />
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.sectionTitle}>권한 목록</h3>
          <div className={styles.cardToolbar}>
          <Input
            className={styles.tableSearchInput}
            placeholder="권한 검색..."
            prefix={<SearchOutlined />}
            allowClear
            value={tableSearch}
            onChange={(e) => {
              setTableSearch(e.target.value);
              setTableParams((prev) => ({ ...prev, page: 1 }));
            }}
          />
          <Select
            className={styles.tableFilterSelect}
            placeholder="페이지"
            allowClear
            value={tablePageId}
            onChange={(v) => {
              setTablePageId(v);
              setTableParams((prev) => ({ ...prev, page: 1 }));
            }}
            options={pages.map((p) => ({ value: p.pageId, label: p.displayName }))}
            showSearch
            optionFilterProp="label"
          />
          <Select
            className={styles.tableFilterSelect}
            placeholder="액션"
            allowClear
            value={tableActionId}
            onChange={(v) => {
              setTableActionId(v);
              setTableParams((prev) => ({ ...prev, page: 1 }));
            }}
            options={uniqueActions.map((a) => ({ value: a.actionId, label: a.displayName || a.actionName }))}
            showSearch
            optionFilterProp="label"
          />
          <Select
            className={styles.tableFilterSelect}
            placeholder="상태"
            allowClear
            value={tableStatus}
            onChange={(v) => {
              setTableStatus(v);
              setTableParams((prev) => ({ ...prev, page: 1 }));
            }}
            options={[
              { value: 1, label: '활성' },
              { value: 0, label: '비활성' },
            ]}
          />
          </div>
        </div>
        <AdminPermissionTable
          data={tableData}
          loading={tableLoading}
          params={tableQueryParams}
          onParamsChange={(p) => setTableParams({ page: p.page, limit: p.limit, sort: p.sort, order: p.order })}
          onDetail={(perm) => setDetailPermissionId(perm.permissionId)}
          onEdit={setEditTarget}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
          canUpdate={canUpdate}
          canDelete={canDelete}
        />
      </div>

      {/* 권한 생성 모달 */}
      <Modal
        title="권한 추가"
        open={!!createTarget}
        onCancel={() => setCreateTarget(null)}
        footer={null}
        destroyOnClose
        width={560}
      >
        {createTarget && (
          <AdminPermissionCreateForm
            pages={pageOptions}
            actions={actionOptions}
            initialPageId={createTarget.pageId}
            initialActionId={createTarget.actionId}
            onSuccess={() => {
              setCreateTarget(null);
              message.success('권한이 생성되었습니다.');
            }}
            onCancel={() => setCreateTarget(null)}
          />
        )}
      </Modal>

      {/* 권한 상세 보기 모달 */}
      <Modal
        title="권한 상세"
        open={detailPermissionId !== null}
        onCancel={() => setDetailPermissionId(null)}
        footer={null}
        destroyOnClose
        width={600}
      >
        <AdminPermissionDetail data={detailData} loading={detailLoading} />
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
