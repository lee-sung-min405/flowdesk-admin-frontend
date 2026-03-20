import { Table, Badge, Button, Dropdown, Tag } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  PoweroffOutlined,
  DeleteOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import type { TableProps, MenuProps } from 'antd';
import type { Role, GetRolesResponse, GetRolesRequest } from '../../types/role.type';
import styles from './role-table.module.css';

interface RoleTableProps {
  data: GetRolesResponse | undefined;
  loading: boolean;
  params: GetRolesRequest;
  onParamsChange: (params: GetRolesRequest) => void;
  onDetail: (role: Role) => void;
  onEdit: (role: Role) => void;
  onToggleStatus: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export default function RoleTable({
  data,
  loading,
  params,
  onParamsChange,
  onDetail,
  onEdit,
  onToggleStatus,
  onDelete,
}: RoleTableProps) {
  const getActionMenuItems = (record: Role): MenuProps['items'] => [
    {
      key: 'detail',
      icon: <EyeOutlined />,
      label: '상세 보기',
      onClick: () => onDetail(record),
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: '정보 수정',
      onClick: () => onEdit(record),
    },
    {
      key: 'status',
      icon: <PoweroffOutlined />,
      label: record.isActive ? '비활성화' : '활성화',
      danger: !!record.isActive,
      onClick: () => onToggleStatus(record),
    },
    { type: 'divider' },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: '삭제',
      danger: true,
      onClick: () => onDelete(record),
    },
  ];

  const columns: TableProps<Role>['columns'] = [
    {
      title: '역할 ID',
      dataIndex: 'roleId',
      width: 90,
      sorter: true,
    },
    {
      title: '역할 이름',
      dataIndex: 'roleName',
      sorter: true,
      render: (name: string) => <code className={styles.codeName}>{name}</code>,
    },
    {
      title: '표시 이름',
      dataIndex: 'displayName',
      sorter: true,
    },
    {
      title: '설명',
      dataIndex: 'description',
      ellipsis: true,
      render: (desc: string | null) => desc || <span className={styles.emptyValue}>—</span>,
    },
    {
      title: '상태',
      dataIndex: 'isActive',
      width: 80,
      align: 'center',
      sorter: true,
      render: (_: number, record: Role) => (
        <Badge
          status={record.isActive ? 'success' : 'default'}
          text={record.isActive ? '활성' : '비활성'}
        />
      ),
    },
    {
      title: '사용자',
      dataIndex: 'userCount',
      width: 80,
      align: 'center',
      sorter: true,
      render: (count: number) => (
        <Tag color={count > 0 ? 'blue' : undefined}>{count}명</Tag>
      ),
    },
    {
      title: '권한',
      dataIndex: 'permissionCount',
      width: 80,
      align: 'center',
      sorter: true,
      render: (count: number) => (
        <span className={count > 0 ? styles.countActive : styles.countZero}>{count}개</span>
      ),
    },
    {
      title: '',
      width: 50,
      align: 'center',
      render: (_, record) => (
        <Dropdown
          menu={{ items: getActionMenuItems(record) }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button type="text" size="small" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const handleTableChange: TableProps<Role>['onChange'] = (pagination, _, sorter) => {
    const sort = Array.isArray(sorter) ? sorter[0] : sorter;
    onParamsChange({
      ...params,
      page: pagination.current,
      limit: pagination.pageSize,
      sort: sort?.field as string | undefined,
      order: sort?.order === 'ascend' ? 'ASC' : sort?.order === 'descend' ? 'DESC' : undefined,
    });
  };

  const pageInfo = data?.pageInfo;
  const items = data?.items ?? [];
  const activeCount = items.filter((r) => r.isActive).length;
  const inactiveCount = items.filter((r) => !r.isActive).length;

  return (
    <>
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>총</span>
          <span className={styles.statValue}>{pageInfo?.totalItems ?? 0}개</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>활성</span>
          <span className={styles.statValueActive}>{activeCount}개</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>비활성</span>
          <span className={styles.statValueInactive}>{inactiveCount}개</span>
        </div>
      </div>

      <Table
        rowKey="roleId"
        columns={columns}
        dataSource={items}
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          current: pageInfo?.currentPage ?? 1,
          pageSize: pageInfo?.pageSize ?? 20,
          total: pageInfo?.totalItems ?? 0,
          showSizeChanger: true,
          showTotal: (total) => `총 ${total}건`,
        }}
      />
    </>
  );
}
