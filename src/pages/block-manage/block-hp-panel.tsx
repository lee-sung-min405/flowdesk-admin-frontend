import { useState } from 'react';
import { Button, Modal, Input, Select, message } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, SearchOutlined, SafetyOutlined } from '@ant-design/icons';
import {
  BlockHpTable,
  BlockHpDetail,
  BlockHpCreateForm,
  BlockHpEditForm,
  BlockHpCheck,
  useBlockHps,
  useBlockHp,
  useUpdateBlockHp,
  useDeleteBlockHp,
} from '@features/security';
import type { BlockHp, GetBlockHpsRequest } from '@features/security';
import styles from './block-manage-page.module.css';

const { confirm } = Modal;

export default function BlockHpPanel() {
  const [params, setParams] = useState<GetBlockHpsRequest>({ page: 1, limit: 20 });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [checkModalOpen, setCheckModalOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState<BlockHp | null>(null);
  const [editTarget, setEditTarget] = useState<BlockHp | null>(null);

  const { data, isLoading } = useBlockHps(params);
  const { data: detailData, isLoading: detailLoading } = useBlockHp(detailTarget?.dbhIdx ?? 0);
  const { data: editDetailData } = useBlockHp(editTarget?.dbhIdx ?? 0);
  const updateBlockHp = useUpdateBlockHp();
  const deleteBlockHp = useDeleteBlockHp();

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

  const handleToggleStatus = (record: BlockHp) => {
    const nextActive = record.isActive ? 0 : 1;
    const action = nextActive ? '활성화' : '비활성화';
    confirm({
      title: `휴대폰 차단 ${action}`,
      icon: <ExclamationCircleOutlined />,
      content: `${record.blockHp} 번호를 ${action}하시겠습니까?`,
      okText: action,
      cancelText: '취소',
      okButtonProps: { danger: !nextActive },
      onOk: async () => {
        try {
          await updateBlockHp.mutateAsync({ id: record.dbhIdx, data: { isActive: nextActive } });
          message.success(`휴대폰 번호가 ${action}되었습니다.`);
        } catch {
          message.error(`휴대폰 ${action}에 실패했습니다.`);
        }
      },
    });
  };

  const handleDelete = (record: BlockHp) => {
    confirm({
      title: '휴대폰 차단 삭제',
      icon: <ExclamationCircleOutlined />,
      content: `${record.blockHp} 번호 차단을 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteBlockHp.mutateAsync(record.dbhIdx);
          message.success('휴대폰 차단이 삭제되었습니다.');
        } catch {
          message.error('휴대폰 차단 삭제에 실패했습니다.');
        }
      },
    });
  };

  return (
    <>
      <div className={styles.panelToolbar}>
        <Input
          className={styles.searchInput}
          placeholder="휴대폰 번호 검색..."
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
          휴대폰 차단 등록
        </Button>
        <Button icon={<SafetyOutlined />} onClick={() => setCheckModalOpen(true)}>
          차단 여부 확인
        </Button>
      </div>

      <BlockHpTable
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
        title={detailTarget ? `휴대폰 차단 상세 — ${detailTarget.blockHp}` : '휴대폰 차단 상세'}
        open={!!detailTarget}
        onCancel={() => setDetailTarget(null)}
        footer={null}
        destroyOnClose
        width={560}
      >
        <BlockHpDetail data={detailData} loading={detailLoading} />
      </Modal>

      {/* 생성 모달 */}
      <Modal
        title="휴대폰 차단 등록"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
        destroyOnClose
        width={520}
      >
        <BlockHpCreateForm
          onSuccess={() => {
            setCreateModalOpen(false);
            message.success('휴대폰 차단이 등록되었습니다.');
          }}
          onCancel={() => setCreateModalOpen(false)}
        />
      </Modal>

      {/* 수정 모달 */}
      <Modal
        title="휴대폰 차단 수정"
        open={!!editTarget}
        onCancel={() => setEditTarget(null)}
        footer={null}
        destroyOnClose
        width={520}
      >
        {editTarget && editDetailData && (
          <BlockHpEditForm
            id={editTarget.dbhIdx}
            defaultValues={{
              reason: editDetailData.reason ?? '',
            }}
            onSuccess={() => {
              setEditTarget(null);
              message.success('휴대폰 차단 정보가 수정되었습니다.');
            }}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>

      {/* 차단 여부 확인 모달 */}
      <Modal
        title="휴대폰 차단 여부 확인"
        open={checkModalOpen}
        onCancel={() => setCheckModalOpen(false)}
        footer={null}
        destroyOnClose
        width={520}
      >
        <BlockHpCheck />
      </Modal>
    </>
  );
}
