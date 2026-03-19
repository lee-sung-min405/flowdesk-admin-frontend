import { useState } from 'react';
import { Button, Modal, Input, Select, message } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import {
  AdminPageTable,
  AdminPageDetail,
  AdminPageCreateForm,
  AdminPageEditForm,
  useAdminPages,
  useAdminPage,
  useUpdateAdminPageStatus,
  useDeleteAdminPage,
} from '@features/admin-page';
import type { AdminPageListItem, GetAdminPagesRequest } from '@features/admin-page';
import styles from './admin-page-manage-page.module.css';

const { confirm } = Modal;

export default function AdminPageManagePage() {
  const [params, setParams] = useState<GetAdminPagesRequest>({ page: 1, limit: 20 });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminPageListItem | null>(null);
  const [detailTarget, setDetailTarget] = useState<AdminPageListItem | null>(null);

  const { data, isLoading } = useAdminPages(params);
  const { data: parentPagesData } = useAdminPages({ limit: 100 }, { enabled: createModalOpen || !!editTarget });
  const { data: editPageDetail } = useAdminPage(editTarget?.pageId ?? 0);
  const { data: detailPageData, isLoading: detailLoading } = useAdminPage(detailTarget?.pageId ?? 0);
  const updateStatus = useUpdateAdminPageStatus();
  const deletePage = useDeleteAdminPage();

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

  const handleParentFilterChange = (value: string) => {
    setParams((prev) => ({
      ...prev,
      parentId: value === 'all' ? undefined : value,
      page: 1,
    }));
  };

  const handleToggleStatus = (page: AdminPageListItem) => {
    const nextActive = page.isActive ? 0 : 1;
    const action = nextActive ? '활성화' : '비활성화';
    confirm({
      title: `페이지 ${action}`,
      icon: <ExclamationCircleOutlined />,
      content: `${page.displayName}(${page.pageName}) 페이지를 ${action}하시겠습니까?`,
      okText: action,
      cancelText: '취소',
      okButtonProps: { danger: !nextActive },
      onOk: async () => {
        try {
          await updateStatus.mutateAsync({ id: page.pageId, data: { isActive: nextActive } });
          message.success(`페이지가 ${action}되었습니다.`);
        } catch {
          message.error(`페이지 ${action}에 실패했습니다.`);
        }
      },
    });
  };

  const handleDelete = (page: AdminPageListItem) => {
    confirm({
      title: '페이지 삭제',
      icon: <ExclamationCircleOutlined />,
      content: `${page.displayName}(${page.pageName}) 페이지를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      okText: '삭제',
      cancelText: '취소',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deletePage.mutateAsync(page.pageId);
          message.success('페이지가 삭제되었습니다.');
        } catch {
          message.error('페이지 삭제에 실패했습니다.');
        }
      },
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.pageTitleRow}>
            <h1 className={styles.pageTitle}>페이지 관리</h1>
            {data?.pageInfo && (
              <span className={styles.totalBadge}>{data.pageInfo.totalItems}</span>
            )}
          </div>
          <p className={styles.pageDesc}>권한 시스템에서 사용되는 페이지를 관리할 수 있습니다.</p>
        </div>
        <div className={styles.toolbar}>
          <Input
            className={styles.searchInput}
            placeholder="페이지 검색 (이름, 경로, 표시이름)..."
            prefix={<SearchOutlined />}
            allowClear
            onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
            onChange={(e) => { if (!e.target.value) handleSearch(''); }}
          />
          <Select
            className={styles.filterSelect}
            defaultValue="all"
            onChange={handleParentFilterChange}
            options={[
              { value: 'all', label: '전체' },
              { value: 'null', label: '최상위만' },
            ]}
          />
          <Select
            className={styles.filterSelect}
            defaultValue="all"
            onChange={handleFilterChange}
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
            페이지 생성
          </Button>
        </div>
      </div>

      <div className={styles.card}>
        <AdminPageTable
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

      {/* 페이지 상세 보기 모달 */}
      <Modal
        title={detailTarget ? `${detailTarget.displayName} 상세` : '페이지 상세'}
        open={!!detailTarget}
        onCancel={() => setDetailTarget(null)}
        footer={null}
        destroyOnClose
        width={680}
      >
        <AdminPageDetail data={detailPageData} loading={detailLoading} />
      </Modal>

      {/* 페이지 생성 모달 */}
      <Modal
        title="페이지 생성"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
        destroyOnClose
        width={560}
      >
        <AdminPageCreateForm
          parentPages={parentPagesData?.items ?? []}
          onSuccess={() => {
            setCreateModalOpen(false);
            message.success('페이지가 생성되었습니다.');
          }}
          onCancel={() => setCreateModalOpen(false)}
        />
      </Modal>

      {/* 페이지 수정 모달 */}
      <Modal
        title="페이지 수정"
        open={!!editTarget}
        onCancel={() => setEditTarget(null)}
        footer={null}
        destroyOnClose
        width={600}
      >
        {editTarget && editPageDetail && (
          <AdminPageEditForm
            pageId={editTarget.pageId}
            defaultValues={{
              pageName: editPageDetail.pageName || '',
              path: editPageDetail.path || '',
              displayName: editPageDetail.displayName || '',
              description: editPageDetail.description || '',
              parentId: editPageDetail.parentId ?? null,
              sortOrder: editPageDetail.sortOrder ?? null,
            }}
            parentPages={parentPagesData?.items ?? []}
            onSuccess={() => {
              setEditTarget(null);
              message.success('페이지 정보가 수정되었습니다.');
            }}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>
    </div>
  );
}
