import { useState } from 'react';
import { Button, Modal, Input, Select, message } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import {
  TenantTable,
  TenantCreateForm,
  TenantEditForm,
  useTenants,
  useTenant,
  useUpdateTenantStatus,
  useDeleteTenant,
} from '@features/tenant';
import type { Tenant, GetTenantsRequest } from '@features/tenant';
import styles from './tenant-page.module.css';

const { confirm } = Modal;

export default function TenantPage() {
  const [params, setParams] = useState<GetTenantsRequest>({ page: 1, limit: 20 });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Tenant | null>(null);

  const { data, isLoading } = useTenants(params);
  const { data: editTenantDetail } = useTenant(editTarget?.tenantId ?? 0);
  const updateStatus = useUpdateTenantStatus();
  const deleteTenant = useDeleteTenant();

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

  const handleToggleStatus = (tenant: Tenant) => {
    const nextActive = tenant.isActive ? 0 : 1;
    const action = nextActive ? '활성화' : '비활성화';
    confirm({
      title: `테넌트 ${action}`,
      icon: <ExclamationCircleOutlined />,
      content: `${tenant.displayName}(${tenant.tenantName}) 테넌트를 ${action}하시겠습니까?`,
      okText: action,
      cancelText: '취소',
      okButtonProps: { danger: !nextActive },
      onOk: async () => {
        try {
          await updateStatus.mutateAsync({ id: tenant.tenantId, data: { isActive: nextActive as 0 | 1 } });
          message.success(`테넌트가 ${action}되었습니다.`);
        } catch {
          message.error(`테넌트 ${action}에 실패했습니다.`);
        }
      },
    });
  };

  const handleDelete = (tenant: Tenant) => {
    confirm({
      title: '테넌트 삭제',
      icon: <ExclamationCircleOutlined />,
      content: `${tenant.displayName}(${tenant.tenantName}) 테넌트를 삭제하시겠습니까? 사용자가 존재하는 테넌트는 삭제할 수 없습니다.`,
      okText: '삭제',
      cancelText: '취소',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteTenant.mutateAsync(tenant.tenantId);
          message.success('테넌트가 삭제되었습니다.');
        } catch {
          message.error('테넌트 삭제에 실패했습니다. 사용자가 존재하는지 확인하세요.');
        }
      },
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.pageTitleRow}>
            <h1 className={styles.pageTitle}>테넌트 관리</h1>
            {data?.pageInfo && (
              <span className={styles.totalBadge}>{data.pageInfo.totalItems}</span>
            )}
          </div>
          <p className={styles.pageDesc}>테넌트를 조회하고 관리할 수 있습니다.</p>
        </div>
        <div className={styles.toolbar}>
          <Input
            className={styles.searchInput}
            placeholder="테넌트 검색 (이름, 표시명, 도메인)..."
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
            테넌트 생성
          </Button>
        </div>
      </div>

      <div className={styles.card}>
        <TenantTable
          data={data}
          loading={isLoading}
          params={params}
          onParamsChange={setParams}
          onEdit={setEditTarget}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      </div>

      {/* 테넌트 생성 모달 */}
      <Modal
        title="테넌트 생성"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
        destroyOnClose
        width={520}
      >
        <TenantCreateForm
          onSuccess={() => {
            setCreateModalOpen(false);
            message.success('테넌트가 생성되었습니다.');
          }}
          onCancel={() => setCreateModalOpen(false)}
        />
      </Modal>

      {/* 테넌트 수정 모달 */}
      <Modal
        title="테넌트 수정"
        open={!!editTarget}
        onCancel={() => setEditTarget(null)}
        footer={null}
        destroyOnClose
        width={560}
      >
        {editTarget && editTenantDetail && (
          <TenantEditForm
            tenantId={editTarget.tenantId}
            defaultValues={{
              tenantName: editTenantDetail.tenantName || '',
              displayName: editTenantDetail.displayName || '',
              domain: editTenantDetail.domain || '',
            }}
            onSuccess={() => {
              setEditTarget(null);
              message.success('테넌트 정보가 수정되었습니다.');
            }}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>
    </div>
  );
}
