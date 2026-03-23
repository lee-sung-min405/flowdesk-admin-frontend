import { useState } from 'react';
import { Button, Modal, Input, Select, message } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, SearchOutlined, SafetyOutlined } from '@ant-design/icons';
import {
  BlockIpTable,
  BlockIpDetail,
  BlockIpCreateForm,
  BlockIpEditForm,
  BlockIpCheck,
  useBlockIps,
  useBlockIp,
  useUpdateBlockIp,
  useDeleteBlockIp,
} from '@features/security';
import type { BlockIp, GetBlockIpsRequest } from '@features/security';
import styles from './block-manage-page.module.css';

const { confirm } = Modal;

export default function BlockIpPanel() {
  const [params, setParams] = useState<GetBlockIpsRequest>({ page: 1, limit: 20 });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [checkModalOpen, setCheckModalOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState<BlockIp | null>(null);
  const [editTarget, setEditTarget] = useState<BlockIp | null>(null);

  const { data, isLoading } = useBlockIps(params);
  const { data: detailData, isLoading: detailLoading } = useBlockIp(detailTarget?.dbiIdx ?? 0);
  const { data: editDetailData } = useBlockIp(editTarget?.dbiIdx ?? 0);
  const updateBlockIp = useUpdateBlockIp();
  const deleteBlockIp = useDeleteBlockIp();

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

  const handleToggleStatus = (record: BlockIp) => {
    const nextActive = record.isActive ? 0 : 1;
    const action = nextActive ? '활성화' : '비활성화';
    confirm({
      title: `IP 차단 ${action}`,
      icon: <ExclamationCircleOutlined />,
      content: `${record.blockIp} IP를 ${action}하시겠습니까?`,
      okText: action,
      cancelText: '취소',
      okButtonProps: { danger: !nextActive },
      onOk: async () => {
        try {
          await updateBlockIp.mutateAsync({ id: record.dbiIdx, data: { isActive: nextActive } });
          message.success(`IP가 ${action}되었습니다.`);
        } catch {
          message.error(`IP ${action}에 실패했습니다.`);
        }
      },
    });
  };

  const handleDelete = (record: BlockIp) => {
    confirm({
      title: 'IP 차단 삭제',
      icon: <ExclamationCircleOutlined />,
      content: `${record.blockIp} IP 차단을 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteBlockIp.mutateAsync(record.dbiIdx);
          message.success('IP 차단이 삭제되었습니다.');
        } catch {
          message.error('IP 차단 삭제에 실패했습니다.');
        }
      },
    });
  };

  return (
    <>
      <div className={styles.panelToolbar}>
        <Input
          className={styles.searchInput}
          placeholder="IP 주소 검색..."
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
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalOpen(true)}>
          IP 차단 등록
        </Button>
        <Button icon={<SafetyOutlined />} onClick={() => setCheckModalOpen(true)}>
          차단 여부 확인
        </Button>
      </div>

      <BlockIpTable
        data={data}
        loading={isLoading}
        params={params}
        onParamsChange={setParams}
        onDetail={setDetailTarget}
        onEdit={setEditTarget}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
      />

      {/* 상세 모달 */}
      <Modal
        title={detailTarget ? `IP 차단 상세 — ${detailTarget.blockIp}` : 'IP 차단 상세'}
        open={!!detailTarget}
        onCancel={() => setDetailTarget(null)}
        footer={null}
        destroyOnClose
        width={560}
      >
        <BlockIpDetail data={detailData} loading={detailLoading} />
      </Modal>

      {/* 생성 모달 */}
      <Modal
        title="IP 차단 등록"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
        destroyOnClose
        width={520}
      >
        <BlockIpCreateForm
          onSuccess={() => {
            setCreateModalOpen(false);
            message.success('IP 차단이 등록되었습니다.');
          }}
          onCancel={() => setCreateModalOpen(false)}
        />
      </Modal>

      {/* 수정 모달 */}
      <Modal
        title="IP 차단 수정"
        open={!!editTarget}
        onCancel={() => setEditTarget(null)}
        footer={null}
        destroyOnClose
        width={520}
      >
        {editTarget && editDetailData && (
          <BlockIpEditForm
            id={editTarget.dbiIdx}
            defaultValues={{
              reason: editDetailData.reason ?? '',
            }}
            onSuccess={() => {
              setEditTarget(null);
              message.success('IP 차단 정보가 수정되었습니다.');
            }}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>

      {/* 차단 여부 확인 모달 */}
      <Modal
        title="IP 차단 여부 확인"
        open={checkModalOpen}
        onCancel={() => setCheckModalOpen(false)}
        footer={null}
        destroyOnClose
        width={520}
      >
        <BlockIpCheck />
      </Modal>
    </>
  );
}
