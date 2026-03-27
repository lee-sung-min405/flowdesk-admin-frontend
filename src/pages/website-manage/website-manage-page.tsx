import { useState } from 'react';
import { Button, Modal, Input, Select, message } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import {
  WebsiteTable,
  WebsiteDetail,
  WebsiteCreateForm,
  WebsiteEditForm,
  useWebsites,
  useWebsite,
  useUpdateWebsiteStatus,
  useDeleteWebsite,
} from '@features/website';
import type { Website, GetWebsitesRequest } from '@features/website';
import { useUsers } from '@features/user';
import styles from './website-manage-page.module.css';

const { confirm } = Modal;

export default function WebsiteManagePage() {
  const [params, setParams] = useState<GetWebsitesRequest>({ page: 1, limit: 20 });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState<Website | null>(null);
  const [editTarget, setEditTarget] = useState<Website | null>(null);

  const { data, isLoading } = useWebsites(params);
  const { data: detailData, isLoading: detailLoading } = useWebsite(detailTarget?.webCode ?? '');
  const { data: editWebsiteDetail } = useWebsite(editTarget?.webCode ?? '');
  const updateStatus = useUpdateWebsiteStatus();
  const deleteWebsite = useDeleteWebsite();

  // 관리자 목록 (생성/수정 폼의 관리자 Select용)
  const { data: usersData, isLoading: usersLoading } = useUsers(
    {},
    { enabled: createModalOpen || !!editTarget },
  );
  const users = usersData?.items ?? [];

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

  const handleToggleStatus = (website: Website) => {
    const nextActive = website.isActive ? 0 : 1;
    const action = nextActive ? '활성화' : '비활성화';

    confirm({
      title: `웹사이트 ${action}`,
      icon: <ExclamationCircleOutlined />,
      content: `${website.webTitle}(${website.webCode}) 웹사이트를 ${action}하시겠습니까?`,
      okText: action,
      cancelText: '취소',
      okButtonProps: { danger: !nextActive },
      onOk: async () => {
        try {
          await updateStatus.mutateAsync({
            webCode: website.webCode,
            data: { isActive: nextActive as 0 | 1 },
          });
          message.success(`웹사이트가 ${action}되었습니다.`);
        } catch {
          message.error(`웹사이트 ${action}에 실패했습니다.`);
        }
      },
    });
  };

  const handleDelete = (website: Website) => {
    confirm({
      title: '웹사이트 삭제',
      icon: <ExclamationCircleOutlined />,
      content: `${website.webTitle}(${website.webCode}) 웹사이트를 삭제하시겠습니까? 삭제된 웹사이트는 복구할 수 없습니다.`,
      okText: '삭제',
      cancelText: '취소',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteWebsite.mutateAsync(website.webCode);
          message.success('웹사이트가 삭제되었습니다.');
        } catch {
          message.error('웹사이트 삭제에 실패했습니다.');
        }
      },
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.pageTitleRow}>
            <h1 className={styles.pageTitle}>웹사이트 관리</h1>
            {data?.pageInfo && (
              <span className={styles.totalBadge}>{data.pageInfo.totalItems}</span>
            )}
          </div>
          <p className={styles.pageDesc}>랜딩 페이지 및 웹사이트를 관리합니다.</p>
        </div>
        <div className={styles.toolbar}>
          <Input
            className={styles.searchInput}
            placeholder="웹사이트 검색 (제목, URL, 코드)..."
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
              { value: 'all', label: '전체 상태' },
              { value: 'active', label: '활성' },
              { value: 'inactive', label: '비활성' },
            ]}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalOpen(true)}>
            웹사이트 추가
          </Button>
        </div>
      </div>

      <div className={styles.card}>
        <WebsiteTable
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

      {/* 상세 보기 모달 */}
      <Modal
        title={detailTarget ? `${detailTarget.webTitle} 상세` : '웹사이트 상세'}
        open={!!detailTarget}
        onCancel={() => setDetailTarget(null)}
        footer={null}
        destroyOnClose
        width={600}
      >
        <WebsiteDetail data={detailData} loading={detailLoading} />
      </Modal>

      {/* 생성 모달 */}
      <Modal
        title="웹사이트 추가"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
        destroyOnClose
        width={560}
      >
        <WebsiteCreateForm
          onSuccess={() => {
            setCreateModalOpen(false);
            message.success('웹사이트가 생성되었습니다.');
          }}
          onCancel={() => setCreateModalOpen(false)}
          users={users}
          usersLoading={usersLoading}
        />
      </Modal>

      {/* 수정 모달 */}
      <Modal
        title="웹사이트 수정"
        open={!!editTarget}
        onCancel={() => setEditTarget(null)}
        footer={null}
        destroyOnClose
        width={560}
      >
        {editTarget && editWebsiteDetail && (
          <WebsiteEditForm
            webCode={editTarget.webCode}
            defaultValues={{
              userSeq: editWebsiteDetail.userSeq,
              webUrl: editWebsiteDetail.webUrl || '',
              webTitle: editWebsiteDetail.webTitle || '',
              webImg: editWebsiteDetail.webImg || '',
              webDesc: editWebsiteDetail.webDesc || '',
              webMemo: editWebsiteDetail.webMemo || '',
              duplicateAllowAfterDays: editWebsiteDetail.duplicateAllowAfterDays,
            }}
            onSuccess={() => {
              setEditTarget(null);
              message.success('웹사이트 정보가 수정되었습니다.');
            }}
            onCancel={() => setEditTarget(null)}
            users={users}
            usersLoading={usersLoading}
          />
        )}
      </Modal>
    </div>
  );
}
