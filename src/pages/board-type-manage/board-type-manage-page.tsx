import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Spin, Empty, message } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  BoardTypeTable,
  BoardTypeDetail,
  BoardTypeCreateForm,
  BoardTypeEditForm,
  useBoardTypes,
  useBoardType,
  useUpdateBoardType,
  useDeleteBoardType,
} from '@features/board-type';
import type { BoardType } from '@features/board-type';
import styles from './board-type-manage-page.module.css';

const { confirm } = Modal;

export default function BoardTypeManagePage() {
  const navigate = useNavigate();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState<BoardType | null>(null);
  const [editTarget, setEditTarget] = useState<BoardType | null>(null);

  const { data, isLoading } = useBoardTypes();
  const { data: detailData, isLoading: detailLoading } = useBoardType(detailTarget?.boardId ?? 0);
  const { data: editDetail, isLoading: editLoading } = useBoardType(editTarget?.boardId ?? 0);
  const updateBoardType = useUpdateBoardType();
  const deleteBoardType = useDeleteBoardType();

  const handleToggleStatus = (boardType: BoardType) => {
    const nextActive = boardType.isActive ? 0 : 1;
    const action = nextActive ? '활성화' : '비활성화';

    if (nextActive === 0) {
      // 비활성화 = DELETE API (논리 삭제)
      confirm({
        title: `게시판 ${action}`,
        icon: <ExclamationCircleOutlined />,
        content: `${boardType.name}(${boardType.boardKey}) 게시판을 ${action}하시겠습니까? 데이터는 보존됩니다.`,
        okText: action,
        cancelText: '취소',
        okButtonProps: { danger: true },
        onOk: async () => {
          try {
            await deleteBoardType.mutateAsync(boardType.boardId);
            message.success(`게시판이 ${action}되었습니다.`);
          } catch {
            message.error(`게시판 ${action}에 실패했습니다.`);
          }
        },
      });
    } else {
      // 활성화 = PATCH API
      confirm({
        title: `게시판 ${action}`,
        icon: <ExclamationCircleOutlined />,
        content: `${boardType.name}(${boardType.boardKey}) 게시판을 ${action}하시겠습니까?`,
        okText: action,
        cancelText: '취소',
        onOk: async () => {
          try {
            await updateBoardType.mutateAsync({
              boardId: boardType.boardId,
              data: { isActive: 1 },
            });
            message.success(`게시판이 ${action}되었습니다.`);
          } catch {
            message.error(`게시판 ${action}에 실패했습니다.`);
          }
        },
      });
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.pageTitleRow}>
            <h1 className={styles.pageTitle}>게시판 타입 관리</h1>
            {data?.items && (
              <span className={styles.totalBadge}>{data.items.length}</span>
            )}
          </div>
          <p className={styles.pageDesc}>게시판 타입을 생성하고 관리합니다.</p>
        </div>
        <div className={styles.toolbar}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalOpen(true)}>
            게시판 추가
          </Button>
        </div>
      </div>

      <div className={styles.card}>
        {!isLoading && data?.items?.length === 0 ? (
          <Empty
            description="등록된 게시판 타입이 없습니다"
            style={{ padding: '60px 0' }}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalOpen(true)}>
              첫 게시판 만들기
            </Button>
          </Empty>
        ) : (
          <BoardTypeTable
            data={data}
            loading={isLoading}
            onDetail={setDetailTarget}
            onEdit={setEditTarget}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>

      {/* 상세 보기 모달 */}
      <Modal
        title={detailTarget ? `${detailTarget.name} 상세` : '게시판 상세'}
        open={!!detailTarget}
        onCancel={() => setDetailTarget(null)}
        footer={null}
        destroyOnClose
        width={600}
      >
        <BoardTypeDetail data={detailData} loading={detailLoading} />
      </Modal>

      {/* 생성 모달 */}
      <Modal
        title="게시판 추가"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
        destroyOnClose
        width={520}
      >
        <BoardTypeCreateForm
          onSuccess={() => {
            setCreateModalOpen(false);
            message.success(
              <span>
                게시판이 생성되었습니다.{' '}
                <a onClick={() => navigate('/boards')}>게시글 작성하러 가기 →</a>
              </span>,
            );
          }}
          onCancel={() => setCreateModalOpen(false)}
        />
      </Modal>

      {/* 수정 모달 */}
      <Modal
        title="게시판 수정"
        open={!!editTarget}
        onCancel={() => setEditTarget(null)}
        footer={null}
        destroyOnClose
        width={520}
      >
        {editTarget && (
          editDetail ? (
            <BoardTypeEditForm
              boardId={editTarget.boardId}
              defaultValues={{
                name: editDetail.name,
                description: editDetail.description ?? '',
                sortOrder: editDetail.sortOrder ?? undefined,
              }}
              onSuccess={() => {
                setEditTarget(null);
                message.success('게시판 정보가 수정되었습니다.');
              }}
              onCancel={() => setEditTarget(null)}
            />
          ) : editLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <Spin />
            </div>
          ) : (
            <Empty description="게시판 정보를 불러올 수 없습니다." />
          )
        )}
      </Modal>
    </div>
  );
}
