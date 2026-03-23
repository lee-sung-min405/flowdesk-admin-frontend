import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Select, Empty, Spin, message } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  PostTable,
  PostDetail,
  PostCreateForm,
  PostEditForm,
  usePosts,
  usePost,
  useDeletePost,
} from '@features/board';
import type { Post, GetPostsRequest } from '@features/board';
import { useBoardTypes } from '@features/board-type';
import styles from './board-manage-page.module.css';

const { confirm } = Modal;

export default function BoardManagePage() {
  const navigate = useNavigate();
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
  const [params, setParams] = useState<GetPostsRequest>({ boardId: 0, page: 1, limit: 20 });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState<Post | null>(null);
  const [editTarget, setEditTarget] = useState<Post | null>(null);

  const { data: boardTypesData, isLoading: boardTypesLoading } = useBoardTypes();
  const allBoardTypes = boardTypesData?.items ?? [];
  const activeBoardTypes = allBoardTypes.filter((b) => b.isActive);
  const inactiveBoardTypes = allBoardTypes.filter((b) => !b.isActive);

  const currentParams: GetPostsRequest = { ...params, boardId: selectedBoardId ?? 0 };
  const { data, isLoading } = usePosts(currentParams);

  const { data: detailData, isLoading: detailLoading } = usePost(
    selectedBoardId ?? 0,
    detailTarget?.postId ?? 0,
  );
  const { data: editPostDetail, isLoading: editPostLoading } = usePost(
    selectedBoardId ?? 0,
    editTarget?.postId ?? 0,
  );
  const deletePost = useDeletePost();

  const handleBoardChange = (boardId: number) => {
    setSelectedBoardId(boardId);
    setParams({ boardId, page: 1, limit: 20 });
  };

  const handleDelete = (post: Post) => {
    confirm({
      title: '게시글 삭제',
      icon: <ExclamationCircleOutlined />,
      content: `"${post.title}" 게시글을 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deletePost.mutateAsync({ boardId: selectedBoardId!, postId: post.postId });
          message.success('게시글이 삭제되었습니다.');
        } catch {
          message.error('게시글 삭제에 실패했습니다.');
        }
      },
    });
  };

  const selectedBoard = allBoardTypes.find((b) => b.boardId === selectedBoardId);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.pageTitleRow}>
            <h1 className={styles.pageTitle}>게시판 관리</h1>
            {selectedBoardId && data?.pageInfo && (
              <span className={styles.totalBadge}>{data.pageInfo.totalItems}</span>
            )}
          </div>
          <p className={styles.pageDesc}>게시판별 게시글을 관리합니다.</p>
        </div>
        <div className={styles.toolbar}>
          <Select
            className={styles.boardSelect}
            placeholder="게시판 선택"
            loading={boardTypesLoading}
            value={selectedBoardId}
            onChange={handleBoardChange}
            options={[
              ...(activeBoardTypes.length > 0 ? [{
                label: '활성 게시판',
                options: activeBoardTypes.map((b) => ({ value: b.boardId, label: b.name })),
              }] : []),
              ...(inactiveBoardTypes.length > 0 ? [{
                label: '비활성 게시판',
                options: inactiveBoardTypes.map((b) => ({ value: b.boardId, label: `${b.name} (비활성)` })),
              }] : []),
            ]}
          />
          {selectedBoardId && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalOpen(true)}>
              게시글 작성
            </Button>
          )}
        </div>
      </div>

      <div className={styles.card}>
        {selectedBoardId ? (
          <PostTable
            data={data}
            loading={isLoading}
            params={currentParams}
            onParamsChange={(p) => setParams(p)}
            onDetail={setDetailTarget}
            onEdit={setEditTarget}
            onDelete={handleDelete}
          />
        ) : allBoardTypes.length === 0 && !boardTypesLoading ? (
          <Empty
            description="등록된 게시판이 없습니다"
            style={{ padding: '60px 0' }}
          >
            <Button type="primary" onClick={() => navigate('/board-types')}>
              게시판 타입 생성하러 가기
            </Button>
          </Empty>
        ) : (
          <Empty description="게시판을 선택해주세요" style={{ padding: '60px 0' }} />
        )}
      </div>

      {/* 상세 보기 모달 */}
      <Modal
        title={detailTarget ? `${detailTarget.title}` : '게시글 상세'}
        open={!!detailTarget}
        onCancel={() => setDetailTarget(null)}
        footer={null}
        destroyOnClose
        width={700}
      >
        <PostDetail data={detailData} loading={detailLoading} />
      </Modal>

      {/* 생성 모달 */}
      <Modal
        title={`게시글 작성${selectedBoard ? ` — ${selectedBoard.name}` : ''}`}
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
        destroyOnClose
        width={640}
      >
        {selectedBoardId && (
          <PostCreateForm
            boardId={selectedBoardId}
            onSuccess={() => {
              setCreateModalOpen(false);
              message.success('게시글이 등록되었습니다.');
            }}
            onCancel={() => setCreateModalOpen(false)}
          />
        )}
      </Modal>

      {/* 수정 모달 */}
      <Modal
        title="게시글 수정"
        open={!!editTarget}
        onCancel={() => setEditTarget(null)}
        footer={null}
        destroyOnClose
        width={640}
      >
        {editTarget && selectedBoardId && (
          editPostDetail ? (
            <PostEditForm
              boardId={selectedBoardId}
              postId={editTarget.postId}
              defaultValues={{
                title: editPostDetail.title,
                content: editPostDetail.content,
                isNotice: editPostDetail.isNotice,
                isActive: editPostDetail.isActive,
                startDtm: editPostDetail.startDtm,
                endDtm: editPostDetail.endDtm,
              }}
              onSuccess={() => {
                setEditTarget(null);
                message.success('게시글이 수정되었습니다.');
              }}
              onCancel={() => setEditTarget(null)}
            />
          ) : editPostLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <Spin />
            </div>
          ) : (
            <Empty description="게시글 정보를 불러올 수 없습니다." />
          )
        )}
      </Modal>
    </div>
  );
}
