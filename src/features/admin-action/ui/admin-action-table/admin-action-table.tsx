import { Table, Badge, Button, Dropdown } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  PoweroffOutlined,
  DeleteOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import type { TableProps, MenuProps } from 'antd';
import type { AdminActionListItem, GetAdminActionsResponse, GetAdminActionsRequest } from '../../types/admin-action.type';
import styles from './admin-action-table.module.css';

interface AdminActionTableProps {
  data: GetAdminActionsResponse | undefined;
  loading: boolean;
  params: GetAdminActionsRequest;
  onParamsChange: (params: GetAdminActionsRequest) => void;
  onDetail: (action: AdminActionListItem) => void;
  onEdit: (action: AdminActionListItem) => void;
  onToggleStatus: (action: AdminActionListItem) => void;
  onDelete: (action: AdminActionListItem) => void;
  canUpdate?: boolean;
  canDelete?: boolean;
}

export default function AdminActionTable({
  data,
  loading,
  params,
  onParamsChange,
  onDetail,
  onEdit,
  onToggleStatus,
  onDelete,
  canUpdate = true,
  canDelete = true,
}: AdminActionTableProps) {
  const getActionMenuItems = (record: AdminActionListItem): MenuProps['items'] => {
    const items: MenuProps['items'] = [
      {
        key: 'detail',
        icon: <EyeOutlined />,
        label: '상세 보기',
        onClick: () => onDetail(record),
      },
    ];
    if (canUpdate) {
      items.push(
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
      );
    }
    if (canDelete) {
      items.push(
        { type: 'divider' },
        {
          key: 'delete',
          icon: <DeleteOutlined />,
          label: '삭제',
          danger: true,
          onClick: () => onDelete(record),
        },
      );
    }
    return items;
  };

  const columns: TableProps<AdminActionListItem>['columns'] = [
    {
      title: '액션 ID',
      dataIndex: 'actionId',
      width: 100,
      sorter: true,
    },
    {
      title: '액션 이름',
      dataIndex: 'actionName',
      sorter: true,
      render: (name: string) => <code className={styles.codeName}>{name}</code>,
    },
    {
      title: '표시 이름',
      dataIndex: 'displayName',
      sorter: true,
      render: (name: string | null) => name || <span className={styles.emptyValue}>—</span>,
    },
    {
      title: '상태',
      dataIndex: 'isActive',
      width: 80,
      align: 'center',
      sorter: true,
      render: (_: number, record: AdminActionListItem) => (
        <Badge
          status={record.isActive ? 'success' : 'default'}
          text={record.isActive ? '활성' : '비활성'}
        />
      ),
    },
    {
      title: '권한 수',
      dataIndex: 'permissionCount',
      width: 90,
      align: 'center',
      sorter: true,
      render: (count: number) => (
        <span className={count > 0 ? styles.countActive : styles.countZero}>{count}</span>
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

  const handleTableChange: TableProps<AdminActionListItem>['onChange'] = (pagination, _, sorter) => {
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
  const activeCount = items.filter((a) => a.isActive).length;
  const inactiveCount = items.filter((a) => !a.isActive).length;

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
        rowKey="actionId"
        columns={columns}
        dataSource={items}
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          current: pageInfo?.page ?? 1,
          pageSize: pageInfo?.limit ?? 20,
          total: pageInfo?.totalItems ?? 0,
          showSizeChanger: true,
          showTotal: (total) => `총 ${total}건`,
        }}
      />
    </>
  );
}
