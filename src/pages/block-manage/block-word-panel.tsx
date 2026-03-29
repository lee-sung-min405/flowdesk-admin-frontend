import { useState } from 'react';
import { Button, Modal, Input, Select, message } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, SearchOutlined, SafetyOutlined } from '@ant-design/icons';
import {
  BlockWordTable,
  BlockWordDetail,
  BlockWordCreateForm,
  BlockWordEditForm,
  BlockWordCheck,
  useBlockWords,
  useBlockWord,
  useUpdateBlockWord,
  useDeleteBlockWord,
} from '@features/security';
import type { BlockWord, GetBlockWordsRequest, MatchType } from '@features/security';
import { useMe } from '@features/auth';
import styles from './block-manage-page.module.css';

const { confirm } = Modal;

export default function BlockWordPanel() {
  const [params, setParams] = useState<GetBlockWordsRequest>({ page: 1, limit: 20 });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [checkModalOpen, setCheckModalOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState<BlockWord | null>(null);
  const [editTarget, setEditTarget] = useState<BlockWord | null>(null);

  const { data, isLoading } = useBlockWords(params);

  const { hasPermission } = useMe();
  const canCreate = hasPermission('security', 'create');
  const canUpdate = hasPermission('security', 'update');
  const canDelete = hasPermission('security', 'delete');
  const { data: detailData, isLoading: detailLoading } = useBlockWord(detailTarget?.dbwIdx ?? 0);
  const { data: editDetailData } = useBlockWord(editTarget?.dbwIdx ?? 0);
  const updateBlockWord = useUpdateBlockWord();
  const deleteBlockWord = useDeleteBlockWord();

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

  const handleMatchTypeFilter = (value: string) => {
    setParams((prev) => ({
      ...prev,
      matchType: value === 'all' ? undefined : (value as MatchType),
      page: 1,
    }));
  };

  const handleToggleStatus = (record: BlockWord) => {
    const nextActive = record.isActive ? 0 : 1;
    const action = nextActive ? '활성화' : '비활성화';
    confirm({
      title: `금칙어 ${action}`,
      icon: <ExclamationCircleOutlined />,
      content: `"${record.blockWord}" 금칙어를 ${action}하시겠습니까?`,
      okText: action,
      cancelText: '취소',
      okButtonProps: { danger: !nextActive },
      onOk: async () => {
        try {
          await updateBlockWord.mutateAsync({ id: record.dbwIdx, data: { isActive: nextActive } });
          message.success(`금칙어가 ${action}되었습니다.`);
        } catch {
          message.error(`금칙어 ${action}에 실패했습니다.`);
        }
      },
    });
  };

  const handleDelete = (record: BlockWord) => {
    confirm({
      title: '금칙어 삭제',
      icon: <ExclamationCircleOutlined />,
      content: `"${record.blockWord}" 금칙어를 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteBlockWord.mutateAsync(record.dbwIdx);
          message.success('금칙어가 삭제되었습니다.');
        } catch {
          message.error('금칙어 삭제에 실패했습니다.');
        }
      },
    });
  };

  return (
    <>
      <div className={styles.panelToolbar}>
        <Input
          className={styles.searchInput}
          placeholder="금칙어 검색..."
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
        <Select
          className={styles.filterSelect}
          defaultValue="all"
          onChange={handleMatchTypeFilter}
          options={[
            { value: 'all', label: '전체 타입' },
            { value: 'EXACT', label: '정확히 일치' },
            { value: 'CONTAINS', label: '포함' },
            { value: 'REGEX', label: '정규식' },
          ]}
        />
        {canCreate && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalOpen(true)}>
            금칙어 등록
          </Button>
        )}
        <Button icon={<SafetyOutlined />} onClick={() => setCheckModalOpen(true)}>
          차단 여부 확인
        </Button>
      </div>

      <BlockWordTable
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

      {/* 상세 모달 */}
      <Modal
        title={detailTarget ? `금칙어 상세 — ${detailTarget.blockWord}` : '금칙어 상세'}
        open={!!detailTarget}
        onCancel={() => setDetailTarget(null)}
        footer={null}
        destroyOnClose
        width={560}
      >
        <BlockWordDetail data={detailData} loading={detailLoading} />
      </Modal>

      {/* 생성 모달 */}
      <Modal
        title="금칙어 등록"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
        destroyOnClose
        width={520}
      >
        <BlockWordCreateForm
          onSuccess={() => {
            setCreateModalOpen(false);
            message.success('금칙어가 등록되었습니다.');
          }}
          onCancel={() => setCreateModalOpen(false)}
        />
      </Modal>

      {/* 수정 모달 */}
      <Modal
        title="금칙어 수정"
        open={!!editTarget}
        onCancel={() => setEditTarget(null)}
        footer={null}
        destroyOnClose
        width={520}
      >
        {editTarget && editDetailData && (
          <BlockWordEditForm
            id={editTarget.dbwIdx}
            defaultValues={{
              matchType: editDetailData.matchType,
              reason: editDetailData.reason ?? '',
            }}
            onSuccess={() => {
              setEditTarget(null);
              message.success('금칙어 정보가 수정되었습니다.');
            }}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>

      {/* 차단 여부 확인 모달 */}
      <Modal
        title="금칙어 포함 여부 확인"
        open={checkModalOpen}
        onCancel={() => setCheckModalOpen(false)}
        footer={null}
        destroyOnClose
        width={520}
      >
        <BlockWordCheck />
      </Modal>
    </>
  );
}
