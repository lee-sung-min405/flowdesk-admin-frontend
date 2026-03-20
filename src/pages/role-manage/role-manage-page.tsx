import { useState } from 'react';
import { Button, Modal, Input, Select, message } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import {
  RoleTable,
  RoleCreateForm,
  RoleEditForm,
  RoleDetailDrawer,
  useRoles,
  useUpdateRoleStatus,
  useDeleteRole,
} from '@features/role';
import type { Role, GetRolesRequest } from '@features/role';
import { usePermissionCatalog } from '@features/permission-catalog';
import { useUsers } from '@features/user';
import styles from './role-manage-page.module.css';
const { confirm } = Modal;

export default function RoleManagePage() {
  const [params, setParams] = useState<GetRolesRequest>({ page: 1, limit: 20 });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Role | null>(null);
  const [detailRoleId, setDetailRoleId] = useState<number>(0);
  const [userListParams, setUserListParams] = useState<{ page?: number; limit?: number; q?: string }>({ page: 1, limit: 10 });

  const { data, isLoading } = useRoles(params);

  const drawerOpen = detailRoleId > 0;
  const { data: catalogData, isLoading: catalogLoading } = usePermissionCatalog({ enabled: drawerOpen });
  const { data: allRolesData } = useRoles({ isActive: 1, limit: 100 }, { enabled: drawerOpen });
  const { data: usersData, isLoading: usersLoading } = useUsers(
    userListParams,
    { enabled: drawerOpen },
  );
  const updateStatus = useUpdateRoleStatus();
  const deleteRole = useDeleteRole();

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

  const handleToggleStatus = (role: Role) => {
    const nextActive = role.isActive ? 0 : 1;
    const actionLabel = nextActive ? '활성화' : '비활성화';
    confirm({
      title: `역할 ${actionLabel}`,
      icon: <ExclamationCircleOutlined />,
      content: `${role.displayName}(${role.roleName}) 역할을 ${actionLabel}하시겠습니까?`,
      okText: actionLabel,
      cancelText: '취소',
      okButtonProps: { danger: !nextActive },
      onOk: async () => {
        try {
          await updateStatus.mutateAsync({ id: role.roleId, data: { isActive: nextActive } });
          message.success(`역할이 ${actionLabel}되었습니다.`);
        } catch {
          message.error(`역할 ${actionLabel}에 실패했습니다.`);
        }
      },
    });
  };

  const handleDelete = (role: Role) => {
    confirm({
      title: '역할 삭제',
      icon: <ExclamationCircleOutlined />,
      content: `${role.displayName}(${role.roleName}) 역할을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      okText: '삭제',
      cancelText: '취소',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteRole.mutateAsync(role.roleId);
          message.success('역할이 삭제되었습니다.');
        } catch {
          message.error('역할 삭제에 실패했습니다.');
        }
      },
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.pageTitleRow}>
            <h1 className={styles.pageTitle}>역할 관리</h1>
            {data?.pageInfo && (
              <span className={styles.totalBadge}>{data.pageInfo.totalItems}</span>
            )}
          </div>
          <p className={styles.pageDesc}>역할을 관리하고 권한과 사용자를 할당할 수 있습니다.</p>
        </div>
        <div className={styles.toolbar}>
          <Input
            className={styles.searchInput}
            placeholder="역할 검색 (이름, 표시이름)..."
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
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalOpen(true)}
          >
            역할 생성
          </Button>
        </div>
      </div>

      <div className={styles.card}>
        <RoleTable
          data={data}
          loading={isLoading}
          params={params}
          onParamsChange={setParams}
          onDetail={(role) => setDetailRoleId(role.roleId)}
          onEdit={setEditTarget}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      </div>

      {/* 역할 상세 Drawer (3탭) */}
      <RoleDetailDrawer
        roleId={detailRoleId}
        open={detailRoleId > 0}
        onClose={() => { setDetailRoleId(0); setUserListParams({ page: 1, limit: 10 }); }}
        catalog={catalogData}
        catalogLoading={catalogLoading}
        rolesData={allRolesData}
        userListData={
          usersData
            ? {
                items: usersData.items.map((u) => ({
                  userSeq: u.userSeq,
                  userId: u.userId,
                  userName: u.userName,
                })),
                totalItems: usersData.pageInfo.totalItems,
                currentPage: usersData.pageInfo.currentPage,
                pageSize: usersData.pageInfo.pageSize,
              }
            : undefined
        }
        userListLoading={usersLoading}
        onUserListChange={(p) => setUserListParams((prev) => ({ ...prev, ...p }))}
      />

      {/* 역할 생성 모달 */}
      <Modal
        title="역할 생성"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
        destroyOnClose
        width={480}
      >
        <RoleCreateForm
          onSuccess={() => {
            setCreateModalOpen(false);
            message.success('역할이 생성되었습니다.');
          }}
          onCancel={() => setCreateModalOpen(false)}
        />
      </Modal>

      {/* 역할 수정 모달 */}
      <Modal
        title="역할 수정"
        open={!!editTarget}
        onCancel={() => setEditTarget(null)}
        footer={null}
        destroyOnClose
        width={480}
      >
        {editTarget && (
          <RoleEditForm
            roleId={editTarget.roleId}
            defaultValues={{
              roleName: editTarget.roleName || '',
              displayName: editTarget.displayName || '',
              description: editTarget.description || '',
            }}
            onSuccess={() => {
              setEditTarget(null);
              message.success('역할 정보가 수정되었습니다.');
            }}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>
    </div>
  );
}
