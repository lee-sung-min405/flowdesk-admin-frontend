import { useState } from 'react';
import { Button, Modal, Input, Select, message } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import {
  UserTable,
  UserDetail,
  UserCreateForm,
  UserEditForm,
  UserPasswordForm,
  useUsers,
  useUser,
  useUpdateUserStatus,
  useInvalidateUserTokens,
} from '@features/user';
import type { User, GetUsersRequest } from '@features/user';
import { useRoles } from '@features/role';
import styles from './user-page.module.css';

const { confirm } = Modal;

export default function UserPage() {
  const [params, setParams] = useState<GetUsersRequest>({ page: 1, limit: 20 });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState<User | null>(null);
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [passwordTarget, setPasswordTarget] = useState<User | null>(null);

  const { data, isLoading } = useUsers(params);
  const { data: rolesData } = useRoles({ isActive: 1 });
  const { data: detailData, isLoading: detailLoading } = useUser(detailTarget?.userSeq ?? 0);
  const { data: editUserDetail } = useUser(editTarget?.userSeq ?? 0);
  const updateStatus = useUpdateUserStatus();
  const invalidateTokens = useInvalidateUserTokens();

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

  const handleToggleStatus = (user: User) => {
    const nextActive = user.isActive ? 0 : 1;
    const action = nextActive ? '활성화' : '정지';
    confirm({
      title: `사용자 ${action}`,
      icon: <ExclamationCircleOutlined />,
      content: `${user.userName}(${user.userId}) 사용자를 ${action}하시겠습니까?`,
      okText: action,
      cancelText: '취소',
      okButtonProps: { danger: !nextActive },
      onOk: async () => {
        try {
          await updateStatus.mutateAsync({ id: user.userSeq, data: { isActive: nextActive as 0 | 1 } });
          message.success(`사용자가 ${action}되었습니다.`);
        } catch {
          message.error(`사용자 ${action}에 실패했습니다.`);
        }
      },
    });
  };

  const handleInvalidateTokens = (user: User) => {
    confirm({
      title: '강제 로그아웃',
      icon: <ExclamationCircleOutlined />,
      content: `${user.userName}(${user.userId})의 모든 세션을 만료하시겠습니까?`,
      okText: '강제 로그아웃',
      cancelText: '취소',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await invalidateTokens.mutateAsync(user.userSeq);
          message.success('강제 로그아웃되었습니다.');
        } catch {
          message.error('강제 로그아웃에 실패했습니다.');
        }
      },
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.pageTitleRow}>
            <h1 className={styles.pageTitle}>사용자 관리</h1>
            {data?.pageInfo && (
              <span className={styles.totalBadge}>{data.pageInfo.totalItems}</span>
            )}
          </div>
          <p className={styles.pageDesc}>사용자 계정을 조회하고 관리할 수 있습니다.</p>
        </div>
        <div className={styles.toolbar}>
          <Input
            className={styles.searchInput}
            placeholder="사용자 검색 (아이디, 이름, 이메일)..."
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
              { value: 'inactive', label: '정지' },
            ]}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalOpen(true)}
          >
            사용자 생성
          </Button>
        </div>
      </div>

      <div className={styles.card}>
        <UserTable
          data={data}
          loading={isLoading}
          params={params}
          onParamsChange={setParams}
          onDetail={setDetailTarget}
          onEdit={setEditTarget}
          onToggleStatus={handleToggleStatus}
          onResetPassword={setPasswordTarget}
          onInvalidateTokens={handleInvalidateTokens}
        />
      </div>

      {/* 사용자 상세 보기 모달 */}
      <Modal
        title={detailTarget ? `${detailTarget.userName}(${detailTarget.userId}) 상세` : '사용자 상세'}
        open={!!detailTarget}
        onCancel={() => setDetailTarget(null)}
        footer={null}
        destroyOnClose
        width={600}
      >
        <UserDetail data={detailData} loading={detailLoading} />
      </Modal>

      {/* 사용자 생성 모달 */}
      <Modal
        title="사용자 생성"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
        destroyOnClose
        width={560}
      >
        <UserCreateForm
          onSuccess={() => {
            setCreateModalOpen(false);
            message.success('사용자가 생성되었습니다.');
          }}
          onCancel={() => setCreateModalOpen(false)}
        />
      </Modal>

      {/* 사용자 수정 모달 */}
      <Modal
        title="사용자 수정"
        open={!!editTarget}
        onCancel={() => setEditTarget(null)}
        footer={null}
        destroyOnClose
        width={600}
      >
        {editTarget && editUserDetail && (
          <UserEditForm
            userId={editTarget.userSeq}
            defaultValues={{
              userName: editTarget.userName || '',
              corpName: editTarget.corpName || '',
              userEmail: editTarget.userEmail || '',
              userTel: editTarget.userTel || '',
              userHp: editTarget.userHp || '',
            }}
            roles={rolesData?.items ?? []}
            assignedRoleIds={editUserDetail.assignedRoleIds ?? []}
            onSuccess={() => {
              setEditTarget(null);
              message.success('사용자 정보가 수정되었습니다.');
            }}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>

      {/* 비밀번호 초기화 모달 */}
      <Modal
        title="비밀번호 초기화"
        open={!!passwordTarget}
        onCancel={() => setPasswordTarget(null)}
        footer={null}
        destroyOnClose
      >
        {passwordTarget && (
          <UserPasswordForm
            userId={passwordTarget.userSeq}
            onSuccess={() => {
              setPasswordTarget(null);
              message.success('비밀번호가 초기화되었습니다.');
            }}
            onCancel={() => setPasswordTarget(null)}
          />
        )}
      </Modal>
    </div>
  );
}
