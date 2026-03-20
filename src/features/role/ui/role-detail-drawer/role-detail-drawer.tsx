import { useState, useMemo, useCallback } from 'react';
import {
  Drawer,
  Tabs,
  Descriptions,
  Badge,
  Table,
  Checkbox,
  Button,
  Select,
  Input,
  Spin,
  Empty,
  message,
  Modal,
} from 'antd';
import {
  SearchOutlined,
  CopyOutlined,
  SaveOutlined,
  ExclamationCircleOutlined,
  UserAddOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useRole } from '../../model/use-role';
import { useUpdateRolePermissions } from '../../model/use-update-role-permissions';
import { useCopyRolePermissions } from '../../model/use-copy-role-permissions';
import { useAddUserToRole, useRemoveUserFromRole } from '../../model/use-update-role-users';
import type {
  RoleDetailResponse,
  RolePermissionsByPage,
  RoleAssignedUser,
} from '../../types/role.type';
import type { GetPermissionCatalogResponse, CatalogPage, CatalogAction } from '@features/permission-catalog';
import type { GetRolesResponse } from '../../types/role.type';
import type { TableProps } from 'antd';
import styles from './role-detail-drawer.module.css';

const { confirm } = Modal;

interface UserListItem {
  userSeq: number;
  userId: string;
  userName: string;
}

interface UserListData {
  items: UserListItem[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
}

interface RoleDetailDrawerProps {
  roleId: number;
  open: boolean;
  onClose: () => void;
  /** 권한 카탈로그 데이터 (페이지 레이어에서 주입) */
  catalog: GetPermissionCatalogResponse | undefined;
  catalogLoading: boolean;
  /** 역할 목록 (권한 복사 소스 선택용) */
  rolesData: GetRolesResponse | undefined;
  /** 사용자 목록 (페이지네이션, 페이지 레이어에서 주입) */
  userListData: UserListData | undefined;
  userListLoading: boolean;
  onUserListChange: (params: { page?: number; q?: string }) => void;
}

/** 카탈로그에서 permissionId 조회: pageId + actionId → permissionId */
function buildCatalogPermMap(catalog: GetPermissionCatalogResponse | undefined) {
  const map = new Map<string, number>();
  if (!catalog) return map;
  for (const perm of catalog.permissions) {
    map.set(`${perm.pageId}-${perm.actionId}`, perm.permissionId);
  }
  return map;
}

/** role의 현재 권한을 permissionId Set으로 변환 */
function buildRolePermSet(detail: RoleDetailResponse | undefined): Set<number> {
  const set = new Set<number>();
  if (!detail) return set;
  for (const group of detail.permissionsByPage) {
    for (const perm of group.permissions) {
      set.add(perm.permissionId);
    }
  }
  return set;
}

export default function RoleDetailDrawer({
  roleId,
  open,
  onClose,
  catalog,
  catalogLoading,
  rolesData,
  userListData,
  userListLoading,
  onUserListChange,
}: RoleDetailDrawerProps) {
  const { data: detail, isLoading } = useRole(roleId);
  const updatePermissions = useUpdateRolePermissions();
  const copyPermissions = useCopyRolePermissions();
  const addUserToRole = useAddUserToRole();
  const removeUserFromRole = useRemoveUserFromRole();

  // 권한 편집 상태: 선택된 permissionId 세트
  const initialPermIds = useMemo(() => buildRolePermSet(detail), [detail]);
  const [selectedPermIds, setSelectedPermIds] = useState<Set<number>>(new Set());
  const [permInitialized, setPermInitialized] = useState(false);

  // detail이 변경되면 선택 상태를 리셋
  useMemo(() => {
    if (detail) {
      setSelectedPermIds(buildRolePermSet(detail));
      setPermInitialized(true);
    }
  }, [detail]);

  const [searchKeyword, setSearchKeyword] = useState('');

  const catalogPermMap = useMemo(() => buildCatalogPermMap(catalog), [catalog]);

  // ── 변경사항 계산 ──
  const changes = useMemo(() => {
    if (!permInitialized) return { add: [] as number[], remove: [] as number[] };
    const add: number[] = [];
    const remove: number[] = [];
    for (const id of selectedPermIds) {
      if (!initialPermIds.has(id)) add.push(id);
    }
    for (const id of initialPermIds) {
      if (!selectedPermIds.has(id)) remove.push(id);
    }
    return { add, remove };
  }, [selectedPermIds, initialPermIds, permInitialized]);

  const hasChanges = changes.add.length > 0 || changes.remove.length > 0;

  // ── 체크박스 토글 ──
  const togglePermission = useCallback((permissionId: number) => {
    setSelectedPermIds((prev) => {
      const next = new Set(prev);
      if (next.has(permissionId)) {
        next.delete(permissionId);
      } else {
        next.add(permissionId);
      }
      return next;
    });
  }, []);

  // ── 권한 저장 ──
  const handleSavePermissions = async () => {
    if (!hasChanges) return;
    try {
      await updatePermissions.mutateAsync({
        id: roleId,
        data: {
          add: changes.add.length > 0 ? changes.add : undefined,
          remove: changes.remove.length > 0 ? changes.remove : undefined,
        },
      });
      message.success('권한이 저장되었습니다.');
    } catch {
      message.error('권한 저장에 실패했습니다.');
    }
  };

  // ── 권한 복사 ──
  const handleCopyPermissions = (sourceRoleId: number) => {
    const sourceRole = rolesData?.items.find((r) => r.roleId === sourceRoleId);
    const sourceName = sourceRole?.displayName ?? `#${sourceRoleId}`;
    confirm({
      title: '권한 복사',
      icon: <ExclamationCircleOutlined />,
      content: `"${sourceName}" 역할의 권한을 복사하시겠습니까? 현재 권한은 모두 대체됩니다.`,
      okText: '복사',
      cancelText: '취소',
      onOk: async () => {
        try {
          await copyPermissions.mutateAsync({
            id: roleId,
            data: { sourceRoleId },
          });
          message.success('권한이 복사되었습니다.');
        } catch {
          message.error('권한 복사에 실패했습니다.');
        }
      },
    });
  };

  // ── 사용자 추가 ──
  const handleAddUser = async (userSeq: number) => {
    try {
      await addUserToRole.mutateAsync({ userSeq, roleId });
      message.success('사용자가 할당되었습니다.');
    } catch {
      message.error('사용자 할당에 실패했습니다.');
    }
  };

  // ── 사용자 제거 ──
  const handleRemoveUser = (user: RoleAssignedUser) => {
    confirm({
      title: '사용자 할당 해제',
      icon: <ExclamationCircleOutlined />,
      content: `${user.userName}(${user.userId})의 역할 할당을 해제하시겠습니까?`,
      okText: '해제',
      cancelText: '취소',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await removeUserFromRole.mutateAsync({ userSeq: user.userSeq, roleId });
          message.success('사용자 할당이 해제되었습니다.');
        } catch {
          message.error('사용자 할당 해제에 실패했습니다.');
        }
      },
    });
  };

  // ── 카탈로그 기반 매트릭스 데이터 ──
  const { filteredPages, actions } = useMemo(() => {
    if (!catalog) return { filteredPages: [] as CatalogPage[], actions: [] as CatalogAction[] };
    const keyword = searchKeyword.toLowerCase();
    const filtered = keyword
      ? catalog.pages.filter(
          (p) =>
            p.displayName.toLowerCase().includes(keyword) ||
            p.pageName.toLowerCase().includes(keyword),
        )
      : catalog.pages;
    return { filteredPages: filtered, actions: catalog.actions };
  }, [catalog, searchKeyword]);

  // ── 할당된 사용자 테이블 컬럼 ──
  const assignedUserSeqs = useMemo(
    () => new Set(detail?.assignedUsers.map((u) => u.userSeq) ?? []),
    [detail?.assignedUsers],
  );

  const [userSearchInput, setUserSearchInput] = useState('');

  const userColumns: TableProps<RoleAssignedUser>['columns'] = [
    {
      title: '사용자 ID',
      dataIndex: 'userId',
      render: (id: string) => <code className={styles.userCodeName}>{id}</code>,
    },
    {
      title: '이름',
      dataIndex: 'userName',
    },
    {
      title: '이메일',
      dataIndex: 'email',
    },
    {
      title: '상태',
      dataIndex: 'isActive',
      width: 80,
      align: 'center',
      render: (v: number) => (
        <Badge status={v ? 'success' : 'default'} text={v ? '활성' : '비활성'} />
      ),
    },
    {
      title: '할당일',
      dataIndex: 'assignedAt',
      width: 160,
      render: (v: string) => new Date(v).toLocaleString('ko-KR'),
    },
    {
      title: '',
      width: 50,
      align: 'center',
      render: (_: unknown, record: RoleAssignedUser) => (
        <Button
          type="text"
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveUser(record)}
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <Drawer title="역할 상세" open={open} onClose={onClose} width={720} destroyOnClose>
        <div className={styles.loadingContainer}>
          <Spin />
        </div>
      </Drawer>
    );
  }

  if (!detail) {
    return (
      <Drawer title="역할 상세" open={open} onClose={onClose} width={720} destroyOnClose>
        <Empty description="역할 정보를 불러올 수 없습니다." />
      </Drawer>
    );
  }

  const tabItems = [
    {
      key: 'info',
      label: '기본 정보',
      children: (
        <div className={styles.detailContainer}>
          <Descriptions bordered size="small" column={2} labelStyle={{ fontWeight: 600, width: 120 }}>
            <Descriptions.Item label="역할 ID">{detail.roleId}</Descriptions.Item>
            <Descriptions.Item label="상태">
              <Badge
                status={detail.isActive ? 'success' : 'default'}
                text={detail.isActive ? '활성' : '비활성'}
              />
            </Descriptions.Item>
            <Descriptions.Item label="역할 이름">
              <code className={styles.codeName}>{detail.roleName}</code>
            </Descriptions.Item>
            <Descriptions.Item label="표시 이름">{detail.displayName}</Descriptions.Item>
            <Descriptions.Item label="설명" span={2}>
              {detail.description || <span className={styles.emptyValue}>—</span>}
            </Descriptions.Item>
            <Descriptions.Item label="테넌트 ID">{detail.tenantId}</Descriptions.Item>
            <Descriptions.Item label="할당된 사용자">{detail.assignedUsers.length}명</Descriptions.Item>
            <Descriptions.Item label="생성일">
              {new Date(detail.createdAt).toLocaleString('ko-KR')}
            </Descriptions.Item>
            <Descriptions.Item label="수정일">
              {new Date(detail.updatedAt).toLocaleString('ko-KR')}
            </Descriptions.Item>
          </Descriptions>

          {/* 현재 권한 요약 */}
          {detail.permissionsByPage.length > 0 && (
            <>
              <h4 style={{ margin: '8px 0 0', fontSize: 14, fontWeight: 600 }}>권한 요약</h4>
              <Descriptions bordered size="small" column={1} labelStyle={{ fontWeight: 500, width: 180 }}>
                {detail.permissionsByPage.map((group: RolePermissionsByPage) => (
                  <Descriptions.Item key={group.pageId} label={group.pageDisplayName}>
                    {group.permissions.map((p) => p.actionDisplayName || p.actionName).join(', ')}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            </>
          )}
        </div>
      ),
    },
    {
      key: 'permissions',
      label: '권한 관리',
      children: (
        <div className={styles.permissionContainer}>
          <div className={styles.permissionToolbar}>
            <div className={styles.permissionToolbarLeft}>
              <Input
                className={styles.permissionSearchInput}
                placeholder="페이지 검색..."
                prefix={<SearchOutlined />}
                allowClear
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <span className={styles.permissionCount}>
                선택 <span className={styles.permissionCountNum}>{selectedPermIds.size}</span>개
              </span>
            </div>
            <div className={styles.permissionToolbarRight}>
              <Select
                placeholder="권한 복사 (다른 역할)"
                style={{ width: 200 }}
                allowClear
                showSearch
                optionFilterProp="label"
                suffixIcon={<CopyOutlined />}
                onChange={(val) => { if (val) handleCopyPermissions(val); }}
                options={
                  rolesData?.items
                    .filter((r) => r.roleId !== roleId)
                    .map((r) => ({
                      value: r.roleId,
                      label: `${r.displayName} (${r.roleName})`,
                    })) ?? []
                }
                value={null}
              />
              <Button
                type="primary"
                icon={<SaveOutlined />}
                disabled={!hasChanges}
                loading={updatePermissions.isPending}
                onClick={handleSavePermissions}
              >
                권한 저장
              </Button>
            </div>
          </div>

          {hasChanges && (
            <div className={styles.changeIndicator}>
              <span>변경사항:</span>
              {changes.add.length > 0 && (
                <span className={styles.changeAdd}>+{changes.add.length} 추가</span>
              )}
              {changes.remove.length > 0 && (
                <span className={styles.changeRemove}>-{changes.remove.length} 제거</span>
              )}
            </div>
          )}

          {catalogLoading ? (
            <div className={styles.loadingContainer}>
              <Spin />
            </div>
          ) : filteredPages.length === 0 ? (
            <div className={styles.noPermissions}>
              {searchKeyword ? '검색 결과가 없습니다.' : '등록된 페이지가 없습니다.'}
            </div>
          ) : (
            <div className={styles.matrixWrapper}>
              <table className={styles.matrixTable}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>페이지</th>
                    {actions.map((action) => (
                      <th key={action.actionId}>
                        {action.displayName || action.actionName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredPages.map((page) => (
                    <tr key={page.pageId}>
                      <td>
                        <div className={styles.pageNameCell}>
                          <span className={styles.pageDisplayName}>{page.displayName}</span>
                          <span className={styles.pageCodeName}>{page.pageName}</span>
                        </div>
                      </td>
                      {actions.map((action) => {
                        const permId = catalogPermMap.get(`${page.pageId}-${action.actionId}`);
                        if (!permId) {
                          return (
                            <td key={action.actionId}>
                              <span className={styles.cellEmpty}>—</span>
                            </td>
                          );
                        }
                        return (
                          <td key={action.actionId}>
                            <Checkbox
                              checked={selectedPermIds.has(permId)}
                              onChange={() => togglePermission(permId)}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'users',
      label: `할당된 사용자 (${detail.assignedUsers.length})`,
      children: (
        <div className={styles.userContainer}>
          {/* ── 현재 할당된 사용자 ── */}
          <div className={styles.userSectionHeader}>
            <UserAddOutlined />
            <span>할당된 사용자</span>
            <Badge count={detail.assignedUsers.length} showZero style={{ backgroundColor: 'var(--color-primary, #1677ff)' }} />
          </div>
          {detail.assignedUsers.length > 0 ? (
            <Table<RoleAssignedUser>
              rowKey="userSeq"
              columns={userColumns}
              dataSource={detail.assignedUsers}
              pagination={
                detail.assignedUsers.length > 5
                  ? { pageSize: 5, size: 'small', showTotal: (total) => `총 ${total}명` }
                  : false
              }
              size="small"
            />
          ) : (
            <div className={styles.noUsers}>할당된 사용자가 없습니다.</div>
          )}

          {/* ── 사용자 추가 (전체 목록) ── */}
          <div className={styles.userSectionHeader}>
            <PlusOutlined />
            <span>사용자 추가</span>
          </div>
          <Input
            placeholder="이름 또는 아이디로 검색..."
            prefix={<SearchOutlined />}
            allowClear
            value={userSearchInput}
            onChange={(e) => setUserSearchInput(e.target.value)}
            onPressEnter={() => onUserListChange({ q: userSearchInput || undefined, page: 1 })}
            onClear={() => onUserListChange({ q: undefined, page: 1 })}
          />
          <Table<UserListItem>
            rowKey="userSeq"
            columns={[
              {
                title: '사용자 ID',
                dataIndex: 'userId',
                render: (id: string) => <code className={styles.userCodeName}>{id}</code>,
              },
              {
                title: '이름',
                dataIndex: 'userName',
              },
              {
                title: '',
                width: 80,
                align: 'center',
                render: (_: unknown, record: UserListItem) =>
                  assignedUserSeqs.has(record.userSeq) ? (
                    <span className={styles.alreadyAssigned}>할당됨</span>
                  ) : (
                    <Button
                      type="primary"
                      size="small"
                      ghost
                      icon={<PlusOutlined />}
                      loading={addUserToRole.isPending}
                      onClick={() => handleAddUser(record.userSeq)}
                    >
                      추가
                    </Button>
                  ),
              },
            ]}
            dataSource={userListData?.items}
            loading={userListLoading}
            pagination={{
              current: userListData?.currentPage ?? 1,
              pageSize: userListData?.pageSize ?? 10,
              total: userListData?.totalItems ?? 0,
              size: 'small',
              showTotal: (total) => `총 ${total}명`,
              onChange: (page) => onUserListChange({ page }),
            }}
            size="small"
          />
        </div>
      ),
    },
  ];

  return (
    <Drawer
      title={`${detail.displayName} (${detail.roleName})`}
      open={open}
      onClose={onClose}
      width={720}
      destroyOnClose
    >
      <Tabs items={tabItems} />
    </Drawer>
  );
}
